/**
 * Lo stato di una partita e le regole che lo cambiano: condizioni, effetti,
 * ferite, logorio, Traccia, imprevisti e il tempo che passa (Parti II e IV).
 */

import type { Ambientazione, Condizione, Effetto, Gravita, Grado, Scena, Storia, Testo } from "./tipi.ts";
import { intero, tiraDueDadi } from "./dadi.ts";

export interface Evento {
  tipo: "testo" | "tiro" | "esito" | "traccia" | "imprevisto" | "ferita" | "tempo" | "logorio" | "crescita" | "protezione" | "scadenza" | "morte" | "confronto" | "qualita";
  testo: string;
}

export interface Ferita {
  nome: string;
  gravita: Exclude<Gravita, "morte">;
  ambito: string;
  passi: number;
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

export interface Partita {
  seme: number;
  rng: number;
  scena: string;
  passo: number;
  fatti: Record<string, true>;
  misure: Record<string, number>;
  oggetti: Record<string, number>;
  conoscenze: Record<string, true>;
  traccia: Record<string, number>;
  quiete: Record<string, number>;
  logorio: Record<string, { stadio: 1 | 2 | 3; passi: number }>;
  ferite: Ferita[];
  protezioni: Record<string, 0 | 1 | 2>;
  livelli: Record<string, number>;
  tacche: Record<string, number>;
  taccheScena: Record<string, true>;
  fili: Record<string, number>;
  scadenze: Record<string, number>;
  preparazioni: Array<{ id: string; luogo?: string }>;
  usate: Record<string, true>;
  /** Tentativi in corso per ogni via, e i tentativi della prima volta per ogni capacità (§18.2). */
  tentativi: Record<string, number>;
  primaVolta: Record<string, number>;
  /** La prova fallita che si può ritentare, e la scena da cui veniva. */
  ritento?: { scena: string; scelta: string; verso: string };
  confronto?: StatoConfronto;
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
// Luogo, zona, momento
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
  const ciclo = m.reduce((s, x) => s + x.passi, 0);
  let i = m.findIndex((x) => x.id === g.storia.momentoIniziale);
  let resto = p.passo % ciclo;
  while (resto >= m[i].passi) {
    resto -= m[i].passi;
    i = (i + 1) % m.length;
  }
  return m[i];
}

// ---------------------------------------------------------------------------
// Condizioni
// ---------------------------------------------------------------------------

export interface ContestoProva {
  ambito: string;
  tag: string[];
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
  if ("oggetto" in c) return (p.oggetti[c.oggetto] ?? 0) >= (c.almeno ?? 1);
  if ("conoscenza" in c) return !!p.conoscenze[c.conoscenza];
  if ("nonConoscenza" in c) return !p.conoscenze[c.nonConoscenza];
  if ("traccia" in c) return (p.traccia[c.traccia] ?? 0) >= c.almeno;
  if ("momento" in c) {
    const m = momentoDi(g, p).id;
    return Array.isArray(c.momento) ? c.momento.includes(m) : c.momento === m;
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
  if ("oggettoTag" in c) {
    return g.storia.oggetti.some((o) => o.tag?.includes(c.oggettoTag) && (p.oggetti[o.id] ?? 0) > 0);
  }
  return false;
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
  const p: Partita = {
    seme,
    rng: seme,
    scena: g.storia.inizio,
    passo: 0,
    fatti: {},
    misure: {},
    oggetti: { ...pers.oggetti },
    conoscenze: {},
    traccia: {},
    quiete: {},
    logorio: Object.fromEntries(g.amb.logorii.map((l) => [l.id, { stadio: 1 as const, passi: 0 }])),
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
  return p;
}

// ---------------------------------------------------------------------------
// Effetti
// ---------------------------------------------------------------------------

const DECLASSA: Record<Gravita, Gravita | null> = { morte: "mortale", mortale: "grave", grave: "lieve", lieve: null };

export function nomeFatto(g: Gioco, id: string): string {
  return g.storia.fatti.find((f) => f.id === id)?.parola ?? id;
}

export function applica(g: Gioco, p: Partita, effetti: Effetto[] | undefined, eventi: Evento[]): number {
  let tempo = 0;
  for (const e of effetti ?? []) {
    if ("fatto" in e) {
      p.fatti[e.fatto] = true;
      eventi.push({ tipo: "qualita", testo: `Parola chiave: ${nomeFatto(g, e.fatto)}` });
    } else if ("togliFatto" in e) delete p.fatti[e.togliFatto];
    else if ("misura" in e) {
      const m = g.storia.misure.find((x) => x.id === e.misura);
      p.misure[e.misura] = Math.max(0, Math.min(m?.max ?? 99, (p.misure[e.misura] ?? 0) + e.piu));
      eventi.push({ tipo: "qualita", testo: `${m?.nome ?? e.misura}: ${p.misure[e.misura]}` });
    } else if ("oggetto" in e) {
      p.oggetti[e.oggetto] = Math.max(0, (p.oggetti[e.oggetto] ?? 0) + e.piu);
      const o = g.storia.oggetti.find((x) => x.id === e.oggetto);
      eventi.push({ tipo: "qualita", testo: `${o?.nome ?? e.oggetto}: ${e.piu > 0 ? "+" : ""}${e.piu} (ora ${p.oggetti[e.oggetto]})` });
    } else if ("conoscenza" in e) {
      if (!p.conoscenze[e.conoscenza]) {
        p.conoscenze[e.conoscenza] = true;
        const k = g.storia.conoscenze.find((x) => x.id === e.conoscenza);
        eventi.push({ tipo: "qualita", testo: `Sai che: ${k?.testo ?? e.conoscenza}` });
      }
    } else if ("traccia" in e) aggiungiTraccia(g, p, e.traccia === "qui" ? luogoDi(g, p).zona : e.traccia, e.piu, eventi);
    else if ("logorio" in e) sposta(g, p, e.logorio, e.piu, eventi);
    else if ("rimedio" in e) {
      p.logorio[e.rimedio] = { stadio: 1, passi: 0 };
      const l = g.amb.logorii.find((x) => x.id === e.rimedio);
      eventi.push({ tipo: "logorio", testo: `${l?.nome ?? e.rimedio}: ${l?.stadi[0] ?? "a posto"}` });
    } else if ("ferita" in e) ferisci(g, p, e.ferita.nome, e.ferita.gravita, e.ferita.ambito, e.ferita.tipo, eventi);
    else if ("cura" in e) cura(p, eventi);
    else if ("tempo" in e) tempo += e.tempo;
    else if ("filo" in e) {
      p.fili[e.filo] = (p.fili[e.filo] ?? 0) + e.piu;
      const f = g.storia.fili.find((x) => x.id === e.filo);
      eventi.push({ tipo: "qualita", testo: `${f?.nome ?? e.filo}: ${p.fili[e.filo]} su ${f?.tappe ?? "?"}` });
    } else if ("preparazione" in e) {
      const def = g.amb.preparazioni.find((x) => x.id === e.preparazione);
      if (def && !p.preparazioni.some((x) => x.id === def.id)) {
        p.preparazioni.push({ id: def.id, luogo: def.durata === "luogo" ? luogoDi(g, p).id : undefined });
        eventi.push({ tipo: "qualita", testo: `Preparazione: ${def.testo}` });
      }
    } else if ("tacca" in e) tacca(g, p, e.tacca, eventi, true);
  }
  return tempo;
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

export function ferisci(g: Gioco, p: Partita, nome: string, gravita: Gravita, ambito: string, tipo: string | undefined, eventi: Evento[]): void {
  let gr: Gravita | null = gravita;
  if (tipo) {
    for (const [id, stato] of Object.entries(p.protezioni)) {
      const prot = g.amb.protezioni.find((x) => x.id === id);
      if (prot && stato < 2 && prot.contro.includes(tipo) && gr) {
        p.protezioni[id] = (stato + 1) as 0 | 1 | 2;
        gr = DECLASSA[gr];
        eventi.push({ tipo: "protezione", testo: `${prot.nome} attutisce il colpo (ora ${["intatta", "intaccata", "inservibile"][p.protezioni[id]]}).` });
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
  p.ferite.push({ nome, gravita: gr, ambito, passi: 0 });
  eventi.push({ tipo: "ferita", testo: `Ferita ${gr}: ${nome} (${ambito}).` });
  for (const l of g.amb.logorii) if (l.saleCon.includes("ferita")) sposta(g, p, l.id, 1, eventi);
}

function cura(p: Partita, eventi: Evento[]): void {
  const ordine = ["mortale", "grave", "lieve"] as const;
  for (const gr of ordine) {
    const f = p.ferite.find((x) => x.gravita === gr);
    if (!f) continue;
    if (gr === "lieve") p.ferite.splice(p.ferite.indexOf(f), 1);
    else {
      f.gravita = gr === "mortale" ? "grave" : "lieve";
      f.passi = 0;
    }
    eventi.push({ tipo: "ferita", testo: `Curata: ${f.nome}, ora ${gr === "lieve" ? "guarita" : f.gravita}.` });
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

// ---------------------------------------------------------------------------
// Il tempo (§5.1): scadenze, logorio, ferite, Traccia, imprevisti
// ---------------------------------------------------------------------------

export function avanza(g: Gioco, p: Partita, passi: number, eventi: Evento[]): void {
  let resto = passi;
  let guardia = 0;
  // Quando la storia viene deviata (scadenza, morte, agguato) il tempo che restava non conta più.
  while (resto > 0 && !p.deviazione && guardia++ < 200) {
    resto--;
    p.passo++;
    const m = momentoDi(g, p);
    eventi.push({ tipo: "tempo", testo: `Passa un passo (${m.nome}).` });

    // 1. scadenze
    for (const s of g.storia.scadenze) {
      const prima = p.scadenze[s.id];
      p.scadenze[s.id] = Math.min(s.caselle, Math.floor(p.passo / s.ogniPassi));
      if (p.scadenze[s.id] !== prima) eventi.push({ tipo: "scadenza", testo: `${s.nome}: ${p.scadenze[s.id]} su ${s.caselle}` });
      if (p.scadenze[s.id] >= s.caselle && prima < s.caselle && !(s.salvoSe && vale(g, p, s.salvoSe))) {
        if (!p.deviazione) p.deviazione = s.alScadere;
      }
    }

    // 2. logorio
    for (const l of g.amb.logorii) {
      const s = p.logorio[l.id];
      s.passi++;
      if (l.ogniPassi > 0 && s.passi % l.ogniPassi === 0) sposta(g, p, l.id, 1, eventi);
      if (s.stadio === 3) {
        const livello = p.livelli[g.amb.resistenza] ?? 0;
        const t = tiraDueDadi(p.rng);
        p.rng = t.stato;
        const ok = t.totale + livello >= 8;
        eventi.push({ tipo: "tiro", testo: `${l.nome} allo stremo: prova di resistenza, ${t.dadi[0]}+${t.dadi[1]}+${livello} contro 8: ${ok ? "reggi" : "non reggi"}.` });
        if (!ok) {
          eventi.push({ tipo: "logorio", testo: l.crollo.testo });
          resto += applica(g, p, l.crollo.effetti, eventi);
        }
      }
    }

    // 3. ferite
    for (const f of [...p.ferite]) {
      f.passi++;
      if (f.gravita === "lieve" && f.passi >= g.amb.ferite.lieveGuarisceIn) {
        p.ferite.splice(p.ferite.indexOf(f), 1);
        eventi.push({ tipo: "ferita", testo: `${f.nome}: guarita.` });
      } else if (f.gravita === "grave" && f.passi >= g.amb.ferite.graveDiventaMortaleIn) {
        f.gravita = "mortale";
        f.passi = 0;
        eventi.push({ tipo: "ferita", testo: `${f.nome}: senza cure, è diventata mortale.` });
      } else if (f.gravita === "mortale" && f.passi >= g.amb.ferite.mortaleUccideIn) {
        muori(g, p, eventi, `${f.nome}: nessuno ti ha curato in tempo.`);
      }
    }

    // 4. Traccia che cala
    for (const zona of Object.keys(p.traccia)) {
      if (p.traccia[zona] <= 0) continue;
      p.quiete[zona] = (p.quiete[zona] ?? 0) + 1;
      if (p.quiete[zona] >= g.amb.traccia.calaOgniPassi) {
        p.quiete[zona] = 0;
        aggiungiTraccia(g, p, zona, -1, eventi);
      }
    }

    // 5. imprevisto nella zona in cui sei
    imprevisto(g, p, eventi, (x) => (resto += x));
  }
}

function imprevisto(g: Gioco, p: Partita, eventi: Evento[], piuTempo: (n: number) => void): void {
  const zona = luogoDi(g, p).zona;
  const t = tiraDueDadi(p.rng);
  p.rng = t.stato;
  const limite = g.amb.traccia.imprevistoFinoA[p.traccia[zona] ?? 0];
  if (t.totale > limite) return;
  const voci = g.amb.repertorio.filter((v) => v.zona === zona && (!v.quando || vale(g, p, v.quando)));
  if (voci.length === 0) return;
  const i = intero(p.rng, 0, voci.length - 1);
  p.rng = i.stato;
  const v = voci[i.valore];
  eventi.push({ tipo: "imprevisto", testo: v.testo });
  piuTempo(applica(g, p, v.effetti, eventi));
  if (v.vai && !p.deviazione && !p.confronto) p.deviazione = v.vai;
}

/** Una complicazione dal repertorio della zona, per il rovescio minore (§11). */
export function complicazione(g: Gioco, p: Partita, eventi: Evento[]): number {
  const zona = luogoDi(g, p).zona;
  const voci = g.amb.repertorio.filter((v) => v.zona === zona && !v.vai && (!v.quando || vale(g, p, v.quando)));
  if (voci.length === 0) return 0;
  const i = intero(p.rng, 0, voci.length - 1);
  p.rng = i.stato;
  eventi.push({ tipo: "imprevisto", testo: voci[i.valore].testo });
  return applica(g, p, voci[i.valore].effetti, eventi);
}

export function nomeGrado(g: Grado): string {
  return ["al coperto", "esposto", "allo scoperto"][g];
}
