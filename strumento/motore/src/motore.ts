/**
 * L'interfaccia del motore per chi presenta il gioco (§48.4): `vista` dice che cosa
 * mostrare, `agisci` risolve una scelta. Non disegna e non scrive niente: un gioco
 * testuale, un librogame o un gioco grafico usano le stesse due funzioni.
 */

import type { Condizione, Effetto, Fascia, Grado, Prova, Scelta, Scena, Spostamento } from "./tipi.ts";
import { componi, NOMI_GRADO, NOMI_GRADO_MINUSCOLI, riuscita, type Composizione, type Parte, type Ragione, type Riuscita } from "./quadro.ts";
import { fasciaDi, NOMI_FASCIA, tiraDueDadi } from "./dadi.ts";
import {
  applica,
  aggiungiTraccia,
  avanza,
  cambiaPersona,
  clona,
  complicazione,
  convinzioneCheChiude,
  dim,
  ferisci,
  ferisciCompagno,
  haCosa,
  luogoDi,
  momentoDi,
  nomeCosa,
  nomeFatto,
  nomeGrado,
  nomeOre,
  nomePersona,
  NOMI_LIVELLO,
  passaStatoAnimo,
  prezzoPredefinito,
  proprietaAttive,
  reagisci,
  rompi,
  scenaDi,
  STATI_COSA,
  tacca,
  testoDi,
  testoNotizia,
  tradirebbe,
  vale,
  type Evento,
  type Gioco,
  type Partita,
  type StatoNotizia,
} from "./stato.ts";

// ---------------------------------------------------------------------------
// Il quadro (§21)
// ---------------------------------------------------------------------------

export interface Quadro {
  azione: string;
  /** Chi fa la prova: il personaggio, oppure un compagno (§33). */
  chi?: string;
  capacita: string;
  ambito: string;
  livello: string;
  puoi: { aperta: boolean; righe: string[]; richiede?: string };
  riesci: Riuscita & { sogliaNome: string };
  costo: Composizione;
  /** Il grado di esposizione, per comodità: è `costo.grado`. */
  grado: Grado;
  dopo: { pieno: string; riesci: string; quasi: string[]; nonRiesci: string; posta: string; persone: string[] };
  /** Un nuovo tentativo costa un'ora (§22). */
  ritento: boolean;
  unColpoSolo: boolean;
}

export interface VistaScelta {
  id: string;
  testo: string;
  tipo: "vai" | "prova" | "riprova" | "difesa" | "finestra" | "parlare" | "andarsene" | "quasi" | "ripensa" | "deduci" | "combina";
  disponibile: boolean;
  richiede?: string;
  /** Perché è chiusa: un requisito, una convinzione, la forza, una ferita, la difficoltà. */
  chiusaDa?: "requisito" | "convinzione" | "forza" | "ferita" | "difficile" | "usata";
  ripiego?: boolean;
  quadro?: Quadro;
  /** Per le possibilità del Quasi: che cosa costa sceglierla. */
  costa?: string;
  /** Le stesse prove con un compagno: con il suo aiuto, oppure fatte da lui (§33). */
  varianti?: VistaScelta[];
}

export interface Vista {
  scena: { id: string; titolo: string; testo: string; luogo: string; momento: string; presentazione?: Record<string, string> };
  stato: {
    ora: number;
    momento: string;
    scadenze: string[];
    logorio: string[];
    ferite: string[];
    statiAnimo: string[];
    tracciaQui: number;
    cose: Array<{ id: string; nome: string; quante: number; stato?: string }>;
    parole: string[];
    notizie: Array<{ id: string; testo: string; stato: StatoNotizia; contrasto: string[] }>;
    convinzioni: Array<{ id: string; testo: string; inDubbio: boolean }>;
    tratti: Array<{ id: string; nome: string; effetti: string; origine: string }>;
    persone: Array<{ id: string; nome: string; parole: string }>;
    compagni: Array<{ id: string; nome: string; capacita: string[]; tratti: string[]; ferite: string[] }>;
    capacita: string[];
    protezioni: string[];
  };
  confronto?: { avversario: string; natura: string; copertura: string; finestra: boolean; inDifesa: boolean };
  /** Una prova finita nel Quasi, o una convinzione su cui si sta ripensando: le scelte sono quelle. */
  sospeso?: { tipo: "quasi" | "ripensa"; testo: string };
  scelte: VistaScelta[];
  finale?: "vittoria" | "sconfitta" | "morte";
}

const TIPO_SOGLIA: Record<number, string> = { 4: "Sotto Facile", 6: "Facile", 8: "Impegnativa", 10: "Ardua", 12: "Estrema", 14: "Oltre Estrema" };

function voceDi(g: Gioco, id: string) {
  const s = g.amb.catalogo.find((x) => x.id === id);
  if (!s) throw new Error(`Voce non in catalogo: ${id}`);
  return s;
}

function capDi(g: Gioco, id: string) {
  const c = g.amb.capacita.find((x) => x.id === id);
  if (!c) throw new Error(`Capacità inesistente: ${id}`);
  return c;
}

function parteDi(c: Condizione): Parte {
  if ("notizia" in c) return "notizia";
  if ("tratto" in c) return "tratto";
  if ("cosa" in c || "cosaProprieta" in c) return "cosa";
  if ("persona" in c || "conosci" in c) return "legame";
  if ("statoAnimo" in c) return "stato d'animo";
  if ("tutte" in c && c.tutte.length) return parteDi(c.tutte[0]);
  return "scena";
}

function applicabile(g: Gioco, p: Partita, s: Spostamento, capacita: string, generi: string[]): boolean {
  const perGenere = s.generi?.some((x) => generi.includes(x)) ?? false;
  const perCapacita = s.capacita?.includes(capacita) ?? false;
  if (!perGenere && !perCapacita) return false;
  return !s.se || vale(g, p, s.se);
}

function preparazioniAttive(g: Gioco, p: Partita): string[] {
  const luogo = luogoDi(g, p).id;
  const attive = new Set<string>();
  for (const x of p.preparazioni) if (!x.luogo || x.luogo === luogo) attive.add(x.id);
  for (const def of g.amb.preparazioni) if (def.durata === "cosa" && def.cosa && haCosa(p, def.cosa)) attive.add(def.id);
  return [...attive];
}

/** Gli attrezzi che aiutano questa prova, in ordine (§7). */
function attrezzi(g: Gioco, p: Partita, capacita: string, generi: string[]): string[] {
  return g.storia.cose
    .filter((o) => o.attrezzo && haCosa(p, o.id))
    .filter((o) => o.attrezzo!.capacita?.includes(capacita) || o.attrezzo!.generi?.some((x) => generi.includes(x)))
    .map((o) => o.id);
}

/** Chi può aiutare: si fida di te almeno 2, oppure ti deve un favore (§30.3). */
export function puoAiutare(p: Partita, persona: string): boolean {
  return dim(p, persona, "fiducia") >= 2 || dim(p, persona, "debito") > 0;
}

/** Una ferita che impedisce la capacità (§36), a te o al compagno che agisce. */
function impedimento(g: Gioco, p: Partita, capacitaId: string, attore?: string): string | undefined {
  const cap = capDi(g, capacitaId);
  const ferite = attore ? p.compagni[attore]?.ferite ?? [] : p.ferite;
  const grave = ferite.find((f) => f.gravita === "grave" && f.ambito === cap.ambito);
  if (grave) return `${grave.nome} ${attore ? "glielo" : "te lo"} impedisce`;
  if (ferite.some((f) => f.gravita === "mortale") && !g.amb.ferite.conMortaleSoloAmbiti.includes(cap.ambito)) return `una ferita mortale ${attore ? "glielo" : "te lo"} impedisce`;
  return undefined;
}

function femminile(g: Gioco, id: string): boolean {
  return !!g.storia.persone.find((x) => x.id === id)?.femminile;
}

/** Il livello a parole, accordato: «Esperta» per una compagna. */
function nomeLivello(g: Gioco, livello: number, attore?: string): string {
  const n = NOMI_LIVELLO[livello];
  return attore && femminile(g, attore) ? n.replace(/o$/, "a") : n;
}

/**
 * La partita vista da chi agisce: se è un compagno, contano i suoi tratti, le sue
 * ferite e nessuno stato d'animo del personaggio. Il resto (luogo, cose, Traccia) è lo stesso.
 */
function vistaDi(g: Gioco, p: Partita, attore?: string): Partita {
  if (!attore) return p;
  const def = g.storia.persone.find((x) => x.id === attore)?.compagno;
  return { ...p, tratti: Object.fromEntries((def?.tratti ?? []).map((t) => [t, ""])), ferite: p.compagni[attore]?.ferite ?? [], statiAnimo: [] };
}

