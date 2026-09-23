/**
 * I test del motore 2.0. Molti controllano che i numeri del documento di design
 * (ESPOSIZIONE-DESIGN.md) siano quelli che il motore produce davvero.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { componi, tieni } from "../src/ricevuta.ts";
import { almeno, percentuale, probabilita } from "../src/dadi.ts";
import { prepara, nuovaPartita, type Partita } from "../src/stato.ts";
import { agisci, vista } from "../src/motore.ts";
import { controlla } from "../src/controlli.ts";
import { simula } from "../src/simulazione.ts";
import { libro } from "../src/libro.ts";
import type { Ambientazione, Grado, Storia } from "../src/tipi.ts";

const amb: Ambientazione = JSON.parse(readFileSync(new URL("../dati/porto.ambientazione.json", import.meta.url), "utf8"));
const storia: Storia = JSON.parse(readFileSync(new URL("../dati/santa-rita.storia.json", import.meta.url), "utf8"));
const g = prepara(amb, storia);

// ---------------------------------------------------------------------------
// Dadi: la tabella del §8 e dell'appendice A
// ---------------------------------------------------------------------------

test("la tabella delle probabilità è quella del §8", () => {
  const attese = [
    [72, 42, 17, 3],
    [83, 58, 28, 8],
    [92, 72, 42, 17],
    [97, 83, 58, 28],
  ];
  [0, 1, 2, 3].forEach((liv) => [6, 8, 10, 12].forEach((s, j) => assert.equal(percentuale(probabilita(s, liv, 0)), attese[liv][j])));
});

test("due dadi: le probabilità dell'appendice A", () => {
  const attese = [100, 97, 92, 83, 72, 58, 42, 28, 17, 8, 3];
  for (let n = 2; n <= 12; n++) assert.equal(percentuale(almeno(n)), attese[n - 2]);
});

// ---------------------------------------------------------------------------
// Ricevuta: la tabella del §10.2
// ---------------------------------------------------------------------------

test("l'esempio del §10.1: la preparazione non basta, le aggravanti contano", () => {
  const c = componi({ testo: "partenza", valore: 0 }, [
    { tipo: "luogo", testo: "archivio", valore: 1 },
    { tipo: "momento", testo: "notte", valore: 1 },
    { tipo: "aggravante", testo: "visto", valore: 1 },
    { tipo: "preparazione", testo: "osservato", valore: -1 },
  ], 0);
  assert.equal(c.somma, 2);
  assert.equal(c.grado, 2);
  assert.deepEqual(c.righe.map((r) => r.conta), [true, true, true, true, false]);
  assert.match(c.righe[4].nota!, /un'altra/);
});

test("la garanzia del §10.2: togliere insieme le righe segnate non cambia il grado, e ognuna da sola non lo cambia", () => {
  // Tutte le combinazioni: partenza, fondo ≤ partenza, luogo, momento, 0–3 aggravanti, 0–3 preparazioni.
  let casi = 0;
  for (const partenza of [0, 1, 2] as Grado[])
    for (const fondo of [0, 1, 2] as Grado[]) {
      if (fondo > partenza) continue;
      for (const l of [-1, 0, 1])
        for (const m of [-1, 0, 1])
          for (let agg = 0; agg <= 3; agg++)
            for (let prep = 0; prep <= 3; prep++) {
              const altre = [
                { tipo: "luogo" as const, testo: "l", valore: l },
                { tipo: "momento" as const, testo: "m", valore: m },
                ...Array.from({ length: agg }, (_, i) => ({ tipo: "aggravante" as const, testo: `a${i}`, valore: 1 })),
                ...Array.from({ length: prep }, (_, i) => ({ tipo: "preparazione" as const, testo: `p${i}`, valore: -1 })),
              ];
              const c = componi({ testo: "p", valore: partenza }, altre, fondo);
              const senza = (escludi: (i: number) => boolean) =>
                tieni(c.righe.reduce((s, r, i) => (escludi(i) ? s : s + r.valore), 0), fondo);
              const segnate = c.righe.map((r, i) => (!r.conta ? i : -1)).filter((i) => i >= 0);
              assert.equal(senza((i) => segnate.includes(i)), c.grado, "togliere tutte le righe segnate");
              for (const i of segnate) assert.equal(senza((j) => j === i), c.grado, "togliere una riga segnata");
              casi++;
            }
    }
  assert.ok(casi > 500);
});

// ---------------------------------------------------------------------------
// I dati del porto
// ---------------------------------------------------------------------------

test("il porto e la storia di prova passano tutti i controlli", () => {
  const r = controlla(amb, storia);
  assert.deepEqual(r.filter((x) => x.grave), []);
});

function a(p: Partita, id: string): Partita {
  return agisci(g, p, id).partita;
}

test("la scena del §2: archivio all'alba, le due ricevute", () => {
  let p = nuovaPartita(g, 1);
  p = a(p, "via");
  p.passo = 0; // lo spostamento costa un passo: per la prova rimettiamo l'alba
  p.scena = "archivio";
  const v = vista(g, p);
  const sottrarre = v.scelte.find((s) => s.id === "sottrarre")!.ricevuta!;
  assert.equal(sottrarre.somma, 0);
  assert.equal(sottrarre.grado, 0);
  assert.equal(sottrarre.probabilita, 58);
  const chiedere = v.scelte.find((s) => s.id === "chiedere")!.ricevuta!;
  assert.equal(chiedere.somma, 0);
  assert.equal(chiedere.grado, 1);
  assert.equal(chiedere.righe.find((r) => r.tipo === "momento")!.conta, false);
  assert.equal(chiedere.probabilita, 42);
});

test("l'inversione del §9.2: di notte entrare è facile e prendere è pericoloso", () => {
  const p = nuovaPartita(g, 1);
  p.scena = "archivio";
  p.passo = 12; // la notte
  const v = vista(g, p);
  assert.equal(v.stato.momento, "la notte");
  assert.equal(v.scelte.find((s) => s.id === "grondaia")!.ricevuta!.grado, 0);
  p.scena = "archivio_notte";
  assert.equal(vista(g, p).scelte.find((s) => s.id === "armadio")!.ricevuta!.grado, 2);
});

test("la stessa partita con lo stesso seme si rigioca identica (§22.3)", () => {
  const gioca = (seme: number) => {
    let p = nuovaPartita(g, seme);
    const storiaScelte: string[] = [];
    for (let i = 0; i < 40 && !p.finita; i++) {
      const s = vista(g, p).scelte.find((x) => x.disponibile)!;
      storiaScelte.push(`${p.scena}:${s.id}`);
      p = a(p, s.id);
    }
    return JSON.stringify({ p, storiaScelte });
  };
  assert.equal(gioca(42), gioca(42));
});

test("le scelte chiuse si mostrano con il loro requisito (§4.4)", () => {
  const p = nuovaPartita(g, 1);
  p.scena = "banchina";
  const nave = vista(g, p).scelte.find((s) => s.id === "nave")!;
  assert.equal(nave.disponibile, false);
  assert.equal(nave.richiede, "sapere che Matteo è a bordo");
});

test("ritentare costa un passo (§12)", () => {
  // Cerchiamo un seme in cui il primo tentativo non riesca e non sia un rovescio.
  for (let seme = 1; seme < 200; seme++) {
    const p = nuovaPartita(g, seme);
    p.scena = "liberare";
    p.passo = 4; // di giorno: forzare sulla nave è esposto
    const dopo = a(p, "forza");
    if (dopo.scena === "liberare_fallito") {
      const tornato = a(dopo, "torna");
      assert.equal(tornato.passo, dopo.passo, "tornare alla prova non costa niente");
      const ancora = agisci(g, tornato, "forza");
      assert.ok(ancora.eventi[0].tipo === "tempo", "il primo evento del nuovo tentativo è il passo che costa");
      return;
    }
  }
  assert.fail("nessun seme ha prodotto un fallimento");
});

test("il confronto: la finestra si apre allo scoperto e non si tira", () => {
  const r = nuovaPartita(g, 5);
  r.scena = "bressan_nega";
  r.confronto = { scena: "bressan_nega", avversario: "bressan", esposizione: 2, partenza: 0, ultimoGrado: 0, parlato: false, inDifesa: false };
  const v = vista(g, r);
  assert.ok(v.confronto?.finestra);
  assert.deepEqual(v.scelte.map((s) => s.tipo), ["finestra", "finestra"]);
  const fine = agisci(g, r, "fine:parla");
  assert.equal(fine.partita.scena, "bressan_parla");
  assert.equal(fine.eventi.some((e) => e.tipo === "tiro"), false);
});

test("al coperto il dado non può rovinarti: nessun fallimento senza rovescio chiude la storia (controllo 19)", () => {
  for (const s of storia.scene)
    for (const c of s.scelte ?? []) {
      if (!c.prova) continue;
      const dopo = storia.scene.find((x) => x.id === c.prova!.nonRiesci.vai)!;
      assert.equal(dopo.finale, undefined, `${s.id}:${c.id} porta a un finale`);
    }
  assert.deepEqual(controlla(amb, storia).filter((x) => x.controllo === "19"), []);
});

test("nessuna morte senza avviso: senza difese possibili il colpo si subisce, e la posta lo dice", () => {
  const p = nuovaPartita(g, 9);
  p.scena = "stiva_teodoro";
  p.ferite.push({ nome: "una gamba rotta", gravita: "grave", ambito: "corpo", passi: 0 });
  p.confronto = { scena: "stiva_teodoro", avversario: "teodoro", esposizione: 1, partenza: 0, ultimoGrado: 2, parlato: false, inDifesa: true };
  const v = vista(g, p);
  assert.deepEqual(v.scelte.filter((s) => s.disponibile).map((s) => s.id), ["subisci"]);
  assert.match(v.scelte.find((s) => s.id === "subisci")!.testo, /ferita mortale/);
});

test("simulazione: nessuna partita si blocca, nessun errore, nessun ciclo infinito", () => {
  for (const pol of ["casuale", "prudente", "temeraria"] as const) {
    const r = simula(g, pol, 150);
    assert.deepEqual(r.errori, [], pol);
    assert.deepEqual(r.bloccate, [], pol);
    assert.equal(r.esiti["troppo lunga"] ?? 0, 0, pol);
  }
});

test("il librogame numera ogni scena e comincia dal paragrafo 1", () => {
  const md = libro(amb, storia);
  for (let i = 1; i <= storia.scene.length; i++) assert.ok(md.includes(`### ${i}\n`), `manca il paragrafo ${i}`);
  assert.ok(md.indexOf("### 1\n") < md.indexOf("### 2\n"));
  assert.ok(md.includes("Tuo fratello Matteo non torna a casa"));
});
