/**
 * I controlli del §47 del documento di design 3.0, e quelli strutturali che servono
 * perché i dati si possano giocare: rimandi esistenti, scene raggiungibili, nessun
 * vicolo cieco. Ogni rilievo dice quale controllo viola e dove.
 */

import type { Ambientazione, Condizione, Effetto, Scelta, Scena, Storia, Testo } from "./tipi.ts";

export interface Rilievo {
  controllo: string;
  grave: boolean;
  dove: string;
  testo: string;
}

function* condizioni(c: Condizione | undefined): Generator<Condizione> {
  if (!c) return;
  yield c;
  if ("tutte" in c) for (const x of c.tutte) yield* condizioni(x);
  if ("una" in c) for (const x of c.una) yield* condizioni(x);
  if ("non" in c) yield* condizioni(c.non);
}

/** Le condizioni che valgono «in positivo»: fuori da ogni `non`. */
function* positive(c: Condizione | undefined): Generator<Condizione> {
  if (!c) return;
  if ("non" in c) return;
  yield c;
  if ("tutte" in c) for (const x of c.tutte) yield* positive(x);
  if ("una" in c) for (const x of c.una) yield* positive(x);
}

function condizioniDelTesto(t: Testo): Condizione[] {
  return typeof t === "string" ? [] : t.flatMap((b) => (b.se ? [...condizioni(b.se)] : []));
}

function effettiDellaScena(s: Scena): Effetto[] {
  const e: Effetto[] = [...(s.entrando ?? [])];
  for (const c of s.scelte ?? []) {
    e.push(...(c.effetti ?? []));
    const p = c.prova;
    if (!p) continue;
    e.push(...(p.riesci.effetti ?? []), ...(p.nonRiesci.effetti ?? []), ...(p.rovescio?.effetti ?? []), ...(p.prezzo?.effetti ?? []), ...(p.dono?.effetti ?? []));
    if (p.meta && !("ripiego" in p.meta)) e.push(...(p.meta.effetti ?? []));
    e.push({ notizia: p.nonRiesci.notizia });
  }
  if (s.confronto) {
    e.push(...s.confronto.andarsene.effetti, ...(s.confronto.parlare?.riesci.effetti ?? []));
    for (const f of s.confronto.fini) e.push(...(f.effetti ?? []));
  }
  return e;
}

function destinazioni(s: Scena): string[] {
  const d: string[] = [];
  for (const c of s.scelte ?? []) {
    if (c.vai) d.push(c.vai);
    const p = c.prova;
    if (p) {
      d.push(p.riesci.vai, p.nonRiesci.vai);
      if (p.rovescio) d.push(p.rovescio.vai);
      if (p.meta && !("ripiego" in p.meta)) d.push(p.meta.vai);
    }
  }
  if (s.confronto) {
    d.push(s.confronto.andarsene.vai, ...s.confronto.fini.map((f) => f.vai));
    if (s.confronto.parlare) d.push(s.confronto.parlare.riesci.vai);
    if (s.confronto.seTiPrende) d.push(s.confronto.seTiPrende);
  }
  return d;
}

