/**
 * Tipi TypeScript del formato `.iwstory` e dello stato di runtime.
 * Allineati a schema/iwstory.schema.json (formatVersion "0.2").
 *
 * Nota: questo file contiene SOLO tipi, quindi viene interamente cancellato
 * dal type-stripping di Node. Importarlo sempre con `import type`.
 */

// ---------------------------------------------------------------------------
// Riferimenti, letterali, espressioni (condizioni)
// ---------------------------------------------------------------------------

/** Valore primitivo ammesso come letterale. */
export type Literal = string | number | boolean;

/**
 * Riferimento risolvibile a runtime.
 * - nome nudo            -> variabile di stateSchema
 * - `@skill:id`          -> valore skill del personaggio
 * - `@attr:id`           -> valore attributo
 * - `@resource:id`       -> valore risorsa corrente
 * - `@item:id`           -> quantita' posseduta
 * - `@thread:id`         -> indice dello stage corrente (-1 se non avviato)
 */
export type Ref = string;

export type ComparisonOp = "==" | "!=" | ">" | "<" | ">=" | "<=";

export interface ConditionLeaf {
  lhs: Ref;
  op: ComparisonOp;
  rhs: Literal | { var: Ref };
}
export interface ConditionAll { all: Condition[]; }
export interface ConditionAny { any: Condition[]; }
export interface ConditionNot { not: Condition; }
export interface ConditionCheck { check: PassiveCheck; }

export type Condition =
  | ConditionLeaf
  | ConditionAll
  | ConditionAny
  | ConditionNot
  | ConditionCheck;

// ---------------------------------------------------------------------------
// Effetti
// ---------------------------------------------------------------------------

export type Effect =
  | { kind: "set"; var: string; value: Literal }
  | { kind: "add"; var: string; value: number }
  | { kind: "addItem"; item: string; qty?: number }
  | { kind: "removeItem"; item: string; qty?: number }
  | { kind: "adjustResource"; resource: string; value: number }
  | { kind: "startThread"; thread: string }
  | { kind: "advanceThread"; thread: string; to: string }
  | { kind: "completeThread"; thread: string }
  | { kind: "unlockThought"; thread: string };

// ---------------------------------------------------------------------------
// Check (prove di abilita')
// ---------------------------------------------------------------------------

export interface Modifier {
  when: Condition;
  value: number;
  label?: string;
}

/** Un check punta a esattamente una statistica: `skill` OPPURE `attribute`. */
export interface PassiveCheck {
  skill?: string;
  attribute?: string;
  difficulty: number;
  mode?: "passive";
  modifiers?: Modifier[];
}

/** Le cinque fasce di esito, ordinate dal peggio al meglio. */
export type OutcomeTier =
  | "critFailure"
  | "failure"
  | "partial"
  | "success"
  | "critSuccess";

export interface OutcomeResolution {
  goto: string;
  effects?: Effect[];
  text?: string;
}

export type Outcomes = Partial<Record<OutcomeTier, OutcomeResolution>>;

export interface ActiveCheck {
  skill?: string;
  attribute?: string;
  difficulty: number;
  mode?: "active";
  retryable?: boolean;
  modifiers?: Modifier[];
  // Forma a esiti graduati...
  outcomes?: Outcomes;
  // ...oppure forma breve binaria:
  onSuccess?: string;
  onFailure?: string;
}

// ---------------------------------------------------------------------------
// Nodi
// ---------------------------------------------------------------------------

export interface ContentBlock {
  speaker: string;
  text: string;
  requires?: Condition;
  /** Hint di presentazione liberi (glitch, typingSpeed, ...). Ignorati dal motore. */
  hints?: Record<string, unknown>;
}

export interface Choice {
  id: string;
  text: string;
  tags?: string[];
  requires?: Condition;
  whenLocked?: "hide" | "show";
  effects?: Effect[];
  check?: ActiveCheck;
  goto?: string;
}

export interface StoryNode {
  id: string;
  title?: string;
  tags?: string[];
  /** Effetti applicati solo alla prima visita del nodo (prima di onEnter). */
  onFirstEnter?: Effect[];
  onEnter?: Effect[];
  content: ContentBlock[];
  choices?: Choice[];
}

