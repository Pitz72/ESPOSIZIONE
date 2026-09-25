/**
 * Lo stato di una partita e le regole che lo cambiano: condizioni, effetti, notizie,
 * persone, ferite, logorio, stati d'animo, Traccia, imprevisti e il tempo che passa
 * (Parti II, III, VI e VII del documento di design 3.0).
 */

import type { Ambientazione, Condizione, Dimensione, Effetto, Fascia, Gravita, Grado, Proprieta, Scena, Storia, Testo } from "./tipi.ts";
import { fasciaDi, intero, NOMI_FASCIA, tiraDueDadi } from "./dadi.ts";

export interface Evento {
  tipo:
    | "testo" | "tiro" | "esito" | "traccia" | "imprevisto" | "ferita" | "tempo" | "logorio" | "crescita" | "protezione"
    | "scadenza" | "morte" | "confronto" | "memoria" | "notizia" | "convinzione" | "tratto" | "persona" | "statoAnimo" | "cosa";
  testo: string;
  /** Dati per le interfacce grafiche: i dadi di un tiro, la fascia e il grado di un esito. */
  dati?: DatiTiro | DatiEsito;
}

export interface DatiTiro {
  dadi: [number, number];
  bonus: number;
  totale: number;
  soglia: number;
  margine: number;
  fascia: Fascia;
  grado: Grado;
}

export interface DatiEsito {
  fascia: Fascia;
  grado: Grado;
  /** Che cosa è successo, in breve: «ottieni», «la metà», «rovescio»… */
  come: string;
}

export interface Ferita {
  nome: string;
  gravita: Exclude<Gravita, "morte">;
  ambito: string;
  ore: number;
  segno?: string;
}

export interface StatoConfronto {
  /** La scena del confronto: rientrare in un'altra scena con lo stesso avversario è un confronto nuovo. */
  scena: string;
  avversario: string;
  esposizione: Grado;
  partenza: Grado;
  ultimoGrado: Grado;
  parlato: boolean;
  inDifesa: boolean;
}

/** Una prova finita nel Quasi, in attesa della scelta di chi gioca (§28.3). */
export interface Sospeso {
  tipo: "prova" | "difesa" | "debole" | "parlare";
  scena: string;
  scelta: string;
  grado: Grado;
  capacita: string;
  chiave: string;
}

export type StatoNotizia = "sentita" | "verificata" | "smentita";

export interface StatoPersona {
  dim: Partial<Record<Dimensione, number>>;
  /** 0 l'hai vista, 1 ci hai parlato, 2 la conosci bene (§13). */
  livello: 0 | 1 | 2;
}

export interface Partita {
  seme: number;
  rng: number;
  scena: string;
  /** Le ore passate dall'inizio della storia. */
  ora: number;
  fatti: Record<string, true>;
  misure: Record<string, number>;
  cose: Record<string, number>;
  /** Lo stato delle cose che si rompono: 0 intatta, 1 rovinata, 2 rotta. */
  statoCose: Record<string, 0 | 1 | 2>;
  notizie: Record<string, StatoNotizia>;
  convinzioni: Record<string, "salda" | "in dubbio">;
  /** I tratti, con la loro origine (vuota per quelli iniziali). */
  tratti: Record<string, string>;
  persone: Record<string, StatoPersona>;
  reazioniFatte: Record<string, true>;
  statiAnimo: Array<{ id: string; ore: number }>;
  traccia: Record<string, number>;
  quiete: Record<string, number>;
  logorio: Record<string, { stadio: 1 | 2 | 3; ore: number }>;
  ferite: Ferita[];
  protezioni: Record<string, 0 | 1 | 2>;
  livelli: Record<string, number>;
  tacche: Record<string, number>;
  taccheScena: Record<string, true>;
  fili: Record<string, number>;
  scadenze: Record<string, number>;
  preparazioni: Array<{ id: string; luogo?: string }>;
  usate: Record<string, true>;
  /** Tentativi in corso per ogni via, e com'è andata la prima volta per ogni capacità (§42). */
  tentativi: Record<string, number>;
  primaVolta: Record<string, { tentativi: number; fascia: Fascia }>;
  /** La prova non riuscita che si può ritentare, e la scena da cui veniva. */
  ritento?: { scena: string; scelta: string; verso: string };
  confronto?: StatoConfronto;
  quasi?: Sospeso;
  /** La convinzione su cui chi gioca sta ripensando (§8.5). */
  ripensa?: string;
  /** Una scena verso cui il tempo ha deviato la storia (scadenza, imprevisto, morte). */
  deviazione?: string;
  finita?: { tipo: "vittoria" | "sconfitta" | "morte" };
}

