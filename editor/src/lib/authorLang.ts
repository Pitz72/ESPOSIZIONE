/**
 * Traduttore dal dato tecnico alla LINGUA DELL'AUTORE (docs/author-experience.md).
 * Nessun id, nessun @, nessun operatore matematico crudo: solo frasi leggibili.
 * La vista tecnica usa invece i riepiloghi di summarize.ts.
 */
import type { Story, Condition, Effect, ActiveCheck, Finding, VarDecl } from "../../../core/src/index.ts";

// --- Nomi leggibili -------------------------------------------------------

/** Nome amichevole di un riferimento (fatto, indicatore, abilità). */
/** I riferimenti d'ingombro non hanno id: sono grandezze dell'inventario. */
const SPACE_LABEL: Record<string, string> = {
  "@capacity": "lo spazio che puoi portare",
  "@carried": "lo spazio occupato",
  "@free": "lo spazio libero",
};

export function friendlyRef(ref: string, story: Story): string {
  if (SPACE_LABEL[ref]) return SPACE_LABEL[ref];
  if (ref.startsWith("@")) {
    const idx = ref.indexOf(":");
    const kind = ref.slice(1, idx);
    const id = ref.slice(idx + 1);
    if (kind === "resource") return story.ruleset.resources?.find((r) => r.id === id)?.name ?? id;
    if (kind === "skill") return story.ruleset.skills?.find((s) => s.id === id)?.name ?? id;
    if (kind === "attr") return story.ruleset.attributes?.find((a) => a.id === id)?.name ?? id;
    if (kind === "item") return story.items?.[id]?.name ?? id;
    if (kind === "thread") return story.threads?.[id]?.name ?? id;
    return id;
  }
  return story.stateSchema[ref]?.label || ref;
}

export function sceneTitle(story: Story, id: string): string {
  return story.nodes[id]?.title || id;
}

// --- Tipi di fatto in parole d'autore ------------------------------------

export const FACT_KIND_LABEL: Record<VarDecl["type"], string> = {
  boolean: "un fatto (sì / no)",
  number: "un contatore",
  enum: "uno stato tra alcuni",
  string: "un testo",
};

// --- Condizioni → frase ("Appare solo se…") ------------------------------

const OP_WORD: Record<string, string> = {
  "==": "è uguale a", "!=": "è diverso da",
  ">": "è più di", "<": "è meno di", ">=": "è almeno", "<=": "è al massimo",
};

function valueWord(v: unknown): string {
  if (v === true) return "vero";
  if (v === false) return "falso";
  return String(v);
}

export function conditionToAuthor(c: Condition | undefined, story: Story): string {
  if (!c) return "";
  if ("all" in c) return c.all.map((x) => conditionToAuthor(x, story)).join(" e anche ");
  if ("any" in c) return c.any.map((x) => conditionToAuthor(x, story)).join(" oppure ");
  if ("not" in c) return `tranne quando ${conditionToAuthor(c.not, story)}`;
  if ("check" in c) return `una prova di ${friendlyRef("@skill:" + (c.check.skill ?? ""), story)} riesce`;

  const name = friendlyRef(c.lhs, story);
  const decl = story.stateSchema[c.lhs];
  const rhs = typeof c.rhs === "object" && c.rhs !== null && "var" in c.rhs ? friendlyRef(c.rhs.var, story) : c.rhs;

  // fatto sì/no: frasi naturali
  if (decl?.type === "boolean" && (c.op === "==" || c.op === "!=")) {
    const wantTrue = (c.op === "==" && rhs === true) || (c.op === "!=" && rhs === false);
    return `${name} ${wantTrue ? "è vero" : "è falso"}`;
  }
  return `${name} ${OP_WORD[c.op] ?? c.op} ${valueWord(rhs)}`;
}

// --- Effetti → frase ("Cosa cambia") -------------------------------------

export function effectToAuthor(e: Effect, story: Story): string {
  switch (e.kind) {
    case "set": {
      const name = friendlyRef(e.var, story);
      return `${name} diventa ${valueWord(e.value)}`;
    }
    case "add": {
      const name = friendlyRef(e.var, story);
      return e.value >= 0 ? `aumenta ${name} di ${e.value}` : `diminuisci ${name} di ${-e.value}`;
    }
    case "adjustSkill": {
      const name = friendlyRef("@skill:" + e.skill, story);
      return e.value >= 0 ? `${name} cresce di ${e.value}` : `${name} cala di ${-e.value}`;
    }
    case "adjustAttribute": {
      const name = friendlyRef("@attr:" + e.attribute, story);
      return e.value >= 0 ? `${name} cresce di ${e.value}` : `${name} cala di ${-e.value}`;
    }
    case "addItem": return `ottieni ${story.items?.[e.item]?.name ?? e.item}`;
    case "removeItem": return `perdi ${story.items?.[e.item]?.name ?? e.item}`;
    case "adjustResource": {
      const name = friendlyRef("@resource:" + e.resource, story);
      return `${name} ${e.value >= 0 ? "+" : "−"}${Math.abs(e.value)}`;
    }
    case "startThread": return `avvia il filo «${story.threads?.[e.thread]?.name ?? e.thread}»`;
    case "advanceThread": return `il filo «${story.threads?.[e.thread]?.name ?? e.thread}» avanza`;
    case "completeThread": return `concludi il filo «${story.threads?.[e.thread]?.name ?? e.thread}»`;
    case "unlockThought": return `sblocca il pensiero «${story.threads?.[e.thread]?.name ?? e.thread}»`;
  }
}