// ---------------------------------------------------------------------------
// Ruleset
// ---------------------------------------------------------------------------

export interface Attribute {
  id: string;
  name: string;
  default?: number;
  min?: number;
  max?: number;
}

export interface Skill {
  id: string;
  name: string;
  attribute: string;
  default?: number;
  min?: number;
  max?: number;
  canSpeak?: boolean;
}

export interface Resource {
  id: string;
  name: string;
  default?: number;
  min?: number;
  max?: number;
  onDepleted?: string;
}

export interface CheckFormula {
  dice: string; // "NdM"
  adds?: Array<"skill" | "attribute" | "modifiers">;
  compare: ">=" | ">" | "<=" | "<";
  critSuccess?: number;
  critFailure?: number;
}

export interface OutcomeModel {
  partial?: boolean;
  partialBand?: number;
  crits?: "natural" | "margin" | "off";
  critMargin?: number;
}

/** Tutti i campi sono opzionali: una storia checkless/statless può avere un ruleset vuoto. */
export interface Ruleset {
  attributes?: Attribute[];
  skills?: Skill[];
  resources?: Resource[];
  check?: CheckFormula;
  outcomeModel?: OutcomeModel;
  characterCreation?: { attributePoints?: number; skillPoints?: number };
}

// ---------------------------------------------------------------------------
// Dichiarazioni di stato, item, thread
// ---------------------------------------------------------------------------

export type VarDecl =
  | { type: "boolean"; default?: boolean; label?: string }
  | { type: "number"; default?: number; min?: number; max?: number; label?: string }
  | { type: "string"; default?: string; label?: string }
  | { type: "enum"; values: string[]; default?: string; label?: string };

export interface ItemDecl {
  name: string;
  description?: string;
  tags?: string[];
  stackable?: boolean;
}

export interface ThreadDecl {
  name: string;
  type: "quest" | "thought";
  stages: string[];
  onComplete?: Effect[];
}

// ---------------------------------------------------------------------------
// Storia
// ---------------------------------------------------------------------------

export interface StoryMeta {
  id: string;
  title: string;
  version: string;
  formatVersion: string;
  locale?: string;
  authors?: string[];
  description?: string;
}

export interface Story {
  meta: StoryMeta;
  ruleset: Ruleset;
  stateSchema: Record<string, VarDecl>;
  items?: Record<string, ItemDecl>;
  threads?: Record<string, ThreadDecl>;
  nodes: Record<string, StoryNode>;
  entry: string;
}

// ---------------------------------------------------------------------------
// Stato di runtime (e' anche il formato di salvataggio)
// ---------------------------------------------------------------------------

export interface RuntimeState {
  currentNodeId: string;
  vars: Record<string, Literal>;
  resources: Record<string, number>;
  inventory: Record<string, number>;
  threads: Record<string, string>; // threadId -> stage corrente
  attributes: Record<string, number>;
  skills: Record<string, number>;
  seed: number; // stato dell'RNG (avanza a ogni tiro)
  redChecksUsed: Record<string, true>; // "nodeId:choiceId" gia' tentati (red check)
  history: string[];
}

export interface CharacterBuild {
  attributes?: Record<string, number>;
  skills?: Record<string, number>;
  seed?: number;
}

// ---------------------------------------------------------------------------
// Risultati risolti (output del motore verso lo shell)
// ---------------------------------------------------------------------------

export type ChoiceStatus = "available" | "locked" | "hidden";

export interface ResolvedChoice {
  id: string;
  text: string;
  tags?: string[];
  status: ChoiceStatus;
  reason?: string; // perche' bloccata/nascosta
}

export interface ResolvedNode {
  nodeId: string;
  title?: string;
  content: ContentBlock[];
  choices: ResolvedChoice[];
}

export interface CheckResult {
  tier: OutcomeTier;
  total: number;
  target: number;
  dice: number[];
  natural: number;
  modifierTotal: number;
  resolution: OutcomeResolution;
}
