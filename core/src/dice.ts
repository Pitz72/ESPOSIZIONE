/** Parsing e tiro della notazione dadi `NdM` (es. "2d6"). */

import { nextInt } from "./rng.ts";

export interface DiceSpec {
  count: number;
  faces: number;
}

const DICE_RE = /^(\d+)d(\d+)$/;

export function parseDice(notation: string): DiceSpec {
  const m = DICE_RE.exec(notation.trim());
  if (!m) throw new Error(`Notazione dadi non valida: "${notation}" (attesa NdM, es. 2d6)`);
  const count = Number(m[1]);
  const faces = Number(m[2]);
  if (count < 1 || faces < 2) throw new Error(`Notazione dadi fuori range: "${notation}"`);
  return { count, faces };
}

export function diceMin(spec: DiceSpec): number {
  return spec.count; // tutti 1
}
export function diceMax(spec: DiceSpec): number {
  return spec.count * spec.faces; // tutti al massimo
}

export interface DiceRoll {
  rolls: number[];
  sum: number;
  state: number;
}

/** Tira i dadi consumando (e avanzando) lo stato dell'RNG. */
export function rollDice(spec: DiceSpec, rngState: number): DiceRoll {
  const rolls: number[] = [];
  let state = rngState;
  let sum = 0;
  for (let i = 0; i < spec.count; i++) {
    const r = nextInt(state, 1, spec.faces);
    rolls.push(r.value);
    sum += r.value;
    state = r.state;
  }
  return { rolls, sum, state };
}