/** L'ambientazione e la storia, con gli indici per trovarne i pezzi. */
export interface Gioco {
  amb: Ambientazione;
  storia: Storia;
  scene: Map<string, Scena>;
}

export function prepara(amb: Ambientazione, storia: Storia): Gioco {
  return { amb, storia, scene: new Map(storia.scene.map((s) => [s.id, s])) };
}

export function clona(p: Partita): Partita {
  return structuredClone(p);
}

// ---------------------------------------------------------------------------
// Luogo, zona, momento, proprietà
// ---------------------------------------------------------------------------

export function scenaDi(g: Gioco, id: string): Scena {
  const s = g.scene.get(id);
  if (!s) throw new Error(`Scena inesistente: ${id}`);
  return s;
}

export function luogoDi(g: Gioco, p: Partita) {
  const id = scenaDi(g, p.scena).luogo;
  const l = g.amb.luoghi.find((x) => x.id === id);
  if (!l) throw new Error(`Luogo inesistente: ${id}`);
  return l;
}

export function momentoDi(g: Gioco, p: Partita) {
  const m = g.amb.momenti;
  const ciclo = m.reduce((s, x) => s + x.ore, 0);
  let i = m.findIndex((x) => x.id === g.storia.momentoIniziale);
  let resto = p.ora % ciclo;
  while (resto >= m[i].ore) {
    resto -= m[i].ore;
    i = (i + 1) % m.length;
  }
  return m[i];
}

export interface ProprietaAttiva {
  def: Proprieta;
  da: "luogo" | "momento";
  /** Annullata da una condizione (una luce accesa): la riga si mostra, e non conta. */
  annullata?: string;
}

/** Le proprietà che valgono adesso, nel luogo e nel momento (§11.1). Una proprietà vale una volta sola. */
export function proprietaAttive(g: Gioco, p: Partita): ProprietaAttiva[] {
  const luogo = luogoDi(g, p);
  const mom = momentoDi(g, p);
  const ids = new Map<string, "luogo" | "momento">();
  for (const id of luogo.proprieta) ids.set(id, "luogo");
  for (const st of luogo.stati ?? []) {
    if (!vale(g, p, st.se)) continue;
    for (const id of st.aggiungi ?? []) ids.set(id, "luogo");
    for (const id of st.togli ?? []) ids.delete(id);
  }
  for (const id of mom.proprieta) {
    if (ids.has(id)) continue;
    if ((luogo.sospende ?? []).some((s) => s.proprieta === id && (!s.momento || s.momento === mom.id))) continue;
    ids.set(id, "momento");
  }
  const out: ProprietaAttiva[] = [];
  for (const [id, da] of ids) {
    const def = g.amb.proprieta.find((x) => x.id === id);
    if (!def) throw new Error(`Proprietà inesistente: ${id}`);
    const annullata = def.annullataDa && vale(g, p, def.annullataDa.se) ? def.annullataDa.testo : undefined;
    out.push({ def, da, annullata });
  }
  return out;
}

export function haProprieta(g: Gioco, p: Partita, id: string): boolean {
  return proprietaAttive(g, p).some((x) => x.def.id === id && !x.annullata);
}

// ---------------------------------------------------------------------------
// Condizioni
// ---------------------------------------------------------------------------

export interface ContestoProva {
  ambito: string;
  tag: string[];
}

export function dim(p: Partita, persona: string, d: Dimensione): number {
  return p.persone[persona]?.dim[d] ?? 0;
}

export function tradirebbe(g: Gioco, p: Partita, persona: string): boolean {
  const def = g.storia.persone.find((x) => x.id === persona);
  if (!def?.puoTradire) return false;
  const r = dim(p, persona, "rancore");
  return r >= 3 || (r >= 2 && dim(p, persona, "paura") >= 2);
}

export function haCosa(p: Partita, id: string, almeno = 1): boolean {
  return (p.cose[id] ?? 0) >= almeno && (p.statoCose[id] ?? 0) < 2;
}

