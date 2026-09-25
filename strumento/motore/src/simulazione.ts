/**
 * Giocatori automatici (§54.2): fanno giocare molte partite con strategie diverse e
 * contano come finiscono. Servono a trovare vicoli ciechi ed errori, a vedere se una
 * strategia batte tutte le altre, e se nel Quasi una possibilità vince sempre.
 * Non misurano il divertimento: quello no.
 */

import { intero } from "./dadi.ts";
import { agisci, vista, type Vista, type VistaScelta } from "./motore.ts";
import { nuovaPartita, scenaDi, type Gioco, type Partita, type DatiEsito } from "./stato.ts";
import type { Fascia, Scena } from "./tipi.ts";

export const POLITICHE = ["casuale", "prudente", "temeraria", "scrupolosa", "opportunista", "sempre-tutto", "sempre-meta", "sempre-lascio", "situazione", "obiettivo"] as const;
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
  /** Nelle vittorie: quante ore restavano prima che scadesse la prima scadenza. */
  margineMedio: number;
  sceneViste: Set<string>;
}

// ---------------------------------------------------------------------------
// Il giocatore con un obiettivo (§54.2): cerca la strada più breve verso una vittoria
// ---------------------------------------------------------------------------

/** Le scene verso cui una scelta porta se va come chi gioca vuole: niente fallimenti, niente rovesci. */
function versoVoluto(s: Scena): string[] {
  const d: string[] = [];
  for (const c of s.scelte ?? []) {
    if (c.vai) d.push(c.vai);
    if (c.prova) {
      d.push(c.prova.riesci.vai);
      if (c.prova.meta && !("ripiego" in c.prova.meta)) d.push(c.prova.meta.vai);
    }
  }
  if (s.confronto) {
    d.push(s.confronto.andarsene.vai, ...s.confronto.fini.map((f) => f.vai));
    if (s.confronto.parlare) d.push(s.confronto.parlare.riesci.vai);
  }
  return d;
}

const cacheDistanze = new WeakMap<Gioco, Map<string, number>>();

/** Quante scelte separano ogni scena dalla vittoria più vicina, guardando soltanto la forma della storia. */
export function distanzeDallaVittoria(g: Gioco): Map<string, number> {
  const pronta = cacheDistanze.get(g);
  if (pronta) return pronta;
  const indietro = new Map<string, string[]>();
  for (const s of g.storia.scene) for (const d of versoVoluto(s)) indietro.set(d, [...(indietro.get(d) ?? []), s.id]);
  const dist = new Map<string, number>();
  const coda = g.storia.scene.filter((s) => s.finale?.tipo === "vittoria").map((s) => s.id);
  for (const id of coda) dist.set(id, 0);
  while (coda.length) {
    const id = coda.shift()!;
    for (const prima of indietro.get(id) ?? []) {
      if (dist.has(prima)) continue;
      dist.set(prima, dist.get(id)! + 1);
      coda.push(prima);
    }
  }
  cacheDistanze.set(g, dist);
  return dist;
}

/**
 * Sceglie la via che avvicina di più alla vittoria, pesando la probabilità di riuscire,
 * il costo e il tempo, e scoraggiando i giri a vuoto fra scene già viste.
 */
