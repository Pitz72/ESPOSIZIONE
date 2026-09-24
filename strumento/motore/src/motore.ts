/**
 * L'interfaccia del motore per chi presenta il gioco (§22.4): `vista` dice che cosa
 * mostrare, `agisci` risolve una scelta. Non disegna e non scrive niente: un gioco
 * testuale, un librogame o un gioco grafico usano le stesse due funzioni.
 */

import type { Grado, Prova, Scelta, Scena } from "./tipi.ts";
import { componi, NOMI_GRADO, type Composizione } from "./ricevuta.ts";
import { percentuale, probabilita, tiraDueDadi } from "./dadi.ts";
import {
  applica,
  aggiungiTraccia,
  avanza,
  clona,
  complicazione,
  ferisci,
  luogoDi,
  momentoDi,
  nomeFatto,
  nomeGrado,
  NOMI_LIVELLO,
  scenaDi,
  tacca,
  testoDi,
  vale,
  type Evento,
  type Gioco,
  type Partita,
} from "./stato.ts";

export interface RicevutaPiena extends Composizione {
  azione: string;
  capacita: string;
  livello: string;
  bonus: number;
  penalita: number;
  soglia: number;
  sogliaNome: string;
  probabilita: number;
  posta: string;
  /** Un nuovo tentativo costa un passo (§12). */
  ritento: boolean;
  unColpoSolo: boolean;
}

export interface VistaScelta {
  id: string;
  testo: string;
  tipo: "vai" | "prova" | "riprova" | "difesa" | "finestra" | "parlare" | "andarsene";
  disponibile: boolean;
  richiede?: string;
  povera?: boolean;
  ricevuta?: RicevutaPiena;
}

export interface Vista {
  scena: { id: string; titolo: string; testo: string; luogo: string; momento: string; presentazione?: Record<string, string> };
  stato: {
    passo: number;
    momento: string;
    scadenze: string[];
    logorio: string[];
    ferite: string[];
    tracciaQui: number;
    oggetti: string[];
    parole: string[];
    conoscenze: string[];
    capacita: string[];
    protezioni: string[];
  };
  confronto?: { avversario: string; natura: string; copertura: string; finestra: boolean; inDifesa: boolean };
  scelte: VistaScelta[];
  finale?: "vittoria" | "sconfitta" | "morte";
}

const TIPO_SOGLIA: Record<number, string> = { 6: "Facile", 8: "Impegnativa", 10: "Ardua", 12: "Estrema" };

// ---------------------------------------------------------------------------
// La ricevuta di una prova, nello stato attuale
// ---------------------------------------------------------------------------

function sogliaDi(g: Gioco, id: string): { soglia: number; nome: string } {
  const s = g.amb.soglie.find((x) => x.id === id);
  if (!s) throw new Error(`Soglia non in catalogo: ${id}`);
  return { soglia: s.soglia, nome: TIPO_SOGLIA[s.soglia] };
}

function penalitaPer(g: Gioco, p: Partita, ambito: string): number {
  const lievi = p.ferite.filter((f) => f.gravita === "lieve" && f.ambito === ambito).length;
  const stremo = g.amb.logorii.filter((l) => p.logorio[l.id]?.stadio === 3).length;
  return Math.min(3, lievi + stremo);
}

function preparazioniAttive(g: Gioco, p: Partita): string[] {
  const luogo = luogoDi(g, p).id;
  const attive = new Set<string>();
  for (const x of p.preparazioni) if (!x.luogo || x.luogo === luogo) attive.add(x.id);
  for (const def of g.amb.preparazioni) if (def.durata === "oggetto" && def.oggetto && (p.oggetti[def.oggetto] ?? 0) > 0) attive.add(def.id);
  return [...attive];
}