export function vale(g: Gioco, p: Partita, c: Condizione, ctx?: ContestoProva): boolean {
  if ("tutte" in c) return c.tutte.every((x) => vale(g, p, x, ctx));
  if ("una" in c) return c.una.some((x) => vale(g, p, x, ctx));
  if ("non" in c) return !vale(g, p, c.non, ctx);
  if ("fatto" in c) return !!p.fatti[c.fatto];
  if ("nonFatto" in c) return !p.fatti[c.nonFatto];
  if ("misura" in c) {
    const v = p.misure[c.misura] ?? 0;
    return v >= (c.almeno ?? -Infinity) && v <= (c.alPiu ?? Infinity);
  }
  if ("cosa" in c) return haCosa(p, c.cosa, c.almeno ?? 1);
  if ("cosaProprieta" in c) return g.storia.cose.some((o) => o.proprieta?.includes(c.cosaProprieta) && haCosa(p, o.id));
  if ("notizia" in c) return !!p.notizie[c.notizia] && p.notizie[c.notizia] !== "smentita";
  if ("nonNotizia" in c) return !p.notizie[c.nonNotizia];
  if ("tratto" in c) return c.tratto in p.tratti;
  if ("convinzione" in c) return !!p.convinzioni[c.convinzione];
  if ("statoAnimo" in c) return p.statiAnimo.some((s) => s.id === c.statoAnimo);
  if ("persona" in c) {
    const v = dim(p, c.persona, c.dimensione);
    return v >= (c.almeno ?? -Infinity) && v <= (c.alPiu ?? Infinity);
  }
  if ("conosci" in c) return (p.persone[c.conosci]?.livello ?? 0) >= (c.almeno ?? 1);
  if ("tradisce" in c) return tradirebbe(g, p, c.tradisce);
  if ("traccia" in c) return (p.traccia[c.traccia] ?? 0) >= c.almeno;
  if ("momento" in c) {
    const m = momentoDi(g, p).id;
    return Array.isArray(c.momento) ? c.momento.includes(m) : c.momento === m;
  }
  if ("luogo" in c) {
    const l = scenaDi(g, p.scena).luogo;
    return Array.isArray(c.luogo) ? c.luogo.includes(l) : c.luogo === l;
  }
  if ("logorio" in c) return (p.logorio[c.logorio]?.stadio ?? 1) >= c.almeno;
  if ("ferita" in c) {
    const ordine = ["lieve", "grave", "mortale", "morte"];
    return p.ferite.some((f) => ordine.indexOf(f.gravita) >= ordine.indexOf(c.ferita));
  }
  if ("filo" in c) return (p.fili[c.filo] ?? 0) >= c.almeno;
  if ("scadenza" in c) return (p.scadenze[c.scadenza] ?? 0) >= c.almeno;
  if ("tracciaQui" in c) return (p.traccia[luogoDi(g, p).zona] ?? 0) >= c.tracciaQui;
  if ("logorioSuAmbito" in c) {
    if (!ctx) return false;
    return g.amb.logorii.some((l) => l.ambiti.includes(ctx.ambito) && (p.logorio[l.id]?.stadio ?? 1) >= c.logorioSuAmbito);
  }
  if ("tagScena" in c) return !!ctx && ctx.tag.includes(c.tagScena);
  return false;
}

/** La prima convinzione che chiude una condizione, se è una convinzione a chiuderla (§8.4). */
export function convinzioneCheChiude(g: Gioco, p: Partita, c: Condizione | undefined): string | undefined {
  if (!c) return undefined;
  if ("tutte" in c) {
    for (const x of c.tutte) if (!vale(g, p, x)) return convinzioneCheChiude(g, p, x);
    return undefined;
  }
  if ("non" in c && "convinzione" in c.non && p.convinzioni[c.non.convinzione]) {
    return g.storia.convinzioni.find((x) => x.id === (c.non as { convinzione: string }).convinzione)?.testo;
  }
  return undefined;
}

export function testoDi(g: Gioco, p: Partita, t: Testo): string {
  if (typeof t === "string") return t;
  return t.filter((b) => !b.se || vale(g, p, b.se)).map((b) => b.testo).join("\n\n");
}

// ---------------------------------------------------------------------------
// Nuova partita
// ---------------------------------------------------------------------------

export function nuovaPartita(g: Gioco, seme: number): Partita {
  const pers = g.storia.personaggio;
  return {
    seme,
    rng: seme,
    scena: g.storia.inizio,
    ora: 0,
    fatti: {},
    misure: {},
    cose: { ...pers.cose },
    statoCose: {},
    notizie: {},
    convinzioni: Object.fromEntries(pers.convinzioni.map((id) => [id, "salda" as const])),
    tratti: Object.fromEntries(pers.tratti.map((id) => [id, ""])),
    persone: Object.fromEntries(g.storia.persone.map((x) => [x.id, { dim: { ...x.dimensioni }, livello: x.conosciuta ?? 0 }])),
    reazioniFatte: {},
    statiAnimo: [],
    traccia: {},
    quiete: {},
    logorio: Object.fromEntries(g.amb.logorii.map((l) => [l.id, { stadio: 1 as const, ore: 0 }])),
    ferite: [],
    protezioni: Object.fromEntries(pers.protezioni.map((id) => [id, 0 as const])),
    livelli: Object.fromEntries(g.amb.capacita.map((c) => [c.id, pers.livelli[c.id] ?? 0])),
    tacche: {},
    taccheScena: {},
    fili: {},
    scadenze: Object.fromEntries(g.storia.scadenze.map((s) => [s.id, 0])),
    preparazioni: [],
    usate: {},
    tentativi: {},
    primaVolta: {},
  };
}