function sceltaObiettivo(g: Gioco, p: Partita, scelte: VistaScelta[], visite: Map<string, number>): string {
  const dist = distanzeDallaVittoria(g);
  const scena = scenaDi(g, p.scena);
  const qui = dist.get(scena.id) ?? 99;
  let migliore = scelte[0].id;
  let punti = Infinity;
  for (const v of scelte) {
    const base = v.id.split("@")[0];
    const s = (scena.scelte ?? []).find((x) => x.id === base);
    let dest = scena.id;
    if (s?.prova) dest = s.prova.riesci.vai;
    else if (s?.vai) dest = s.vai;
    else if (scena.confronto && v.id.startsWith("fine:")) dest = scena.confronto.fini.find((f) => `fine:${f.id}` === v.id)?.vai ?? dest;
    else if (scena.confronto && v.id === "parlare") dest = scena.confronto.parlare?.riesci.vai ?? dest;
    else if (scena.confronto && v.id === "andarsene") dest = scena.confronto.andarsene.vai;
    let x = dist.get(dest) ?? 99;
    x += (visite.get(dest) ?? 0) * 1.5;
    if (v.quadro) {
      const q = v.quadro;
      const e = q.riesci.esatte;
      const riesce = q.riesci.nonSiTira ? 1 : (e.pieno + e.riesci + e.quasi) / 36;
      x += (1 - riesce) * 3 + q.grado * 0.7;
      // Allo scoperto, un Non riesci è un rovescio: chi gioca per vincere lo teme.
      if (q.grado === 2 && !q.riesci.nonSiTira) x += (e.non / 36) * 8;
      if (q.dopo.posta.includes("vita")) x += 2;
    }
    const ore = (s?.effetti ?? []).reduce((n, e) => n + ("tempo" in e ? e.tempo : 0), 0);
    const rumore = (s?.effetti ?? []).reduce((n, e) => n + ("traccia" in e && e.piu > 0 ? e.piu : 0), 0);
    x += ore * 0.25 + rumore * 1.5;
    if (v.tipo === "deduci" || v.tipo === "ripensa") x = qui - 0.5 + (visite.get(`${v.id}`) ?? 0) * 5;
    if (v.tipo === "combina") x = qui + 3 + (visite.get(v.id) ?? 0) * 5;
    if (x < punti) {
      punti = x;
      migliore = v.id;
    }
  }
  visite.set(migliore, (visite.get(migliore) ?? 0) + 1);
  return migliore;
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

function scegli(g: Gioco, p: Partita, v: Vista, politica: Politica, scelte: VistaScelta[], rng: number, visite: Map<string, number>): { id: string; rng: number } {
  if (politica === "obiettivo" && v.sospeso?.tipo === "quasi" && p.quasi) {
    // Chi gioca per vincere prende tutto finché il prezzo è una tacca di Traccia; allo scoperto si accontenta.
    const c = (suff: string) => scelte.find((s) => s.id === `quasi:${suff}`)?.id;
    const id = p.quasi.grado < 2 ? c("tutto") ?? c("ferita") : c("meta") ?? c("lascia") ?? c("perdi");
    if (id) return { id, rng };
  }
  if (politica === "obiettivo" && !v.sospeso) return { id: sceltaObiettivo(g, p, scelte, visite), rng };
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

/** `traccia`, se data, riceve le scelte della prima partita: serve a vedere che strada ha preso una strategia. */
export function simula(g: Gioco, politica: Politica, partite: number, semeIniziale = 1, traccia?: string[]): Resoconto {
  const r: Resoconto = { politica, partite, esiti: {}, finali: {}, bloccate: [], errori: [], oreMedie: 0, azioniMedie: 0, rovesciMedi: 0, fasce: { pieno: 0, riesci: 0, quasi: 0, non: 0 }, quasi: { tutto: 0, meta: 0, lascia: 0 }, margineMedio: 0, sceneViste: new Set() };
  let ore = 0;
  let margine = 0;
  let vittorie = 0;
  let azioni = 0;
  let rovesci = 0;
  for (let k = 0; k < partite; k++) {
    const seme = semeIniziale + k * 7919;
    let p = nuovaPartita(g, seme);
    let rng = seme ^ 0x5bd1e995;
    let n = 0;
    const visite = new Map<string, number>();
    try {
      while (!p.finita && n < 600) {
        r.sceneViste.add(p.scena);
        const v = vista(g, p);
        const disponibili = v.scelte.flatMap((s) => [s, ...(s.varianti ?? [])]).filter((s) => s.disponibile);
        if (disponibili.length === 0) {
          r.bloccate.push(`${p.scena} (seme ${seme})`);
          break;
        }
        visite.set(p.scena, (visite.get(p.scena) ?? 0) + 1);
        const c = scegli(g, p, v, politica, disponibili, rng, visite);
        rng = c.rng;
        if (c.id === "quasi:tutto") r.quasi.tutto++;
        if (c.id === "quasi:meta") r.quasi.meta++;
        if (c.id === "quasi:lascia") r.quasi.lascia++;
        if (traccia && k === 0) traccia.push(`${p.scena} → ${c.id}`);
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
      const sc = g.storia.scadenze[0];
      if (p.finita?.tipo === "vittoria" && sc) {
        vittorie++;
        margine += sc.caselle * sc.ogniOre - p.ora;
      }
      ore += p.ora;
      azioni += n;
    } catch (e) {
      r.errori.push(`seme ${seme}, scena ${p.scena}: ${(e as Error).message}`);
    }
  }
  r.oreMedie = ore / partite;
  r.azioniMedie = azioni / partite;
  r.rovesciMedi = rovesci / partite;
  r.margineMedio = vittorie ? margine / vittorie : 0;
  return r;
}