/** Il livello di un compagno in una capacità; 0 se non la conosce. */
function livelloCompagno(g: Gioco, id: string, capacita: string): number {
  return g.storia.persone.find((x) => x.id === id)?.compagno?.capacita[capacita] ?? 0;
}

export interface SpecProva {
  azione: string;
  capacita: string;
  soglia: string;
  righe?: Prova["righe"];
  sposta?: Prova["sposta"];
  persona?: string;
  aiuto?: string;
  posta: string;
  unColpoSolo?: boolean;
  chiave: string;
  prova?: Prova;
  /** Il grado da cui partire invece di calcolarlo: la difesa usa quello dell'ultima azione. */
  gradoFisso?: { testo: string; grado: Grado };
  /** Un compagno che fa la prova al posto tuo. */
  attore?: string;
  /** Un compagno che ti aiuta. */
  aiutoCompagno?: string;
}

/** Il quadro di una prova nello stato attuale: le quattro domande (§17–20). */
export function quadroProva(g: Gioco, p0: Partita, spec: SpecProva): Quadro {
  const p = vistaDi(g, p0, spec.attore);
  const cap = capDi(g, spec.capacita);
  const voce = voceDi(g, spec.soglia);
  const generi = voce.generi ?? [];
  const scena = scenaDi(g, p.scena);
  const luogo = luogoDi(g, p);
  const mom = momentoDi(g, p);
  const props = proprietaAttive(g, p);

  // --- Puoi farlo?
  const puoiRighe: string[] = [];
  let richiede: string | undefined;
  if (voce.serve) {
    const ok = voce.serve.una.find((c) => vale(g, p, c));
    if (ok) puoiRighe.push(`${voce.serve.testo.split(":")[0]}: ce l'hai`);
    else richiede = voce.serve.testo;
  }
  for (const pa of props) {
    for (const sv of pa.def.serve ?? []) {
      if (!sv.generi.some((x) => generi.includes(x))) continue;
      if (vale(g, p, sv.se)) puoiRighe.push(`${pa.def.nome}: ${sv.testo.replace(/^serve /, "hai ")}`);
      else richiede ??= sv.testo;
    }
  }
  if (spec.aiuto && !puoAiutare(p, spec.aiuto)) richiede ??= `che ${nomePersona(g, spec.aiuto)} si fidi di te, o ti debba un favore`;

  // --- Ci riesci?
  const giu: Ragione[] = [];
  const su: Ragione[] = [];
  const note: string[] = [];
  const metti = (gradini: -1 | 1, r: Ragione) => (gradini < 0 ? giu : su).push(r);
  for (const s of voce.sposta ?? []) if (vale(g, p, s.se)) metti(s.gradini, { testo: s.testo, parte: parteDi(s.se) });
  for (const id of Object.keys(p.tratti)) {
    const t = g.amb.tratti.find((x) => x.id === id);
    for (const s of t?.sposta ?? []) if (applicabile(g, p, s, cap.id, generi)) metti(s.gradini, { testo: s.testo, parte: "tratto" });
  }
  for (const pa of props) {
    for (const s of pa.def.sposta ?? []) {
      if (!applicabile(g, p, s, cap.id, generi)) continue;
      if (pa.annullata) note.push(pa.annullata);
      else metti(s.gradini, { testo: s.testo, parte: "proprieta" });
    }
  }
  if (spec.persona) {
    const nome = nomePersona(g, spec.persona);
    if (g.amb.sociali.fiducia.includes(cap.id)) {
      if (dim(p, spec.persona, "fiducia") >= 2) giu.push({ testo: `${nome} si fida di te`, parte: "legame" });
      if (dim(p, spec.persona, "rancore") >= 2) su.push({ testo: `${nome} ce l'ha con te`, parte: "legame" });
    }
    if (g.amb.sociali.paura.includes(cap.id) && dim(p, spec.persona, "paura") >= 2) giu.push({ testo: `${nome} ha paura di te`, parte: "legame" });
  }
  for (const st of p.statiAnimo) {
    const def = g.amb.statiAnimo.find((x) => x.id === st.id);
    for (const s of def?.sposta ?? []) if (applicabile(g, p, s, cap.id, generi)) metti(s.gradini, { testo: s.testo, parte: "stato d'animo" });
  }
  for (const s of spec.sposta ?? []) metti(s.gradini, { testo: s.testo, parte: "scena" });

  const spinte: Ragione[] = attrezzi(g, p, cap.id, generi).map((id) => ({ testo: `${nomeCosa(g, id).toLowerCase()}: ${g.storia.cose.find((o) => o.id === id)!.attrezzo!.testo}`, parte: "cosa" as const }));
  if (spec.aiuto && puoAiutare(p, spec.aiuto)) spinte.push({ testo: `${nomePersona(g, spec.aiuto)} ti aiuta`, parte: "aiuto" });
  if (spec.aiutoCompagno) {
    if (puoAiutare(p, spec.aiutoCompagno)) spinte.push({ testo: `${nomePersona(g, spec.aiutoCompagno)} ti aiuta`, parte: "aiuto" });
    else richiede ??= `che ${nomePersona(g, spec.aiutoCompagno)} si fidi di te, o ti debba un favore`;
  }

  const penalita: Ragione[] = [];
  for (const f of p.ferite) if (f.gravita === "lieve" && f.ambito === cap.ambito) penalita.push({ testo: `${f.nome}`, parte: "ferita" });
  for (const l of g.amb.logorii) if (p.logorio[l.id]?.stadio === 3) penalita.push({ testo: `${l.nome.toLowerCase()}: ${l.stadi[2]}`, parte: "logorio" });
  for (const st of p.statiAnimo) {
    const def = g.amb.statiAnimo.find((x) => x.id === st.id);
    const pen = def?.penalita;
    if (pen && (pen.capacita?.includes(cap.id) || pen.ambiti?.includes(cap.ambito))) penalita.push({ testo: pen.testo, parte: "stato d'animo" });
  }

  const livello = spec.attore ? livelloCompagno(g, spec.attore, cap.id) : p.livelli[cap.id] ?? 0;
  const chi = spec.attore ? `${nomePersona(g, spec.attore)} è` : "sei";
  const ris = riuscita({ testo: `${TIPO_SOGLIA[voce.soglia]}: ${voce.cosa}`, soglia: voce.soglia }, giu, su, { testo: `${chi} ${nomeLivello(g, livello, spec.attore)} in ${cap.nome}`, valore: livello }, spinte, penalita);
  for (const n of note) ris.righe.push({ tipo: "nota", testo: n, valore: 0, conta: false });
  if (ris.troppoDifficile) richiede ??= "troppo difficile per te adesso";

  // --- Quanto ti costa?
  let costo: Composizione;
  if (spec.gradoFisso) costo = componi({ testo: spec.gradoFisso.testo, valore: spec.gradoFisso.grado }, [], 0);
  else {
    const ctx = { ambito: cap.ambito, tag: scena.tag ?? [] };
    const ambiente: Array<{ tipo: "ambiente"; testo: string; valore: number }> = [];
    for (const pa of props.filter((x) => x.da === "luogo")) if (!pa.annullata) ambiente.push({ tipo: "ambiente", testo: pa.def.cause[cap.ambito] ?? pa.def.nome, valore: pa.def.valori[cap.ambito] ?? 0 });
    for (const r of luogo.righe ?? []) if (r.ambito === cap.ambito) ambiente.push({ tipo: "ambiente", testo: r.testo, valore: r.valore });
    for (const pa of props.filter((x) => x.da === "momento")) if (!pa.annullata) ambiente.push({ tipo: "ambiente", testo: pa.def.cause[cap.ambito] ?? pa.def.nome, valore: pa.def.valori[cap.ambito] ?? 0 });
    for (const r of mom.righe ?? []) if (r.ambito === cap.ambito) ambiente.push({ tipo: "ambiente", testo: r.testo, valore: r.valore });
    costo = componi({ testo: cap.causa, valore: cap.partenza }, [
      ...ambiente,
      ...(spec.righe ?? []).map((r) => ({ tipo: "scena" as const, testo: r.testo, valore: r.valore })),
      ...g.amb.aggravanti.filter((a) => vale(g, p, a.quando, ctx)).map((a) => ({ tipo: "aggravante" as const, testo: a.testo, valore: 1 })),
      ...preparazioniAttive(g, p).map((id) => ({ tipo: "preparazione" as const, testo: g.amb.preparazioni.find((x) => x.id === id)!.testo, valore: -1 })),
    ], cap.fondo);
  }
  const grado = costo.grado;

  // --- Che cosa cambia dopo?
  const pr = spec.prova;
  const ottieni = pr ? pr.ottieni ?? scenaDi(g, pr.riesci.vai).titolo.toLowerCase() : "ciò che volevi";
  const quasi: string[] = [];
  if (grado < 2) quasi.push(`tutto, ma ${NOMI_GRADO_MINUSCOLI[grado + 1]}`);
  else quasi.push("tutto, e il rovescio lo stesso");
  const meta = pr ? testoMeta(g, scena, pr) : undefined;
  if (meta) quasi.push(`la metà: ${meta}`);
  quasi.push("lasci perdere");
  const persone: string[] = [];
  for (const x of [spec.aiuto, spec.aiutoCompagno]) if (x && puoAiutare(p, x)) persone.push(dim(p, x, "debito") > 0 ? `${nomePersona(g, x)} non ti dovrà più un favore` : `dovrai un favore a ${nomePersona(g, x)}`);
  if (spec.attore) persone.push(`se va male, ci va di mezzo ${nomePersona(g, spec.attore)}`);
  const nonRiesci = ["scopri qualcosa sull'ostacolo", grado === 1 ? "e la scena si complica" : grado === 2 ? "e arriva il rovescio" : ""].filter(Boolean).join(", ");

  return {
    azione: spec.azione,
    chi: spec.attore,
    capacita: cap.nome,
    ambito: cap.ambito,
    livello: nomeLivello(g, livello, spec.attore),
    puoi: { aperta: !richiede, righe: puoiRighe, richiede },
    riesci: { ...ris, sogliaNome: TIPO_SOGLIA[ris.soglia] ?? String(ris.soglia) },
    costo,
    grado,
    dopo: {
      pieno: pr?.dono?.testo ?? "qualcosa in più",
      riesci: ottieni,
      quasi,
      nonRiesci,
      posta: spec.posta || (grado === 0 ? "Se va male: niente di peggio che non riuscire." : ""),
      persone,
    },
    ritento: (p.tentativi[spec.chiave] ?? 0) > 0,
    unColpoSolo: !!spec.unColpoSolo,
  };
}