// ---------------------------------------------------------------------------
// Effetti
// ---------------------------------------------------------------------------

const DECLASSA: Record<Gravita, Gravita | null> = { morte: "mortale", mortale: "grave", grave: "lieve", lieve: null };
export const STATI_COSA = ["intatta", "rovinata", "rotta"] as const;
export const NOMI_DIMENSIONE: Record<Dimensione, string> = { fiducia: "fiducia", debito: "debito", paura: "paura", affetto: "affetto", rancore: "rancore" };

export function nomeFatto(g: Gioco, id: string): string {
  return g.storia.fatti.find((f) => f.id === id)?.parola ?? id;
}
export function nomeCosa(g: Gioco, id: string): string {
  return g.storia.cose.find((o) => o.id === id)?.nome ?? id;
}
export function nomePersona(g: Gioco, id: string): string {
  return g.storia.persone.find((x) => x.id === id)?.nome ?? id;
}
export function nomeTratto(g: Gioco, id: string): string {
  return g.amb.tratti.find((x) => x.id === id)?.nome ?? id;
}
export function testoNotizia(g: Gioco, id: string): string {
  return g.storia.notizie.find((x) => x.id === id)?.testo ?? id;
}

/** Aggiorna le notizie smentite dopo che se ne è aggiunta una (§8.2). */
function smentisci(g: Gioco, p: Partita, eventi: Evento[]): void {
  for (const n of g.storia.notizie) {
    if (!p.notizie[n.id] || p.notizie[n.id] === "smentita") continue;
    if ((n.smentitaDa ?? []).some((id) => p.notizie[id] && p.notizie[id] !== "smentita")) {
      p.notizie[n.id] = "smentita";
      eventi.push({ tipo: "notizia", testo: `Smentita: ${n.testo}` });
    }
  }
}

function aggiungiNotizia(g: Gioco, p: Partita, id: string, verificata: boolean, eventi: Evento[]): void {
  const prima = p.notizie[id];
  if (prima === "smentita" || prima === "verificata") return;
  if (prima === "sentita" && !verificata) return;
  p.notizie[id] = verificata ? "verificata" : "sentita";
  eventi.push({ tipo: "notizia", testo: `${verificata ? (prima ? "Verificata" : "Hai visto") : "Sai che"}: ${testoNotizia(g, id)}` });
  smentisci(g, p, eventi);
  for (const c of g.storia.convinzioni) {
    if (p.convinzioni[c.id] === "salda" && c.dubbioDa.includes(id)) eventi.push({ tipo: "convinzione", testo: `Una notizia mette in dubbio ciò che credi: ${c.testo}` });
  }
}

export function cambiaPersona(g: Gioco, p: Partita, persona: string, cambia: Partial<Record<Dimensione, number>>, eventi: Evento[], perche?: string): void {
  const st = p.persone[persona];
  if (!st) return;
  const parti: string[] = [];
  for (const [d, v] of Object.entries(cambia) as Array<[Dimensione, number]>) {
    if (!v) continue;
    const min = d === "debito" ? -3 : 0;
    const prima = st.dim[d] ?? 0;
    st.dim[d] = Math.max(min, Math.min(3, prima + v));
    if (st.dim[d] !== prima) parti.push(`${NOMI_DIMENSIONE[d]} ${v > 0 ? "+" : "−"}${Math.abs(v)}`);
  }
  if (parti.length) eventi.push({ tipo: "persona", testo: `${nomePersona(g, persona)}: ${perche ? `${perche} ` : ""}(${parti.join(", ")})` });
}

