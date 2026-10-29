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

export const NOMI_GRADO = ["AL COPERTO", "IN VISTA", "ALLO SCOPERTO"] as const;
export const NOMI_GRADO_MINUSCOLI = ["al coperto", "in vista", "allo scoperto"] as const;

export function tieni(somma: number, fondo: Grado): Grado {
  if (somma < fondo) return fondo;
  if (somma > 2) return 2;
  return somma as Grado;
}

function altreDue(n: number): string {
  return n === 1 ? "ne servirebbe un'altra" : `ne servirebbero altre ${n}`;
}

/** Il grado più basso di un'azione, detto in una frase che regge anche con «al coperto». */
function piuInBasso(fondo: Grado): string {
  return fondo === 0 ? "il grado più basso è al coperto" : `il grado più basso di questa azione è ${NOMI_GRADO_MINUSCOLI[fondo]}`;
}

/**
 * Compone il costo e segna le righe che non contano (§21.3). Le righe dell'ambiente
 * contano al massimo 2 in su o in giù (§11.1): quelle in più restano nel quadro,
 * segnate, e non entrano nella somma. Il Fondo e il tetto non spengono nessuna riga:
 * li dice una nota sotto il totale. Si segnano soltanto le preparazioni che non
 * cambiano il grado, perché chi le ha pagate deve saperlo prima di tirare. Le righe a
 * zero non si scrivono, tranne la partenza. Garanzia: togliendo insieme tutte le
 * righe segnate, il grado non cambia (vedi i test).
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
  const preparazioni = dentro.filter((r) => r.tipo === "preparazione");

  const spegni = (r: Riga, nota: string) => {
    r.conta = false;
    r.nota = nota;
  };

  if (fondo === 2) {
    for (const r of preparazioni) spegni(r, "non serve: questa azione costa sempre il massimo");
    return { righe, somma, fondo, grado, nota: "questa azione costa sempre il massimo" };
  }

  if (somma >= 2) {
    // Al tetto: nessuna preparazione basta a scendere.
    const mancano = somma - 1;
    for (const r of preparazioni) spegni(r, `non basta: ${altreDue(mancano)}`);
    return { righe, somma, fondo, grado, nota: somma > 2 ? "più su di allo scoperto non si va" : undefined };
  }
  if (somma < fondo) {
    // Sotto il Fondo: le ultime preparazioni, tante quanti i punti di troppo, non servono.
    const sotto = fondo - somma;
    for (const r of preparazioni.slice(Math.max(0, preparazioni.length - sotto))) spegni(r, `non serve: ${fondo === 0 ? "sei già al coperto" : piuInBasso(fondo)}`);
    return { righe, somma, fondo, grado, nota: piuInBasso(fondo) };
  }
  return { righe, somma, fondo, grado };
}

// ---------------------------------------------------------------------------
// Ci riesci (§18)
// ---------------------------------------------------------------------------

/** Da quale parte della scheda, o del mondo, viene una riga della riuscita. */
export type Parte = "catalogo" | "tratto" | "notizia" | "proprieta" | "legame" | "stato d'animo" | "scena" | "capacità" | "cosa" | "aiuto" | "ferita" | "logorio";

export interface RigaRiuscita {
  tipo: "soglia" | "scatto" | "livello" | "spinta" | "penalita" | "nota";
  testo: string;
  valore: number;
  /**
   * Il numero da scrivere accanto alla riga. La soglia e i suoi scatti scrivono la
   * soglia che ne risulta («8», poi «→ 10»); il livello, gli attrezzi, gli aiuti e le
   * penalità scrivono quanto aggiungono al tiro («+1», «−1»). Così nella stessa
   * sezione un «+» vuol dire sempre «ti aiuta».
   */
  mostra: string;
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
 * Compone la riuscita. La soglia si sposta al massimo di uno scatto in giù e di uno
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
  const segno = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : "+0");
  const righe: RigaRiuscita[] = [{ tipo: "soglia", testo: base.testo, valore: base.soglia, mostra: String(base.soglia), parte: "catalogo", conta: true }];
  let corrente = base.soglia;
  const scatto = (r: Ragione, i: number, verso: -1 | 1) => {
    if (i === 0) corrente += 2 * verso;
    righe.push({ tipo: "scatto", testo: r.testo, valore: 2 * verso, mostra: i === 0 ? `→ ${corrente}` : "", parte: r.parte, conta: i === 0, nota: i === 0 ? (verso > 0 ? "uno scatto più difficile" : "uno scatto più facile") : "non conta: basta uno scatto" });
  };
  giu.forEach((r, i) => scatto(r, i, -1));
  su.forEach((r, i) => scatto(r, i, 1));
  righe.push({ tipo: "livello", testo: livello.testo, valore: livello.valore, mostra: segno(livello.valore), parte: "capacità", conta: true });
  spinte.forEach((r, i) => righe.push({ tipo: "spinta", testo: r.testo, valore: 1, mostra: "+1", parte: r.parte, conta: i < 2, nota: i < 2 ? undefined : "non conta: attrezzi e aiuti valgono al massimo +2" }));
  penalita.forEach((r, i) => righe.push({ tipo: "penalita", testo: r.testo, valore: -1, mostra: "−1", parte: r.parte, conta: i < 3, nota: i < 3 ? undefined : "non conta: le penalità arrivano al massimo a −3" }));

  const scatti = (giu.length ? -1 : 0) + (su.length ? 1 : 0);
  const soglia = base.soglia + 2 * scatti;
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