function testoMeta(g: Gioco, scena: Scena, pr: Prova): string | undefined {
  if (!pr.meta) return undefined;
  if ("ripiego" in pr.meta) {
    const r = (scena.scelte ?? []).find((s) => s.id === (pr.meta as { ripiego: string }).ripiego);
    return r ? scenaDi(g, r.vai ?? scena.id).titolo.toLowerCase() : undefined;
  }
  return pr.meta.testo;
}

// ---------------------------------------------------------------------------
// Le scelte che si esauriscono (§15.6)
// ---------------------------------------------------------------------------

/** Una scena di solo resoconto: racconta che cosa hai ottenuto e ti rimanda indietro. */
function resoconto(sc: Scena): boolean {
  return !sc.finale && !sc.confronto && (sc.scelte ?? []).length <= 1 && !(sc.scelte ?? []).some((x) => x.prova);
}

function guadagni(g: Gioco, scena: Scena, s: Scelta): Effetto[] {
  const e: Effetto[] = [...(s.effetti ?? [])];
  const dest = s.prova ? s.prova.riesci.vai : s.vai;
  // Conta ciò che dà la scena di arrivo solo se è un resoconto: un luogo o un ostacolo non si esauriscono.
  if (dest && dest !== scena.id && resoconto(scenaDi(g, dest))) e.push(...(scenaDi(g, dest).entrando ?? []));
  if (s.prova) e.push(...(s.prova.riesci.effetti ?? []));
  return e.filter((x) => "notizia" in x || "verifica" in x || "fatto" in x || "preparazione" in x || "convinzione" in x || "tratto" in x || ("cosa" in x && x.piu > 0 && !g.storia.cose.find((o) => o.id === x.cosa)?.scorta));
}

function giaTuo(g: Gioco, p: Partita, e: Effetto): boolean {
  if ("notizia" in e) return !!p.notizie[e.notizia];
  if ("verifica" in e) return p.notizie[e.verifica] === "verificata" || p.notizie[e.verifica] === "smentita";
  if ("fatto" in e) return !!p.fatti[e.fatto];
  if ("preparazione" in e) return preparazioniAttive(g, p).includes(e.preparazione);
  if ("convinzione" in e) return !!p.convinzioni[e.convinzione];
  if ("tratto" in e) return e.tratto in p.tratti;
  if ("cosa" in e) return (p.cose[e.cosa] ?? 0) > 0;
  return false;
}

export function esaurita(g: Gioco, p: Partita, scena: Scena, s: Scelta): boolean {
  if (s.sempre) return false;
  const gg = guadagni(g, scena, s);
  return gg.length > 0 && gg.every((e) => giaTuo(g, p, e));
}

// ---------------------------------------------------------------------------
// Vista
// ---------------------------------------------------------------------------

function specDi(scena: Scena, s: Scelta, modo?: string): SpecProva {
  const pr = s.prova!;
  const [tipo, chi] = (modo ?? "").split(":");
  return {
    azione: s.testo,
    capacita: pr.capacita,
    soglia: pr.soglia,
    righe: pr.righe,
    sposta: pr.sposta,
    persona: pr.persona,
    aiuto: pr.aiuto,
    posta: pr.posta,
    unColpoSolo: pr.unColpoSolo,
    chiave: `${scena.id}:${s.id}`,
    prova: pr,
    attore: tipo === "fa" ? chi : undefined,
    aiutoCompagno: tipo === "aiuto" ? chi : undefined,
  };
}

/** Le varianti di una prova con i compagni presenti: con il loro aiuto, o fatta da loro (§33). */
function varianti(g: Gioco, p: Partita, scena: Scena, s: Scelta): VistaScelta[] {
  const out: VistaScelta[] = [];
  const pr = s.prova!;
  for (const id of Object.keys(p.compagni ?? {})) {
    const liv = livelloCompagno(g, id, pr.capacita);
    if (liv < 1) continue; // un compagno aiuta o agisce solo in ciò che sa fare
    const nome = nomePersona(g, id);
    for (const modo of [`aiuto:${id}`, `fa:${id}`]) {
      const spec = specDi(scena, s, modo);
      const attore = spec.attore;
      const pa = vistaDi(g, p, attore);
      const aperta = !s.requisito || vale(g, pa, s.requisito);
      const quadro = quadroProva(g, p, spec);
      const imp = impedimento(g, p, pr.capacita, attore);
      const richiede = !aperta ? s.richiede : imp ?? (!quadro.puoi.aperta ? quadro.puoi.richiede : undefined);
      const testo = attore ? `Lascio fare a ${nome}: «${s.testo}»` : `${s.testo}, con l'aiuto di ${nome}`;
      out.push({ id: `${s.id}@${modo}`, testo, tipo: "prova", disponibile: !richiede && !p.usate[`${scena.id}:${s.id}`], richiede, quadro });
    }
  }
  return out;
}

function sceltaNormale(g: Gioco, p: Partita, scena: Scena, s: Scelta): VistaScelta | null {
  const chiave = `${scena.id}:${s.id}`;
  if (p.usate[chiave] && s.unaVolta) return null;
  if (esaurita(g, p, scena, s)) return null;
  const aperta = !s.requisito || vale(g, p, s.requisito);
  const conv = aperta ? undefined : convinzioneCheChiude(g, p, s.requisito);
  if (!aperta && s.nascondiSeChiusa && !conv) return null;
  const chiusa = (richiede: string | undefined, chiusaDa: VistaScelta["chiusaDa"]) => ({ richiede, chiusaDa });
  const perRequisito = !aperta ? (conv ? chiusa(`è contro ciò che credi: «${conv}»`, "convinzione") : chiusa(s.richiede, "requisito")) : undefined;
  if (s.prova) {
    if (p.usate[chiave]) return { id: s.id, testo: s.testo, tipo: "prova", disponibile: false, richiede: "l'hai già tentata: si poteva fare una volta sola", chiusaDa: "usata" };
    const imp = impedimento(g, p, s.prova.capacita);
    const quadro = quadroProva(g, p, specDi(scena, s));
    const altro = perRequisito ?? (imp ? chiusa(imp, "ferita") : !quadro.puoi.aperta ? chiusa(quadro.puoi.richiede, quadro.riesci.troppoDifficile ? "difficile" : "forza") : undefined);
    const v = varianti(g, p, scena, s);
    return { id: s.id, testo: s.testo, tipo: "prova", disponibile: !altro, ...(altro ?? {}), quadro, ...(v.length ? { varianti: v } : {}) };
  }
  return { id: s.id, testo: s.testo, tipo: "vai", disponibile: aperta, ...(perRequisito ?? {}), ripiego: s.ripiego };
}

