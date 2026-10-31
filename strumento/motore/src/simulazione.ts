/**
 * Giocatori automatici (§54.2): fanno giocare molte partite con strategie diverse e
 * contano come finiscono. Servono a trovare vicoli ciechi ed errori, a vedere se una
 * strategia batte tutte le altre, e se nel Quasi una possibilità vince sempre.
 * Non misurano il divertimento: quello no.
 */

import { intero } from "./dadi.ts";
import { agisci, vista, type Vista, type VistaScelta } from "./motore.ts";
import { nuovaPartita, scenaDi, type Gioco, type Partita, type DatiEsito } from "./stato.ts";
import type { Condizione, Fascia, Prova, Scena } from "./tipi.ts";

export const POLITICHE = ["casuale", "prudente", "temeraria", "scrupolosa", "opportunista", "sempre-tutto", "sempre-meta", "sempre-lascio", "situazione", "obiettivo", "obiettivo-tutto", "obiettivo-meta", "obiettivo-lascio"] as const;
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
  /** Le partite con almeno un rovescio, una ferita o la morte: il criterio 6 (§54.2). */
  colpite: number;
  /** Ai bivi fra una prova in vista e una strada al coperto (criterio 4): quante volte ha preso l'una o l'altra. */
  bivi: { vista: number; coperto: number };
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
const cacheUtili = new WeakMap<Gioco, Set<string>>();

/** Le cose che servono a qualcosa: aprono una scelta, spostano una soglia, danno forza, fanno da attrezzo o da preparazione. */
function coseUtili(g: Gioco): Set<string> {
  const pronte = cacheUtili.get(g);
  if (pronte) return pronte;
  const utili = new Set<string>();
  const leggi = (c: Condizione | undefined): void => {
    if (!c) return;
    if ("cosa" in c) utili.add(c.cosa);
    if ("tutte" in c) c.tutte.forEach(leggi);
    if ("una" in c) c.una.forEach(leggi);
  };
  for (const s of g.storia.scene) for (const c of s.scelte ?? []) leggi(c.requisito);
  for (const v of g.amb.catalogo) {
    for (const s of v.sposta ?? []) leggi(s.se);
    v.serve?.una.forEach(leggi);
  }
  for (const o of g.storia.cose) if (o.attrezzo) utili.add(o.id);
  for (const p of g.amb.preparazioni) if (p.cosa) utili.add(p.cosa);
  cacheUtili.set(g, utili);
  return utili;
}

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
    const s = (scena.scelte ?? []).find((x) => x.id === v.id.split("@")[0]);
    let dest = doveVa(scena, v.id) ?? scena.id;
    if (!s && scena.confronto && v.id.startsWith("fine:")) dest = scena.confronto.fini.find((f) => `fine:${f.id}` === v.id)?.vai ?? dest;
    else if (!s && scena.confronto && v.id === "parlare") dest = scena.confronto.parlare?.riesci.vai ?? dest;
    else if (!s && scena.confronto && v.id === "andarsene") dest = scena.confronto.andarsene.vai;
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
    // Prende subito ciò che serve, e lascia stare il resto.
    if (v.tipo === "prendi") x = (coseUtili(g).has(v.id.slice(7)) ? qui - 0.5 : qui + 3) + (visite.get(v.id) ?? 0) * 5;
    if (x < punti) {
      punti = x;
      migliore = v.id;
    }
  }
  visite.set(migliore, (visite.get(migliore) ?? 0) + 1);
  return migliore;
}

/**
 * Quanto pesa un prezzo scritto dall'autore, per chi gioca per vincere. Il gioco lo mostra
 * prima della scelta, quindi il giocatore lo può contare: uno stato del mondo che rende un
 * luogo più difficile pesa più di una moneta o di un'ora. Un prezzo non scritto, pescato
 * dal repertorio, non si conosce prima, e pesa come un'ora.
 */
