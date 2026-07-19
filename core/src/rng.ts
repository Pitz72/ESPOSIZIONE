/**
 * RNG seedabile e deterministico (mulberry32).
 * Lo stato e' un intero a 32 bit; ogni estrazione restituisce anche il nuovo stato,
 * cosi' il motore puo' filare il seed dentro RuntimeState in modo puro e riproducibile.
 */

export interface RandomDraw {
  /** Valore in [0, 1). */
  value: number;
  /** Nuovo stato dell'RNG da conservare per l'estrazione successiva. */
  state: number;
}

export function nextRandom(state: number): RandomDraw {
  let a = state | 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  const value = ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  return { value, state: a };
}

/** Intero in [minInclusive, maxInclusive]. */
export function nextInt(state: number, minInclusive: number, maxInclusive: number): { value: number; state: number } {
  const draw = nextRandom(state);
  const span = maxInclusive - minInclusive + 1;
  return { value: minInclusive + Math.floor(draw.value * span), state: draw.state };
}
