/** API pubblica di @interactivewriter/core. */

export type * from "./types.ts";
export { nextRandom, nextInt } from "./rng.ts";
export { parseDice, rollDice, diceMin, diceMax } from "./dice.ts";
export {
  newGame,
  resolveNode,
  choose,
  evaluate,
  applyEffects,
  rollCheck,
  gradeTier,
  degrade,
  resolveRef,
  passiveSucceeds,
} from "./engine.ts";
export type { ChooseResult } from "./engine.ts";
export { validateStory, hasErrors } from "./validator.ts";
export type { Finding, Severity } from "./validator.ts";