function pesoPrezzo(pr: Prova): number {
  if (!pr.prezzo) return 1;
  let n = 0;
  for (const e of pr.prezzo.effetti) {
    if ("stato" in e) n += 3;
    else if ("scadenza" in e || "traccia" in e) n += e.piu * 1.5;
    else if ("ferita" in e) n += e.ferita.gravita === "lieve" ? 0.5 : 4;
    else if ("logorio" in e) n += e.piu;
    else if ("rompi" in e) n += 1;
    else if ("cosa" in e && e.piu < 0) n += -e.piu * 0.5;
    else if ("persona" in e) n += 0.5;
    else if ("tempo" in e) n += e.tempo * 0.25;
  }
  return n;
}

/**
 * Il Quasi del giocatore con un obiettivo: pesa le tre possibilità con gli stessi conti
 * che usa per le altre scelte. Tutto avvicina alla vittoria ma costa Traccia e il prezzo;
 * la metà porta dove porta il ripiego; lasciar perdere costa un'ora e un nuovo tiro, e
 * lascia la notizia che spesso rende più facile riprovare.
 */
function sceltaQuasiObiettivo(g: Gioco, p: Partita, scelte: VistaScelta[]): string | undefined {
  const q = p.quasi;
  const c = (suff: string) => scelte.find((s) => s.id === `quasi:${suff}`)?.id;
  if (!q || q.tipo !== "prova") return q && q.grado < 2 ? c("tutto") ?? c("ferita") : c("meta") ?? c("lascia") ?? c("perdi");
  const dist = distanzeDallaVittoria(g);
  const scena = scenaDi(g, q.scena);
  const pr = (scena.scelte ?? []).find((x) => x.id === q.scelta)!.prova!;
  const d = (id: string | undefined) => (id ? dist.get(id) ?? 99 : 99);
  const segno = q.grado >= 1 ? 1.5 : 0;
  const punti: Array<[string | undefined, number]> = [];
  punti.push([c("tutto"), q.grado < 2 ? d(pr.riesci.vai) + 1.5 + pesoPrezzo(pr) : d(pr.rovescio?.vai) + 1.5 + 8]);
  const meta = pr.meta ? ("ripiego" in pr.meta ? (scena.scelte ?? []).find((x) => x.id === (pr.meta as { ripiego: string }).ripiego)?.vai : pr.meta.vai) : undefined;
  if (c("meta")) punti.push([c("meta"), d(meta) + segno + (q.grado === 2 ? pesoPrezzo(pr) : 0)]);
  const giaSa = !!p.notizie[pr.nonRiesci.notizia];
  punti.push([c("lascia"), pr.unColpoSolo ? d(scena.id) + 3 + segno : d(pr.riesci.vai) + 1 + 0.25 + (giaSa ? 1.2 : 0.6) + segno]);
  const validi = punti.filter((x): x is [string, number] => !!x[0]);
  validi.sort((a, b) => a[1] - b[1]);
  return validi[0]?.[0];
}

// ---------------------------------------------------------------------------
// I bivi del criterio 4 (§54.2): conviene mai essere in vista?
// ---------------------------------------------------------------------------

/** La scena verso cui porta una scelta della scena, se va bene: quella della prova riuscita, o quella della via. */
function doveVa(scena: Scena, id: string): string | undefined {
  const s = (scena.scelte ?? []).find((x) => x.id === id.split("@")[0]);
  return s?.prova ? s.prova.riesci.vai : s?.vai;
}

export interface Bivio {
  /** La scena dove portano tutte e due le strade. */
  verso: string;
  vista: VistaScelta[];
  coperto: VistaScelta[];
}

/**
 * Un bivio: una prova in vista e, verso la stessa scena, una strada al coperto. Al coperto
 * vuol dire una prova al coperto, oppure una via senza tiro che non lascia Traccia (di
 * solito costa tempo: aspettare che il guardiano si addormenti).
 */
