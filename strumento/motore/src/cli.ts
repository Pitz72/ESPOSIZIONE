#!/usr/bin/env node
/**
 * esposizione — la riga di comando del motore 2.0.
 *
 *   node src/cli.ts gioca     [--seme N] [--scelte 1,2,3]   gioca nel terminale
 *   node src/cli.ts controlla                                i controlli del §20
 *   node src/cli.ts libro     [--uscita file.md]             genera il librogame
 *   node src/cli.ts simula    [--partite N]                  giocatori automatici
 *
 * Opzioni comuni: --ambientazione file.json --storia file.json
 */

import { readFileSync, writeFileSync } from "node:fs";
import { createInterface } from "node:readline/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import type { Ambientazione, Storia } from "./tipi.ts";
import { prepara, nuovaPartita, type Evento, type Partita } from "./stato.ts";
import { agisci, vista, type RicevutaPiena, type Vista } from "./motore.ts";
import { controlla } from "./controlli.ts";
import { libro } from "./libro.ts";
import { simula, type Politica } from "./simulazione.ts";

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

function ricevuta(r: RicevutaPiena): string {
  const righe = r.righe.map((x) => {
    const v = x.tipo === "partenza" ? ` ${x.valore}` : x.valore > 0 ? `+${x.valore}` : `−${-x.valore}`;
    return `      ${v.padStart(3)}   ${x.testo}${x.nota ? `   — ${x.nota}` : ""}`;
  });
  return [
    ...righe,
    "      ───",
    `      ${String(r.somma).padStart(3)}   ${["AL COPERTO", "ESPOSTO", "ALLO SCOPERTO"][r.grado]}${r.somma < r.grado ? `   (${r.capacita} non scende sotto ${["al coperto", "esposto", "allo scoperto"][r.fondo]})` : r.somma > 2 ? "   (più di allo scoperto non si va)" : ""}${r.nota ? `   — ${r.nota}` : ""}`,
    `      Prova: ${r.sogliaNome} (${r.soglia}). ${r.capacita}, ${r.livello} (+${r.bonus})${r.penalita ? `, penalità −${r.penalita}` : ""}: riesci ${r.probabilita} volte su 100.${r.unColpoSolo ? " Una volta sola." : ""}${r.ritento ? " Ritentare costa un passo." : ""}`,
    r.posta ? `      ${r.posta}` : "",
  ].filter(Boolean).join("\n");
}

function mostra(v: Vista, eventi: Evento[]): string {
  const out: string[] = [];
  if (eventi.length) {
    out.push("");
    for (const e of eventi) out.push(`  · ${e.testo}`);
  }
  out.push("", `━━ ${v.scena.titolo} ━━  ${v.scena.luogo}, ${v.stato.momento} (passo ${v.stato.passo})`, "", v.scena.testo.replace(/\*/g, ""), "");
  out.push(`  ${v.stato.scadenze.join(" · ")} · Traccia qui: ${v.stato.tracciaQui} · ${v.stato.logorio.join(" · ")}${v.stato.ferite.length ? ` · Ferite: ${v.stato.ferite.join(", ")}` : ""}`);
  if (v.confronto) out.push(`  Confronto: ${v.confronto.avversario} (${v.confronto.natura}), ora ${v.confronto.copertura}.${v.confronto.finestra ? " LA FINESTRA È APERTA." : ""}${v.confronto.inDifesa ? " TI ATTACCA: DIFENDITI." : ""}`);
  if (v.finale) {
    out.push("", `  FINE (${v.finale}).`);
    return out.join("\n");
  }
  out.push("");
  let i = 0;
  for (const s of v.scelte) {
    if (s.disponibile) {
      i++;
      out.push(`  ${i}. ${s.povera ? "[via povera] " : ""}${s.testo}`);
    } else out.push(`   · ${s.testo}  (chiusa: ${s.richiede ?? "non disponibile"})`);
    if (s.ricevuta && s.disponibile) out.push(ricevuta(s.ricevuta));
  }
  return out.join("\n");
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
      console.log(`\n> ${n}`);
    } else {
      const r = (await rl!.question("\n> ")).trim();
      if (r === "q" || r === "esci") break;
      if (r === "scheda") {
        console.log(`\n  ${v.stato.capacita.join(" · ")}\n  Oggetti: ${v.stato.oggetti.join(", ")}\n  Protezioni: ${v.stato.protezioni.join(", ")}\n  Parole chiave: ${v.stato.parole.join(", ") || "nessuna"}\n  Taccuino:\n${v.stato.conoscenze.map((k) => `    - ${k}`).join("\n")}`);
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
    console.log(`\n${storia.scene.length} scene, ${errori} errori, ${r.length - errori} avvisi.`);
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
    for (const pol of ["casuale", "prudente", "temeraria"] as Politica[]) {
      const r = simula(g, pol, partite);
      r.sceneViste.forEach((s) => tutte.add(s));
      const perc = (k: string) => `${Math.round(((r.esiti[k] ?? 0) / partite) * 100)}%`;
      console.log(`${pol.padEnd(10)} vittorie ${perc("vittoria")} · sconfitte ${perc("sconfitta")} · morti ${perc("morte")} · passi medi ${r.passiMedi.toFixed(1)} · azioni medie ${r.azioniMedie.toFixed(1)}`);
      console.log(`           finali: ${Object.entries(r.finali).sort((a, b) => b[1] - a[1]).map(([k, v]) => `${k} ${v}`).join(", ")}`);
      if (r.bloccate.length) console.log(`           BLOCCATE: ${r.bloccate.slice(0, 5).join("; ")}`);
      if (r.errori.length) console.log(`           ERRORI: ${r.errori.slice(0, 5).join("; ")}`);
    }
    const mai = storia.scene.filter((s) => !tutte.has(s.id)).map((s) => s.id);
    console.log(`\nScene mai raggiunte: ${mai.length ? mai.join(", ") : "nessuna"}`);
    break;
  }
  default:
    console.log("Comandi: gioca, controlla, libro, simula");
}
