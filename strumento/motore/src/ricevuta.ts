/**
 * La ricevuta (§10): le righe che compongono l'esposizione, la somma, il grado,
 * e quali righe non contano. È una funzione pura: riceve le righe già scelte e
 * restituisce la ricevuta segnata.
 */

import type { Grado } from "./tipi.ts";

export type TipoRiga = "partenza" | "luogo" | "momento" | "scena" | "aggravante" | "preparazione";

export interface Riga {
  tipo: TipoRiga;
  testo: string;
  valore: number;
  conta: boolean;
  nota?: string;
}

export interface Composizione {
  righe: Riga[];
  somma: number;
  fondo: Grado;
  grado: Grado;
  /** Una nota per tutta la ricevuta (per esempio quando il Fondo è 2). */
  nota?: string;
}

export const NOMI_GRADO = ["AL COPERTO", "ESPOSTO", "ALLO SCOPERTO"] as const;
export const NOMI_GRADO_MINUSCOLI = ["al coperto", "esposto", "allo scoperto"] as const;

export function tieni(somma: number, fondo: Grado): Grado {
  if (somma < fondo) return fondo;
  if (somma > 2) return 2;
  return somma as Grado;
}

function altreDue(n: number): string {
  return n === 1 ? "ne servirebbe un'altra" : `ne servirebbero altre ${n}`;
}

/**
 * Compone la ricevuta e segna le righe che non contano, secondo la tabella del §10.2.
 * Le righe a zero non si scrivono, tranne la partenza. Garanzia: togliendo insieme
 * tutte le righe segnate, il grado non cambia (vedi i test).
 */
export function componi(partenza: { testo: string; valore: number }, altre: Array<{ tipo: TipoRiga; testo: string; valore: number }>, fondo: Grado): Composizione {
  const righe: Riga[] = [{ tipo: "partenza", testo: partenza.testo, valore: partenza.valore, conta: true }];
  for (const r of altre) if (r.valore !== 0) righe.push({ ...r, conta: true });

  const somma = righe.reduce((s, r) => s + r.valore, 0);
  const grado = tieni(somma, fondo);
  const alzano = righe.filter((r) => r.tipo !== "partenza" && r.valore > 0);
  const abbassano = righe.filter((r) => r.tipo !== "partenza" && r.valore < 0);

  const spegni = (r: Riga, nota: string) => {
    r.conta = false;
    r.nota = nota;
  };

  if (fondo === 2) {
    for (const r of [...alzano, ...abbassano]) spegni(r, "non conta");
    return { righe, somma, fondo, grado, nota: "questa azione costa sempre il massimo" };
  }

  if (somma >= 2) {
    // Al tetto: nessuna riga che abbassa basta a scendere.
    const mancano = somma - 1;
    for (const r of abbassano) spegni(r, r.tipo === "preparazione" ? `non basta: ${altreDue(mancano)}` : "non conta: resti allo scoperto");
    // Oltre il tetto: le ultime righe che alzano, tante quanti i punti di troppo.
    const troppo = somma - 2;
    for (const r of alzano.slice(alzano.length - troppo)) if (troppo > 0) spegni(r, "non conta: sei già allo scoperto");
  } else if (somma <= fondo) {
    // Al Fondo o sotto: nessuna riga che alza conta.
    for (const r of alzano) spegni(r, `non conta: saresti comunque ${NOMI_GRADO_MINUSCOLI[fondo]}`);
    const sotto = fondo - somma;
    if (sotto > 0) {
      for (const r of abbassano.slice(abbassano.length - sotto)) {
        spegni(r, `${r.tipo === "preparazione" ? "non serve" : "non conta"}: più in basso di ${NOMI_GRADO_MINUSCOLI[fondo]} non si scende`);
      }
    }
  }
  return { righe, somma, fondo, grado };
}