export function bivio(g: Gioco, p: Partita, scelte: VistaScelta[]): Bivio | undefined {
  const scena = scenaDi(g, p.scena);
  const rumorosa = (id: string) => (scena.scelte ?? []).find((x) => x.id === id)?.effetti?.some((e) => "traccia" in e && e.piu > 0);
  for (const v of scelte) {
    if (v.tipo !== "prova" || v.quadro?.grado !== 1) continue;
    const verso = doveVa(scena, v.id);
    if (!verso || verso === scena.id) continue;
    const coperto = scelte.filter((s) => doveVa(scena, s.id) === verso && ((s.tipo === "prova" && s.quadro?.grado === 0) || (s.tipo === "vai" && !rumorosa(s.id))));
    if (coperto.length) return { verso, vista: scelte.filter((s) => s.tipo === "prova" && s.quadro?.grado === 1 && doveVa(scena, s.id) === verso), coperto };
  }
  return undefined;
}

function aCaso(scelte: VistaScelta[], rng: number): { id: string; rng: number } {
  const i = intero(rng, 0, scelte.length - 1);
  return { id: scelte[i.valore].id, rng: i.stato };
}

/**
 * Che cosa scegliere nel Quasi, secondo la strategia. Il casuale sceglie a caso anche
 * qui; le altre strategie semplici scelgono secondo la situazione, come «situazione».
 */
function sceltaQuasi(g: Gioco, p: Partita, v: Vista, politica: Politica, scelte: VistaScelta[]): string | undefined {
  const c = (suff: string) => scelte.find((s) => s.id === `quasi:${suff}`)?.id;
  if (politica === "casuale") return undefined;
  if (politica === "sempre-tutto" || politica === "obiettivo-tutto") return c("tutto") ?? c("ferita");
  if (politica === "sempre-meta" || politica === "obiettivo-meta") return c("meta") ?? c("lascia") ?? c("perdi");
  if (politica === "sempre-lascio" || politica === "obiettivo-lascio") return c("lascia") ?? c("perdi");
  // Secondo la situazione: tutto quando la scadenza incalza, lascio quando qui mi hanno già visto, altrimenti la metà.
  const sc = g.storia.scadenze[0];
  const incalza = sc && p.scadenze[sc.id] >= sc.caselle - 3;
  if (incalza) return c("tutto") ?? c("ferita");
  if (v.stato.tracciaQui >= 2) return c("lascia") ?? c("perdi");
  return c("meta") ?? c("tutto") ?? c("perdi");
}