export function applica(g: Gioco, p: Partita, effetti: Effetto[] | undefined, eventi: Evento[]): number {
  let tempo = 0;
  for (const e of effetti ?? []) {
    if ("fatto" in e) {
      if (!p.fatti[e.fatto]) eventi.push({ tipo: "memoria", testo: `Parola chiave: ${nomeFatto(g, e.fatto)}` });
      p.fatti[e.fatto] = true;
    } else if ("togliFatto" in e) delete p.fatti[e.togliFatto];
    else if ("misura" in e) {
      const m = g.storia.misure.find((x) => x.id === e.misura);
      p.misure[e.misura] = Math.max(0, Math.min(m?.max ?? 99, (p.misure[e.misura] ?? 0) + e.piu));
      eventi.push({ tipo: "memoria", testo: `${m?.nome ?? e.misura}: ${p.misure[e.misura]}` });
    } else if ("cosa" in e) {
      p.cose[e.cosa] = Math.max(0, (p.cose[e.cosa] ?? 0) + e.piu);
      if (e.piu > 0 && p.cose[e.cosa] === e.piu) delete p.statoCose[e.cosa];
      eventi.push({ tipo: "cosa", testo: `${nomeCosa(g, e.cosa)}: ${e.piu > 0 ? "+" : ""}${e.piu} (ora ${p.cose[e.cosa]})` });
    } else if ("rompi" in e) rompi(g, p, e.rompi, eventi);
    else if ("notizia" in e) aggiungiNotizia(g, p, e.notizia, false, eventi);
    else if ("verifica" in e) aggiungiNotizia(g, p, e.verifica, true, eventi);
    else if ("convinzione" in e) {
      if (!p.convinzioni[e.convinzione]) {
        p.convinzioni[e.convinzione] = "salda";
        eventi.push({ tipo: "convinzione", testo: `Adesso credi che: ${g.storia.convinzioni.find((x) => x.id === e.convinzione)?.testo ?? e.convinzione}` });
      }
    } else if ("togliConvinzione" in e) delete p.convinzioni[e.togliConvinzione];
    else if ("tratto" in e) {
      if (!(e.tratto in p.tratti)) {
        p.tratti[e.tratto] = e.origine ?? "";
        eventi.push({ tipo: "tratto", testo: `Tratto nuovo: ${nomeTratto(g, e.tratto)}${e.origine ? `, ${e.origine}` : ""}` });
      }
    } else if ("togliTratto" in e) {
      if (e.togliTratto in p.tratti) {
        delete p.tratti[e.togliTratto];
        eventi.push({ tipo: "tratto", testo: `Non più: ${nomeTratto(g, e.togliTratto)}` });
      }
    } else if ("persona" in e) cambiaPersona(g, p, e.persona, e.cambia, eventi);
    else if ("conosci" in e) {
      const st = p.persone[e.conosci];
      if (st && st.livello < e.livello) st.livello = e.livello;
    } else if ("statoAnimo" in e) aggiungiStatoAnimo(g, p, e.statoAnimo, eventi);
    else if ("passaStatoAnimo" in e) passaStatoAnimo(g, p, e.passaStatoAnimo, eventi);
    else if ("traccia" in e) aggiungiTraccia(g, p, e.traccia === "qui" ? luogoDi(g, p).zona : e.traccia, e.piu, eventi);
    else if ("logorio" in e) sposta(g, p, e.logorio, e.piu, eventi);
    else if ("rimedio" in e) {
      p.logorio[e.rimedio] = { stadio: 1, ore: 0 };
      const l = g.amb.logorii.find((x) => x.id === e.rimedio);
      eventi.push({ tipo: "logorio", testo: `${l?.nome ?? e.rimedio}: ${l?.stadi[0] ?? "a posto"}` });
    } else if ("ferita" in e) ferisci(g, p, e.ferita.nome, e.ferita.gravita, e.ferita.ambito, e.ferita.tipo, eventi, e.ferita.segno);
    else if ("cura" in e) cura(g, p, eventi);
    else if ("tempo" in e) tempo += e.tempo;
    else if ("filo" in e) {
      p.fili[e.filo] = (p.fili[e.filo] ?? 0) + e.piu;
      const f = g.storia.fili.find((x) => x.id === e.filo);
      eventi.push({ tipo: "memoria", testo: `${f?.nome ?? e.filo}: ${p.fili[e.filo]} su ${f?.tappe ?? "?"}` });
    } else if ("preparazione" in e) {
      const def = g.amb.preparazioni.find((x) => x.id === e.preparazione);
      if (def && !p.preparazioni.some((x) => x.id === def.id)) {
        p.preparazioni.push({ id: def.id, luogo: def.durata === "luogo" ? luogoDi(g, p).id : undefined });
        eventi.push({ tipo: "memoria", testo: `Preparazione: ${def.testo}` });
      }
    } else if ("tacca" in e) tacca(g, p, e.tacca, eventi, true);
  }
  return tempo;
}

export function rompi(g: Gioco, p: Partita, id: string, eventi: Evento[]): void {
  if (!haCosa(p, id)) return;
  const s = Math.min(2, (p.statoCose[id] ?? 0) + 1) as 0 | 1 | 2;
  p.statoCose[id] = s;
  eventi.push({ tipo: "cosa", testo: `${nomeCosa(g, id)}: ${STATI_COSA[s]}.` });
}

