/**
 * Motore di runtime deterministico per storie `.iwstory`.
 * Tutte le funzioni sono pure: non fanno I/O e non mutano gli input
 * (lo stato in ingresso viene clonato). L'unica sorgente di casualita'
 * e' il seed dentro RuntimeState, che avanza a ogni tiro attivo.
 */

import type {
  Story,
  RuntimeState,
  CharacterBuild,
  Condition,
  Effect,
  ActiveCheck,
  PassiveCheck,
  Modifier,
  Outcomes,
  OutcomeTier,
  OutcomeResolution,
  Literal,
  ResolvedNode,
  ResolvedChoice,
  Choice,
  CheckResult,
} from "./types.ts";
import { parseDice, diceMin, diceMax, rollDice } from "./dice.ts";

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

const TIER_ORDER: OutcomeTier[] = ["critFailure", "failure", "partial", "success", "critSuccess"];

function clone(state: RuntimeState): RuntimeState {
  return structuredClone(state);
}

function toNum(v: Literal | undefined): number {
  if (typeof v === "number") return v;
  if (typeof v === "boolean") return v ? 1 : 0;
  if (typeof v === "string") return Number(v);
  return NaN;
}

function clamp(value: number, min: number | undefined, max: number | undefined): number {
  let v = value;
  if (typeof min === "number") v = Math.max(min, v);
  if (typeof max === "number") v = Math.min(max, v);
  return v;
}

// ---------------------------------------------------------------------------
// Inventario: quanto si puo' portare addosso
// ---------------------------------------------------------------------------

/** Posti occupati adesso: somma di `size` (default 1) per ogni oggetto posseduto. */
export function carriedOf(state: RuntimeState, story: Story): number {
  let total = 0;
  for (const [id, qty] of Object.entries(state.inventory)) {
    const size = story.items?.[id]?.size ?? 1;
    total += size * qty;
  }
  return total;
}

/** Posti disponibili: base + i bonus dei contenitori che il personaggio ha addosso. */
export function capacityOf(state: RuntimeState, story: Story): number {
  const inv = story.ruleset.inventory;
  if (!inv) return Infinity; // storia senza regole d'ingombro: nessun limite
  let total = inv.baseCapacity;
  for (const [id, qty] of Object.entries(state.inventory)) {
    const bonus = story.items?.[id]?.capacityBonus;
    if (bonus) total += bonus * qty;
  }
  return total;
}

/** Posti liberi. Infinity se la storia non usa regole d'ingombro. */
export function freeSpaceOf(state: RuntimeState, story: Story): number {
  return capacityOf(state, story) - carriedOf(state, story);
}

// ---------------------------------------------------------------------------
// Risoluzione riferimenti e condizioni
// ---------------------------------------------------------------------------

export function resolveRef(ref: string, state: RuntimeState, story: Story): Literal {
  if (ref.startsWith("@")) {
    const idx = ref.indexOf(":");
    // riferimenti senza id: @capacity, @carried, @free
    if (idx === -1) {
      switch (ref.slice(1)) {
        case "capacity": return capacityOf(state, story);
        case "carried": return carriedOf(state, story);
        case "free": return freeSpaceOf(state, story);
        default: return 0;
      }
    }
    const kind = ref.slice(1, idx);
    const id = ref.slice(idx + 1);
    switch (kind) {
      case "skill": return state.skills[id] ?? 0;
      case "attr": return state.attributes[id] ?? 0;
      case "resource": return state.resources[id] ?? 0;
      case "item": return state.inventory[id] ?? 0;
      case "thread": {
        const stage = state.threads[id];
        if (stage === undefined) return -1;
        const decl = story.threads?.[id];
        return decl ? decl.stages.indexOf(stage) : -1;
      }
      default: return 0;
    }
  }
  return state.vars[ref];
}

function applyOp(op: string, a: Literal | undefined, b: Literal | undefined): boolean {
  switch (op) {
    case "==": return a === b;
    case "!=": return a !== b;
    case ">": return toNum(a) > toNum(b);
    case "<": return toNum(a) < toNum(b);
    case ">=": return toNum(a) >= toNum(b);
    case "<=": return toNum(a) <= toNum(b);
    default: return false;
  }
}