function postaAvversario(g: Gioco, avvId: string, grado: Grado): string {
  const avv = g.amb.avversari.find((a) => a.id === avvId)!;
  if (avv.pericolo.arma) {
    const arma = g.amb.armi.find((a) => a.id === avv.pericolo.arma)!;
    if (grado === 0) return `Al coperto: ${arma.nome} non ti raggiunge.`;
    const gr = grado === 1 ? arma.daEsposto : arma.daScoperto;
    return `Se ti colpisce: ${gr === "morte" ? "la vita" : `ferita ${gr}`} (${arma.nome}).`;
  }
  return grado === 2 ? `Se va male: ${avv.pericolo.sociale}.` : "Se va male: si chiude di più.";
}

const PAROLE: Record<string, string[]> = {
  fiducia: ["non si fida di te", "ti ascolta", "si fida di te", "si fiderebbe di te a occhi chiusi"],
  paura: ["", "ha un po' paura di te", "ha paura di te", "è terrorizzato da te"],
  affetto: ["", "ti è affezionato", "ti vuole bene", "rischierebbe per te"],
  rancore: ["", "ce l'ha un po' con te", "ce l'ha con te", "ti odia"],
};

/** Come chi gioca vede una persona, a parole, secondo quanto la conosce (§29). */
export function parolePersona(g: Gioco, p: Partita, id: string): string {
  const st = p.persone[id];
  if (!st) return "";
  const d = (x: string) => st.dim[x as keyof typeof st.dim] ?? 0;
  if (st.livello === 0) {
    if (d("rancore") >= 2) return "ti guarda storto";
    if (d("paura") >= 2) return "sembra temerti";
    if (d("fiducia") >= 2) return "sembra fidarsi di te";
    return "non sai ancora che cosa pensi di te";
  }
  const parti: string[] = [];
  for (const k of ["fiducia", "affetto", "paura", "rancore"]) {
    if (!(k in st.dim)) continue;
    const w = PAROLE[k][Math.max(0, Math.min(3, d(k)))];
    if (w) parti.push(w);
  }
  const deb = d("debito");
  if (deb > 0) parti.push(deb === 1 ? "ti deve un favore" : `ti deve ${deb} favori`);
  if (deb < 0) parti.push(deb === -1 ? "gli devi un favore" : `gli devi ${-deb} favori`);
  if (st.livello >= 2 && tradirebbe(g, p, id)) parti.push("ti tradirebbe, se potesse");
  const f = g.storia.persone.find((x) => x.id === id)?.femminile;
  return f ? parti.join(", ").replace(/affezionato/g, "affezionata").replace(/terrorizzato/g, "terrorizzata") : parti.join(", ");
}

function statoVista(g: Gioco, p: Partita): Vista["stato"] {
  const luogo = luogoDi(g, p);
  const mom = momentoDi(g, p);
  return {
    ora: p.ora,
    momento: mom.nome,
    scadenze: g.storia.scadenze.map((s) => `${s.nome}: ${p.scadenze[s.id]} su ${s.caselle}`),
    logorio: g.amb.logorii.map((l) => `${l.nome}: ${l.stadi[p.logorio[l.id].stadio - 1]}`),
    ferite: p.ferite.map((f) => `${f.nome} (${f.gravita})`),
    statiAnimo: p.statiAnimo.map((s) => g.amb.statiAnimo.find((x) => x.id === s.id)?.nome ?? s.id),
    tracciaQui: p.traccia[luogo.zona] ?? 0,
    cose: Object.entries(p.cose).filter(([, n]) => n > 0).map(([id, n]) => ({ id, nome: nomeCosa(g, id), quante: n, stato: p.statoCose[id] ? STATI_COSA[p.statoCose[id]] : undefined })),
    parole: Object.keys(p.fatti).map((f) => nomeFatto(g, f)),
    notizie: Object.entries(p.notizie).map(([id, stato]) => {
      const def = g.storia.notizie.find((x) => x.id === id);
      const contrasto = stato === "sentita" ? (def?.contrasto ?? []).filter((c) => p.notizie[c] === "sentita").map((c) => testoNotizia(g, c)) : [];
      return { id, testo: testoNotizia(g, id), stato, contrasto };
    }),
    convinzioni: Object.entries(p.convinzioni).map(([id, s]) => ({ id, testo: g.storia.convinzioni.find((x) => x.id === id)?.testo ?? id, inDubbio: s === "in dubbio" })),
    tratti: Object.entries(p.tratti).map(([id, origine]) => {
      const t = g.amb.tratti.find((x) => x.id === id);
      return { id, nome: t?.nome ?? id, effetti: t?.effetti ?? "", origine };
    }),
    persone: g.storia.persone.filter((x) => (p.persone[x.id]?.livello ?? 0) >= 1).map((x) => ({ id: x.id, nome: x.nome, parole: parolePersona(g, p, x.id) })),
    compagni: Object.entries(p.compagni ?? {}).map(([id, c]) => {
      const def = g.storia.persone.find((x) => x.id === id)!.compagno!;
      return {
        id,
        nome: nomePersona(g, id),
        capacita: Object.entries(def.capacita).map(([k, v]) => `${capDi(g, k).nome}: ${nomeLivello(g, v, id)}`),
        tratti: def.tratti.map((t) => g.amb.tratti.find((x) => x.id === t)?.nome ?? t),
        ferite: c.ferite.map((f) => `${f.nome} (${f.gravita})`),
      };
    }),
    capacita: g.amb.capacita.map((c) => `${c.nome}: ${NOMI_LIVELLO[p.livelli[c.id] ?? 0]}`),
    protezioni: Object.entries(p.protezioni).map(([id, s]) => `${g.amb.protezioni.find((x) => x.id === id)?.nome ?? id}: ${STATI_COSA[s]}`),
  };
}

/** Le possibilità del Quasi, con quello che costano (§28.3). */
function scelteQuasi(g: Gioco, p: Partita): VistaScelta[] {
  const q = p.quasi!;
  const su = (gr: Grado) => (gr === 0 ? "+1 Traccia" : gr === 1 ? "+1 Traccia e il prezzo" : "+1 Traccia e il rovescio");
  const segno = (gr: Grado) => (gr === 0 ? "niente" : "+1 Traccia");
  if (q.tipo === "difesa") {
    const avv = g.amb.avversari.find((a) => a.id === p.confronto?.avversario);
    return [
      { id: "quasi:ferita", testo: "Il colpo mi prende di striscio", tipo: "quasi", disponibile: true, costa: "la ferita dell'arma, un grado più lieve" },
      { id: "quasi:perdi", testo: avv?.perdi?.testo ?? "Mi scanso, e perdo terreno", tipo: "quasi", disponibile: true, costa: avv?.perdi ? "nessuna ferita" : "nessuna ferita, +1 Traccia" },
    ];
  }
  const out: VistaScelta[] = [];
  const tutto = q.tipo === "prova" ? "Prendo tutto, anche se mi espongo di più" : q.tipo === "debole" ? "Lo scopro, anche se mi espongo di più" : "Insisto, anche se mi espongo di più";
  out.push({ id: "quasi:tutto", testo: tutto, tipo: "quasi", disponibile: true, costa: su(q.grado) });
  if (q.tipo === "prova") {
    const scena = scenaDi(g, q.scena);
    const s = (scena.scelte ?? []).find((x) => x.id === q.scelta)!;
    const meta = testoMeta(g, scena, s.prova!);
    if (meta) out.push({ id: "quasi:meta", testo: `Mi accontento della metà: ${meta}`, tipo: "quasi", disponibile: true, costa: q.grado === 2 ? "+1 Traccia e il prezzo" : segno(q.grado) });
  }
  out.push({ id: "quasi:lascia", testo: "Lascio perdere, prima che qualcuno se ne accorga", tipo: "quasi", disponibile: true, costa: segno(q.grado) });
  return out;
}

function tranquillo(g: Gioco, p: Partita): boolean {
  return !!luogoDi(g, p).tranquillo && !p.confronto;
}

/** Le scelte che il motore aggiunge da solo: riprovare, mettere insieme, ripensare, combinare. */
function scelteAutomatiche(g: Gioco, p: Partita, scena: Scena): VistaScelta[] {
  const out: VistaScelta[] = [];
  if (p.ritento && p.ritento.verso === scena.id && p.ritento.scena !== scena.id) {
    out.push({ id: "riprova", testo: `Ci riprovo (mi costa ${nomeOre(g, 1)})`, tipo: "riprova", disponibile: true });
  }
  if (tranquillo(g, p)) {
    for (const d of g.storia.deduzioni) {
      if (p.notizie[d.notizia]) continue;
      if (d.da.every((x) => p.notizie[x] && p.notizie[x] !== "smentita")) out.push({ id: `deduci:${d.id}`, testo: `Metto insieme quello che so (${nomeOre(g, 1)})`, tipo: "deduci", disponibile: true });
    }
    for (const c of g.storia.convinzioni) {
      if (p.convinzioni[c.id] !== "salda") continue;
      if (c.dubbioDa.some((x) => p.notizie[x] && p.notizie[x] !== "smentita")) out.push({ id: `ripensa:${c.id}`, testo: `Ci ripenso: «${c.testo}» (${nomeOre(g, 1)})`, tipo: "ripensa", disponibile: true });
    }
  }
  const buio = proprietaAttive(g, p).some((x) => x.def.annullataDa && !x.annullata);
  for (const c of g.storia.combinazioni) {
    if (haCosa(p, c.cosa)) continue;
    // Accendere una luce ha senso solo dove qualcosa la luce annulla: il buio.
    if (g.storia.cose.find((o) => o.id === c.cosa)?.proprieta?.includes("luce") && !buio) continue;
    if (c.da.every((x) => haCosa(p, x))) out.push({ id: `combina:${c.id}`, testo: c.ore > 0 ? `${c.testo} (${nomeOre(g, c.ore)})` : c.testo, tipo: "combina", disponibile: true });
  }
  return out;
}