export function aggiungiStatoAnimo(g: Gioco, p: Partita, id: string, eventi: Evento[]): void {
  const def = g.amb.statiAnimo.find((x) => x.id === id);
  if (!def) return;
  p.statiAnimo = p.statiAnimo.filter((s) => s.id !== id);
  p.statiAnimo.push({ id, ore: 0 });
  if (p.statiAnimo.length > 2) p.statiAnimo.shift();
  eventi.push({ tipo: "statoAnimo", testo: `Adesso sei ${def.nome.toLowerCase()}.` });
}

export function passaStatoAnimo(g: Gioco, p: Partita, id: string, eventi: Evento[]): void {
  if (!p.statiAnimo.some((s) => s.id === id)) return;
  p.statiAnimo = p.statiAnimo.filter((s) => s.id !== id);
  const def = g.amb.statiAnimo.find((x) => x.id === id);
  eventi.push({ tipo: "statoAnimo", testo: `Non sei più ${def?.nome.toLowerCase() ?? id}.` });
}

export function aggiungiTraccia(g: Gioco, p: Partita, zona: string, piu: number, eventi: Evento[]): void {
  const prima = p.traccia[zona] ?? 0;
  p.traccia[zona] = Math.max(0, Math.min(3, prima + piu));
  if (piu > 0) p.quiete[zona] = 0;
  if (p.traccia[zona] !== prima) {
    const nome = g.amb.luoghi.find((l) => l.zona === zona)?.nome ?? zona;
    eventi.push({ tipo: "traccia", testo: `Traccia (${nome}): ${p.traccia[zona]}` });
  }
}

function sposta(g: Gioco, p: Partita, id: string, piu: number, eventi: Evento[]): void {
  const l = g.amb.logorii.find((x) => x.id === id);
  if (!l) return;
  const s = p.logorio[id];
  const nuovo = Math.max(1, Math.min(3, s.stadio + piu)) as 1 | 2 | 3;
  if (nuovo !== s.stadio) {
    s.stadio = nuovo;
    eventi.push({ tipo: "logorio", testo: `${l.nome}: ${l.stadi[nuovo - 1]}` });
  }
}

export function ferisci(g: Gioco, p: Partita, nome: string, gravita: Gravita, ambito: string, tipo: string | undefined, eventi: Evento[], segno?: string): void {
  let gr: Gravita | null = gravita;
  if (tipo) {
    for (const [id, stato] of Object.entries(p.protezioni)) {
      const prot = g.amb.protezioni.find((x) => x.id === id);
      if (prot && stato < 2 && prot.contro.includes(tipo) && gr) {
        p.protezioni[id] = (stato + 1) as 0 | 1 | 2;
        gr = DECLASSA[gr];
        eventi.push({ tipo: "protezione", testo: `${prot.nome} attutisce il colpo (ora ${STATI_COSA[p.protezioni[id]]}).` });
        break;
      }
    }
  }
  if (!gr) {
    eventi.push({ tipo: "ferita", testo: "Il colpo non lascia ferite." });
    return;
  }
  if (gr === "morte") {
    muori(g, p, eventi, `${nome}: un colpo mortale.`);
    return;
  }
  p.ferite.push({ nome, gravita: gr, ambito, ore: 0, segno });
  eventi.push({ tipo: "ferita", testo: `Ferita ${gr}: ${nome} (${ambito}).` });
  for (const l of g.amb.logorii) if (l.saleCon.includes("ferita")) sposta(g, p, l.id, 1, eventi);
}

function cura(g: Gioco, p: Partita, eventi: Evento[]): void {
  const ordine = ["mortale", "grave", "lieve"] as const;
  for (const gr of ordine) {
    const f = p.ferite.find((x) => x.gravita === gr);
    if (!f) continue;
    if (gr === "lieve") p.ferite.splice(p.ferite.indexOf(f), 1);
    else {
      f.gravita = gr === "mortale" ? "grave" : "lieve";
      f.ore = 0;
    }
    eventi.push({ tipo: "ferita", testo: `Curata: ${f.nome}, ora ${gr === "lieve" ? "guarita" : f.gravita}.` });
    if (gr === "grave" && f.segno) applica(g, p, [{ tratto: f.segno, origine: `da ${f.nome}` }], eventi);
    return;
  }
}

export function muori(g: Gioco, p: Partita, eventi: Evento[], testo: string): void {
  eventi.push({ tipo: "morte", testo });
  p.deviazione = g.storia.morte;
}