export function effectsToAuthor(effects: Effect[] | undefined, story: Story): string {
  if (!effects || effects.length === 0) return "";
  return effects.map((e) => effectToAuthor(e, story)).join(" · ");
}

// --- Probabilità di riuscita di una prova --------------------------------

function diceCounts(notation: string): { counts: Map<number, number>; total: number } | null {
  const m = /^(\d+)d(\d+)$/.exec(notation.trim());
  if (!m) return null;
  const count = Number(m[1]), faces = Number(m[2]);
  let counts = new Map<number, number>([[0, 1]]);
  for (let i = 0; i < count; i++) {
    const next = new Map<number, number>();
    for (const [sum, c] of counts) for (let f = 1; f <= faces; f++) next.set(sum + f, (next.get(sum + f) ?? 0) + c);
    counts = next;
  }
  let total = 0;
  for (const c of counts.values()) total += c;
  return { counts, total };
}

function meets(op: string, total: number, difficulty: number): boolean {
  switch (op) {
    case ">=": return total >= difficulty;
    case ">": return total > difficulty;
    case "<=": return total <= difficulty;
    case "<": return total < difficulty;
    default: return false;
  }
}

/** % di riuscita di una prova per un PERSONAGGIO MEDIO (default della statistica). Null se non calcolabile. */
export function successChance(story: Story, check: ActiveCheck): number | null {
  const rs = story.ruleset;
  if (!rs.check) return null;
  const dist = diceCounts(rs.check.dice);
  if (!dist) return null;
  const adds = rs.check.adds ?? ["skill", "modifiers"];

  let statAvg = 0;
  if (check.skill) {
    const sk = rs.skills?.find((s) => s.id === check.skill);
    if (adds.includes("skill")) statAvg += sk?.default ?? Math.round(((sk?.min ?? 0) + (sk?.max ?? 6)) / 2);
    if (adds.includes("attribute")) {
      const at = sk ? rs.attributes?.find((a) => a.id === sk.attribute) : undefined;
      statAvg += at?.default ?? 0;
    }
  } else if (check.attribute) {
    const at = rs.attributes?.find((a) => a.id === check.attribute);
    statAvg += at?.default ?? Math.round(((at?.min ?? 1) + (at?.max ?? 6)) / 2);
  }

  let ok = 0;
  for (const [sum, c] of dist.counts) if (meets(rs.check.compare, sum + statAvg, check.difficulty)) ok += c;
  return Math.round((ok / dist.total) * 100);
}

/** Difficoltà a parole, derivata dalla % di riuscita. */
export function difficultyWord(pct: number | null): string {
  if (pct == null) return "—";
  if (pct >= 88) return "Banale";
  if (pct >= 72) return "Facile";
  if (pct >= 55) return "Medio";
  if (pct >= 38) return "Difficile";
  return "Arduo";
}

export function checkToAuthor(story: Story, check: ActiveCheck): { line: string; pct: number | null } {
  const ability = friendlyRef((check.skill ? "@skill:" : "@attr:") + (check.skill ?? check.attribute ?? ""), story);
  const pct = successChance(story, check);
  return { line: `Prova di ${ability} — difficoltà ${difficultyWord(pct)}`, pct };
}

// --- Validazione gentile -------------------------------------------------

/** Traduce un finding tecnico in un consiglio amichevole. */
export function friendlyFinding(f: Finding, story: Story): string {
  const scene = /^nodes\.([A-Za-z_][A-Za-z0-9_]*)/.exec(f.path);
  const where = scene ? `«${sceneTitle(story, scene[1])}»` : "";
  switch (f.code) {
    case "E01": return `Una scelta ${where ? `in ${where} ` : ""}non porta a nessuna scena. Vuoi collegarla?`;
    case "E06": return "La storia non ha una scena d'inizio valida.";
    case "E07": return "C'è una prova di abilità ma manca la scheda del personaggio con i dadi.";
    case "W01": return `A ${where || "questa scena"} non arriva nessun percorso. È una scena orfana?`;
    case "W02": return `Da ${where || "questa scena"} non si può proseguire. Manca un finale o una via d'uscita?`;
    case "W03": return `Una prova ${where ? `in ${where} ` : ""}riesce sempre o non riesce mai: rivedi la difficoltà.`;
    case "W04": {
      const v = /stateSchema\.([A-Za-z_][A-Za-z0-9_]*)/.exec(f.path);
      const name = v ? friendlyRef(v[1], story) : "un fatto";
      return `Ti segni «${name}» ma non lo controlli mai. Serve davvero?`;
    }
    case "W05": return "Un filo narrativo non viene mai concluso.";
    default: return f.message;
  }
}