export function evaluate(cond: Condition, state: RuntimeState, story: Story): boolean {
  if ("all" in cond) return cond.all.every((c) => evaluate(c, state, story));
  if ("any" in cond) return cond.any.some((c) => evaluate(c, state, story));
  if ("not" in cond) return !evaluate(cond.not, state, story);
  if ("check" in cond) return passiveSucceeds(cond.check, state, story);
  // foglia
  const lhs = resolveRef(cond.lhs, state, story);
  const rhs = typeof cond.rhs === "object" && cond.rhs !== null && "var" in cond.rhs
    ? resolveRef(cond.rhs.var, state, story)
    : (cond.rhs as Literal);
  return applyOp(cond.op, lhs, rhs);
}

function modifierTotal(mods: Modifier[] | undefined, state: RuntimeState, story: Story): number {
  if (!mods) return 0;
  let total = 0;
  for (const m of mods) if (evaluate(m.when, state, story)) total += m.value;
  return total;
}

/**
 * Contributo statico (senza dado e senza modificatori) di un check.
 * Il check punta a una skill OPPURE a un attributo.
 * - target skill:     +skill (se adds ha "skill"), +attributo genitore (se adds ha "attribute")
 * - target attributo: +attributo (sempre: e' il bersaglio)
 */
function checkStatBonus(check: ActiveCheck | PassiveCheck, state: RuntimeState, story: Story): number {
  const adds = story.ruleset.check.adds ?? ["skill", "modifiers"];
  let bonus = 0;
  if (check.skill) {
    if (adds.includes("skill")) bonus += state.skills[check.skill] ?? 0;
    if (adds.includes("attribute")) {
      const sd = story.ruleset.skills?.find((s) => s.id === check.skill);
      if (sd) bonus += state.attributes[sd.attribute] ?? 0;
    }
  } else if (check.attribute) {
    bonus += state.attributes[check.attribute] ?? 0;
  }
  return bonus;
}

/**
 * I check passivi sono DETERMINISTICI (nessun dado): confrontano
 * statistica + modificatori con la difficolta'. Cosi' cio' che una voce interiore
 * rivela e' riproducibile e stabile.
 */
export function passiveSucceeds(check: PassiveCheck, state: RuntimeState, story: Story): boolean {
  const adds = story.ruleset.check.adds ?? ["skill", "modifiers"];
  let total = checkStatBonus(check, state, story);
  if (adds.includes("modifiers")) total += modifierTotal(check.modifiers, state, story);
  return applyOp(story.ruleset.check.compare, total, check.difficulty);
}

// ---------------------------------------------------------------------------
// Grading degli esiti
// ---------------------------------------------------------------------------

function passingBoundary(op: string, difficulty: number): { boundary: number; dir: number } {
  switch (op) {
    case ">=": return { boundary: difficulty, dir: 1 };
    case ">": return { boundary: difficulty + 1, dir: 1 };
    case "<=": return { boundary: difficulty, dir: -1 };
    case "<": return { boundary: difficulty - 1, dir: -1 };
    default: return { boundary: difficulty, dir: 1 };
  }
}

export function gradeTier(
  total: number,
  natural: number,
  difficulty: number,
  story: Story,
): OutcomeTier {
  const rs = story.ruleset;
  const om = rs.outcomeModel ?? {};
  const partial = om.partial ?? false;
  const partialBand = om.partialBand ?? 2;
  const crits = om.crits ?? "natural";
  const critMargin = om.critMargin ?? 5;

  const { boundary, dir } = passingBoundary(rs.check.compare, difficulty);
  const effMargin = dir * (total - boundary); // >= 0 => superato

  // Critici (hanno la precedenza sul risultato base)
  if (crits === "natural") {
    const spec = parseDice(rs.check.dice);
    if (natural >= diceMax(spec)) return "critSuccess";
    if (natural <= diceMin(spec)) return "critFailure";
  } else if (crits === "margin") {
    if (effMargin >= critMargin) return "critSuccess";
    if (effMargin <= -critMargin) return "critFailure";
  }

  if (effMargin < 0) return "failure";
  if (partial && effMargin < partialBand) return "partial";
  return "success";
}