export function tacca(g: Gioco, p: Partita, capacita: string, eventi: Evento[], forzata = false): void {
  if (g.amb.crescita.tipo === "fissa") return;
  if (!forzata && p.taccheScena[capacita]) return;
  p.taccheScena[capacita] = true;
  const livello = p.livelli[capacita] ?? 0;
  if (livello >= 3) return;
  p.tacche[capacita] = (p.tacche[capacita] ?? 0) + 1;
  const servono = g.amb.crescita.tacche[livello];
  const c = g.amb.capacita.find((x) => x.id === capacita);
  if (p.tacche[capacita] >= servono) {
    if (livello === 2 && !p.fatti[`maestro:${capacita}`]) return; // Maestro solo con chi insegna
    p.livelli[capacita] = livello + 1;
    p.tacche[capacita] = 0;
    eventi.push({ tipo: "crescita", testo: `${c?.nome ?? capacita}: ora sei ${NOMI_LIVELLO[livello + 1]}.` });
  }
}

export const NOMI_LIVELLO = ["Inesperto", "Pratico", "Esperto", "Maestro"] as const;

/** Le reazioni delle persone (§30.2): ciascuna scatta una volta, quando la sua condizione diventa vera. */
export function reagisci(g: Gioco, p: Partita, eventi: Evento[]): void {
  for (const pers of g.storia.persone) {
    for (const r of pers.reazioni ?? []) {
      const chiave = `${pers.id}:${r.id}`;
      if (p.reazioniFatte[chiave] || !vale(g, p, r.se)) continue;
      p.reazioniFatte[chiave] = true;
      cambiaPersona(g, p, pers.id, r.cambia, eventi, r.testo);
    }
  }
}

// ---------------------------------------------------------------------------
// Il tempo (§12): scadenze, logorio, stati d'animo, ferite, Traccia, imprevisti
// ---------------------------------------------------------------------------

export function nomeOre(g: Gioco, n: number): string {
  const numeri = ["", "", "due", "tre", "quattro", "cinque", "sei", "sette", "otto", "nove", "dieci", "undici", "dodici"];
  const u = g.amb.tempo.unita;
  if (n === 1) return /^[aeiou]/i.test(u) ? `un'${u}` : `un ${u}`;
  return `${numeri[n] ?? n} ${g.amb.tempo.plurale}`;
}

/** Il tempo che passa: ogni ora le scadenze, il logorio, le ferite, la Traccia; una volta per scelta la resistenza e l'imprevisto. */
export function avanza(g: Gioco, p: Partita, ore: number, eventi: Evento[]): void {
  let resto = ore;
  let guardia = 0;
  let passate = 0;
  // Quando la storia viene deviata (scadenza, morte, agguato) il tempo che restava non conta più.
  while (resto > 0 && !p.deviazione && guardia++ < 200) {
    resto--;
    passate++;
    p.ora++;

    // 1. scadenze
    for (const s of g.storia.scadenze) {
      const prima = p.scadenze[s.id];
      p.scadenze[s.id] = Math.min(s.caselle, Math.floor(p.ora / s.ogniOre));
      if (p.scadenze[s.id] !== prima) eventi.push({ tipo: "scadenza", testo: `${s.nome}: ${p.scadenze[s.id]} su ${s.caselle}` });
      if (p.scadenze[s.id] >= s.caselle && prima < s.caselle && !(s.salvoSe && vale(g, p, s.salvoSe))) {
        if (!p.deviazione) p.deviazione = s.alScadere;
      }
    }

    // 2. logorio
    for (const l of g.amb.logorii) {
      const s = p.logorio[l.id];
      s.ore++;
      if (l.ogniOre > 0 && s.ore % l.ogniOre === 0) sposta(g, p, l.id, 1, eventi);
    }

    // 3. stati d'animo che passano col tempo
    for (const s of [...p.statiAnimo]) {
      s.ore++;
      const def = g.amb.statiAnimo.find((x) => x.id === s.id);
      if (def?.passa.ore && s.ore >= def.passa.ore) passaStatoAnimo(g, p, s.id, eventi);
    }

    // 4. ferite
    for (const f of [...p.ferite]) {
      f.ore++;
      if (f.gravita === "lieve" && f.ore >= g.amb.ferite.lieveGuarisceIn) {
        p.ferite.splice(p.ferite.indexOf(f), 1);
        eventi.push({ tipo: "ferita", testo: `${f.nome}: guarita.` });
      } else if (f.gravita === "grave" && f.ore >= g.amb.ferite.graveDiventaMortaleIn) {
        f.gravita = "mortale";
        f.ore = 0;
        eventi.push({ tipo: "ferita", testo: `${f.nome}: senza cure, è diventata mortale.` });
      } else if (f.gravita === "mortale" && f.ore >= g.amb.ferite.mortaleUccideIn) {
        muori(g, p, eventi, `${f.nome}: nessuno ti ha curato in tempo.`);
      }
    }

    // 5. Traccia che cala
    for (const zona of Object.keys(p.traccia)) {
      if (p.traccia[zona] <= 0) continue;
      p.quiete[zona] = (p.quiete[zona] ?? 0) + 1;
      if (p.quiete[zona] >= g.amb.traccia.calaOgniOre) {
        p.quiete[zona] = 0;
        aggiungiTraccia(g, p, zona, -1, eventi);
      }
    }

    // Alla fine del tempo di questa scelta: la resistenza allo stremo e l'imprevisto, una volta sola.
    if (resto === 0 && !p.deviazione) {
      eventi.push({ tipo: "tempo", testo: `Passa${passate === 1 ? "" : "no"} ${nomeOre(g, passate)} (${momentoDi(g, p).nome}).` });
      resto += resistenza(g, p, eventi);
      if (resto === 0) imprevisto(g, p, eventi, (x) => (resto += x));
      if (resto > 0) passate = 0;
    }
  }
}