export function vista(g: Gioco, p: Partita): Vista {
  const scena = scenaDi(g, p.scena);
  const luogo = luogoDi(g, p);
  const mom = momentoDi(g, p);
  const scelte: VistaScelta[] = [];
  let confronto: Vista["confronto"];
  let sospeso: Vista["sospeso"];

  if (!p.finita && scena.confronto && p.confronto) {
    const c = p.confronto;
    const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
    confronto = { avversario: avv.nome, natura: avv.natura === "avanza" ? "chi avanza" : "chi si chiude", copertura: nomeGrado(c.esposizione), finestra: c.esposizione === 2 && !c.inDifesa, inDifesa: c.inDifesa };
  }

  if (p.finita) {
    /* niente scelte */
  } else if (p.quasi) {
    sospeso = { tipo: "quasi", testo: "Ti è mancato poco. Scegli tu come va a finire." };
    scelte.push(...scelteQuasi(g, p));
  } else if (p.ripensa) {
    const c = g.storia.convinzioni.find((x) => x.id === p.ripensa)!;
    sospeso = { tipo: "ripensa", testo: `Ci ripensi: «${c.testo}»` };
    scelte.push({ id: "ripensa:lascia", testo: c.lasciare.testo, tipo: "ripensa", disponibile: true });
    scelte.push({ id: "ripensa:tieni", testo: c.tenere.testo, tipo: "ripensa", disponibile: true });
  } else if (scena.confronto && p.confronto) {
    const c = p.confronto;
    const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
    if (c.inDifesa) {
      for (const capId of g.amb.difesa) {
        const cap = capDi(g, capId);
        const imp = impedimento(g, p, capId);
        const quadro = quadroProva(g, p, { azione: `Mi difendo (${cap.nome})`, capacita: capId, soglia: avv.sogliaDifesa!, posta: postaAvversario(g, avv.id, c.ultimoGrado), chiave: `${scena.id}:difesa`, gradoFisso: { testo: "il grado della tua ultima azione", grado: c.ultimoGrado } });
        scelte.push({ id: `difesa:${capId}`, testo: `Mi difendo: ${cap.nome}`, tipo: "difesa", disponibile: !imp, richiede: imp, chiusaDa: imp ? "ferita" : undefined, quadro });
      }
      // Se nessuna difesa è possibile, il colpo arriva: chi gioca lo vede e lo accetta, non resta bloccato.
      if (!scelte.some((s) => s.disponibile)) {
        scelte.push({ id: "subisci", testo: `Non posso difendermi: subisco il colpo. ${postaAvversario(g, avv.id, c.ultimoGrado)}`, tipo: "difesa", disponibile: true });
      }
    } else if (c.esposizione === 2) {
      for (const f of scena.confronto.fini) scelte.push({ id: `fine:${f.id}`, testo: f.testo, tipo: "finestra", disponibile: true });
    } else {
      for (const pd of avv.puntiDeboli) {
        const aperta = !pd.requisito || vale(g, p, pd.requisito);
        if (!aperta && !pd.richiede) continue;
        const imp = impedimento(g, p, pd.capacita);
        const posta = `${postaAvversario(g, avv.id, 2)} Se riesci, lo scopri di ${pd.gradi === 1 ? "un grado" : "due gradi"}.`;
        const quadro = quadroProva(g, p, { azione: pd.testo, capacita: pd.capacita, soglia: pd.soglia, persona: avv.persona, posta, chiave: `${scena.id}:debole:${pd.id}` });
        scelte.push({ id: `debole:${pd.id}`, testo: pd.testo, tipo: "prova", disponibile: aperta && !imp, richiede: aperta ? imp : pd.richiede, chiusaDa: !aperta ? "requisito" : imp ? "ferita" : undefined, quadro });
      }
      const parl = scena.confronto.parlare;
      if (parl && !c.parlato) {
        const aperta = !parl.requisito || vale(g, p, parl.requisito);
        const quadro = quadroProva(g, p, { azione: parl.testo, capacita: parl.capacita, soglia: parl.soglia, persona: avv.persona, posta: "Se non riesci, questa porta si chiude per tutto il confronto.", chiave: `${scena.id}:parlare`, unColpoSolo: true });
        scelte.push({ id: "parlare", testo: parl.testo, tipo: "parlare", disponibile: aperta, richiede: aperta ? undefined : parl.richiede, chiusaDa: aperta ? undefined : "requisito", quadro });
      }
      scelte.push({ id: "andarsene", testo: scena.confronto.andarsene.testo, tipo: "andarsene", disponibile: true, ripiego: true });
    }
  } else {
    scelte.push(...scelteAutomatiche(g, p, scena).filter((s) => s.id === "riprova"));
    for (const s of scena.scelte ?? []) {
      const v = sceltaNormale(g, p, scena, s);
      if (v) scelte.push(v);
    }
    scelte.push(...scelteAutomatiche(g, p, scena).filter((s) => s.id !== "riprova"));
  }

  return {
    scena: { id: scena.id, titolo: scena.titolo, testo: testoDi(g, p, scena.testo), luogo: luogo.nome, momento: mom.nome, presentazione: scena.presentazione },
    stato: statoVista(g, p),
    confronto,
    sospeso,
    scelte,
    finale: p.finita?.tipo,
  };
}

// ---------------------------------------------------------------------------
// Agire
// ---------------------------------------------------------------------------

function tira(p: Partita, q: Quadro, eventi: Evento[]): Fascia {
  const r = q.riesci;
  const t = tiraDueDadi(p.rng);
  p.rng = t.stato;
  const totale = t.totale + r.bonus;
  const margine = totale - r.soglia;
  const f = fasciaDi(margine);
  const b = r.bonus >= 0 ? `+ ${r.bonus}` : `− ${-r.bonus}`;
  eventi.push({
    tipo: "tiro",
    testo: `${q.azione}: ${t.dadi[0]} + ${t.dadi[1]} ${b} = ${totale} contro ${r.soglia}. ${NOMI_FASCIA[f]}, ${NOMI_GRADO[q.grado].toLowerCase()}.`,
    dati: { dadi: t.dadi, bonus: r.bonus, totale, soglia: r.soglia, margine, fascia: f, grado: q.grado },
  });
  return f;
}

function esito(eventi: Evento[], fascia: Fascia, grado: Grado, come: string): void {
  eventi.push({ tipo: "esito", testo: `${NOMI_FASCIA[fascia]}, ${NOMI_GRADO_MINUSCOLI[grado]}: ${come}.`, dati: { fascia, grado, come } });
}

function consumaPreparazioni(g: Gioco, p: Partita): void {
  p.preparazioni = p.preparazioni.filter((x) => g.amb.preparazioni.find((d) => d.id === x.id)?.durata !== "prova");
}

function mostraCrescita(g: Gioco, p: Partita, capacita: string, tentativi: number, fascia: Fascia, eventi: Evento[]): void {
  const prima = p.primaVolta[capacita];
  if (prima === undefined) p.primaVolta[capacita] = { tentativi, fascia };
  else {
    const nome = capDi(g, capacita).nome;
    const t = (n: number) => (n === 1 ? "al primo tentativo" : `al tentativo numero ${n}`);
    eventi.push({ tipo: "crescita", testo: `${nome}: ${NOMI_FASCIA[fascia].toLowerCase()}, ${t(tentativi)}. La prima volta: ${NOMI_FASCIA[prima.fascia].toLowerCase()}, ${t(prima.tentativi)}.` });
  }
}