function normalizeOutcomes(check: ActiveCheck): Outcomes {
  if (check.outcomes) return check.outcomes;
  const out: Outcomes = {};
  if (check.onSuccess) out.success = { goto: check.onSuccess };
  if (check.onFailure) out.failure = { goto: check.onFailure };
  return out;
}

/** Trova la risoluzione per una fascia, degradando verso il basso (poi verso l'alto). */
export function degrade(tier: OutcomeTier, outcomes: Outcomes): OutcomeResolution {
  const i = TIER_ORDER.indexOf(tier);
  for (let j = i; j >= 0; j--) {
    const r = outcomes[TIER_ORDER[j]];
    if (r) return r;
  }
  for (let j = i + 1; j < TIER_ORDER.length; j++) {
    const r = outcomes[TIER_ORDER[j]];
    if (r) return r;
  }
  throw new Error("Check senza alcun esito risolvibile");
}

/** Tira un check attivo. Restituisce il risultato e il nuovo stato del seed. */
export function rollCheck(
  check: ActiveCheck,
  state: RuntimeState,
  story: Story,
): { result: CheckResult; seed: number } {
  const rs = story.ruleset;
  const adds = rs.check.adds ?? ["skill", "modifiers"];
  const spec = parseDice(rs.check.dice);
  const roll = rollDice(spec, state.seed);

  const modTotal = modifierTotal(check.modifiers, state, story);
  let total = roll.sum + checkStatBonus(check, state, story);
  if (adds.includes("modifiers")) total += modTotal;

  const tier = gradeTier(total, roll.sum, check.difficulty, story);
  const resolution = degrade(tier, normalizeOutcomes(check));

  return {
    result: {
      tier,
      total,
      target: check.difficulty,
      dice: roll.rolls,
      natural: roll.sum,
      modifierTotal: modTotal,
      resolution,
    },
    seed: roll.state,
  };
}

// ---------------------------------------------------------------------------
// Effetti
// ---------------------------------------------------------------------------

function applyEffect(effect: Effect, state: RuntimeState, story: Story): void {
  switch (effect.kind) {
    case "set":
      state.vars[effect.var] = effect.value;
      break;
    case "add": {
      const decl = story.stateSchema[effect.var];
      const cur = toNum(state.vars[effect.var]);
      const base = Number.isNaN(cur) ? 0 : cur;
      let next = base + effect.value;
      if (decl && decl.type === "number") next = clamp(next, decl.min, decl.max);
      state.vars[effect.var] = next;
      break;
    }
    case "adjustSkill": {
      const decl = (story.ruleset.skills ?? []).find((s) => s.id === effect.skill);
      const cur = state.skills[effect.skill] ?? decl?.default ?? 0;
      state.skills[effect.skill] = clamp(cur + effect.value, decl?.min ?? 0, decl?.max);
      break;
    }
    case "adjustAttribute": {
      const decl = (story.ruleset.attributes ?? []).find((a) => a.id === effect.attribute);
      const cur = state.attributes[effect.attribute] ?? decl?.default ?? 1;
      state.attributes[effect.attribute] = clamp(cur + effect.value, decl?.min ?? 1, decl?.max);
      break;
    }
    case "addItem": {
      const qty = effect.qty ?? 1;
      const inv = story.ruleset.inventory;
      if (inv && (inv.overflow ?? "block") === "block") {
        // Non entra piu' di quanto ci sta: l'oggetto resta fuori (niente parziali).
        const size = story.items?.[effect.item]?.size ?? 1;
        if (size * qty > freeSpaceOf(state, story)) break;
      }
      state.inventory[effect.item] = (state.inventory[effect.item] ?? 0) + qty;
      break;
    }
    case "removeItem": {
      const next = (state.inventory[effect.item] ?? 0) - (effect.qty ?? 1);
      if (next <= 0) delete state.inventory[effect.item];
      else state.inventory[effect.item] = next;
      break;
    }
    case "adjustResource": {
      const decl = (story.ruleset.resources ?? []).find((r) => r.id === effect.resource);
      const cur = state.resources[effect.resource] ?? decl?.default ?? 0;
      state.resources[effect.resource] = clamp(cur + effect.value, decl?.min ?? 0, decl?.max);
      break;
    }
    case "startThread": {
      const decl = story.threads?.[effect.thread];
      if (decl && state.threads[effect.thread] === undefined) {
        state.threads[effect.thread] = decl.stages[0];
      }
      break;
    }
    case "advanceThread":
      state.threads[effect.thread] = effect.to;
      break;
    case "completeThread": {
      const decl = story.threads?.[effect.thread];
      if (!decl) break;
      const last = decl.stages[decl.stages.length - 1];
      const wasComplete = state.threads[effect.thread] === last;
      state.threads[effect.thread] = last;
      if (!wasComplete && decl.onComplete) applyEffects(decl.onComplete, state, story);
      break;
    }
    case "unlockThought": {
      const decl = story.threads?.[effect.thread];
      if (decl && state.threads[effect.thread] === undefined) {
        state.threads[effect.thread] = decl.stages[0];
      }
      break;
    }
  }
}

