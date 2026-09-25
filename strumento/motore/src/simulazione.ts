/**
 * Giocatori automatici (§54.2): fanno giocare molte partite con strategie diverse e
 * contano come finiscono. Servono a trovare vicoli ciechi ed errori, a vedere se una
 * strategia batte tutte le altre, e se nel Quasi una possibilità vince sempre.
 * Non misurano il divertimento: quello no.
 */

import { intero } from "./dadi.ts";
import { agisci, vista, type Vista, type VistaScelta } from "./motore.ts";
import { nuovaPartita, type Gioco, type Partita, type DatiEsito } from "./stato.ts";
import type { Fascia } from "./tipi.ts";

export const POLITICHE = ["casuale", "prudente", "temeraria", "scrupolosa", "opportunista", "sempre-tutto", "sempre-meta", "sempre-lascio", "situazione"] as const;
export type Politica = (typeof POLITICHE)[number];

export interface Resoconto {
  politica: Politica;
  partite: number;
  esiti: Record<string, number>;
  finali: Record<string, number>;
  bloccate: string[];
  errori: string[];
  oreMedie: number;
  azioniMedie: number;
  rovesciMedi: number;
  fasce: Record<Fascia, number>;
  quasi: { tutto: number; meta: number; lascia: number };
  sceneViste: Set<string>;
}

function aCaso(scelte: VistaScelta[], rng: number): { id: string; rng: number } {
  const i = intero(rng, 0, scelte.length - 1);
  return { id: scelte[i.valore].id, rng: i.stato };
}

/** Che cosa scegliere nel Quasi, secondo la strategia. */
function sceltaQuasi(g: Gioco, p: Partita, v: Vista, politica: Politica, scelte: VistaScelta[]): string | undefined {
  const c = (suff: string) => scelte.find((s) => s.id === `quasi:${suff}`)?.id;
  if (politica === "sempre-tutto") return c("tutto") ?? c("ferita");
  if (politica === "sempre-meta") return c("meta") ?? c("lascia") ?? c("perdi");
  if (politica === "sempre-lascio") return c("lascia") ?? c("perdi");
  // Secondo la situazione: tutto quando la scadenza incalza, lascio quando qui mi hanno già visto, altrimenti la metà.
  const sc = g.storia.scadenze[0];
  const incalza = sc && p.scadenze[sc.id] >= sc.caselle - 3;
  if (incalza) return c("tutto") ?? c("ferita");
  if (v.stato.tracciaQui >= 2) return c("lascia") ?? c("perdi");
  return c("meta") ?? c("tutto") ?? c("perdi");
}

function scegli(g: Gioco, p: Partita, v: Vista, politica: Politica, scelte: VistaScelta[], rng: number): { id: string; rng: number } {
  if (v.sospeso?.tipo === "quasi") {
    const id = sceltaQuasi(g, p, v, politica, scelte);
    if (id) return { id, rng };
  }
  let candidate = scelte;
  const prove = scelte.filter((s) => s.quadro);
  if (politica === "prudente") {
    const sicure = scelte.filter((s) => !s.quadro || s.quadro.grado === 0);
    if (sicure.length) candidate = sicure;
  } else if (politica === "temeraria") {
    if (prove.length) candidate = prove;
  } else if (politica === "scrupolosa") {
    const prepara = scelte.filter((s) => /^Osservo/.test(s.testo));
    if (prepara.length) candidate = prepara;
    else if (prove.length) {
      const min = Math.min(...prove.map((s) => s.quadro!.grado));
      candidate = prove.filter((s) => s.quadro!.grado === min);
    }
  } else if (politica === "opportunista") {
    if (prove.length) {
      const max = Math.max(...prove.map((s) => s.quadro!.riesci.probabilita));
      const migliori = prove.filter((s) => s.quadro!.riesci.probabilita === max && s.quadro!.grado < 2);
      if (migliori.length && max >= 58) candidate = migliori;
    }
  }
  return aCaso(candidate, rng);
}

export function simula(g: Gioco, politica: Politica, partite: number, semeIniziale = 1): Resoconto {
  const r: Resoconto = { politica, partite, esiti: {}, finali: {}, bloccate: [], errori: [], oreMedie: 0, azioniMedie: 0, rovesciMedi: 0, fasce: { pieno: 0, riesci: 0, quasi: 0, non: 0 }, quasi: { tutto: 0, meta: 0, lascia: 0 }, sceneViste: new Set() };
  let ore = 0;
  let azioni = 0;
  let rovesci = 0;
  for (let k = 0; k < partite; k++) {
    const seme = semeIniziale + k * 7919;
    let p = nuovaPartita(g, seme);
    let rng = seme ^ 0x5bd1e995;
    let n = 0;
    try {
      while (!p.finita && n < 600) {
        r.sceneViste.add(p.scena);
        const v = vista(g, p);
        const disponibili = v.scelte.filter((s) => s.disponibile);
        if (disponibili.length === 0) {
          r.bloccate.push(`${p.scena} (seme ${seme})`);
          break;
        }
        const c = scegli(g, p, v, politica, disponibili, rng);
        rng = c.rng;
        if (c.id === "quasi:tutto") r.quasi.tutto++;
        if (c.id === "quasi:meta") r.quasi.meta++;
        if (c.id === "quasi:lascia") r.quasi.lascia++;
        const esito = agisci(g, p, c.id);
        for (const e of esito.eventi) {
          if (e.tipo !== "esito" || !e.dati || !("come" in e.dati)) continue;
          const d = e.dati as DatiEsito;
          if (d.come === "scegli tu" || !c.id.startsWith("quasi:")) r.fasce[d.fascia]++;
          if (/rovescio/.test(d.come)) rovesci++;
        }
        p = esito.partita;
        n++;
      }
      r.sceneViste.add(p.scena);
      const fine = p.finita?.tipo ?? (n >= 600 ? "troppo lunga" : "bloccata");
      r.esiti[fine] = (r.esiti[fine] ?? 0) + 1;
      if (p.finita) r.finali[p.scena] = (r.finali[p.scena] ?? 0) + 1;
      ore += p.ora;
      azioni += n;
    } catch (e) {
      r.errori.push(`seme ${seme}, scena ${p.scena}: ${(e as Error).message}`);
    }
  }
  r.oreMedie = ore / partite;
  r.azioniMedie = azioni / partite;
  r.rovesciMedi = rovesci / partite;
  return r;
}