export function controlla(amb: Ambientazione, storia: Storia): Rilievo[] {
  const r: Rilievo[] = [];
  const err = (controllo: string, dove: string, testo: string) => r.push({ controllo, grave: true, dove, testo });
  const avviso = (controllo: string, dove: string, testo: string) => r.push({ controllo, grave: false, dove, testo });

  const ambiti = new Set(amb.ambiti.map((a) => a.id));
  const capacita = new Map(amb.capacita.map((c) => [c.id, c]));
  const catalogo = new Map(amb.catalogo.map((s) => [s.id, s]));
  const luoghi = new Set(amb.luoghi.map((l) => l.id));
  const proprieta = new Map(amb.proprieta.map((p) => [p.id, p]));
  const tratti = new Map(amb.tratti.map((t) => [t.id, t]));
  const notizie = new Map(storia.notizie.map((n) => [n.id, n]));
  const cose = new Map(storia.cose.map((c) => [c.id, c]));
  const persone = new Set(storia.persone.map((x) => x.id));
  const scene = new Map(storia.scene.map((s) => [s.id, s]));

  // Un rimando a un tratto, una notizia, una cosa, una persona che non esistono.
  const rimandi = (c: Condizione | undefined, dove: string) => {
    for (const x of condizioni(c)) {
      if ("tratto" in x && !tratti.has(x.tratto)) err("rimandi", dove, `Tratto inesistente: ${x.tratto}.`);
      if ("notizia" in x && !notizie.has(x.notizia)) err("rimandi", dove, `Notizia inesistente: ${x.notizia}.`);
      if ("nonNotizia" in x && !notizie.has(x.nonNotizia)) err("rimandi", dove, `Notizia inesistente: ${x.nonNotizia}.`);
      if ("cosa" in x && !cose.has(x.cosa)) err("rimandi", dove, `Cosa inesistente: ${x.cosa}.`);
      if ("persona" in x && !persone.has(x.persona)) err("rimandi", dove, `Persona inesistente: ${x.persona}.`);
      if ("convinzione" in x && !storia.convinzioni.some((k) => k.id === x.convinzione)) err("rimandi", dove, `Convinzione inesistente: ${x.convinzione}.`);
    }
  };
  const rimandiEffetti = (effetti: Effetto[], dove: string) => {
    for (const e of effetti) {
      if ("notizia" in e && !notizie.has(e.notizia)) err("rimandi", dove, `Notizia inesistente: ${e.notizia}.`);
      if ("verifica" in e) {
        if (!notizie.has(e.verifica)) err("rimandi", dove, `Notizia inesistente: ${e.verifica}.`);
        else if (notizie.get(e.verifica)!.verita === "falsa") err("18", dove, `Una notizia falsa non si verifica: ${e.verifica}.`);
      }
      if ("cosa" in e && !cose.has(e.cosa)) err("rimandi", dove, `Cosa inesistente: ${e.cosa}.`);
      if ("rompi" in e && !cose.has(e.rompi)) err("rimandi", dove, `Cosa inesistente: ${e.rompi}.`);
      if ("tratto" in e && !tratti.has(e.tratto)) err("rimandi", dove, `Tratto inesistente: ${e.tratto}.`);
      if ("persona" in e && !persone.has(e.persona)) err("rimandi", dove, `Persona inesistente: ${e.persona}.`);
      if ("statoAnimo" in e && !amb.statiAnimo.some((x) => x.id === e.statoAnimo)) err("rimandi", dove, `Stato d'animo inesistente: ${e.statoAnimo}.`);
      if ("preparazione" in e && !amb.preparazioni.some((p) => p.id === e.preparazione)) err("rimandi", dove, `Preparazione inesistente: ${e.preparazione}.`);
    }
  };

  // Chi legge i tratti (controllo 8).
  const trattiLetti = new Set<string>();
  const leggiTratti = (c: Condizione | undefined) => {
    for (const x of condizioni(c)) if ("tratto" in x) trattiLetti.add(x.tratto);
  };

  // --- L'ambientazione ------------------------------------------------------
  if (amb.ambiti.length < 3 || amb.ambiti.length > 5) err("scheda 3", "ambiti", `Gli ambiti devono essere da 3 a 5: sono ${amb.ambiti.length}.`);
  if (amb.capacita.length < 8 || amb.capacita.length > 14) err("scheda 4", "capacità", `Le capacità devono essere da 8 a 14: sono ${amb.capacita.length}.`);
  for (const a of ambiti) {
    const n = amb.capacita.filter((c) => c.ambito === a).length;
    if (n < 2) err("scheda 4", `ambito ${a}`, `Ogni ambito deve avere almeno due capacità: ${a} ne ha ${n}.`);
  }
  // Controllo 12
  const zero = amb.capacita.filter((c) => c.partenza === 0).length;
  const due = amb.capacita.filter((c) => c.partenza === 2).length;
  if (zero * 2 < amb.capacita.length) err("12", "capacità", `Almeno metà delle capacità deve avere partenza 0: sono ${zero} su ${amb.capacita.length}.`);
  if (due > 2) err("12", "capacità", `Al massimo due capacità possono avere partenza 2: sono ${due}.`);
  for (const c of amb.capacita) {
    if (c.fondo > c.partenza) err("12", `capacità ${c.id}`, "Il Fondo è più alto della partenza.");
    if (!ambiti.has(c.ambito)) err("scheda 4", `capacità ${c.id}`, `Ambito inesistente: ${c.ambito}.`);
  }
  // Controllo 14: valori −1, 0, +1, e ogni valore con la sua frase.
  const valoriOk = (v: number | undefined) => v === undefined || v === -1 || v === 0 || v === 1;
  for (const p of amb.proprieta) {
    for (const [a, v] of Object.entries(p.valori)) {
      if (!ambiti.has(a)) err("rimandi", `proprietà ${p.id}`, `Ambito inesistente: ${a}.`);
      if (!valoriOk(v)) err("14", `proprietà ${p.id}`, `Il valore per ${a} deve essere −1, 0 o +1.`);
      else if (v !== 0 && !p.cause[a]) err("quadro", `proprietà ${p.id}`, `Manca la frase del quadro per ${a}.`);
    }
    for (const s of p.sposta ?? []) leggiTratti(s.se);
    for (const s of p.serve ?? []) leggiTratti(s.se);
    leggiTratti(p.annullataDa?.se);
  }
  for (const l of [...amb.luoghi, ...amb.momenti]) {
    const dove = "zona" in l ? `luogo ${l.id}` : `momento ${l.id}`;
    for (const id of l.proprieta) if (!proprieta.has(id)) err("rimandi", dove, `Proprietà inesistente: ${id}.`);
    for (const riga of l.righe ?? []) if (!valoriOk(riga.valore)) err("14", dove, `Il valore della riga «${riga.testo}» deve essere −1, 0 o +1.`);
  }
  // Controllo 13: ogni luogo, in almeno un momento, ha un ambito a −1.
  for (const l of amb.luoghi) {
    const buono = amb.momenti.some((m) => {
      const ids = new Set(l.proprieta);
      for (const id of m.proprieta) if (!(l.sospende ?? []).some((s) => s.proprieta === id && (!s.momento || s.momento === m.id))) ids.add(id);
      return [...ambiti].some((a) => {
        let v = 0;
        for (const id of ids) v += proprieta.get(id)?.valori[a] ?? 0;
        for (const riga of [...(l.righe ?? []), ...(m.righe ?? [])]) if (riga.ambito === a) v += riga.valore;
        return v < 0;
      });
    });
    if (!buono) err("13", `luogo ${l.id}`, "In nessun momento un ambito vale −1: il luogo non è buono per niente.");
  }
  if (amb.aggravanti.length < 3 || amb.aggravanti.length > 5) err("scheda 9", "aggravanti", "Le aggravanti devono essere da 3 a 5.");
  for (const a of amb.aggravanti) leggiTratti(a.quando);
  if (amb.preparazioni.length < 3 || amb.preparazioni.length > 6) err("scheda 10", "preparazioni", "Le preparazioni devono essere da 3 a 6.");
  // Il catalogo (controlli 9 e 17)
  for (const v of amb.catalogo) {
    for (const s of v.sposta ?? []) {
      leggiTratti(s.se);
      rimandi(s.se, `catalogo ${v.id}`);
      for (const x of condizioni(s.se)) if ("notizia" in x && notizie.get(x.notizia)?.verita === "falsa") err("17", `catalogo ${v.id}`, `Una notizia falsa sposta la soglia: ${x.notizia}.`);
    }
    if (v.serve) {
      for (const c of v.serve.una) leggiTratti(c);
      const delCorpo = v.serve.una.some((c) => "tratto" in c && tratti.get(c.tratto)?.delCorpo);
      if (delCorpo && v.serve.una.length < 2) err("9", `catalogo ${v.id}`, "Un tratto del corpo che manca chiude la via senza alternativa.");
    }
  }
  // Controllo 7
  const rimedi = new Set<string>();
  for (const l of amb.logorii) {
    if (!l.rimedio) err("7", `logorio ${l.id}`, "Manca il rimedio.");
    if (rimedi.has(l.rimedio)) err("7", `logorio ${l.id}`, "Lo stesso rimedio cura due logorii.");
    rimedi.add(l.rimedio);
  }
  // Controllo 20
  for (const s of amb.statiAnimo) {
    if (!s.passa.ore && !s.passa.inLuogoTranquillo && !s.passa.alPrimoNonRiesci) err("20", `stato d'animo ${s.id}`, "Non dice come passa.");
    for (const x of s.sposta ?? []) leggiTratti(x.se);
  }
  // Controllo 6
  for (const a of amb.armi) {
    if (!ambiti.has(a.colpisce)) err("6", `arma ${a.id}`, "La ferita non dice quale ambito impedisce.");
    if (a.segno) trattiLetti.add(a.segno);
  }
  // Controlli 25 e movente
  for (const a of amb.avversari) {
    if (!a.movente.vuole || !a.movente.smette) err("25", `avversario ${a.id}`, "Il movente è incompleto.");
    if (!a.pericolo.arma && !a.pericolo.sociale) err("25", `avversario ${a.id}`, "Manca il pericolo.");
    if (a.pericolo.arma && !a.sogliaDifesa) err("25", `avversario ${a.id}`, "Un avversario armato deve dire quanto è difficile difendersi.");
    if (a.persona && !persone.has(a.persona)) err("rimandi", `avversario ${a.id}`, `Persona inesistente: ${a.persona}.`);
    const ambitiDeboli = new Set(a.puntiDeboli.map((p) => capacita.get(p.capacita)?.ambito));
    if (a.puntiDeboli.length < 2 || ambitiDeboli.size < 2) err("25", `avversario ${a.id}`, "Servono almeno due punti deboli con capacità di ambiti diversi.");
    for (const p of a.puntiDeboli) {
      if (!capacita.has(p.capacita)) err("rimandi", `avversario ${a.id}`, `Capacità inesistente: ${p.capacita}.`);
      if (!catalogo.has(p.soglia)) err("15", `avversario ${a.id}`, `Soglia non in catalogo: ${p.soglia}.`);
      rimandi(p.requisito, `avversario ${a.id}`);
    }
  }
  for (const z of new Set(amb.luoghi.map((l) => l.zona))) {
    if (!amb.repertorio.some((v) => v.zona === z && !v.vai && !v.quando && v.tipo !== "prezzo")) avviso("repertorio", `zona ${z}`, "Nessuna complicazione sempre disponibile per il Non riesci da esposto.");
  }
  for (const v of amb.repertorio) rimandiEffetti(v.effetti, `repertorio ${v.id}`);

  // --- La storia ------------------------------------------------------------
  if (storia.ambientazione !== amb.id) err("rimandi", "storia", `La storia chiede l'ambientazione ${storia.ambientazione}.`);
  if (!scene.has(storia.inizio)) err("rimandi", "storia", `Scena iniziale inesistente: ${storia.inizio}.`);
  if (!scene.has(storia.morte)) err("rimandi", "storia", `Scena della morte inesistente: ${storia.morte}.`);
  if (!amb.momenti.some((m) => m.id === storia.momentoIniziale)) err("rimandi", "storia", "Momento iniziale inesistente.");
  for (const s of storia.scadenze) if (!scene.has(s.alScadere)) err("rimandi", `scadenza ${s.id}`, `Scena inesistente: ${s.alScadere}.`);
  for (const v of amb.repertorio) if (v.vai && !scene.has(v.vai)) err("rimandi", `repertorio ${v.id}`, `Scena inesistente: ${v.vai}.`);
  for (const t of storia.personaggio.tratti) if (!tratti.has(t)) err("rimandi", "personaggio", `Tratto inesistente: ${t}.`);
  for (const c of storia.personaggio.convinzioni) if (!storia.convinzioni.some((k) => k.id === c)) err("rimandi", "personaggio", `Convinzione inesistente: ${c}.`);
  for (const c of Object.keys(storia.personaggio.cose)) if (!cose.has(c)) err("rimandi", "personaggio", `Cosa inesistente: ${c}.`);

  // Controllo 18: ogni notizia falsa si può smentire.
  const verificate = new Set<string>();
  for (const s of storia.scene) for (const e of effettiDellaScena(s)) if ("verifica" in e) verificate.add(e.verifica);
  for (const n of storia.notizie) {
    if (n.verita === "falsa" && !(n.smentitaDa ?? []).length) err("18", `notizia ${n.id}`, "Una notizia falsa deve dire da che cosa è smentita.");
    for (const x of n.smentitaDa ?? []) {
      if (!notizie.has(x)) err("rimandi", `notizia ${n.id}`, `Notizia inesistente: ${x}.`);
      else if (notizie.get(x)!.verita === "falsa") err("18", `notizia ${n.id}`, `È smentita da un'altra notizia falsa: ${x}.`);
    }
    if (n.verita !== "falsa" && (n.smentitaDa ?? []).length) err("18", `notizia ${n.id}`, "Una notizia vera non può essere smentita.");
  }
  // Controllo 19: ogni convinzione dichiara che cosa la mette in dubbio.
  for (const c of storia.convinzioni) {
    if (!Array.isArray(c.dubbioDa)) err("19", `convinzione ${c.id}`, "Non dichiara che cosa la mette in dubbio.");
    for (const x of c.dubbioDa ?? []) if (!notizie.has(x)) err("rimandi", `convinzione ${c.id}`, `Notizia inesistente: ${x}.`);
  }
  for (const d of storia.deduzioni) {
    for (const x of [...d.da, d.notizia]) if (!notizie.has(x)) err("rimandi", `deduzione ${d.id}`, `Notizia inesistente: ${x}.`);
    if (notizie.get(d.notizia)?.verita === "falsa") err("17", `deduzione ${d.id}`, "Una deduzione non dà una notizia falsa.");
  }
  for (const c of storia.combinazioni) for (const x of [...c.da, c.cosa]) if (!cose.has(x)) err("rimandi", `combinazione ${c.id}`, `Cosa inesistente: ${x}.`);
  // Controllo 21: chi può tradire lo dichiara.
  for (const pers of storia.persone) {
    for (const re of pers.reazioni ?? []) rimandi(re.se, `persona ${pers.id}`);
    const avv = amb.avversari.find((a) => a.persona === pers.id);
    if (pers.puoTradire && avv && avv.movente.mantieneLaParola) err("21", `persona ${pers.id}`, "Può tradire, ma il suo movente dice che mantiene la parola.");
  }

  const scritte = { fatti: new Set<string>(), notizie: new Set<string>() };
  const lette = { fatti: new Set<string>(), notizie: new Set<string>() };
  const notizieNonRiesci = new Set<string>();
  const leggi = (c: Condizione) => {
    if ("fatto" in c) lette.fatti.add(c.fatto);
    if ("nonFatto" in c) lette.fatti.add(c.nonFatto);
    if ("notizia" in c) lette.notizie.add(c.notizia);
    if ("nonNotizia" in c) lette.notizie.add(c.nonNotizia);
  };
  const leggiTutto = (c: Condizione | undefined) => {
    for (const x of condizioni(c)) leggi(x);
    leggiTratti(c);
  };
  for (const v of amb.repertorio) leggiTutto(v.quando);
  for (const a of amb.avversari) for (const p of a.puntiDeboli) leggiTutto(p.requisito);
  for (const l of amb.luoghi) for (const st of l.stati ?? []) leggiTutto(st.se);
  for (const v of amb.catalogo) for (const s of v.sposta ?? []) leggiTutto(s.se);
  for (const s of storia.scadenze) leggiTutto(s.salvoSe);
  for (const pers of storia.persone) for (const re of pers.reazioni ?? []) leggiTutto(re.se);
  for (const d of storia.deduzioni) for (const x of d.da) lette.notizie.add(x);
  for (const c of storia.convinzioni) for (const x of c.dubbioDa) lette.notizie.add(x);
  for (const n of storia.notizie) for (const x of [...(n.smentitaDa ?? []), ...(n.contrasto ?? [])]) lette.notizie.add(x);
  for (const t of storia.personaggio.tratti) if (tratti.get(t)?.sposta?.length) trattiLetti.add(t);

  for (const s of storia.scene) {
    const dove = `scena ${s.id}`;
    if (!luoghi.has(s.luogo)) err("rimandi", dove, `Luogo inesistente: ${s.luogo}.`);
    for (const d of destinazioni(s)) if (!scene.has(d)) err("rimandi", dove, `Rimanda a una scena inesistente: ${d}.`);
    for (const c of condizioniDelTesto(s.testo)) {
      leggi(c);
      leggiTratti(c);
    }
    const effetti = effettiDellaScena(s);
    rimandiEffetti(effetti, dove);
    for (const e of effetti) {
      if ("fatto" in e) scritte.fatti.add(e.fatto);
      if ("notizia" in e) scritte.notizie.add(e.notizia);
      if ("verifica" in e) scritte.notizie.add(e.verifica);
      if ("tratto" in e) trattiLetti.add(e.tratto);
      if ("togliTratto" in e) trattiLetti.add(e.togliTratto);
    }
    if (!s.finale && (s.scelte ?? []).length === 0 && !s.confronto) err("vicolo cieco", dove, "Una scena senza scelte e senza finale.");

    const scelte = s.scelte ?? [];
    const prove = scelte.filter((c) => c.prova);
    for (const c of scelte) {
      const qui = `${dove}, scelta ${c.id}`;
      leggiTutto(c.requisito);
      rimandi(c.requisito, qui);
      if (c.requisito && !c.nascondiSeChiusa && !c.richiede) avviso("14.3", qui, "Una scelta chiusa si mostra: scrivi che cosa richiede.");
      // Controllo 29
      if (/^[A-ZÀ-Ú]?[a-zà-ú']+(are|ere|ire|arsi|ersi|irsi|arti|erti|irti)\b/.test(c.testo)) avviso("29", qui, `La scelta sembra all'infinito: «${c.testo}». Si scrive in prima persona.`);
      // Controllo 9: un tratto del corpo che chiude la via, e l'ostacolo senza ripiego.
      const delCorpo = [...positive(c.requisito)].some((x) => "tratto" in x && tratti.get(x.tratto)?.delCorpo);
      if (delCorpo && !scelte.some((x) => x.ripiego)) err("9", qui, "Un tratto del corpo chiude questa via, e l'ostacolo non ha un ripiego.");
      const p = c.prova;
      if (!p) continue;
      if (!capacita.has(p.capacita)) err("rimandi", qui, `Capacità inesistente: ${p.capacita}.`);
      const voce = catalogo.get(p.soglia);
      if (!voce) err("15", qui, `Soglia non in catalogo: ${p.soglia}.`);
      // Controllo 15: al massimo un gradino per parte, anche per l'autore.
      if ((p.sposta ?? []).filter((x) => x.gradini < 0).length > 1 || (p.sposta ?? []).filter((x) => x.gradini > 0).length > 1) avviso("15", qui, "Più di un gradino per parte: le righe in più non conteranno.");
      if (p.persona && !persone.has(p.persona)) err("rimandi", qui, `Persona inesistente: ${p.persona}.`);
      if (p.aiuto && !persone.has(p.aiuto)) err("rimandi", qui, `Persona inesistente: ${p.aiuto}.`);
      // Controllo 10
      if (!p.nonRiesci.notizia) err("10", qui, "Manca la notizia del Non riesci.");
      else {
        notizieNonRiesci.add(p.nonRiesci.notizia);
        if (!notizie.has(p.nonRiesci.notizia)) err("rimandi", qui, `Notizia inesistente: ${p.nonRiesci.notizia}.`);
      }
      // Controllo 11: una prova che può essere allo scoperto ha un rovescio. Lo sono tutte, salvo il Fondo e le tabelle: lo chiediamo sempre.
      if (!p.rovescio) err("11", qui, "Manca il rovescio.");
      // Controllo 4: una prova che può uccidere lo dice nella posta.
      const uccide = [p.riesci, p.nonRiesci, ...(p.rovescio ? [p.rovescio] : [])].some((e) => scene.get(e.vai)?.finale?.tipo === "morte" || (e.effetti ?? []).some((x) => "ferita" in x && (x.ferita.gravita === "mortale" || x.ferita.gravita === "morte")));
      if (uccide && !/vita/i.test(p.posta)) err("4", qui, "Questa prova può uccidere, e la posta non lo dice.");
      if (!p.posta) err("4", qui, "Manca la posta.");
      // Controllo 28: al coperto il dado non può rovinarti; esposto il peggio è una complicazione.
      if (scene.get(p.nonRiesci.vai)?.finale) err("28", qui, "Un Non riesci al coperto o esposto porta a un finale: solo il rovescio può chiudere la storia.");
      if ((p.nonRiesci.effetti ?? []).some((x) => "ferita" in x)) err("28", qui, "Un Non riesci al coperto o esposto produce una ferita.");
      // La metà presa da un ripiego che esiste.
      if (p.meta && "ripiego" in p.meta && !scelte.some((x) => x.id === (p.meta as { ripiego: string }).ripiego && x.ripiego)) err("rimandi", qui, "La metà rimanda a un ripiego che non c'è.");
      if (voce?.serve) for (const x of voce.serve.una) leggiTratti(x);
    }
    if (prove.length > 0) {
      // Controllo 1
      if (!scelte.some((c) => c.ripiego && !c.prova)) err("1", dove, "L'ostacolo non ha un ripiego.");
      // Controllo 2
      for (const c of prove) if (c.prova!.unColpoSolo && scelte.length < 2) err("2", `${dove}, scelta ${c.id}`, "Una prova da una volta sola è l'unica via.");
      // Controllo 26
      for (let i = 0; i < prove.length; i++)
        for (let j = i + 1; j < prove.length; j++) {
          const a = prove[i].prova!, b = prove[j].prova!;
          const ca = capacita.get(a.capacita), cb = capacita.get(b.capacita);
          if (a.capacita !== b.capacita && ca && cb && ca.ambito === cb.ambito && ca.partenza === cb.partenza && ca.fondo === cb.fondo && a.soglia === b.soglia && a.riesci.vai === b.riesci.vai && a.nonRiesci.vai === b.nonRiesci.vai)
            avviso("26", dove, `Le vie ${prove[i].id} e ${prove[j].id} differiscono solo per la capacità.`);
        }
    }
    // Controllo 22: le scelte che danno qualcosa si esauriscono, a meno che non siano «sempre».
    for (const c of scelte) if (c.sempre && !c.ripiego && !(c.effetti ?? []).some((e) => "rimedio" in e || "cura" in e)) avviso("22", `${dove}, scelta ${c.id}`, "Segnata come sempre disponibile: è voluto?");
    if (s.confronto) {
      const conf = s.confronto;
      const avv = amb.avversari.find((a) => a.id === conf.avversario);
      if (!avv) err("rimandi", dove, `Avversario inesistente: ${conf.avversario}.`);
      // Controllo 3: l'andarsene c'è per costruzione; qui si controlla che costi.
      if (conf.andarsene.effetti.length === 0) avviso("3", dove, "Andarsene non costa niente: un ripiego deve costare.");
      if (avv?.pericolo.sociale && !conf.seTiPrende) err("rimandi", dove, "Il pericolo sociale non dice dove porta.");
      if (conf.fini.length === 0) err("32", dove, "La finestra non offre nessuna fine.");
      leggiTutto(conf.parlare?.requisito);
      // Controllo 5
      if (s.tag?.includes("agguato") && avv?.copertura === 2) err("5", dove, "Un agguato comincia con la finestra aperta per l'avversario.");
    }
    if (s.finale && (s.scelte ?? []).length > 0) avviso("finale", dove, "Una scena finale con delle scelte: le scelte non verranno mostrate.");
  }
  // Controllo 8
  for (const t of amb.tratti) if (!trattiLetti.has(t.id)) avviso("8", `tratto ${t.id}`, "Nessuna scena, voce del catalogo o proprietà lo legge.");
  // Controllo 23
  for (const f of scritte.fatti) if (!lette.fatti.has(f)) avviso("23", `fatto ${f}`, "Viene scritto ma nessuna scena lo legge.");
  for (const k of scritte.notizie) if (!lette.notizie.has(k) && !notizieNonRiesci.has(k)) avviso("23", `notizia ${k}`, "Viene scritta ma nessuna scena la legge.");
  for (const k of storia.notizie) if (!scritte.notizie.has(k.id) && !storia.deduzioni.some((d) => d.notizia === k.id)) avviso("23", `notizia ${k.id}`, "È dichiarata ma nessuna scena la dà.");
  // Controllo 27
  if (storia.scadenze.length === 0 && !amb.logorii.some((l) => l.ogniOre > 0)) err("27", "storia", "Nessuna pressione: restare al coperto sarebbe gratis.");

  // Raggiungibilità
  const viste = new Set<string>([storia.inizio, storia.morte, ...storia.scadenze.map((s) => s.alScadere), ...amb.repertorio.flatMap((v) => (v.vai ? [v.vai] : []))]);
  const coda = [...viste];
  while (coda.length) {
    const s = scene.get(coda.pop()!);
    if (!s) continue;
    for (const d of destinazioni(s)) if (!viste.has(d)) {
      viste.add(d);
      coda.push(d);
    }
  }
  for (const s of storia.scene) if (!viste.has(s.id)) avviso("raggiungibilità", `scena ${s.id}`, "Nessuna scelta porta qui.");
  if (!storia.scene.some((s) => s.finale)) err("finale", "storia", "La storia non ha nessun finale.");
  return r;
}

export type { Scelta };
