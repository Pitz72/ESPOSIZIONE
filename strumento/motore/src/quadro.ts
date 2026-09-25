/**
 * Il quadro (§21): le righe della riuscita e del costo, con le righe che non contano.
 * Qui ci sono soltanto funzioni pure: ricevono le righe già scelte dal motore e
 * restituiscono le sezioni segnate. Il motore (motore.ts) sceglie le righe.
 */

import type { Grado } from "./tipi.ts";
import { fascePercento, fasce, type Fasce } from "./dadi.ts";

// ---------------------------------------------------------------------------
// Quanto ti costa (§19)
// ---------------------------------------------------------------------------

export type TipoRiga = "partenza" | "ambiente" | "scena" | "aggravante" | "preparazione";

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
  /** Una nota per tutta la sezione (per esempio quando il Fondo è 2). */
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
 * Compone il costo e segna le righe che non contano, secondo la tabella del §21.3.
 * Le righe dell'ambiente contano al massimo 2 in su o in giù (§11.1): quelle in più
 * restano nel quadro, segnate, e non entrano nella somma. Le righe a zero non si
 * scrivono, tranne la partenza. Garanzia: togliendo insieme tutte le righe segnate,
 * il grado non cambia (vedi i test).
 */
export function componi(partenza: { testo: string; valore: number }, altre: Array<{ tipo: TipoRiga; testo: string; valore: number }>, fondo: Grado): Composizione {
  const righe: Riga[] = [{ tipo: "partenza", testo: partenza.testo, valore: partenza.valore, conta: true }];
  const fuori = new Set<Riga>();
  let ambiente = 0;
  for (const r of altre) {
    if (r.valore === 0) continue;
    const riga: Riga = { ...r, conta: true };
    if (r.tipo === "ambiente") {
      if (Math.abs(ambiente + r.valore) > 2) {
        riga.conta = false;
        riga.nota = "non conta: l'ambiente conta al massimo 2";
        fuori.add(riga);
      } else ambiente += r.valore;
    }
    righe.push(riga);
  }

  const dentro = righe.filter((r) => !fuori.has(r));
  const somma = dentro.reduce((s, r) => s + r.valore, 0);
  const grado = tieni(somma, fondo);
  const alzano = dentro.filter((r) => r.tipo !== "partenza" && r.valore > 0);
  const abbassano = dentro.filter((r) => r.tipo !== "partenza" && r.valore < 0);

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
    if (troppo > 0) for (const r of alzano.slice(alzano.length - troppo)) spegni(r, "non conta: sei già allo scoperto");
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

// ---------------------------------------------------------------------------
// Ci riesci (§18)
// ---------------------------------------------------------------------------

/** Da quale parte della scheda, o del mondo, viene una riga della riuscita. */
export type Parte = "catalogo" | "tratto" | "notizia" | "proprieta" | "legame" | "stato d'animo" | "scena" | "capacità" | "cosa" | "aiuto" | "ferita" | "logorio";

export interface RigaRiuscita {
  tipo: "soglia" | "gradino" | "livello" | "spinta" | "penalita" | "nota";
  testo: string;
  valore: number;
  parte?: Parte;
  conta: boolean;
  nota?: string;
}

export interface Riuscita {
  righe: RigaRiuscita[];
  sogliaBase: number;
  soglia: number;
  /** Livello + attrezzi e aiuti − penalità. */
  bonus: number;
  /** Quanto devono fare i dadi (§18.3). */
  dadi: number;
  /** Le fasce in trentaseiesimi e in percentuale. */
  esatte: Fasce;
  fasce: Fasce;
  /** In pieno più Riesci, in percentuale. */
  probabilita: number;
  /** La soglia è scesa sotto Facile: non si tira (§18.1). */
  nonSiTira: boolean;
  /** La soglia è salita sopra Estrema: la via è chiusa (§17). */
  troppoDifficile: boolean;
}

export interface Ragione {
  testo: string;
  parte: Parte;
}

/**
 * Compone la riuscita. La soglia si sposta al massimo di un gradino in giù e di uno
 * in su: le altre ragioni restano nel quadro, segnate. Attrezzi e aiuti valgono al
 * massimo +2, le penalità al massimo −3.
 */
export function riuscita(
  base: { testo: string; soglia: number },
  giu: Ragione[],
  su: Ragione[],
  livello: { testo: string; valore: number },
  spinte: Ragione[],
  penalita: Ragione[],
): Riuscita {
  const righe: RigaRiuscita[] = [{ tipo: "soglia", testo: base.testo, valore: base.soglia, parte: "catalogo", conta: true }];
  giu.forEach((r, i) => righe.push({ tipo: "gradino", testo: r.testo, valore: -2, parte: r.parte, conta: i === 0, nota: i === 0 ? undefined : "non conta: basta un gradino" }));
  su.forEach((r, i) => righe.push({ tipo: "gradino", testo: r.testo, valore: 2, parte: r.parte, conta: i === 0, nota: i === 0 ? undefined : "non conta: basta un gradino" }));
  righe.push({ tipo: "livello", testo: livello.testo, valore: livello.valore, parte: "capacità", conta: true });
  spinte.forEach((r, i) => righe.push({ tipo: "spinta", testo: r.testo, valore: 1, parte: r.parte, conta: i < 2, nota: i < 2 ? undefined : "non conta: attrezzi e aiuti valgono al massimo +2" }));
  penalita.forEach((r, i) => righe.push({ tipo: "penalita", testo: r.testo, valore: -1, parte: r.parte, conta: i < 3, nota: i < 3 ? undefined : "non conta: le penalità arrivano al massimo a −3" }));

  const gradini = (giu.length ? -1 : 0) + (su.length ? 1 : 0);
  const soglia = base.soglia + 2 * gradini;
  const bonus = livello.valore + Math.min(2, spinte.length) - Math.min(3, penalita.length);
  const dadi = soglia - bonus;
  const nonSiTira = soglia < 6;
  const troppoDifficile = soglia > 12;
  const esatte = fasce(dadi);
  const f = fascePercento(dadi);
  return {
    righe,
    sogliaBase: base.soglia,
    soglia,
    bonus,
    dadi,
    esatte,
    fasce: f,
    probabilita: Math.round(((esatte.pieno + esatte.riesci) / 36) * 100),
    nonSiTira,
    troppoDifficile,
  };
}