export function ricevutaProva(g: Gioco, p: Partita, azione: string, capacitaId: string, sogliaId: string, righe: Prova["righe"], posta: string, chiave: string, unColpoSolo = false): RicevutaPiena {
  const cap = g.amb.capacita.find((c) => c.id === capacitaId);
  if (!cap) throw new Error(`Capacità inesistente: ${capacitaId}`);
  const luogo = luogoDi(g, p);
  const mom = momentoDi(g, p);
  const scena = scenaDi(g, p.scena);
  const ctx = { ambito: cap.ambito, tag: scena.tag ?? [] };
  const altre: Array<{ tipo: "luogo" | "momento" | "scena" | "aggravante" | "preparazione"; testo: string; valore: number }> = [
    { tipo: "luogo", testo: luogo.cause[cap.ambito] ?? luogo.nome, valore: luogo.valori[cap.ambito] ?? 0 },
    { tipo: "momento", testo: mom.cause[cap.ambito] ?? mom.nome, valore: mom.valori[cap.ambito] ?? 0 },
    ...(righe ?? []).map((r) => ({ tipo: "scena" as const, testo: r.testo, valore: r.valore })),
    ...g.amb.aggravanti.filter((a) => vale(g, p, a.quando, ctx)).map((a) => ({ tipo: "aggravante" as const, testo: a.testo, valore: 1 })),
    ...preparazioniAttive(g, p).map((id) => ({ tipo: "preparazione" as const, testo: g.amb.preparazioni.find((x) => x.id === id)!.testo, valore: -1 })),
  ];
  const comp = componi({ testo: cap.causa, valore: cap.partenza }, altre, cap.fondo);
  const { soglia, nome } = sogliaDi(g, sogliaId);
  const bonus = p.livelli[cap.id] ?? 0;
  const penalita = penalitaPer(g, p, cap.ambito);
  return {
    ...comp,
    azione,
    capacita: cap.nome,
    livello: NOMI_LIVELLO[bonus],
    bonus,
    penalita,
    soglia,
    sogliaNome: nome,
    probabilita: percentuale(probabilita(soglia, bonus, penalita)),
    posta,
    ritento: (p.tentativi[chiave] ?? 0) > 0,
    unColpoSolo,
  };
}

/** Una ferita o un pericolo che impedisce la capacità (§14). */
function impedimento(g: Gioco, p: Partita, capacitaId: string): string | undefined {
  const cap = g.amb.capacita.find((c) => c.id === capacitaId);
  if (!cap) return undefined;
  const grave = p.ferite.find((f) => f.gravita === "grave" && f.ambito === cap.ambito);
  if (grave) return `${grave.nome} te lo impedisce`;
  if (p.ferite.some((f) => f.gravita === "mortale") && !g.amb.ferite.conMortaleSoloAmbiti.includes(cap.ambito)) return "una ferita mortale te lo impedisce";
  return undefined;
}

// ---------------------------------------------------------------------------
// Vista
// ---------------------------------------------------------------------------