/** Applica una lista di effetti a una COPIA dello stato e la restituisce. */
export function applyEffects(effects: Effect[], state: RuntimeState, story: Story): RuntimeState {
  const next = clone(state);
  for (const e of effects) applyEffect(e, next, story);
  return next;
}

// applica in-place su uno stato gia' clonato (uso interno)
function applyEffectsInPlace(effects: Effect[] | undefined, state: RuntimeState, story: Story): void {
  if (!effects) return;
  for (const e of effects) applyEffect(e, state, story);
}

// ---------------------------------------------------------------------------
// Creazione partita
// ---------------------------------------------------------------------------

function defaultVar(decl: Story["stateSchema"][string]): Literal {
  switch (decl.type) {
    case "boolean": return decl.default ?? false;
    case "number": return decl.default ?? 0;
    case "string": return decl.default ?? "";
    case "enum": return decl.default ?? decl.values[0];
  }
}

/**
 * Il preset da cui partire: quello chiesto dal build, altrimenti quello marcato
 * `default`, altrimenti nessuno (si usano i valori base delle dichiarazioni).
 */
export function resolvePreset(story: Story, build: CharacterBuild = {}) {
  const presets = story.ruleset.presets ?? [];
  if (build.preset) return presets.find((p) => p.id === build.preset);
  return presets.find((p) => p.default);
}

export function newGame(story: Story, build: CharacterBuild = {}): RuntimeState {
  const preset = resolvePreset(story, build);

  const vars: Record<string, Literal> = {};
  for (const [name, decl] of Object.entries(story.stateSchema)) vars[name] = defaultVar(decl);

  const resources: Record<string, number> = {};
  for (const r of story.ruleset.resources ?? []) {
    resources[r.id] = clamp(preset?.resources?.[r.id] ?? r.default ?? 0, r.min ?? 0, r.max);
  }

  // Precedenza: build esplicito > preset > default della dichiarazione.
  const attributes: Record<string, number> = {};
  for (const a of story.ruleset.attributes ?? []) {
    const v = build.attributes?.[a.id] ?? preset?.attributes?.[a.id] ?? a.default ?? 1;
    attributes[a.id] = clamp(v, a.min ?? 1, a.max);
  }

  const skills: Record<string, number> = {};
  for (const s of story.ruleset.skills ?? []) {
    const v = build.skills?.[s.id] ?? preset?.skills?.[s.id] ?? s.default ?? 0;
    skills[s.id] = clamp(v, s.min ?? 0, s.max);
  }

  // L'equipaggiamento iniziale entra senza passare dal controllo d'ingombro:
  // e' l'autore a dichiararlo, non il gioco a raccoglierlo.
  const inventory: Record<string, number> = {};
  for (const [id, qty] of Object.entries(preset?.items ?? {})) if (qty > 0) inventory[id] = qty;

  const state: RuntimeState = {
    currentNodeId: story.entry,
    vars,
    resources,
    inventory,
    threads: {},
    attributes,
    skills,
    seed: (build.seed ?? 0) | 0,
    redChecksUsed: {},
    history: [],
  };

  enter(state, story.entry, story);
  return state;
}