/** Il costo di chi ottiene ciò che voleva, al grado dato (§28.6). */
function costoOttenuto(g: Gioco, p: Partita, grado: Grado, pr: Prova | undefined, eventi: Evento[]): number {
  let tempo = 0;
  if (grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
  if (grado === 2) {
    if (pr?.prezzo) {
      eventi.push({ tipo: "esito", testo: `Il prezzo: ${pr.prezzo.testo}` });
      tempo += applica(g, p, pr.prezzo.effetti, eventi);
    } else tempo += prezzoPredefinito(g, p, eventi);
  }
  return tempo;
}

/** Il rovescio (§28.5): Traccia, logorio, il travestimento perso, gli effetti della scena. Le ferite vanno a chi ha agito. */
function rovescio(g: Gioco, p: Partita, capacita: string, pr: Prova, usati: string[], eventi: Evento[], attore?: string): number {
  const cap = capDi(g, capacita);
  let tempo = 0;
  aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
  if (!attore) for (const l of g.amb.logorii) if (l.saleCon.includes("rovescio") && l.ambiti.includes(cap.ambito)) tempo += applica(g, p, [{ logorio: l.id, piu: 1 }], eventi);
  for (const def of g.amb.preparazioni) if (def.durata === "cosa" && def.cosa && haCosa(p, def.cosa)) tempo += applica(g, p, [{ cosa: def.cosa, piu: -1 }], eventi);
  for (const id of usati) rompi(g, p, id, eventi);
  const effetti = pr.rovescio?.effetti ?? [];
  if (attore) {
    for (const e of effetti) if ("ferita" in e) ferisciCompagno(g, p, attore, e.ferita.nome, e.ferita.gravita, e.ferita.ambito, eventi);
    tempo += applica(g, p, effetti.filter((e) => !("ferita" in e)), eventi);
  } else tempo += applica(g, p, effetti, eventi);
  return tempo;
}

/** Il prezzo di un aiuto (§30.3): un favore, e il rancore di chi ci finisce dentro con te. */
function dopoAiuto(g: Gioco, p: Partita, pr: Prova, rovesciata: boolean, eventi: Evento[], modo?: string): void {
  const [tipo, chi] = (modo ?? "").split(":");
  const aiutante = tipo === "aiuto" ? chi : pr.aiuto;
  if (aiutante && puoAiutare(p, aiutante)) {
    cambiaPersona(g, p, aiutante, { debito: -1 }, eventi, "ti ha aiutato");
    if (rovesciata) cambiaPersona(g, p, aiutante, { rancore: 1 }, eventi, "ci è finito dentro con te");
  }
  if (tipo === "fa" && rovesciata) cambiaPersona(g, p, chi, { rancore: 1 }, eventi, "ha pagato al posto tuo");
}

type Uscita = { verso: string; tempo: number };

/** Una prova fuori dal confronto: il tiro, la fascia, il costo (§28). */
function risolviProva(g: Gioco, p: Partita, scena: Scena, s: Scelta, eventi: Evento[], modo?: string): Uscita {
  const pr = s.prova!;
  const chiave = `${scena.id}:${s.id}`;
  const spec = specDi(scena, s, modo);
  const attore = spec.attore;
  const q = quadroProva(g, p, spec);
  const cap = capDi(g, pr.capacita);
  const usati = attrezzi(g, p, cap.id, voceDi(g, pr.soglia).generi ?? []);
  p.tentativi[chiave] = (p.tentativi[chiave] ?? 0) + 1;
  const fascia: Fascia = q.riesci.nonSiTira ? "riesci" : tira(p, q, eventi);
  if (q.riesci.nonSiTira) eventi.push({ tipo: "tiro", testo: `${s.testo}: è sotto Facile, non si tira.` });
  consumaPreparazioni(g, p);
  if (pr.unColpoSolo) p.usate[chiave] = true;
  if (g.amb.sociali.paura.includes(cap.id) && pr.persona && (fascia === "pieno" || fascia === "riesci")) cambiaPersona(g, p, pr.persona, { paura: 1, rancore: 1 }, eventi, "l'hai minacciato");

  if (fascia === "quasi") {
    p.quasi = { tipo: "prova", modo, scena: scena.id, scelta: s.id, grado: q.grado, capacita: cap.id, chiave };
    esito(eventi, fascia, q.grado, "scegli tu");
    return { verso: scena.id, tempo: 0 };
  }

  if (fascia === "pieno" || fascia === "riesci") {
    let tempo = 0;
    if (!attore) {
      tacca(g, p, cap.id, eventi);
      mostraCrescita(g, p, cap.id, p.tentativi[chiave], fascia, eventi);
    }
    delete p.tentativi[chiave];
    esito(eventi, fascia, q.grado, attore ? `${nomePersona(g, attore)} ci riesce` : "ottieni ciò che volevi");
    tempo += costoOttenuto(g, p, q.grado, pr, eventi);
    if (fascia === "pieno") tempo -= dono(g, p, pr, s, eventi);
    dopoAiuto(g, p, pr, false, eventi, modo);
    tempo += applica(g, p, pr.riesci.effetti, eventi);
    return { verso: pr.riesci.vai, tempo };
  }

  // Non riesci: la notizia, a ogni grado (§28.4).
  let tempo = 0;
  esito(eventi, fascia, q.grado, q.grado === 2 ? "il rovescio" : q.grado === 1 ? "non ottieni, e la scena si complica" : "non ottieni, ma impari qualcosa");
  tempo += applica(g, p, [{ notizia: pr.nonRiesci.notizia }], eventi);
  for (const st of [...p.statiAnimo]) if (g.amb.statiAnimo.find((x) => x.id === st.id)?.passa.alPrimoNonRiesci) passaStatoAnimo(g, p, st.id, eventi);
  for (const id of usati) if (g.storia.cose.find((o) => o.id === id)?.fragile) rompi(g, p, id, eventi);
  if (q.grado === 2) {
    if (!pr.rovescio) throw new Error(`La prova ${chiave} è allo scoperto e non ha un rovescio.`);
    tempo += rovescio(g, p, cap.id, pr, usati, eventi, attore);
    dopoAiuto(g, p, pr, true, eventi, modo);
    return { verso: pr.rovescio.vai, tempo };
  }
  if (q.grado === 1) {
    aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    tempo += complicazione(g, p, eventi);
  }
  tempo += applica(g, p, pr.nonRiesci.effetti, eventi);
  dopoAiuto(g, p, pr, false, eventi, modo);
  if (!pr.unColpoSolo) p.ritento = { scena: scena.id, scelta: s.id, verso: pr.nonRiesci.vai };
  return { verso: pr.nonRiesci.vai, tempo };
}

/** Il dono di In pieno (§28.1). Restituisce le ore risparmiate. */
function dono(g: Gioco, p: Partita, pr: Prova, s: Scelta, eventi: Evento[]): number {
  if (pr.dono) {
    eventi.push({ tipo: "esito", testo: `In più: ${pr.dono.testo}` });
    applica(g, p, pr.dono.effetti, eventi);
    return 0;
  }
  if (!p.notizie[pr.nonRiesci.notizia]) {
    eventi.push({ tipo: "esito", testo: "In più: vedi anche ciò che avresti scoperto non riuscendo." });
    applica(g, p, [{ notizia: pr.nonRiesci.notizia }], eventi);
    return 0;
  }
  const ore = (s.effetti ?? []).reduce((n, e) => n + ("tempo" in e ? e.tempo : 0), 0);
  if (ore > 0) {
    eventi.push({ tipo: "esito", testo: "In più: fai presto, e risparmi un'ora." });
    return 1;
  }
  return 0;
}

/** La scelta di chi gioca dopo un Quasi (§28.3). */
function risolviQuasi(g: Gioco, p: Partita, id: string, eventi: Evento[]): Uscita {
  const q = p.quasi!;
  delete p.quasi;
  const scena = scenaDi(g, q.scena);
  const resta = { verso: scena.id, tempo: 0 };

  if (q.tipo === "difesa") return risolviQuasiDifesa(g, p, id, eventi);
  if (q.tipo === "debole" || q.tipo === "parlare") {
    const c = p.confronto!;
    const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
    if (id === "quasi:lascia") {
      esito(eventi, "quasi", q.grado, "lasci perdere");
      if (q.grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
      if (avv.natura === "avanza") reazione(g, p, scena, false, eventi);
      return resta;
    }
    const su = Math.min(2, q.grado + 1) as Grado;
    esito(eventi, "quasi", q.grado, `ci riesci, ma adesso sei ${NOMI_GRADO_MINUSCOLI[su]}`);
    c.ultimoGrado = su;
    aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    tacca(g, p, q.capacita, eventi);
    if (q.tipo === "parlare") {
      const parl = scena.confronto!.parlare!;
      return { verso: parl.riesci.vai, tempo: applica(g, p, parl.riesci.effetti, eventi) };
    }
    const pd = avv.puntiDeboli.find((x) => `${scena.id}:debole:${x.id}` === q.chiave)!;
    return scopri(g, p, scena, pd.gradi, eventi);
  }

  const s = (scena.scelte ?? []).find((x) => x.id === q.scelta)!;
  const pr = s.prova!;
  const usati: string[] = [];
  const attore = q.modo?.startsWith("fa:") ? q.modo.slice(3) : undefined;
  if (id === "quasi:tutto") {
    if (!attore) tacca(g, p, q.capacita, eventi);
    delete p.tentativi[q.chiave];
    dopoAiuto(g, p, pr, q.grado === 2, eventi, q.modo);
    if (q.grado < 2) {
      const su = (q.grado + 1) as Grado;
      esito(eventi, "quasi", q.grado, `prendi tutto, ma adesso sei ${NOMI_GRADO_MINUSCOLI[su]}`);
      let tempo = costoOttenuto(g, p, su, pr, eventi);
      tempo += applica(g, p, pr.riesci.effetti, eventi);
      return { verso: pr.riesci.vai, tempo };
    }
    esito(eventi, "quasi", q.grado, "prendi tutto, e arriva il rovescio lo stesso");
    const dentro = (scenaDi(g, pr.riesci.vai).entrando ?? []).filter((e) => !("tempo" in e));
    let tempo = applica(g, p, [...(pr.riesci.effetti ?? []), ...dentro], eventi);
    tempo += rovescio(g, p, q.capacita, pr, usati, eventi, attore);
    return { verso: pr.rovescio!.vai, tempo };
  }
  if (id === "quasi:meta") {
    const m = pr.meta;
    if (!m) throw new Error("Questa prova non ha una metà.");
    esito(eventi, "quasi", q.grado, "ti accontenti della metà");
    delete p.tentativi[q.chiave];
    let tempo = costoOttenuto(g, p, q.grado, pr, eventi);
    if ("ripiego" in m) {
      const r = (scena.scelte ?? []).find((x) => x.id === m.ripiego)!;
      return { verso: r.vai ?? scena.id, tempo };
    }
    tempo += applica(g, p, m.effetti, eventi);
    return { verso: m.vai, tempo };
  }
  if (id === "quasi:lascia") {
    esito(eventi, "quasi", q.grado, "lasci perdere");
    if (q.grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    return resta;
  }
  throw new Error(`Scelta del Quasi inesistente: ${id}`);
}

function risolviQuasiDifesa(g: Gioco, p: Partita, id: string, eventi: Evento[]): Uscita {
  const c = p.confronto!;
  const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
  const arma = g.amb.armi.find((a) => a.id === avv.pericolo.arma)!;
  const resta = { verso: c.scena, tempo: 0 };
  if (id === "quasi:ferita") {
    const gr = c.ultimoGrado === 1 ? arma.daEsposto : arma.daScoperto;
    const lieve = { morte: "mortale", mortale: "grave", grave: "lieve", lieve: null }[gr] as "mortale" | "grave" | "lieve" | null;
    esito(eventi, "quasi", c.ultimoGrado, "il colpo ti prende di striscio");
    if (lieve) ferisci(g, p, `un colpo di striscio (${arma.nome})`, lieve, arma.colpisce, arma.tipo, eventi, arma.segno);
    else eventi.push({ tipo: "ferita", testo: "Il colpo ti sfiora appena." });
    return resta;
  }
  if (id === "quasi:perdi") {
    esito(eventi, "quasi", c.ultimoGrado, "eviti la ferita, e perdi qualcosa");
    if (avv.perdi) {
      eventi.push({ tipo: "esito", testo: avv.perdi.testo });
      return { verso: c.scena, tempo: applica(g, p, avv.perdi.effetti, eventi) };
    }
    aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    return resta;
  }
  throw new Error(`Scelta del Quasi inesistente: ${id}`);
}

/** L'avversario si scopre di `gradi`: se arriva allo scoperto si apre la finestra, altrimenti reagisce. */
function scopri(g: Gioco, p: Partita, scena: Scena, gradi: number, eventi: Evento[]): Uscita {
  const c = p.confronto!;
  const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
  c.esposizione = Math.min(2, c.esposizione + gradi) as Grado;
  eventi.push({ tipo: "confronto", testo: `${avv.nome} è ${nomeGrado(c.esposizione)}.` });
  if (c.esposizione === 2) eventi.push({ tipo: "confronto", testo: "Si apre la finestra: decidi tu come finisce." });
  else reazione(g, p, scena, false, eventi);
  return { verso: scena.id, tempo: 0 };
}

/** La reazione dell'avversario dopo la tua azione (§32). */
function reazione(g: Gioco, p: Partita, scena: Scena, fallita: boolean, eventi: Evento[]): void {
  const c = p.confronto!;
  const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
  if (avv.natura === "si-chiude") {
    if (fallita && c.esposizione > c.partenza) {
      c.esposizione = (c.esposizione - 1) as Grado;
      eventi.push({ tipo: "confronto", testo: `${avv.nome} si ricopre: ora è ${nomeGrado(c.esposizione)}.` });
    }
    if (fallita && c.ultimoGrado === 2) {
      if (avv.pericolo.arma) {
        c.inDifesa = true;
        eventi.push({ tipo: "confronto", testo: `${avv.nome} ti attacca.` });
      } else if (avv.pericolo.sociale && scena.confronto?.seTiPrende) {
        eventi.push({ tipo: "confronto", testo: `${avv.nome}: ${avv.pericolo.sociale}.` });
        p.deviazione = scena.confronto.seTiPrende;
      }
    }
  } else {
    if (c.esposizione < 2) c.esposizione = (c.esposizione + 1) as Grado;
    eventi.push({ tipo: "confronto", testo: `${avv.nome} si avvicina: ora è ${nomeGrado(c.esposizione)}.` });
    if (c.esposizione >= 1 && avv.pericolo.arma) {
      c.inDifesa = true;
      eventi.push({ tipo: "confronto", testo: `${avv.nome} ti è addosso e colpisce.` });
    }
  }
}

function agisciConfronto(g: Gioco, p: Partita, scena: Scena, id: string, eventi: Evento[]): Uscita | null {
  const c = p.confronto!;
  const conf = scena.confronto!;
  const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
  const resta = { verso: scena.id, tempo: 0 };

  if (id.startsWith("difesa:") || id === "subisci") {
    if (!c.inDifesa) throw new Error("Non c'è niente da cui difendersi.");
    const capId = id.slice(7);
    const v = vista(g, p).scelte.find((x) => x.id === id);
    if (!v || !v.disponibile || (id !== "subisci" && !v.quadro)) throw new Error(`Difesa non disponibile: ${capId}`);
    const f: Fascia = id === "subisci" ? "non" : tira(p, v.quadro!, eventi);
    c.inDifesa = false;
    const arma = g.amb.armi.find((a) => a.id === avv.pericolo.arma)!;
    if (c.ultimoGrado === 0) {
      esito(eventi, f, 0, "al coperto il colpo non ti raggiunge");
      return resta;
    }
    if (f === "pieno" || f === "riesci") {
      tacca(g, p, capId, eventi);
      esito(eventi, f, c.ultimoGrado, f === "pieno" ? "eviti il colpo, e lui resta sbilanciato" : "eviti il colpo");
      aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
      if (f === "pieno") return scopri(g, p, scena, 1, eventi);
      return resta;
    }
    if (f === "quasi") {
      p.quasi = { tipo: "difesa", scena: scena.id, scelta: id, grado: c.ultimoGrado, capacita: capId, chiave: `${scena.id}:difesa` };
      esito(eventi, f, c.ultimoGrado, "scegli tu");
      return resta;
    }
    const gr = c.ultimoGrado === 1 ? arma.daEsposto : arma.daScoperto;
    esito(eventi, f, c.ultimoGrado, "il colpo ti prende");
    ferisci(g, p, `un colpo (${arma.nome})`, gr, arma.colpisce, arma.tipo, eventi, arma.segno);
    aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    return resta;
  }

  if (id.startsWith("fine:")) {
    if (c.esposizione !== 2 || c.inDifesa) throw new Error("La finestra non è aperta.");
    const f = conf.fini.find((x) => `fine:${x.id}` === id);
    if (!f) throw new Error(`Fine inesistente: ${id}`);
    return { verso: f.vai, tempo: applica(g, p, f.effetti, eventi) };
  }

  if (c.inDifesa) throw new Error("Prima devi difenderti.");
  if (c.esposizione === 2) throw new Error("La finestra è aperta: scegli come finisce.");

  if (id === "andarsene") return { verso: conf.andarsene.vai, tempo: applica(g, p, conf.andarsene.effetti, eventi) };

  if (id === "parlare") {
    const parl = conf.parlare;
    if (!parl || c.parlato) throw new Error("Non puoi più parlare.");
    if (parl.requisito && !vale(g, p, parl.requisito)) throw new Error("Scelta chiusa.");
    const q = quadroProva(g, p, { azione: parl.testo, capacita: parl.capacita, soglia: parl.soglia, persona: avv.persona, posta: "", chiave: `${scena.id}:parlare`, unColpoSolo: true });
    c.parlato = true;
    c.ultimoGrado = q.grado;
    const f = tira(p, q, eventi);
    consumaPreparazioni(g, p);
    if (f === "quasi") {
      p.quasi = { tipo: "parlare", scena: scena.id, scelta: "parlare", grado: q.grado, capacita: parl.capacita, chiave: `${scena.id}:parlare` };
      esito(eventi, f, q.grado, "scegli tu");
      return resta;
    }
    if (q.grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    if (f === "pieno" || f === "riesci") {
      esito(eventi, f, q.grado, "ti ascolta");
      tacca(g, p, parl.capacita, eventi);
      return { verso: parl.riesci.vai, tempo: applica(g, p, parl.riesci.effetti, eventi) };
    }
    esito(eventi, f, q.grado, "non ti ascolta, e non ti ascolterà più");
    reazione(g, p, scena, true, eventi);
    return resta;
  }

  if (id.startsWith("debole:")) {
    const pd = avv.puntiDeboli.find((x) => `debole:${x.id}` === id);
    if (!pd) throw new Error(`Punto debole inesistente: ${id}`);
    if (pd.requisito && !vale(g, p, pd.requisito)) throw new Error("Scelta chiusa.");
    if (impedimento(g, p, pd.capacita)) throw new Error("Una ferita te lo impedisce.");
    const chiave = `${scena.id}:${id}`;
    const q = quadroProva(g, p, { azione: pd.testo, capacita: pd.capacita, soglia: pd.soglia, persona: avv.persona, posta: "", chiave });
    c.ultimoGrado = q.grado;
    const f = tira(p, q, eventi);
    consumaPreparazioni(g, p);
    if (f === "quasi") {
      p.quasi = { tipo: "debole", scena: scena.id, scelta: id, grado: q.grado, capacita: pd.capacita, chiave };
      esito(eventi, f, q.grado, "scegli tu");
      return resta;
    }
    if (q.grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    if (f === "pieno" || f === "riesci") {
      tacca(g, p, pd.capacita, eventi);
      esito(eventi, f, q.grado, f === "pieno" ? "lo scopri più di quanto speravi" : "lo scopri");
      return scopri(g, p, scena, pd.gradi + (f === "pieno" ? 1 : 0), eventi);
    }
    esito(eventi, f, q.grado, "non lo scopri");
    reazione(g, p, scena, true, eventi);
    return resta;
  }
  return null;
}

function entra(g: Gioco, p: Partita, verso: string, eventi: Evento[]): void {
  const primaLuogo = luogoDi(g, p).id;
  p.scena = verso;
  const scena = scenaDi(g, verso);
  if (scena.luogo !== primaLuogo) p.preparazioni = p.preparazioni.filter((x) => !x.luogo);
  p.taccheScena = {};
  if (p.ritento && p.ritento.verso !== verso && p.ritento.scena !== verso) delete p.ritento;
  if (scena.confronto) {
    const avv = g.amb.avversari.find((a) => a.id === scena.confronto!.avversario)!;
    if (!p.confronto || p.confronto.scena !== verso) {
      p.confronto = { scena: verso, avversario: avv.id, esposizione: avv.copertura, partenza: avv.copertura, ultimoGrado: 0, parlato: false, inDifesa: false };
    }
  } else delete p.confronto;
  if (luogoDi(g, p).tranquillo) {
    for (const st of [...p.statiAnimo]) if (g.amb.statiAnimo.find((x) => x.id === st.id)?.passa.inLuogoTranquillo) passaStatoAnimo(g, p, st.id, eventi);
  }
  const tempo = applica(g, p, scena.entrando, eventi);
  if (tempo) avanza(g, p, tempo, eventi);
  if (scena.finale) p.finita = { tipo: scena.finale.tipo };
}

function agisciAutomatica(g: Gioco, p: Partita, scena: Scena, id: string, eventi: Evento[]): Uscita | null {
  const v = scelteAutomatiche(g, p, scena).find((x) => x.id === id);
  if (!v) return null;
  if (id === "riprova") return { verso: p.ritento!.scena, tempo: 0 };
  if (id.startsWith("deduci:")) {
    const d = g.storia.deduzioni.find((x) => `deduci:${x.id}` === id)!;
    eventi.push({ tipo: "notizia", testo: d.testo });
    applica(g, p, [{ notizia: d.notizia }], eventi);
    return { verso: scena.id, tempo: 1 };
  }
  if (id.startsWith("ripensa:")) {
    p.ripensa = id.slice(8);
    return { verso: scena.id, tempo: 1 };
  }
  if (id.startsWith("combina:")) {
    const c = g.storia.combinazioni.find((x) => `combina:${x.id}` === id)!;
    for (const x of c.consuma ?? []) applica(g, p, [{ cosa: x, piu: -1 }], eventi);
    applica(g, p, [{ cosa: c.cosa, piu: 1 }], eventi);
    return { verso: scena.id, tempo: c.ore };
  }
  return null;
}

function risolviRipensa(g: Gioco, p: Partita, id: string, eventi: Evento[]): Uscita {
  const c = g.storia.convinzioni.find((x) => x.id === p.ripensa)!;
  delete p.ripensa;
  if (id === "ripensa:lascia") {
    delete p.convinzioni[c.id];
    eventi.push({ tipo: "convinzione", testo: `Non ci credi più: «${c.testo}»` });
    return { verso: p.scena, tempo: applica(g, p, c.lasciare.effetti, eventi) };
  }
  if (id === "ripensa:tieni") {
    p.convinzioni[c.id] = "in dubbio";
    eventi.push({ tipo: "convinzione", testo: `Ci credi ancora: ${c.testo}` });
    return { verso: p.scena, tempo: applica(g, p, c.tenere.effetti, eventi) };
  }
  throw new Error(`Scelta inesistente: ${id}`);
}

/** Risolve una scelta. Non modifica la partita ricevuta: ne restituisce una nuova. */
export function agisci(g: Gioco, p0: Partita, sceltaId: string): { partita: Partita; eventi: Evento[] } {
  const p = clona(p0);
  p.compagni ??= {};
  const eventi: Evento[] = [];
  if (p.finita) throw new Error("La partita è finita.");
  const scena = scenaDi(g, p.scena);
  let uscita: Uscita | null = null;

  if (p.quasi) {
    if (!sceltaId.startsWith("quasi:")) throw new Error("Prima scegli come va a finire il Quasi.");
    uscita = risolviQuasi(g, p, sceltaId, eventi);
  } else if (p.ripensa) {
    uscita = risolviRipensa(g, p, sceltaId, eventi);
  } else if (scena.confronto && p.confronto) {
    uscita = agisciConfronto(g, p, scena, sceltaId, eventi);
  }

  if (!uscita) uscita = agisciAutomatica(g, p, scena, sceltaId, eventi);

  if (!uscita) {
    const [base, modo] = sceltaId.split("@");
    const s = (scena.scelte ?? []).find((x) => x.id === base);
    if (!s) throw new Error(`Scelta inesistente: ${sceltaId}`);
    const v0 = sceltaNormale(g, p, scena, s);
    const v = modo ? v0?.varianti?.find((x) => x.id === sceltaId) : v0;
    if (!v || !v.disponibile) throw new Error(`Scelta non disponibile: ${sceltaId}`);
    if (s.unaVolta) p.usate[`${scena.id}:${s.id}`] = true;
    if (s.prova) {
      // Ritentare costa un'ora, prima di tirare (§22).
      if ((p.tentativi[`${scena.id}:${s.id}`] ?? 0) > 0) {
        avanza(g, p, 1, eventi);
        if (p.deviazione) {
          const d = p.deviazione;
          delete p.deviazione;
          entra(g, p, d, eventi);
          reagisci(g, p, eventi);
          return { partita: p, eventi };
        }
      }
      const tempoScelta = applica(g, p, s.effetti, eventi);
      uscita = risolviProva(g, p, scena, s, eventi, modo);
      uscita.tempo += tempoScelta;
    } else {
      uscita = { verso: s.vai ?? scena.id, tempo: applica(g, p, s.effetti, eventi) };
    }
  }

  if (uscita.tempo > 0) avanza(g, p, uscita.tempo, eventi);
  let verso = uscita.verso;
  if (p.deviazione) {
    verso = p.deviazione;
    delete p.deviazione;
    delete p.quasi;
  }
  if (verso !== p.scena) entra(g, p, verso, eventi);
  else if (p.deviazione) {
    const d = p.deviazione;
    delete p.deviazione;
    entra(g, p, d, eventi);
  }
  reagisci(g, p, eventi);
  return { partita: p, eventi };
}

export { nuovaPartita, prepara } from "./stato.ts";