function scegli(g: Gioco, p: Partita, v: Vista, politica: Politica, scelte: VistaScelta[], rng: number, visite: Map<string, number>): { id: string; rng: number } {
  // Le varianti del giocatore con un obiettivo giocano come lui, tranne nel Quasi: servono al criterio 3 (§54.2).
  if (politica.startsWith("obiettivo-") && v.sospeso?.tipo === "quasi") {
    const id = sceltaQuasi(g, p, v, politica, scelte);
    if (id) return { id, rng };
  }
  const obiettivo = politica === "obiettivo" || politica.startsWith("obiettivo-");
  if (politica === "obiettivo" && v.sospeso?.tipo === "quasi" && p.quasi) {
    const id = sceltaQuasiObiettivo(g, p, scelte);
    if (id) return { id, rng };
  }
  if (obiettivo && v.sospeso?.tipo === "posto") {
    // Senza posto, lascia una cosa che non serve; se tutte servono, rinuncia a quella nuova.
    const inutile = scelte.find((s) => s.id.startsWith("posto:lascia:") && !coseUtili(g).has(s.id.slice(13)));
    const id = inutile?.id ?? scelte.find((s) => s.id === "posto:no")?.id ?? scelte[0].id;
    return { id, rng };
  }
  if (obiettivo && !v.sospeso) return { id: sceltaObiettivo(g, p, scelte, visite), rng };
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

/** Le scelte che si possono fare adesso, varianti con i compagni comprese. */
function disponibiliDi(v: Vista): VistaScelta[] {
  return v.scelte.flatMap((s) => [s, ...(s.varianti ?? [])]).filter((s) => s.disponibile);
}

/** Quante ore restano prima della prima scadenza, contati gli allarmi che l'hanno avvicinata. */
function oreCheRestano(g: Gioco, p: Partita): number {
  const sc = g.storia.scadenze[0];
  return sc ? (sc.caselle - (p.spinte?.[sc.id] ?? 0)) * sc.ogniOre - p.ora : Infinity;
}

/** Gioca la partita da qui alla fine con una strategia. `prima`, se c'è, guarda ogni situazione prima della scelta. */
function finisci(g: Gioco, p: Partita, politica: Politica, rng: number, prima?: (p: Partita, scelte: VistaScelta[]) => void): Partita {
  const visite = new Map<string, number>();
  for (let n = 0; !p.finita && n < 600; n++) {
    const v = vista(g, p);
    const scelte = disponibiliDi(v);
    if (!scelte.length) break;
    prima?.(p, scelte);
    visite.set(p.scena, (visite.get(p.scena) ?? 0) + 1);
    const c = scegli(g, p, v, politica, scelte, rng, visite);
    rng = c.rng;
    p = agisci(g, p, c.id).partita;
  }
  return p;
}

/** Un bivio rigiocato: le due strade sono prese dallo stesso punto, con gli stessi dadi, e poi la partita continua. */
export interface BivioRigiocato {
  scena: string;
  verso: string;
  /** Le ore che restavano prima della scadenza. */
  restano: number;
  vista: { id: string; vince: boolean };
  coperto: { id: string; vince: boolean };
}

/**
 * Il criterio 4 (§54.2): conviene mai essere in vista? Fa giocare le partite di una
 * strategia e, al primo bivio di ogni scena, prende due strade a partire dallo stesso
 * punto e con gli stessi dadi: la migliore in vista e la migliore al coperto, scelte con i
 * conti del giocatore con un obiettivo. Da lì la partita la finisce lui: la domanda è che
 * cosa conviene a chi poi gioca bene.
 */
export function rigiocaBivi(g: Gioco, politica: Politica, partite: number, semeIniziale = 1): BivioRigiocato[] {
  const out: BivioRigiocato[] = [];
  const prova = (p: Partita, scelte: VistaScelta[]) => {
    const id = sceltaObiettivo(g, p, scelte, new Map());
    return { id, vince: finisci(g, agisci(g, p, id).partita, "obiettivo", 0).finita?.tipo === "vittoria" };
  };
  for (let k = 0; k < partite; k++) {
    const seme = semeIniziale + k * 7919;
    const viste = new Set<string>();
    finisci(g, nuovaPartita(g, seme), politica, seme ^ 0x5bd1e995, (p, scelte) => {
      const b = viste.has(p.scena) ? undefined : bivio(g, p, scelte);
      if (!b) return;
      viste.add(p.scena);
      out.push({ scena: p.scena, verso: b.verso, restano: oreCheRestano(g, p), vista: prova(p, b.vista), coperto: prova(p, b.coperto) });
    });
  }
  return out;
}

export interface RigaBivi {
  scena: string;
  verso: string;
  /** Quanto mancava alla scadenza: più di cinque caselle, da quattro a cinque, tre o meno (la scadenza incalza). */
  tempo: "molto" | "medio" | "poco";
  volte: number;
  /** Le vittorie su 100 prendendo la strada in vista e quella al coperto, con la strada presa più spesso. */
  vista: { id: string; su100: number };
  coperto: { id: string; su100: number };
  /** Una delle due conviene se vince almeno 10 partite su 100 più dell'altra, in almeno 50 bivi. */
  conviene: "vista" | "coperto" | null;
}

/** Riassume i bivi rigiocati: per ogni bivio, e per quanto tempo restava, quante partite vince ciascuna strada. */
export function riassumiBivi(g: Gioco, bivi: BivioRigiocato[]): RigaBivi[] {
  const casella = g.storia.scadenze[0]?.ogniOre ?? Infinity;
  const tempo = (ore: number): RigaBivi["tempo"] => (ore <= 3 * casella ? "poco" : ore <= 5 * casella ? "medio" : "molto");
  const gruppi = new Map<string, BivioRigiocato[]>();
  for (const b of bivi) {
    const k = `${b.scena}|${b.verso}|${tempo(b.restano)}`;
    gruppi.set(k, [...(gruppi.get(k) ?? []), b]);
  }
  const righe: RigaBivi[] = [];
  for (const [k, gr] of gruppi) {
    const [scena, verso, t] = k.split("|");
    const lato = (quale: "vista" | "coperto") => {
      const volte = new Map<string, number>();
      for (const b of gr) volte.set(b[quale].id, (volte.get(b[quale].id) ?? 0) + 1);
      const id = [...volte.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return { id, su100: Math.round((gr.filter((b) => b[quale].vince).length / gr.length) * 100) };
    };
    const vista = lato("vista");
    const coperto = lato("coperto");
    const scarto = vista.su100 - coperto.su100;
    const conviene = gr.length < 50 || Math.abs(scarto) < 10 ? null : scarto > 0 ? "vista" : "coperto";
    righe.push({ scena, verso, tempo: t as RigaBivi["tempo"], volte: gr.length, vista, coperto, conviene });
  }
  const ordine = { molto: 0, medio: 1, poco: 2 };
  return righe.sort((a, b) => a.scena.localeCompare(b.scena) || a.verso.localeCompare(b.verso) || ordine[a.tempo] - ordine[b.tempo]);
}

/** `traccia`, se data, riceve le scelte della prima partita: serve a vedere che strada ha preso una strategia. */
export function simula(g: Gioco, politica: Politica, partite: number, semeIniziale = 1, traccia?: string[]): Resoconto {
  const r: Resoconto = { politica, partite, esiti: {}, finali: {}, bloccate: [], errori: [], oreMedie: 0, azioniMedie: 0, rovesciMedi: 0, fasce: { pieno: 0, riesci: 0, quasi: 0, non: 0 }, quasi: { tutto: 0, meta: 0, lascia: 0 }, margineMedio: 0, colpite: 0, bivi: { vista: 0, coperto: 0 }, sceneViste: new Set() };
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
    let colpita = false;
    const visite = new Map<string, number>();
    try {
      while (!p.finita && n < 600) {
        r.sceneViste.add(p.scena);
        const v = vista(g, p);
        const disponibili = disponibiliDi(v);
        if (disponibili.length === 0) {
          r.bloccate.push(`${p.scena} (seme ${seme})`);
          break;
        }
        visite.set(p.scena, (visite.get(p.scena) ?? 0) + 1);
        const b = bivio(g, p, disponibili);
        const c = scegli(g, p, v, politica, disponibili, rng, visite);
        rng = c.rng;
        if (c.id === "quasi:tutto") r.quasi.tutto++;
        if (c.id === "quasi:meta") r.quasi.meta++;
        if (c.id === "quasi:lascia") r.quasi.lascia++;
        if (b?.vista.some((s) => s.id === c.id)) r.bivi.vista++;
        if (b?.coperto.some((s) => s.id === c.id)) r.bivi.coperto++;
        if (traccia && k === 0) traccia.push(`${p.scena} → ${c.id}`);
        const esito = agisci(g, p, c.id);
        for (const e of esito.eventi) {
          // Le ferite tue, non quelle dei compagni: hanno un testo diverso.
          if (e.tipo === "ferita" && e.testo.startsWith("Ferita ")) colpita = true;
          if (e.tipo !== "esito" || !e.dati || !("come" in e.dati)) continue;
          const d = e.dati as DatiEsito;
          if (d.come === "scegli tu" || !c.id.startsWith("quasi:")) r.fasce[d.fascia]++;
          if (/rovescio/.test(d.come)) {
            rovesci++;
            colpita = true;
          }
        }
        p = esito.partita;
        n++;
      }
      r.sceneViste.add(p.scena);
      const fine = p.finita?.tipo ?? (n >= 600 ? "troppo lunga" : "bloccata");
      r.esiti[fine] = (r.esiti[fine] ?? 0) + 1;
      if (p.finita) r.finali[p.scena] = (r.finali[p.scena] ?? 0) + 1;
      if (colpita || p.finita?.tipo === "morte") r.colpite++;
      if (p.finita?.tipo === "vittoria" && g.storia.scadenze[0]) {
        vittorie++;
        margine += oreCheRestano(g, p);
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
