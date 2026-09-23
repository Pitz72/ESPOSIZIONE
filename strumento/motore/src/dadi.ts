/**
 * Due dadi a sei facce, con un generatore riproducibile: la stessa partita con lo
 * stesso seme dà gli stessi tiri (§22.3, requisito 5).
 */

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

/** Probabilità di riuscire una prova: due dadi + bonus − penalità ≥ soglia. */
export function probabilita(soglia: number, bonus: number, penalita: number): number {
  return almeno(soglia - bonus + penalita);
}

/** Percentuale arrotondata, come la mostra la ricevuta. */
export function percentuale(p: number): number {
  return Math.round(p * 100);
}
