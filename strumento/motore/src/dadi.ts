/**
 * Due dadi a sei facce, con un generatore riproducibile: la stessa partita con lo
 * stesso seme dà gli stessi tiri (§48.3, requisito 8). E le quattro fasce (§18).
 */

import type { Fascia } from "./tipi.ts";

/** Un passo del generatore mulberry32. Restituisce un valore in [0, 1) e il nuovo stato. */
export function prossimo(stato: number): { valore: number; stato: number } {
  let a = stato | 0;
  a = (a + 0x6d2b79f5) | 0;
  let t = Math.imul(a ^ (a >>> 15), 1 | a);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return { valore: ((t ^ (t >>> 14)) >>> 0) / 4294967296, stato: a };
}

/** Un intero fra min e max, estremi compresi. */
export function intero(stato: number, min: number, max: number): { valore: number; stato: number } {
  const r = prossimo(stato);
  return { valore: min + Math.floor(r.valore * (max - min + 1)), stato: r.stato };
}

export function tiraDueDadi(stato: number): { dadi: [number, number]; totale: number; stato: number } {
  const a = intero(stato, 1, 6);
  const b = intero(a.stato, 1, 6);
  return { dadi: [a.valore, b.valore], totale: a.valore + b.valore, stato: b.stato };
}

const COMBINAZIONI = [0, 0, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1];

/** Probabilità che due dadi facciano almeno `bisogno`. */
export function almeno(bisogno: number): number {
  if (bisogno <= 2) return 1;
  if (bisogno > 12) return 0;
  let casi = 0;
  for (let n = bisogno; n <= 12; n++) casi += COMBINAZIONI[n];
  return casi / 36;
}

/** Probabilità di riuscire una prova (In pieno o Riesci): due dadi + bonus − penalità ≥ soglia. */
export function probabilita(soglia: number, bonus: number, penalita: number): number {
  return almeno(soglia - bonus + penalita);
}

/** Quante combinazioni su 36 fanno almeno `bisogno`. */
export function almenoSu36(bisogno: number): number {
  return Math.round(almeno(bisogno) * 36);
}

export interface Fasce {
  pieno: number;
  riesci: number;
  quasi: number;
  non: number;
}

/** Le quattro fasce in trentaseiesimi, quando i dadi devono fare `d` (appendice A). */
export function fasce(d: number): Fasce {
  const a = almenoSu36;
  return { pieno: a(d + 4), riesci: a(d) - a(d + 4), quasi: a(d - 2) - a(d), non: 36 - a(d - 2) };
}

/** Le fasce in percentuale arrotondata, come le mostra il quadro. */
export function fascePercento(d: number): Fasce {
  const f = fasce(d);
  const p = (n: number) => Math.round((n / 36) * 100);
  return { pieno: p(f.pieno), riesci: p(f.riesci), quasi: p(f.quasi), non: p(f.non) };
}

/** La fascia di un margine (§18.2): +4 o più, da 0 a +3, −1 o −2, −3 o meno. */
export function fasciaDi(margine: number): Fascia {
  if (margine >= 4) return "pieno";
  if (margine >= 0) return "riesci";
  if (margine >= -2) return "quasi";
  return "non";
}

export const NOMI_FASCIA: Record<Fascia, string> = { pieno: "In pieno", riesci: "Riesci", quasi: "Quasi", non: "Non riesci" };

/** Percentuale arrotondata, come la mostra il quadro. */
export function percentuale(p: number): number {
  return Math.round(p * 100);
}
