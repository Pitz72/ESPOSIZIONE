/**
 * I controlli del §20, e quelli strutturali che servono perché i dati si possano
 * giocare: rimandi esistenti, scene raggiungibili, nessun vicolo cieco.
 * Ogni rilievo dice quale controllo viola e dove.
 */

import type { Ambientazione, Condizione, Effetto, Scena, Storia, Testo } from "./tipi.ts";

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

function condizioniDelTesto(t: Testo): Condizione[] {
  return typeof t === "string" ? [] : t.flatMap((b) => (b.se ? [...condizioni(b.se)] : []));
}

function effettiDellaScena(s: Scena): Effetto[] {
  const e: Effetto[] = [...(s.entrando ?? [])];
  for (const c of s.scelte ?? []) {
    e.push(...(c.effetti ?? []));
    if (c.prova) e.push(...(c.prova.riesci.effetti ?? []), ...(c.prova.nonRiesci.effetti ?? []), ...(c.prova.rovescio.effetti ?? []), ...(c.prova.prezzo?.effetti ?? []));
    if (c.prova?.conoscenza) e.push({ conoscenza: c.prova.conoscenza });
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
    if (c.prova) d.push(c.prova.riesci.vai, c.prova.nonRiesci.vai, c.prova.rovescio.vai);
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
  const soglie = new Set(amb.soglie.map((s) => s.id));
  const luoghi = new Set(amb.luoghi.map((l) => l.id));
  const scene = new Map(storia.scene.map((s) => [s.id, s]));

  // --- L'ambientazione ------------------------------------------------------
  if (amb.ambiti.length < 3 || amb.ambiti.length > 5) err("scheda 3", "ambiti", `Gli ambiti devono essere da 3 a 5: sono ${amb.ambiti.length}.`);
  if (amb.capacita.length < 8 || amb.capacita.length > 14) err("scheda 4", "capacità", `Le capacità devono essere da 8 a 14: sono ${amb.capacita.length}.`);
  for (const a of ambiti) {
    const n = amb.capacita.filter((c) => c.ambito === a).length;
    if (n < 2) err("scheda 4", `ambito ${a}`, `Ogni ambito deve avere almeno due capacità: ${a} ne ha ${n}.`);
  }
  // Controllo 8
  const zero = amb.capacita.filter((c) => c.partenza === 0).length;
  const due = amb.capacita.filter((c) => c.partenza === 2).length;
  if (zero * 2 < amb.capacita.length) err("8", "capacità", `Almeno metà delle capacità deve avere partenza 0: sono ${zero} su ${amb.capacita.length}.`);
  if (due > 2) err("8", "capacità", `Al massimo due capacità possono avere partenza 2: sono ${due}.`);
  for (const c of amb.capacita) {
    if (c.fondo > c.partenza) err("8", `capacità ${c.id}`, "Il Fondo è più alto della partenza.");
    if (!ambiti.has(c.ambito)) err("scheda 4", `capacità ${c.id}`, `Ambito inesistente: ${c.ambito}.`);
  }
  // Controlli 9 e 10
  for (const l of amb.luoghi) {
    for (const a of ambiti) {
      const v = l.valori[a];
      if (v !== -1 && v !== 0 && v !== 1) err("10", `luogo ${l.id}`, `Il valore per ${a} deve essere −1, 0 o +1.`);
      else if (v !== 0 && !l.cause[a]) err("ricevuta", `luogo ${l.id}`, `Manca la frase della ricevuta per ${a}.`);
    }
    if (!Object.values(l.valori).some((v) => v === -1)) err("9", `luogo ${l.id}`, "Nessun ambito a −1: il luogo non è buono per niente.");
  }
  for (const m of amb.momenti) {
    for (const a of ambiti) {
      const v = m.valori[a];
      if (v !== -1 && v !== 0 && v !== 1) err("10", `momento ${m.id}`, `Il valore per ${a} deve essere −1, 0 o +1.`);
      else if (v !== 0 && !m.cause[a]) err("ricevuta", `momento ${m.id}`, `Manca la frase della ricevuta per ${a}.`);
    }
  }
  if (amb.aggravanti.length < 3 || amb.aggravanti.length > 5) err("scheda 7", "aggravanti", "Le aggravanti devono essere da 3 a 5.");
  if (amb.preparazioni.length < 3 || amb.preparazioni.length > 6) err("scheda 8", "preparazioni", "Le preparazioni devono essere da 3 a 6.");
  // Controllo 7
  const rimedi = new Set<string>();
  for (const l of amb.logorii) {
    if (!l.rimedio) err("7", `logorio ${l.id}`, "Manca il rimedio.");
    if (rimedi.has(l.rimedio)) err("7", `logorio ${l.id}`, "Lo stesso rimedio cura due logorii.");
    rimedi.add(l.rimedio);
  }
  // Controllo 6
  for (const a of amb.armi) if (!ambiti.has(a.colpisce)) err("6", `arma ${a.id}`, "La ferita non dice quale ambito impedisce.");
  // Controlli 15 e 16
  for (const a of amb.avversari) {
    if (!a.movente.vuole || !a.movente.smette) err("15", `avversario ${a.id}`, "Il movente è incompleto.");
    if (!a.pericolo.arma && !a.pericolo.sociale) err("15", `avversario ${a.id}`, "Manca il pericolo.");
    if (a.pericolo.arma && !a.sogliaDifesa) err("15", `avversario ${a.id}`, "Un avversario armato deve dire quanto è difficile difendersi.");
    const ambitiDeboli = new Set(a.puntiDeboli.map((p) => capacita.get(p.capacita)?.ambito));
    if (a.puntiDeboli.length < 2 || ambitiDeboli.size < 2) err("16", `avversario ${a.id}`, "Servono almeno due punti deboli di ambiti diversi.");
    for (const p of a.puntiDeboli) {
      if (!capacita.has(p.capacita)) err("rimandi", `avversario ${a.id}`, `Capacità inesistente: ${p.capacita}.`);
      if (!soglie.has(p.soglia)) err("11", `avversario ${a.id}`, `Soglia non in catalogo: ${p.soglia}.`);
    }
  }
  for (const z of new Set(amb.luoghi.map((l) => l.zona))) {
    if (!amb.repertorio.some((v) => v.zona === z && !v.vai && !v.quando)) avviso("16 della scheda", `zona ${z}`, "Nessuna complicazione sempre disponibile per il rovescio minore.");
  }

  // --- La storia ------------------------------------------------------------
  if (storia.ambientazione !== amb.id) err("rimandi", "storia", `La storia chiede l'ambientazione ${storia.ambientazione}.`);
  if (!scene.has(storia.inizio)) err("rimandi", "storia", `Scena iniziale inesistente: ${storia.inizio}.`);
  if (!scene.has(storia.morte)) err("rimandi", "storia", `Scena della morte inesistente: ${storia.morte}.`);
  if (!amb.momenti.some((m) => m.id === storia.momentoIniziale)) err("rimandi", "storia", "Momento iniziale inesistente.");
  for (const s of storia.scadenze) if (!scene.has(s.alScadere)) err("rimandi", `scadenza ${s.id}`, `Scena inesistente: ${s.alScadere}.`);
  for (const v of amb.repertorio) if (v.vai && !scene.has(v.vai)) err("rimandi", `repertorio ${v.id}`, `Scena inesistente: ${v.vai}.`);

  const scritte = { fatti: new Set<string>(), misure: new Set<string>(), conoscenze: new Set<string>() };
  const lette = { fatti: new Set<string>(), misure: new Set<string>(), conoscenze: new Set<string>() };
  const leggi = (c: Condizione) => {
    if ("fatto" in c) lette.fatti.add(c.fatto);
    if ("nonFatto" in c) lette.fatti.add(c.nonFatto);
    if ("misura" in c) lette.misure.add(c.misura);
    if ("conoscenza" in c) lette.conoscenze.add(c.conoscenza);
    if ("nonConoscenza" in c) lette.conoscenze.add(c.nonConoscenza);
  };
  for (const v of amb.repertorio) for (const c of condizioni(v.quando)) leggi(c);
  for (const a of amb.avversari) for (const p of a.puntiDeboli) for (const c of condizioni(p.requisito)) leggi(c);
  for (const s of storia.scadenze) for (const c of condizioni(s.salvoSe)) leggi(c);

  for (const s of storia.scene) {
    const dove = `scena ${s.id}`;
    if (!luoghi.has(s.luogo)) err("rimandi", dove, `Luogo inesistente: ${s.luogo}.`);
    for (const d of destinazioni(s)) if (!scene.has(d)) err("rimandi", dove, `Rimanda a una scena inesistente: ${d}.`);
    for (const c of condizioniDelTesto(s.testo)) leggi(c);
    for (const e of effettiDellaScena(s)) {
      if ("fatto" in e) scritte.fatti.add(e.fatto);
      if ("misura" in e) scritte.misure.add(e.misura);
      if ("conoscenza" in e) scritte.conoscenze.add(e.conoscenza);
      if ("preparazione" in e && !amb.preparazioni.some((p) => p.id === e.preparazione)) err("rimandi", dove, `Preparazione inesistente: ${e.preparazione}.`);
    }
    if (!s.finale && (s.scelte ?? []).length === 0 && !s.confronto) err("vicolo cieco", dove, "Una scena senza scelte e senza finale.");

    const prove = (s.scelte ?? []).filter((c) => c.prova);
    for (const c of s.scelte ?? []) {
      for (const x of condizioni(c.requisito)) leggi(x);
      if (c.requisito && !c.nascondiSeChiusa && !c.richiede) avviso("4.4", `${dove}, scelta ${c.id}`, "Una scelta chiusa si mostra: scrivi che cosa richiede.");
      if (!c.prova) continue;
      const p = c.prova;
      if (!capacita.has(p.capacita)) err("rimandi", `${dove}, scelta ${c.id}`, `Capacità inesistente: ${p.capacita}.`);
      if (!soglie.has(p.soglia)) err("11", `${dove}, scelta ${c.id}`, `Soglia non in catalogo: ${p.soglia}.`);
      // Controllo 4: una prova che può uccidere lo dice nella posta.
      const uccide = [p.riesci, p.nonRiesci, p.rovescio].some((e) => scene.get(e.vai)?.finale?.tipo === "morte" || (e.effetti ?? []).some((x) => "ferita" in x && (x.ferita.gravita === "mortale" || x.ferita.gravita === "morte")));
      if (uccide && !/vita/i.test(p.posta)) err("4", `${dove}, scelta ${c.id}`, "Questa prova può uccidere, e la posta non lo dice.");
      if (!p.posta) err("4", `${dove}, scelta ${c.id}`, "Manca la posta.");
    }
    if (prove.length > 0) {
      // Controllo 1
      if (!(s.scelte ?? []).some((c) => c.povera && !c.prova)) {
        // Una via povera può essere chiusa solo se in quel caso non c'è nemmeno una prova aperta: lo controlliamo per momento.
        err("1", dove, "L'ostacolo non ha una via povera.");
      }
      // Controllo 2
      for (const c of prove) if (c.prova!.unColpoSolo && (s.scelte ?? []).length < 2) err("2", `${dove}, scelta ${c.id}`, "Una prova da un colpo solo è l'unica via.");
      // Controllo 17
      for (let i = 0; i < prove.length; i++)
        for (let j = i + 1; j < prove.length; j++) {
          const a = prove[i].prova!, b = prove[j].prova!;
          const ca = capacita.get(a.capacita), cb = capacita.get(b.capacita);
          if (ca && cb && ca.ambito === cb.ambito && ca.partenza === cb.partenza && ca.fondo === cb.fondo && a.soglia === b.soglia && a.riesci.vai === b.riesci.vai && a.nonRiesci.vai === b.nonRiesci.vai && a.rovescio.vai === b.rovescio.vai)
            avviso("17", dove, `Le vie ${prove[i].id} e ${prove[j].id} differiscono solo per la capacità.`);
        }
    }
    if (s.confronto) {
      const conf = s.confronto;
      const avv = amb.avversari.find((a) => a.id === conf.avversario);
      if (!avv) err("rimandi", dove, `Avversario inesistente: ${conf.avversario}.`);
      // Controllo 3: l'andarsene c'è per costruzione; qui si controlla che costi.
      if (conf.andarsene.effetti.length === 0) avviso("3", dove, "Andarsene non costa niente: una via povera deve costare.");
      if (avv?.pericolo.sociale && !conf.seTiPrende) err("rimandi", dove, "Il pericolo sociale non dice dove porta.");
      if (conf.fini.length === 0) err("17.3", dove, "La finestra non offre nessuna fine.");
      for (const x of condizioni(conf.parlare?.requisito)) leggi(x);
      // Controllo 5
      if (s.tag?.includes("agguato") && avv?.copertura === 2) err("5", dove, "Un agguato comincia con la finestra aperta per l'avversario.");
    }
    if (s.finale && (s.scelte ?? []).length > 0) avviso("finale", dove, "Una scena finale con delle scelte: le scelte non verranno mostrate.");
  }
  // Controllo 13
  for (const f of scritte.fatti) if (!lette.fatti.has(f)) avviso("13", `fatto ${f}`, "Viene scritto ma nessuna scena lo legge.");
  for (const m of scritte.misure) if (!lette.misure.has(m)) avviso("13", `misura ${m}`, "Viene scritta ma nessuna scena la legge.");
  for (const k of scritte.conoscenze) if (!lette.conoscenze.has(k)) avviso("13", `conoscenza ${k}`, "Viene scritta ma nessuna scena la legge.");
  for (const k of storia.conoscenze) if (!scritte.conoscenze.has(k.id)) avviso("13", `conoscenza ${k.id}`, "È dichiarata ma nessuna scena la dà.");
  // Controllo 18
  if (storia.scadenze.length === 0 && !amb.logorii.some((l) => l.ogniPassi > 0)) err("18", "storia", "Nessuna pressione: restare al coperto sarebbe gratis.");

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
