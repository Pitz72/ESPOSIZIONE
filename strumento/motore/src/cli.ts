#!/usr/bin/env node
/**
 * esposizione — la riga di comando del motore 3.0.
 *
 *   node src/cli.ts gioca     [--seme N] [--scelte 1,2,3]   gioca nel terminale
 *   node src/cli.ts controlla                                i controlli del §47
 *   node src/cli.ts libro     [--uscita file.md]             genera il librogame
 *   node src/cli.ts simula    [--partite N]                  giocatori automatici (§54.2)
 *
 * Opzioni comuni: --ambientazione file.json --storia file.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Ambientazione, Storia } from "./tipi.ts";
import { prepara, nuovaPartita, type Evento, type Partita } from "./stato.ts";
import { agisci, vista, type Quadro, type Vista } from "./motore.ts";
import { controlla } from "./controlli.ts";
import { libro } from "./libro.ts";
import { POLITICHE, simula } from "./simulazione.ts";

const QUI = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const comando = args[0] ?? "gioca";
const opzione = (nome: string, predefinito?: string) => {
  const i = args.indexOf(`--${nome}`);
  return i >= 0 ? args[i + 1] : predefinito;
};

const amb: Ambientazione = JSON.parse(readFileSync(opzione("ambientazione", join(QUI, "../dati/porto.ambientazione.json"))!, "utf8"));
const storia: Storia = JSON.parse(readFileSync(opzione("storia", join(QUI, "../dati/santa-rita.storia.json"))!, "utf8"));
const g = prepara(amb, storia);
const A_CAPO = "\n";

const segno = (v: number) => (v > 0 ? `+${v}` : v < 0 ? `−${-v}` : ` ${v}`);

function quadro(q: Quadro): string {
  const out: string[] = [];
  out.push(`      PUOI?    ${q.puoi.aperta ? "sì" : `no: ${q.puoi.richiede}`}${q.puoi.righe.length ? ` · ${q.puoi.righe.join(" · ")}` : ""}`);
  const r = q.riesci;
  r.righe.forEach((x, i) => {
    const v = x.tipo === "soglia" ? ` ${x.valore}` : x.tipo === "nota" ? "   " : segno(x.valore);
    out.push(`      ${i === 0 ? "RIESCI?" : "       "}  ${v.padStart(3)}  ${x.testo}${x.nota ? `   — ${x.nota}` : ""}`);
  });
  out.push(r.nonSiTira ? "               ──  sotto Facile: non si tira" : `               ──  i dadi devono fare ${r.dadi}: in pieno ${r.fasce.pieno} · riesci ${r.fasce.riesci} · quasi ${r.fasce.quasi} · non riesci ${r.fasce.non}`);
  q.costo.righe.forEach((x, i) => {
    const v = x.tipo === "partenza" ? ` ${x.valore}` : segno(x.valore);
    out.push(`      ${i === 0 ? "COSTA? " : "       "}  ${v.padStart(3)}  ${x.testo}${x.nota ? `   — ${x.nota}` : ""}`);
  });
  out.push(`               ──  ${q.costo.somma}  ${["AL COPERTO", "ESPOSTO", "ALLO SCOPERTO"][q.grado]}${q.costo.nota ? `   — ${q.costo.nota}` : ""}`);
  out.push(`      DOPO?    riesci: ${q.dopo.riesci} · quasi: ${q.dopo.quasi.join(" / ")} · non riesci: ${q.dopo.nonRiesci}`);
  for (const x of q.dopo.persone) out.push(`               ${x}`);
  if (q.dopo.posta) out.push(`               ${q.dopo.posta}`);
  if (q.unColpoSolo) out.push("               Una volta sola.");
  if (q.ritento) out.push("               Ritentare ti costa un'ora.");
  return out.join(A_CAPO);
}

function mostra(v: Vista, eventi: Evento[]): string {
  const out: string[] = [];
  if (eventi.length) {
    out.push("");
    for (const e of eventi) out.push(`  · ${e.testo}`);
  }
  out.push("", `━━ ${v.scena.titolo} ━━  ${v.scena.luogo}, ${v.stato.momento} (ora ${v.stato.ora})`, "", v.scena.testo.replaceAll("*", ""), "");
  const stati = v.stato.statiAnimo.length ? ` · ${v.stato.statiAnimo.join(", ")}` : "";
  const ferite = v.stato.ferite.length ? ` · Ferite: ${v.stato.ferite.join(", ")}` : "";
  out.push(`  ${v.stato.scadenze.join(" · ")} · Traccia qui: ${v.stato.tracciaQui} · ${v.stato.logorio.join(" · ")}${stati}${ferite}`);
  if (v.confronto) out.push(`  Confronto: ${v.confronto.avversario} (${v.confronto.natura}), ora ${v.confronto.copertura}.${v.confronto.finestra ? " LA FINESTRA È APERTA." : ""}${v.confronto.inDifesa ? " TI ATTACCA: DIFENDITI." : ""}`);
  if (v.sospeso) out.push(`  ${v.sospeso.testo}`);
  if (v.finale) {
    out.push("", `  FINE (${v.finale}).`);
    return out.join(A_CAPO);
  }
  out.push("");
  let i = 0;
  for (const s of v.scelte) {
    if (s.disponibile) {
      i++;
      out.push(`  ${i}. ${s.ripiego ? "[ripiego] " : ""}${s.testo}${s.costa ? `  (${s.costa})` : ""}`);
    } else out.push(`   · ${s.testo}  (chiusa: ${s.richiede ?? "non disponibile"})`);
    if (s.quadro && s.disponibile) out.push(quadro(s.quadro));
  }
  return out.join(A_CAPO);
}

function scheda(v: Vista): string {
  const s = v.stato;
  return [
    "",
    `  ${s.capacita.join(" · ")}`,
    `  Tratti: ${s.tratti.map((x) => `${x.nome}${x.origine ? ` (${x.origine})` : ""}`).join(", ")}`,
    `  Cose: ${s.cose.map((x) => `${x.nome}${x.quante > 1 ? ` ×${x.quante}` : ""}${x.stato ? ` (${x.stato})` : ""}`).join(", ")}`,
    `  Protezioni: ${s.protezioni.join(", ")}`,
    `  Parole chiave: ${s.parole.join(", ") || "nessuna"}`,
    "  Convinzioni:",
    ...s.convinzioni.map((k) => `    - ${k.testo}${k.inDubbio ? " (in dubbio)" : ""}`),
    "  Persone:",
    ...s.persone.map((k) => `    - ${k.nome}: ${k.parole}`),
    "  Taccuino:",
    ...s.notizie.map((k) => `    - ${k.testo} [${k.stato}]${k.contrasto.length ? ` (in contrasto con: ${k.contrasto.join("; ")})` : ""}`),
  ].join(A_CAPO);
}

async function gioca(): Promise<void> {
  let p: Partita = nuovaPartita(g, Number(opzione("seme", String(Date.now() % 100000))));
  let eventi: Evento[] = [];
  const copione = opzione("scelte")?.split(",").map(Number);
  const rl = copione ? null : createInterface({ input: process.stdin, output: process.stdout });
  let passo = 0;
  while (true) {
    const v = vista(g, p);
    console.log(mostra(v, eventi));
    if (v.finale) break;
    const disponibili = v.scelte.filter((s) => s.disponibile);
    let n: number;
    if (copione) {
      if (passo >= copione.length) break;
      n = copione[passo++];
      console.log(`${A_CAPO}> ${n}`);
    } else {
      const r = (await rl!.question(`${A_CAPO}> `)).trim();
      if (r === "q" || r === "esci") break;
      if (r === "scheda") {
        console.log(scheda(v));
        eventi = [];
        continue;
      }
      n = Number(r);
    }
    const scelta = disponibili[n - 1];
    if (!scelta) {
      console.log("  Scegli un numero dell'elenco (oppure: scheda, esci).");
      eventi = [];
      continue;
    }
    const r = agisci(g, p, scelta.id);
    p = r.partita;
    eventi = r.eventi;
  }
  rl?.close();
}

switch (comando) {
  case "gioca":
    await gioca();
    break;
  case "controlla": {
    const r = controlla(amb, storia);
    for (const x of r) console.log(`${x.grave ? "ERRORE" : "avviso"}  [${x.controllo}] ${x.dove}: ${x.testo}`);
    const errori = r.filter((x) => x.grave).length;
    console.log(`${A_CAPO}${storia.scene.length} scene, ${errori} errori, ${r.length - errori} avvisi.`);
    process.exitCode = errori ? 1 : 0;
    break;
  }
  case "libro": {
    const uscita = opzione("uscita", join(QUI, `../libro/${storia.id}.md`))!;
    writeFileSync(uscita, libro(amb, storia));
    console.log(`Librogame scritto in ${uscita}`);
    break;
  }
  case "simula": {
    const partite = Number(opzione("partite", "500"));
    const tutte = new Set<string>();
    for (const pol of POLITICHE) {
      const r = simula(g, pol, partite);
      r.sceneViste.forEach((s) => tutte.add(s));
      const perc = (k: string) => `${Math.round(((r.esiti[k] ?? 0) / partite) * 100)}%`;
      const f = r.fasce;
      const totF = f.pieno + f.riesci + f.quasi + f.non || 1;
      const q = (x: number) => `${Math.round((x / totF) * 100)}`;
      console.log(`${pol.padEnd(12)} vittorie ${perc("vittoria")} · sconfitte ${perc("sconfitta")} · morti ${perc("morte")} · ore medie ${r.oreMedie.toFixed(1)} · azioni ${r.azioniMedie.toFixed(1)} · rovesci per partita ${r.rovesciMedi.toFixed(2)}`);
      console.log(`             fasce: in pieno ${q(f.pieno)} · riesci ${q(f.riesci)} · quasi ${q(f.quasi)} · non riesci ${q(f.non)}   quasi scelti: tutto ${r.quasi.tutto} · metà ${r.quasi.meta} · lascio ${r.quasi.lascia}`);
      if (r.bloccate.length) console.log(`             BLOCCATE: ${r.bloccate.slice(0, 5).join("; ")}`);
      if (r.errori.length) console.log(`             ERRORI: ${r.errori.slice(0, 5).join("; ")}`);
    }
    const mai = storia.scene.filter((s) => !tutte.has(s.id)).map((s) => s.id);
    console.log(`${A_CAPO}Scene mai raggiunte: ${mai.length ? mai.join(", ") : "nessuna"}`);
    break;
  }
  default:
    console.log("Comandi: gioca, controlla, libro, simula");
}