// ---------------------------------------------------------------------------
// Risoluzione del nodo corrente
// ---------------------------------------------------------------------------

function redCheckKey(nodeId: string, choiceId: string): string {
  return `${nodeId}:${choiceId}`;
}

function choiceStatus(choice: Choice, state: RuntimeState, story: Story): ResolvedChoice {
  const base = { id: choice.id, text: choice.text, tags: choice.tags };
  // red check gia' consumato?
  if (choice.check && choice.check.retryable === false) {
    if (state.redChecksUsed[redCheckKey(state.currentNodeId, choice.id)]) {
      return { ...base, status: "locked", reason: "red-check-used" };
    }
  }
  if (choice.requires && !evaluate(choice.requires, state, story)) {
    const show = choice.whenLocked === "show";
    return { ...base, status: show ? "locked" : "hidden", reason: "requires-not-met" };
  }
  return { ...base, status: "available" };
}

export function resolveNode(story: Story, state: RuntimeState): ResolvedNode {
  const node = story.nodes[state.currentNodeId];
  if (!node) throw new Error(`Nodo inesistente: "${state.currentNodeId}"`);

  const content = node.content.filter((b) => !b.requires || evaluate(b.requires, state, story));
  const choices = (node.choices ?? []).map((c) => choiceStatus(c, state, story));

  return { nodeId: node.id, title: node.title, content, choices };
}

// ---------------------------------------------------------------------------
// Esecuzione di una scelta
// ---------------------------------------------------------------------------

/** Entra in un nodo: onFirstEnter solo alla prima visita, poi sempre onEnter. */
function enter(state: RuntimeState, nodeId: string, story: Story): void {
  const first = !state.history.includes(nodeId);
  state.currentNodeId = nodeId;
  const node = story.nodes[nodeId];
  if (first) applyEffectsInPlace(node?.onFirstEnter, state, story);
  applyEffectsInPlace(node?.onEnter, state, story);
  state.history.push(nodeId);
}

export interface ChooseResult {
  state: RuntimeState;
  check: CheckResult | null;
  resolved: ResolvedNode;
}

export function choose(story: Story, prevState: RuntimeState, choiceId: string): ChooseResult {
  const node = story.nodes[prevState.currentNodeId];
  if (!node) throw new Error(`Nodo inesistente: "${prevState.currentNodeId}"`);
  const choice = (node.choices ?? []).find((c) => c.id === choiceId);
  if (!choice) throw new Error(`Scelta "${choiceId}" assente nel nodo "${node.id}"`);

  const status = choiceStatus(choice, prevState, story);
  if (status.status !== "available") {
    throw new Error(`Scelta "${choiceId}" non disponibile (${status.reason})`);
  }

  const state = clone(prevState);
  let checkResult: CheckResult | null = null;
  let goto: string;

  if (choice.check) {
    const rolled = rollCheck(choice.check, state, story);
    state.seed = rolled.seed;
    checkResult = rolled.result;
    applyEffectsInPlace(choice.effects, state, story);
    applyEffectsInPlace(rolled.result.resolution.effects, state, story);
    if (choice.check.retryable === false) {
      state.redChecksUsed[redCheckKey(prevState.currentNodeId, choice.id)] = true;
    }
    goto = rolled.result.resolution.goto;
  } else {
    applyEffectsInPlace(choice.effects, state, story);
    if (!choice.goto) throw new Error(`Scelta "${choiceId}" senza goto ne' check`);
    goto = choice.goto;
  }

  enter(state, goto, story);

  // Risorse esaurite -> nodo forzato (una sola redirezione)
  for (const r of story.ruleset.resources ?? []) {
    if (r.onDepleted && state.resources[r.id] <= (r.min ?? 0)) {
      if (state.currentNodeId !== r.onDepleted) enter(state, r.onDepleted, story);
      break;
    }
  }

  return { state, check: checkResult, resolved: resolveNode(story, state) };
}
