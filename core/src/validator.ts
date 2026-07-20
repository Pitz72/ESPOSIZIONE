/**
 * Validatore statico di un pacchetto `.iwstory`.
 * Non esegue la storia: la analizza per trovare incoerenze prima del runtime.
 *
 * Regole implementate:
 *   E01 goto pendente           E02 variabile non dichiarata
 *   E03 riferimento invalido    E04 tipo incompatibile
 *   E05 enum/stage fuori dominio E06 entry mancante
 *   E07 formula di check mancante
 *   E08 preset di personaggio incoerente
 *   W01 nodo irraggiungibile    W03 check impossibile
 *   W04 flag orfano (mai letto) W05 thread mai completato
 *   W07 equipaggiamento iniziale oltre la capacita' di trasporto
 */

import type {
  Story,
  Condition,
  Effect,
  ActiveCheck,
  VarDecl,
} from "./types.ts";
import { parseDice, diceMin, diceMax } from "./dice.ts";

export type Severity = "error" | "warning";

export interface Finding {
  code: string;
  severity: Severity;
  path: string;
  message: string;
}

const NUMERIC_OPS = new Set([">", "<", ">=", "<="]);

export function validateStory(story: Story): Finding[] {
  const findings: Finding[] = [];
  const add = (code: string, severity: Severity, path: string, message: string) =>
    findings.push({ code, severity, path, message });

  const nodeIds = new Set(Object.keys(story.nodes));
  const varDecls = story.stateSchema ?? {};
  const skillIds = new Set((story.ruleset.skills ?? []).map((s) => s.id));
  const attrIds = new Set((story.ruleset.attributes ?? []).map((a) => a.id));
  const resIds = new Set((story.ruleset.resources ?? []).map((r) => r.id));
  let usesChecks = false;
  const itemIds = new Set(Object.keys(story.items ?? {}));
  const threadDecls = story.threads ?? {};
  const threadIds = new Set(Object.keys(threadDecls));

  const readVars = new Set<string>();
  const writtenVars = new Set<string>();
  const completedThreads = new Set<string>();

  // --- E06 entry
  if (!nodeIds.has(story.entry)) {
    add("E06", "error", "entry", `Il nodo iniziale "${story.entry}" non esiste.`);
  }

  // --- verifica di un riferimento usato in una condizione (E02/E03/E04/E05 parziale)
  function checkRef(ref: string, path: string, op?: string, rhsForEnum?: unknown): void {
    if (ref.startsWith("@")) {
      const idx = ref.indexOf(":");
      const kind = ref.slice(1, idx);
      const id = ref.slice(idx + 1);
      // riferimenti d'inventario senza id: @capacity, @carried, @free
      if (idx === -1) {
        if (!["capacity", "carried", "free"].includes(ref.slice(1))) {
          add("E03", "error", path, `Riferimento sconosciuto: "${ref}".`);
        }
        return;
      }
      const known: Record<string, Set<string>> = {
        skill: skillIds, attr: attrIds, resource: resIds, item: itemIds, thread: threadIds,
      };
      const set = known[kind];
      if (!set) add("E03", "error", path, `Prefisso riferimento sconosciuto: "@${kind}".`);
      else if (!set.has(id)) add("E03", "error", path, `@${kind}:${id} non e' dichiarato.`);
      return;
    }
    // variabile di stateSchema
    readVars.add(ref);
    const decl = varDecls[ref];
    if (!decl) {
      add("E02", "error", path, `Variabile "${ref}" non dichiarata in stateSchema.`);
      return;
    }
    if (op && NUMERIC_OPS.has(op) && decl.type !== "number") {
      add("E04", "error", path, `Operatore "${op}" su variabile "${ref}" di tipo ${decl.type}.`);
    }
    if (decl.type === "enum" && (op === "==" || op === "!=") && typeof rhsForEnum === "string") {
      if (!decl.values.includes(rhsForEnum)) {
        add("E05", "warning", path, `Confronto con "${rhsForEnum}" fuori dall'enum {${decl.values.join(", ")}}.`);
      }
    }
  }

  function validateCheckTarget(check: { skill?: string; attribute?: string }, path: string): void {
    usesChecks = true;
    if (check.skill) {
      if (!skillIds.has(check.skill)) add("E03", "error", path, `Skill "${check.skill}" non dichiarata.`);
    } else if (check.attribute) {
      if (!attrIds.has(check.attribute)) add("E03", "error", path, `Attributo "${check.attribute}" non dichiarato.`);
    } else {
      add("E03", "error", path, `Check senza bersaglio (né skill né attribute).`);
    }
  }

  function walkCondition(cond: Condition, path: string): void {
    if ("all" in cond) { cond.all.forEach((c, i) => walkCondition(c, `${path}.all[${i}]`)); return; }
    if ("any" in cond) { cond.any.forEach((c, i) => walkCondition(c, `${path}.any[${i}]`)); return; }
    if ("not" in cond) { walkCondition(cond.not, `${path}.not`); return; }
    if ("check" in cond) {
      validateCheckTarget(cond.check, `${path}.check`);
      (cond.check.modifiers ?? []).forEach((m, i) => walkCondition(m.when, `${path}.check.mod[${i}]`));
      return;
    }
    // foglia
    const rhsLit = typeof cond.rhs === "object" && cond.rhs !== null && "var" in cond.rhs ? undefined : cond.rhs;
    checkRef(cond.lhs, `${path}.lhs`, cond.op, rhsLit);
    if (typeof cond.rhs === "object" && cond.rhs !== null && "var" in cond.rhs) {
      checkRef(cond.rhs.var, `${path}.rhs`);
    }
  }

  function walkEffects(effects: Effect[] | undefined, path: string): void {
    if (!effects) return;
    effects.forEach((e, i) => {
      const p = `${path}[${i}]`;
      switch (e.kind) {
        case "set": {
          writtenVars.add(e.var);
          const decl = varDecls[e.var];
          if (!decl) { add("E02", "error", p, `set su variabile non dichiarata "${e.var}".`); break; }
          checkSetType(decl, e.value, p, e.var);
          break;
        }
        case "add": {
          writtenVars.add(e.var);
          const decl = varDecls[e.var];
          if (!decl) { add("E02", "error", p, `add su variabile non dichiarata "${e.var}".`); }
          else if (decl.type !== "number") { add("E04", "error", p, `add su variabile "${e.var}" di tipo ${decl.type}.`); }
          break;
        }
        case "adjustSkill":
          if (!skillIds.has(e.skill)) add("E03", "error", p, `Abilità "${e.skill}" non dichiarata.`);
          break;
        case "adjustAttribute":
          if (!attrIds.has(e.attribute)) add("E03", "error", p, `Caratteristica "${e.attribute}" non dichiarata.`);
          break;
        case "addItem":
        case "removeItem":
          if (!itemIds.has(e.item)) add("E03", "error", p, `Oggetto "${e.item}" non dichiarato in items.`);
          break;
        case "adjustResource":
          if (!resIds.has(e.resource)) add("E03", "error", p, `Risorsa "${e.resource}" non dichiarata.`);
          break;
        case "startThread":
        case "unlockThought":
          if (!threadIds.has(e.thread)) add("E03", "error", p, `Thread "${e.thread}" non dichiarato.`);
          break;
        case "advanceThread": {
          if (!threadIds.has(e.thread)) { add("E03", "error", p, `Thread "${e.thread}" non dichiarato.`); break; }
          const decl = threadDecls[e.thread];
          if (!decl.stages.includes(e.to)) {
            add("E05", "error", p, `Stage "${e.to}" non presente nel thread "${e.thread}".`);
          } else if (e.to === decl.stages[decl.stages.length - 1]) {
            completedThreads.add(e.thread);
          }
          break;
        }
        case "completeThread":
          if (!threadIds.has(e.thread)) add("E03", "error", p, `Thread "${e.thread}" non dichiarato.`);
          else completedThreads.add(e.thread);
          break;
      }
    });
  }

  function checkSetType(decl: VarDecl, value: unknown, path: string, varName: string): void {
    const t = typeof value;
    if (decl.type === "boolean" && t !== "boolean") add("E04", "error", path, `set su "${varName}" (boolean) con valore ${t}.`);
    if (decl.type === "number" && t !== "number") add("E04", "error", path, `set su "${varName}" (number) con valore ${t}.`);
    if (decl.type === "string" && t !== "string") add("E04", "error", path, `set su "${varName}" (string) con valore ${t}.`);
    if (decl.type === "enum") {
      if (t !== "string") add("E04", "error", path, `set su "${varName}" (enum) con valore ${t}.`);
      else if (!decl.values.includes(value as string)) add("E05", "error", path, `set su "${varName}" con "${value}" fuori dall'enum.`);
    }
  }

  // --- E01 goto + raccolta archi per W01
  const edges = new Map<string, Set<string>>();
  const addEdge = (from: string, to: string, path: string) => {
    if (!nodeIds.has(to)) { add("E01", "error", path, `goto verso nodo inesistente "${to}".`); return; }
    if (!edges.has(from)) edges.set(from, new Set());
    edges.get(from)!.add(to);
  };

  for (const [nid, node] of Object.entries(story.nodes)) {
    walkEffects(node.onFirstEnter, `nodes.${nid}.onFirstEnter`);
    walkEffects(node.onEnter, `nodes.${nid}.onEnter`);
    node.content.forEach((b, i) => { if (b.requires) walkCondition(b.requires, `nodes.${nid}.content[${i}].requires`); });

    (node.choices ?? []).forEach((c, i) => {
      const cp = `nodes.${nid}.choices.${c.id}`;
      if (c.requires) walkCondition(c.requires, `${cp}.requires`);
      walkEffects(c.effects, `${cp}.effects`);
      if (c.check) validateActiveCheck(c.check, nid, cp);
      else if (c.goto) addEdge(nid, c.goto, `${cp}.goto`);
    });
  }

  function validateActiveCheck(check: ActiveCheck, nid: string, cp: string): void {
    validateCheckTarget(check, `${cp}.check`);
    (check.modifiers ?? []).forEach((m, i) => walkCondition(m.when, `${cp}.check.mod[${i}]`));

    // gotos delle fasce di esito (o forma breve)
    if (check.outcomes) {
      for (const [tier, res] of Object.entries(check.outcomes)) {
        addEdge(nid, res.goto, `${cp}.check.outcomes.${tier}.goto`);
        walkEffects(res.effects, `${cp}.check.outcomes.${tier}.effects`);
      }
    } else {
      if (check.onSuccess) addEdge(nid, check.onSuccess, `${cp}.check.onSuccess`);
      if (check.onFailure) addEdge(nid, check.onFailure, `${cp}.check.onFailure`);
    }

    // W03 check impossibile / banale
    checkFeasibility(check, `${cp}.check`);
  }

  function checkFeasibility(check: ActiveCheck, path: string): void {
    const rs = story.ruleset;
    if (!rs.check) return; // E07 segnala già la formula mancante
    const adds = rs.check.adds ?? ["skill", "modifiers"];
    let spec;
    try { spec = parseDice(rs.check.dice); } catch { return; }

    let statMin = 0, statMax = 0;
    if (check.skill) {
      const skill = rs.skills?.find((s) => s.id === check.skill);
      if (adds.includes("skill")) { statMin += skill?.min ?? 0; statMax += skill?.max ?? 6; }
      if (adds.includes("attribute")) {
        const attr = skill ? rs.attributes.find((a) => a.id === skill.attribute) : undefined;
        statMin += attr?.min ?? 1; statMax += attr?.max ?? 6;
      }
    } else if (check.attribute) {
      const attr = rs.attributes.find((a) => a.id === check.attribute);
      statMin += attr?.min ?? 1; statMax += attr?.max ?? 6;
    }

    const mods = check.modifiers ?? [];
    const modPos = mods.reduce((s, m) => s + Math.max(0, m.value), 0);
    const modNeg = mods.reduce((s, m) => s + Math.min(0, m.value), 0);

    let min = diceMin(spec) + statMin, max = diceMax(spec) + statMax;
    if (adds.includes("modifiers")) { min += modNeg; max += modPos; }

    const meets = (total: number) => {
      switch (rs.check.compare) {
        case ">=": return total >= check.difficulty;
        case ">": return total > check.difficulty;
        case "<=": return total <= check.difficulty;
        case "<": return total < check.difficulty;
        default: return false;
      }
    };
    if (!meets(max) && !meets(min)) add("W03", "warning", path, `Check sempre fallito: nessun totale (${min}..${max}) supera difficolta' ${check.difficulty}.`);
    else if (meets(min) && meets(max)) add("W03", "warning", path, `Check sempre superato: ogni totale (${min}..${max}) batte difficolta' ${check.difficulty}.`);
  }

  // --- E08/W07 personaggi pronti (preset) ed equipaggiamento iniziale
  const presets = story.ruleset.presets ?? [];
  const seenPresetIds = new Set<string>();
  let defaults = 0;
  presets.forEach((preset, i) => {
    const p = `ruleset.presets[${i}]`;
    if (seenPresetIds.has(preset.id)) add("E08", "error", p, `Due personaggi pronti con lo stesso id "${preset.id}".`);
    seenPresetIds.add(preset.id);
    if (preset.default) defaults++;

    for (const id of Object.keys(preset.attributes ?? {}))
      if (!attrIds.has(id)) add("E08", "error", `${p}.attributes.${id}`, `Caratteristica "${id}" non dichiarata.`);
    for (const id of Object.keys(preset.skills ?? {}))
      if (!skillIds.has(id)) add("E08", "error", `${p}.skills.${id}`, `Abilità "${id}" non dichiarata.`);
    for (const id of Object.keys(preset.resources ?? {}))
      if (!resIds.has(id)) add("E08", "error", `${p}.resources.${id}`, `Indicatore "${id}" non dichiarato.`);
    for (const id of Object.keys(preset.items ?? {}))
      if (!itemIds.has(id)) add("E08", "error", `${p}.items.${id}`, `Oggetto "${id}" non dichiarato.`);

    // W07: l'equipaggiamento di partenza non deve già sforare la capacità.
    const inv = story.ruleset.inventory;
    if (inv) {
      let carried = 0, bonus = 0;
      for (const [id, qty] of Object.entries(preset.items ?? {})) {
        const decl = story.items?.[id];
        carried += (decl?.size ?? 1) * qty;
        bonus += (decl?.capacityBonus ?? 0) * qty;
      }
      const capacity = inv.baseCapacity + bonus;
      if (carried > capacity) {
        add("W07", "warning", `${p}.items`,
          `"${preset.name}" parte con ${carried} posti occupati su ${capacity} disponibili.`);
      }
    }
  });
  if (defaults > 1) {
    add("E08", "error", "ruleset.presets", `Più di un personaggio pronto è marcato come predefinito (${defaults}).`);
  }

  // --- E07 un check richiede una formula di risoluzione in ruleset.check
  if (usesChecks && !story.ruleset.check) {
    add("E07", "error", "ruleset.check", "La storia usa dei check ma manca ruleset.check (formula dei dadi).");
  }

  // --- W01 irraggiungibili (BFS da entry + nodi onDepleted come radici)
  const roots = [story.entry];
  for (const r of story.ruleset.resources ?? []) if (r.onDepleted && nodeIds.has(r.onDepleted)) roots.push(r.onDepleted);
  const seen = new Set<string>();
  const queue = roots.filter((r) => nodeIds.has(r));
  while (queue.length) {
    const n = queue.shift()!;
    if (seen.has(n)) continue;
    seen.add(n);
    for (const t of edges.get(n) ?? []) if (!seen.has(t)) queue.push(t);
  }
  for (const nid of nodeIds) {
    if (!seen.has(nid)) add("W01", "warning", `nodes.${nid}`, `Nodo irraggiungibile dall'entry.`);
  }

  // --- W04 flag orfani (mai letti)
  for (const name of Object.keys(varDecls)) {
    if (!readVars.has(name)) {
      add("W04", "warning", `stateSchema.${name}`, writtenVars.has(name)
        ? `Variabile "${name}" scritta ma mai letta.`
        : `Variabile "${name}" dichiarata ma mai usata.`);
    }
  }

  // --- W05 thread mai completati
  for (const tid of threadIds) {
    if (!completedThreads.has(tid)) {
      add("W05", "warning", `threads.${tid}`, `Thread "${tid}" non viene mai portato allo stage finale.`);
    }
  }

  return findings;
}

export function hasErrors(findings: Finding[]): boolean {
  return findings.some((f) => f.severity === "error");
}