function sceltaNormale(g: Gioco, p: Partita, scena: Scena, s: Scelta): VistaScelta | null {
  const chiave = `${scena.id}:${s.id}`;
  if (p.usate[chiave] && s.unaVolta) return null;
  const aperta = !s.requisito || vale(g, p, s.requisito);
  if (!aperta && s.nascondiSeChiusa) return null;
  if (s.prova) {
    if (p.usate[chiave]) return { id: s.id, testo: s.testo, tipo: "prova", disponibile: false, richiede: "l'hai già tentata: si poteva fare una volta sola" };
    const imp = impedimento(g, p, s.prova.capacita);
    const ricevuta = ricevutaProva(g, p, s.testo, s.prova.capacita, s.prova.soglia, s.prova.righe, s.prova.posta, chiave, s.prova.unColpoSolo);
    return { id: s.id, testo: s.testo, tipo: "prova", disponibile: aperta && !imp, richiede: !aperta ? s.richiede : imp, ricevuta };
  }
  return { id: s.id, testo: s.testo, tipo: "vai", disponibile: aperta, richiede: aperta ? undefined : s.richiede, povera: s.povera };
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

export function vista(g: Gioco, p: Partita): Vista {
  const scena = scenaDi(g, p.scena);
  const luogo = luogoDi(g, p);
  const mom = momentoDi(g, p);
  const scelte: VistaScelta[] = [];
  let confronto: Vista["confronto"];

  if (!p.finita && scena.confronto && p.confronto) {
    const c = p.confronto;
    const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
    confronto = { avversario: avv.nome, natura: avv.natura === "avanza" ? "chi avanza" : "chi si chiude", copertura: nomeGrado(c.esposizione), finestra: c.esposizione === 2 && !c.inDifesa, inDifesa: c.inDifesa };
    if (c.inDifesa) {
      for (const capId of g.amb.difesa) {
        const cap = g.amb.capacita.find((x) => x.id === capId)!;
        const { soglia, nome } = sogliaDi(g, avv.sogliaDifesa!);
        const bonus = p.livelli[capId] ?? 0;
        const pen = penalitaPer(g, p, cap.ambito);
        const comp = componi({ testo: "il grado della tua ultima azione", valore: c.ultimoGrado }, [], 0);
        const imp = impedimento(g, p, capId);
        scelte.push({
          id: `difesa:${capId}`,
          testo: `Difenderti: ${cap.nome}`,
          tipo: "difesa",
          disponibile: !imp,
          richiede: imp,
          ricevuta: { ...comp, azione: `Difenderti (${cap.nome})`, capacita: cap.nome, livello: NOMI_LIVELLO[bonus], bonus, penalita: pen, soglia, sogliaNome: nome, probabilita: percentuale(probabilita(soglia, bonus, pen)), posta: postaAvversario(g, avv.id, c.ultimoGrado), ritento: false, unColpoSolo: false },
        });
      }
      // Se nessuna difesa è possibile, il colpo arriva: chi gioca lo vede e lo accetta, non resta bloccato.
      if (!scelte.some((s) => s.disponibile)) {
        scelte.push({ id: "subisci", testo: `Non puoi difenderti: subire il colpo. ${postaAvversario(g, avv.id, c.ultimoGrado)}`, tipo: "difesa", disponibile: true });
      }
    } else if (c.esposizione === 2) {
      for (const f of scena.confronto.fini) scelte.push({ id: `fine:${f.id}`, testo: f.testo, tipo: "finestra", disponibile: true });
    } else {
      for (const pd of avv.puntiDeboli) {
        const aperta = !pd.requisito || vale(g, p, pd.requisito);
        if (!aperta && !pd.richiede) continue;
        const imp = impedimento(g, p, pd.capacita);
        const posta = `${postaAvversario(g, avv.id, 2)} Se riesci, lo scopri di ${pd.gradi === 1 ? "un grado" : "due gradi"}.`;
        const ricevuta = ricevutaProva(g, p, pd.testo, pd.capacita, pd.soglia, [], posta, `${scena.id}:debole:${pd.id}`);
        scelte.push({ id: `debole:${pd.id}`, testo: pd.testo, tipo: "prova", disponibile: aperta && !imp, richiede: aperta ? imp : pd.richiede, ricevuta });
      }
      const parl = scena.confronto.parlare;
      if (parl && !c.parlato) {
        const aperta = !parl.requisito || vale(g, p, parl.requisito);
        const ricevuta = ricevutaProva(g, p, parl.testo, parl.capacita, parl.soglia, [], "Se non riesci, questa porta si chiude per tutto il confronto.", `${scena.id}:parlare`, true);
        scelte.push({ id: "parlare", testo: parl.testo, tipo: "parlare", disponibile: aperta, richiede: aperta ? undefined : parl.richiede, ricevuta });
      }
      scelte.push({ id: "andarsene", testo: scena.confronto.andarsene.testo, tipo: "andarsene", disponibile: true, povera: true });
    }
  } else if (!p.finita) {
    for (const s of scena.scelte ?? []) {
      const v = sceltaNormale(g, p, scena, s);
      if (v) scelte.push(v);
    }
    if (p.ritento && p.ritento.verso === scena.id && p.ritento.scena !== scena.id) {
      scelte.unshift({ id: "riprova", testo: "Riprovare (costa un passo)", tipo: "riprova", disponibile: true });
    }
  }

  return {
    scena: { id: scena.id, titolo: scena.titolo, testo: testoDi(g, p, scena.testo), luogo: luogo.nome, momento: mom.nome, presentazione: scena.presentazione },
    stato: {
      passo: p.passo,
      momento: mom.nome,
      scadenze: g.storia.scadenze.map((s) => `${s.nome}: ${p.scadenze[s.id]} su ${s.caselle}`),
      logorio: g.amb.logorii.map((l) => `${l.nome}: ${l.stadi[p.logorio[l.id].stadio - 1]}`),
      ferite: p.ferite.map((f) => `${f.nome} (${f.gravita})`),
      tracciaQui: p.traccia[luogo.zona] ?? 0,
      oggetti: Object.entries(p.oggetti).filter(([, n]) => n > 0).map(([id, n]) => `${g.storia.oggetti.find((o) => o.id === id)?.nome ?? id}${n > 1 ? ` ×${n}` : ""}`),
      parole: Object.keys(p.fatti).map((f) => nomeFatto(g, f)),
      conoscenze: Object.keys(p.conoscenze).map((k) => g.storia.conoscenze.find((x) => x.id === k)?.testo ?? k),
      capacita: g.amb.capacita.map((c) => `${c.nome}: ${NOMI_LIVELLO[p.livelli[c.id] ?? 0]}`),
      protezioni: Object.entries(p.protezioni).map(([id, s]) => `${g.amb.protezioni.find((x) => x.id === id)?.nome ?? id}: ${["intatta", "intaccata", "inservibile"][s]}`),
    },
    confronto,
    scelte,
    finale: p.finita?.tipo,
  };
}

// ---------------------------------------------------------------------------
// Agire
// ---------------------------------------------------------------------------

function tira(p: Partita, r: RicevutaPiena, eventi: Evento[]): boolean {
  const t = tiraDueDadi(p.rng);
  p.rng = t.stato;
  const totale = t.totale + r.bonus - r.penalita;
  const ok = totale >= r.soglia;
  const pen = r.penalita ? ` − ${r.penalita}` : "";
  eventi.push({
    tipo: "tiro",
    testo: `${r.azione}: ${t.dadi[0]} + ${t.dadi[1]} + ${r.bonus}${pen} = ${totale} contro ${r.soglia}. ${ok ? "Riesci" : "Non riesci"}, ${NOMI_GRADO[r.grado].toLowerCase()}.`,
    dati: { dadi: t.dadi, bonus: r.bonus, penalita: r.penalita, totale, soglia: r.soglia, riesce: ok, grado: r.grado },
  });
  return ok;
}

const CASELLE = [
  ["Successo pieno", "Fallimento pulito"],
  ["Successo sporco", "Rovescio minore"],
  ["Successo a caro prezzo", "Rovescio"],
] as const;

function consumaPreparazioni(g: Gioco, p: Partita): void {
  p.preparazioni = p.preparazioni.filter((x) => g.amb.preparazioni.find((d) => d.id === x.id)?.durata !== "prova");
}

function mostraCrescita(g: Gioco, p: Partita, capacita: string, tentativi: number, eventi: Evento[]): void {
  const prima = p.primaVolta[capacita];
  if (prima === undefined) p.primaVolta[capacita] = tentativi;
  else {
    const nome = g.amb.capacita.find((c) => c.id === capacita)?.nome ?? capacita;
    eventi.push({ tipo: "crescita", testo: `${nome}: ${tentativi} ${tentativi === 1 ? "tentativo" : "tentativi"}. La prima volta: ${prima}.` });
  }
}

/** Le sei caselle, per una prova fuori dal confronto (§11). Restituisce la scena successiva. */
function risolviProva(g: Gioco, p: Partita, scena: Scena, s: Scelta, eventi: Evento[]): { verso: string; tempo: number } {
  const pr = s.prova!;
  const chiave = `${scena.id}:${s.id}`;
  const r = ricevutaProva(g, p, s.testo, pr.capacita, pr.soglia, pr.righe, pr.posta, chiave, pr.unColpoSolo);
  const cap = g.amb.capacita.find((c) => c.id === pr.capacita)!;
  p.tentativi[chiave] = (p.tentativi[chiave] ?? 0) + 1;
  const ok = tira(p, r, eventi);
  consumaPreparazioni(g, p);
  if (pr.unColpoSolo) p.usate[chiave] = true;
  eventi.push({ tipo: "esito", testo: CASELLE[r.grado][ok ? 0 : 1], dati: { casella: CASELLE[r.grado][ok ? 0 : 1], riesce: ok, grado: r.grado } });
  let tempo = 0;

  if (ok) {
    tacca(g, p, cap.id, eventi);
    mostraCrescita(g, p, cap.id, p.tentativi[chiave], eventi);
    delete p.tentativi[chiave];
    if (r.grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    if (r.grado === 2 && pr.prezzo) {
      eventi.push({ tipo: "esito", testo: pr.prezzo.testo });
      tempo += applica(g, p, pr.prezzo.effetti, eventi);
    }
    tempo += applica(g, p, pr.riesci.effetti, eventi);
    return { verso: pr.riesci.vai, tempo };
  }

  if (r.grado === 2) {
    aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    for (const l of g.amb.logorii) if (l.saleCon.includes("rovescio") && l.ambiti.includes(cap.ambito)) tempo += applica(g, p, [{ logorio: l.id, piu: 1 }], eventi);
    // Il travestimento si perde con un rovescio.
    for (const def of g.amb.preparazioni) if (def.durata === "oggetto" && def.oggetto && (p.oggetti[def.oggetto] ?? 0) > 0) tempo += applica(g, p, [{ oggetto: def.oggetto, piu: -1 }], eventi);
    tempo += applica(g, p, pr.rovescio.effetti, eventi);
    return { verso: pr.rovescio.vai, tempo };
  }
  if (r.grado === 0 && pr.conoscenza) tempo += applica(g, p, [{ conoscenza: pr.conoscenza }], eventi);
  if (r.grado === 1) {
    aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    tempo += complicazione(g, p, eventi);
  }
  tempo += applica(g, p, pr.nonRiesci.effetti, eventi);
  if (!pr.unColpoSolo) p.ritento = { scena: scena.id, scelta: s.id, verso: pr.nonRiesci.vai };
  return { verso: pr.nonRiesci.vai, tempo };
}

/** La reazione dell'avversario dopo la tua azione (§17.2, punto 4). */
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

function agisciConfronto(g: Gioco, p: Partita, scena: Scena, id: string, eventi: Evento[]): { verso: string; tempo: number } | null {
  const c = p.confronto!;
  const conf = scena.confronto!;
  const avv = g.amb.avversari.find((a) => a.id === c.avversario)!;
  const resta = { verso: scena.id, tempo: 0 };

  if (id.startsWith("difesa:") || id === "subisci") {
    if (!c.inDifesa) throw new Error("Non c'è niente da cui difendersi.");
    const capId = id.slice(7);
    const v = vista(g, p).scelte.find((x) => x.id === id);
    if (!v || !v.disponibile || (id !== "subisci" && !v.ricevuta)) throw new Error(`Difesa non disponibile: ${capId}`);
    const ok = id === "subisci" ? false : tira(p, v.ricevuta!, eventi);
    c.inDifesa = false;
    const arma = g.amb.armi.find((a) => a.id === avv.pericolo.arma)!;
    if (ok) {
      tacca(g, p, capId, eventi);
      eventi.push({ tipo: "esito", testo: "Eviti il colpo." });
      if (c.ultimoGrado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    } else if (c.ultimoGrado === 0) {
      eventi.push({ tipo: "esito", testo: "Al coperto: il colpo non ti raggiunge." });
    } else {
      const gr = c.ultimoGrado === 1 ? arma.daEsposto : arma.daScoperto;
      ferisci(g, p, `un colpo (${arma.nome})`, gr, arma.colpisce, arma.tipo, eventi);
      aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    }
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
    const r = ricevutaProva(g, p, parl.testo, parl.capacita, parl.soglia, [], "", `${scena.id}:parlare`, true);
    c.parlato = true;
    c.ultimoGrado = r.grado;
    const ok = tira(p, r, eventi);
    consumaPreparazioni(g, p);
    if (r.grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    if (ok) {
      tacca(g, p, parl.capacita, eventi);
      return { verso: parl.riesci.vai, tempo: applica(g, p, parl.riesci.effetti, eventi) };
    }
    eventi.push({ tipo: "confronto", testo: "Non ti ascolta, e non ti ascolterà più." });
    reazione(g, p, scena, true, eventi);
    return resta;
  }

  if (id.startsWith("debole:")) {
    const pd = avv.puntiDeboli.find((x) => `debole:${x.id}` === id);
    if (!pd) throw new Error(`Punto debole inesistente: ${id}`);
    if (pd.requisito && !vale(g, p, pd.requisito)) throw new Error("Scelta chiusa.");
    if (impedimento(g, p, pd.capacita)) throw new Error("Una ferita te lo impedisce.");
    const r = ricevutaProva(g, p, pd.testo, pd.capacita, pd.soglia, [], "", `${scena.id}:${id}`);
    c.ultimoGrado = r.grado;
    const ok = tira(p, r, eventi);
    consumaPreparazioni(g, p);
    if (r.grado >= 1) aggiungiTraccia(g, p, luogoDi(g, p).zona, 1, eventi);
    if (ok) {
      tacca(g, p, pd.capacita, eventi);
      c.esposizione = Math.min(2, c.esposizione + pd.gradi) as Grado;
      eventi.push({ tipo: "confronto", testo: `${avv.nome} è ${nomeGrado(c.esposizione)}.` });
      if (c.esposizione === 2) {
        eventi.push({ tipo: "confronto", testo: "Si apre la finestra: decidi tu come finisce." });
        return resta;
      }
      reazione(g, p, scena, false, eventi);
    } else reazione(g, p, scena, true, eventi);
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
  const tempo = applica(g, p, scena.entrando, eventi);
  if (tempo) avanza(g, p, tempo, eventi);
  if (scena.finale) p.finita = { tipo: scena.finale.tipo };
}

/** Risolve una scelta. Non modifica la partita ricevuta: ne restituisce una nuova. */
export function agisci(g: Gioco, p0: Partita, sceltaId: string): { partita: Partita; eventi: Evento[] } {
  const p = clona(p0);
  const eventi: Evento[] = [];
  if (p.finita) throw new Error("La partita è finita.");
  const scena = scenaDi(g, p.scena);
  let esito: { verso: string; tempo: number } | null = null;

  if (scena.confronto && p.confronto) esito = agisciConfronto(g, p, scena, sceltaId, eventi);

  if (!esito && sceltaId === "riprova") {
    if (!p.ritento || p.ritento.verso !== scena.id) throw new Error("Non c'è niente da riprovare.");
    esito = { verso: p.ritento.scena, tempo: 0 };
  }

  if (!esito) {
    const s = (scena.scelte ?? []).find((x) => x.id === sceltaId);
    if (!s) throw new Error(`Scelta inesistente: ${sceltaId}`);
    const v = sceltaNormale(g, p, scena, s);
    if (!v || !v.disponibile) throw new Error(`Scelta non disponibile: ${sceltaId}`);
    if (s.unaVolta) p.usate[`${scena.id}:${s.id}`] = true;
    if (s.prova) {
      // Ritentare costa un passo, prima di tirare (§12).
      if ((p.tentativi[`${scena.id}:${s.id}`] ?? 0) > 0) {
        avanza(g, p, 1, eventi);
        if (p.deviazione) {
          const d = p.deviazione;
          delete p.deviazione;
          entra(g, p, d, eventi);
          return { partita: p, eventi };
        }
      }
      esito = risolviProva(g, p, scena, s, eventi);
      esito.tempo += applica(g, p, s.effetti, eventi);
    } else {
      esito = { verso: s.vai ?? scena.id, tempo: applica(g, p, s.effetti, eventi) };
    }
  }

  if (esito.tempo > 0) avanza(g, p, esito.tempo, eventi);
  let verso = esito.verso;
  if (p.deviazione) {
    verso = p.deviazione;
    delete p.deviazione;
  }
  if (verso !== p.scena) entra(g, p, verso, eventi);
  else if (p.deviazione) {
    const d = p.deviazione;
    delete p.deviazione;
    entra(g, p, d, eventi);
  }
  return { partita: p, eventi };
}

export { nuovaPartita, prepara } from "./stato.ts";