/** La prova di resistenza allo stremo, con le fasce (§34). Restituisce le ore perse. */
function resistenza(g: Gioco, p: Partita, eventi: Evento[]): number {
  let ore = 0;
  for (const l of g.amb.logorii) {
    if (p.logorio[l.id].stadio !== 3) continue;
    const livello = p.livelli[g.amb.resistenza] ?? 0;
    const t = tiraDueDadi(p.rng);
    p.rng = t.stato;
    const totale = t.totale + livello - 1;
    const f = fasciaDi(totale - 8);
    eventi.push({ tipo: "tiro", testo: `${l.nome} allo stremo: prova di resistenza, ${t.dadi[0]} + ${t.dadi[1]} + ${livello} − 1 = ${totale} contro 8: ${NOMI_FASCIA[f]}.` });
    if (f === "quasi") {
      eventi.push({ tipo: "logorio", testo: "Tieni duro, ma devi fermarti un'ora." });
      ore += 1;
    } else if (f === "non") {
      eventi.push({ tipo: "logorio", testo: l.crollo.testo });
      ore += applica(g, p, l.crollo.effetti, eventi);
    }
  }
  return ore;
}

function imprevisto(g: Gioco, p: Partita, eventi: Evento[], piuTempo: (n: number) => void): void {
  const zona = luogoDi(g, p).zona;
  const t = tiraDueDadi(p.rng);
  p.rng = t.stato;
  const limite = g.amb.traccia.imprevistoFinoA[p.traccia[zona] ?? 0];
  if (t.totale > limite) return;
  const voci = g.amb.repertorio.filter((v) => v.zona === zona && v.tipo !== "prezzo" && (!v.quando || vale(g, p, v.quando)));
  if (voci.length === 0) return;
  const i = intero(p.rng, 0, voci.length - 1);
  p.rng = i.stato;
  const v = voci[i.valore];
  eventi.push({ tipo: "imprevisto", testo: v.testo });
  piuTempo(applica(g, p, v.effetti, eventi));
  if (v.vai && !p.deviazione && !p.confronto) p.deviazione = v.vai;
}

/** Una complicazione dal repertorio della zona, per il Non riesci da esposto (§28.4). */
export function complicazione(g: Gioco, p: Partita, eventi: Evento[]): number {
  const zona = luogoDi(g, p).zona;
  const voci = g.amb.repertorio.filter((v) => v.zona === zona && !v.vai && v.tipo !== "prezzo" && (!v.quando || vale(g, p, v.quando)));
  if (voci.length === 0) return 0;
  const i = intero(p.rng, 0, voci.length - 1);
  p.rng = i.stato;
  eventi.push({ tipo: "imprevisto", testo: voci[i.valore].testo });
  return applica(g, p, voci[i.valore].effetti, eventi);
}

/** Il prezzo predefinito: una voce «prezzo» del repertorio della zona, altrimenti un'ora persa (§28.6). */
export function prezzoPredefinito(g: Gioco, p: Partita, eventi: Evento[]): number {
  const zona = luogoDi(g, p).zona;
  const voci = g.amb.repertorio.filter((v) => v.zona === zona && v.tipo === "prezzo" && (!v.quando || vale(g, p, v.quando)));
  if (voci.length === 0) {
    eventi.push({ tipo: "esito", testo: "Il prezzo: ci perdi un'ora." });
    return 1;
  }
  const i = intero(p.rng, 0, voci.length - 1);
  p.rng = i.stato;
  eventi.push({ tipo: "esito", testo: `Il prezzo: ${voci[i.valore].testo}` });
  return applica(g, p, voci[i.valore].effetti, eventi);
}

export function nomeGrado(g: Grado): string {
  return ["al coperto", "esposto", "allo scoperto"][g];
}

export type { Grado };
