/**
 * I test del motore 3.0. Molti controllano che i numeri del documento di design
 * (ESPOSIZIONE-DESIGN-3.md) siano quelli che il motore produce davvero.
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { componi, riuscita, tieni } from "../src/quadro.ts";
import { almeno, fasce, fascePercento, fasciaDi, percentuale } from "../src/dadi.ts";
import { prepara, nuovaPartita, type Partita } from "../src/stato.ts";
import { agisci, vista } from "../src/motore.ts";
import { controlla } from "../src/controlli.ts";
import { simula } from "../src/simulazione.ts";
import { libro } from "../src/libro.ts";
import type { Ambientazione, Grado, Storia } from "../src/tipi.ts";

const amb: Ambientazione = JSON.parse(readFileSync(new URL("../dati/porto.ambientazione.json", import.meta.url), "utf8"));
const storia: Storia = JSON.parse(readFileSync(new URL("../dati/santa-rita.storia.json", import.meta.url), "utf8"));
const g = prepara(amb, storia);

function a(p: Partita, id: string): Partita {
  return agisci(g, p, id).partita;
}

/** Una partita all'alba nella scena indicata. */
function in_(scena: string, ora = 0): Partita {
  const p = nuovaPartita(g, 1);
  p.scena = scena;
  p.ora = ora;
  return p;
}

// ---------------------------------------------------------------------------
// Dadi e fasce: l'appendice A e il §18.3
// ---------------------------------------------------------------------------

test("due dadi: le probabilità dell'appendice A", () => {
  const attese = [100, 97, 92, 83, 72, 58, 42, 28, 17, 8, 3];
  for (let n = 2; n <= 12; n++) assert.equal(percentuale(almeno(n)), attese[n - 2]);
});

test("le fasce esatte, in trentaseiesimi, sono quelle dell'appendice A", () => {
  const attese: Record<number, number[]> = {
    1: [30, 6, 0, 0], 2: [26, 10, 0, 0], 3: [21, 14, 1, 0], 4: [15, 18, 3, 0], 5: [10, 20, 5, 1], 6: [6, 20, 7, 3], 7: [3, 18, 9, 6],
    8: [1, 14, 11, 10], 9: [0, 10, 11, 15], 10: [0, 6, 9, 21], 11: [0, 3, 7, 26], 12: [0, 1, 5, 30], 13: [0, 0, 3, 33], 14: [0, 0, 1, 35],
  };
  for (const [d, v] of Object.entries(attese)) {
    const f = fasce(Number(d));
    assert.deepEqual([f.pieno, f.riesci, f.quasi, f.non], v, `d = ${d}`);
    assert.equal(v.reduce((s, x) => s + x, 0), 36);
  }
});

test("la tabella delle capacità del §18.3", () => {
  const attese = [
    ["17·56·19·8", "3·39·31·28", "0·17·25·58", "0·3·14·83"],
    ["28·56·14·3", "8·50·25·17", "0·28·31·42", "0·8·19·72"],
    ["42·50·8·0", "17·56·19·8", "3·39·31·28", "0·17·25·58"],
    ["58·39·3·0", "28·56·14·3", "8·50·25·17", "0·28·31·42"],
  ];
  [0, 1, 2, 3].forEach((liv) =>
    [6, 8, 10, 12].forEach((s, j) => {
      const f = fascePercento(s - liv);
      assert.equal(`${f.pieno}·${f.riesci}·${f.quasi}·${f.non}`, attese[liv][j]);
    }),
  );
});

test("In pieno più Riesci è la probabilità di riuscire del 2.0", () => {
  const due = [
    [72, 42, 17, 3],
    [83, 58, 28, 8],
    [92, 72, 42, 17],
    [97, 83, 58, 28],
  ];
  [0, 1, 2, 3].forEach((liv) => [6, 8, 10, 12].forEach((s, j) => {
    const f = fasce(s - liv);
    assert.equal(Math.round(((f.pieno + f.riesci) / 36) * 100), due[liv][j]);
  }));
});

test("le fasce del margine: +4, da 0 a +3, −1 e −2, −3 o meno", () => {
  assert.deepEqual([5, 4, 3, 0, -1, -2, -3, -8].map(fasciaDi), ["pieno", "pieno", "riesci", "riesci", "quasi", "quasi", "non", "non"]);
});

// ---------------------------------------------------------------------------
// Il quadro: §18.1 e §21.3
// ---------------------------------------------------------------------------

test("la soglia si sposta al massimo di un gradino per parte (§18.1)", () => {
  const r = riuscita({ testo: "Ardua", soglia: 10 }, [{ testo: "a", parte: "notizia" }, { testo: "b", parte: "tratto" }], [], { testo: "liv", valore: 0 }, [], []);
  assert.equal(r.soglia, 8);
  assert.deepEqual(r.righe.filter((x) => x.tipo === "gradino").map((x) => x.conta), [true, false]);
  const annulla = riuscita({ testo: "Ardua", soglia: 10 }, [{ testo: "a", parte: "notizia" }], [{ testo: "b", parte: "proprieta" }], { testo: "liv", valore: 0 }, [], []);
  assert.equal(annulla.soglia, 10);
  const sotto = riuscita({ testo: "Facile", soglia: 6 }, [{ testo: "a", parte: "notizia" }], [], { testo: "liv", valore: 0 }, [], []);
  assert.ok(sotto.nonSiTira);
});

test("attrezzi e aiuti valgono al massimo +2, le penalità al massimo −3", () => {
  const r = riuscita({ testo: "Impegnativa", soglia: 8 }, [], [], { testo: "liv", valore: 1 }, [1, 2, 3].map((i) => ({ testo: `s${i}`, parte: "cosa" as const })), [1, 2, 3, 4].map((i) => ({ testo: `p${i}`, parte: "ferita" as const })));
  assert.equal(r.bonus, 1 + 2 - 3);
});

test("l'esempio del §21.1: la preparazione non basta, le righe che alzano contano", () => {
  const c = componi({ testo: "partenza", valore: 1 }, [
    { tipo: "ambiente", testo: "sorveglianza", valore: 1 },
    { tipo: "ambiente", testo: "silenzio", valore: 1 },
    { tipo: "preparazione", testo: "ronda", valore: -1 },
  ], 1);
  assert.equal(c.somma, 2);
  assert.equal(c.grado, 2);
  assert.deepEqual(c.righe.map((r) => r.conta), [true, true, true, false]);
  assert.match(c.righe[3].nota!, /un'altra/);
});

test("l'ambiente conta al massimo 2 (§11.1)", () => {
  const c = componi({ testo: "p", valore: 0 }, [1, 2, 3].map((i) => ({ tipo: "ambiente" as const, testo: `a${i}`, valore: -1 })), 0);
  assert.equal(c.somma, -2);
  assert.equal(c.righe[3].conta, false);
  assert.match(c.righe[3].nota!, /al massimo 2/);
});

test("la garanzia del §21.3: togliere insieme le righe segnate non cambia il grado, e ognuna da sola non lo cambia", () => {
  let casi = 0;
  for (const partenza of [0, 1, 2] as Grado[])
    for (const fondo of [0, 1, 2] as Grado[]) {
      if (fondo > partenza) continue;
      for (const l of [-1, 0, 1])
        for (const m of [-1, 0, 1])
          for (const n of [-1, 0, 1])
            for (let agg = 0; agg <= 3; agg++)
              for (let prep = 0; prep <= 3; prep++) {
                const altre = [
                  { tipo: "ambiente" as const, testo: "l", valore: l },
                  { tipo: "ambiente" as const, testo: "m", valore: m },
                  { tipo: "ambiente" as const, testo: "n", valore: n },
                  ...Array.from({ length: agg }, (_, i) => ({ tipo: "aggravante" as const, testo: `a${i}`, valore: 1 })),
                  ...Array.from({ length: prep }, (_, i) => ({ tipo: "preparazione" as const, testo: `p${i}`, valore: -1 })),
                ];
                const c = componi({ testo: "p", valore: partenza }, altre, fondo);
                // Le righe dell'ambiente oltre il 2 sono già fuori dalla somma.
                const fuori = c.righe.map((r, i) => (r.nota?.includes("ambiente") ? i : -1)).filter((i) => i >= 0);
                const senza = (escludi: (i: number) => boolean) => tieni(c.righe.reduce((s, r, i) => (escludi(i) || fuori.includes(i) ? s : s + r.valore), 0), fondo);
                const segnate = c.righe.map((r, i) => (!r.conta ? i : -1)).filter((i) => i >= 0);
                assert.equal(senza((i) => segnate.includes(i)), c.grado, "togliere tutte le righe segnate");
                for (const i of segnate) assert.equal(senza((j) => j === i), c.grado, "togliere una riga segnata");
                casi++;
              }
    }
  assert.ok(casi > 1000);
});

// ---------------------------------------------------------------------------
// I dati del porto e la scena del §2
// ---------------------------------------------------------------------------

test("il porto e la storia di prova passano tutti i controlli, senza avvisi", () => {
  assert.deepEqual(controlla(amb, storia), []);
});

test("la scena del §2: archivio all'alba, i quadri", () => {
  const v = vista(g, in_("archivio"));
  const sottrarre = v.scelte.find((s) => s.id === "sottrarre")!.quadro!;
  assert.equal(sottrarre.grado, 0);
  assert.deepEqual(sottrarre.riesci.fasce, { pieno: 17, riesci: 56, quasi: 19, non: 8 });
  assert.equal(sottrarre.riesci.probabilita, 72);
  assert.ok(sottrarre.riesci.righe.some((r) => r.parte === "cosa" && /borsa/.test(r.testo)));
  // «Leggo il registro al contrario» c'è per chi ha Vista acuta e Sa leggere.
  const leggi = v.scelte.find((s) => s.id === "leggi")!;
  assert.ok(leggi.disponibile);
  assert.equal(leggi.quadro!.riesci.soglia, 8);
  // Chiedere è esposto: Persuadere non scende sotto il suo Fondo.
  const chiedere = v.scelte.find((s) => s.id === "chiedere")!.quadro!;
  assert.equal(chiedere.grado, 1);
  assert.deepEqual(chiedere.riesci.fasce, { pieno: 3, riesci: 39, quasi: 31, non: 28 });
  assert.ok(v.scelte.find((s) => s.id === "facchino")!.ripiego);
});

test("l'inversione del §19.4: di notte entrare è facile e prendere è pericoloso", () => {
  const p = in_("archivio", 18);
  const v = vista(g, p);
  assert.equal(v.stato.momento, "la notte");
  assert.equal(v.scelte.find((s) => s.id === "grondaia")!.quadro!.grado, 0);
  p.scena = "archivio_notte";
  assert.equal(vista(g, p).scelte.find((s) => s.id === "armadio")!.quadro!.grado, 2);
});

test("una proprietà vale una volta sola: all'alba il Gallo ha la folla una volta", () => {
  const v = vista(g, in_("gallo"));
  const righe = v.scelte.find((s) => s.id === "oste")!.quadro!.costo.righe.filter((r) => /folla/.test(r.testo));
  assert.equal(righe.length, 1);
});

// ---------------------------------------------------------------------------
// Le fasce in gioco: il Quasi e il Non riesci (§28)
// ---------------------------------------------------------------------------

function semeCon(scena: string, scelta: string, fascia: string, ora = 0): Partita {
  for (let seme = 1; seme < 2000; seme++) {
    const p = in_(scena, ora);
    p.rng = seme;
    const r = agisci(g, p, scelta);
    if (r.eventi.some((e) => e.dati && "come" in e.dati && e.dati.fascia === fascia)) {
      p.rng = seme;
      return p;
    }
  }
  throw new Error(`nessun seme dà ${fascia}`);
}

test("il Quasi al coperto: tutto costa una tacca di Traccia, la metà niente, lasciar perdere niente (§28.3)", () => {
  const p = semeCon("archivio", "sottrarre", "quasi");
  const q = a(p, "sottrarre");
  assert.equal(q.scena, "archivio");
  const v = vista(g, q);
  assert.equal(v.sospeso?.tipo, "quasi");
  assert.deepEqual(v.scelte.map((s) => s.id), ["quasi:tutto", "quasi:meta", "quasi:lascia"]);
  const tutto = a(q, "quasi:tutto");
  assert.equal(tutto.scena, "registro");
  assert.equal(tutto.traccia.archivio, 1);
  const meta = a(q, "quasi:meta");
  assert.equal(meta.scena, "registro_meta");
  assert.equal(meta.traccia.archivio ?? 0, 0);
  const lascia = a(q, "quasi:lascia");
  assert.equal(lascia.scena, "archivio");
  assert.equal(lascia.traccia.archivio ?? 0, 0);
});

test("il Non riesci dà la sua notizia a ogni grado (§28.4)", () => {
  const p = semeCon("archivio", "sottrarre", "non");
  const q = a(p, "sottrarre");
  assert.equal(q.notizie.bressan_armadio, "sentita");
  const e = semeCon("archivio", "chiedere", "non");
  const r = a(e, "chiedere");
  assert.equal(r.notizie.bressan_paura, "sentita");
  assert.equal(r.traccia.archivio, 1, "esposto: una tacca di Traccia");
});

test("In pieno: il dono predefinito è la notizia del Non riesci (§28.1)", () => {
  const p = semeCon("archivio", "sottrarre", "pieno");
  const q = a(p, "sottrarre");
  assert.equal(q.scena, "registro");
  assert.ok(q.notizie.bressan_armadio);
});

test("ritentare costa un'ora (§22)", () => {
  const p = semeCon("liberare", "forza", "non", 6);
  const dopo = a(p, "forza");
  assert.equal(dopo.scena, "liberare_fallito");
  const tornato = a(dopo, "torna");
  assert.equal(tornato.ora, dopo.ora, "tornare alla prova non costa niente");
  const ancora = agisci(g, tornato, "forza");
  assert.equal(ancora.partita.ora > tornato.ora, true, "il nuovo tentativo costa tempo");
  assert.equal(ancora.eventi.find((e) => e.tipo === "tempo")?.testo.startsWith("Passa un'ora"), true);
});

// ---------------------------------------------------------------------------
// Scelte esaurite, notizie, convinzioni, tratti, persone
// ---------------------------------------------------------------------------

test("le scelte che non danno più niente spariscono (§15.6)", () => {
  let p = in_("archivio");
  assert.ok(vista(g, p).scelte.some((s) => s.id === "osserva"));
  p = a(p, "osserva");
  assert.equal(vista(g, p).scelte.some((s) => s.id === "osserva"), false, "hai già osservato il salone");
  // Chi sa già tutto quello che Bressan direbbe non ha più ragione di chiederglielo.
  const q = in_("archivio");
  for (const n of ["matteo_a_bordo", "nome_capitano", "carico_grimani", "casse_pesanti"]) q.notizie[n] = "verificata";
  assert.equal(vista(g, q).scelte.some((s) => s.id === "chiedere"), false);
  // Muoversi non si esaurisce mai.
  assert.ok(vista(g, q).scelte.some((s) => s.id === "esci"));
});

test("una notizia falsa si smentisce, e non entra mai nel quadro (§8)", () => {
  let p = in_("banchina");
  p = a(p, "facchini");
  assert.equal(p.notizie.matteo_donna, "sentita");
  const v = vista(g, p);
  assert.equal(v.stato.notizie.find((n) => n.id === "matteo_donna")!.stato, "sentita");
  // Vedere il registro con i propri occhi la smentisce.
  const s = in_("archivio");
  s.notizie.matteo_donna = "sentita";
  s.rng = semeCon("archivio", "sottrarre", "riesci").rng;
  const q = a(s, "sottrarre");
  assert.equal(q.notizie.matteo_a_bordo, "verificata");
  assert.equal(q.notizie.matteo_donna, "smentita");
  // Nessuna voce del catalogo si sposta per una notizia falsa: il controllo 17 lo garantisce.
  assert.equal(controlla(amb, storia).filter((x) => x.controllo === "17").length, 0);
});

test("una convinzione chiude una scelta, e «Ci ripenso» la può togliere (§8.4–8.5)", () => {
  const p = in_("passerella", 6);
  p.notizie.serra_no_morti = "sentita";
  const chiusa = vista(g, p).scelte.find((s) => s.id === "serra")!;
  assert.equal(chiusa.disponibile, false);
  assert.equal(chiusa.chiusaDa, "convinzione");
  p.scena = "chiesa";
  const ripensa = vista(g, p).scelte.find((s) => s.id === "ripensa:grimani_nemici");
  assert.ok(ripensa, "in chiesa si può ripensare");
  let q = a(p, "ripensa:grimani_nemici");
  assert.equal(vista(g, q).sospeso?.tipo, "ripensa");
  q = a(q, "ripensa:lascia");
  assert.equal(q.convinzioni.grimani_nemici, undefined);
  q.scena = "passerella";
  q.ora = 6;
  assert.equal(vista(g, q).scelte.find((s) => s.id === "serra")!.disponibile, true);
});

test("mettere insieme due notizie ne dà una terza (§8.3)", () => {
  const p = in_("chiesa");
  p.notizie.carico_grimani = "sentita";
  p.notizie.casse_pesanti = "sentita";
  const q = a(p, "deduci:armi");
  assert.equal(q.notizie.grimani_armi, "sentita");
  assert.equal(q.ora, 1);
});

test("i tratti aprono vie, e la forza che manca dice le alternative (§6)", () => {
  const p = in_("passerella", 6);
  assert.ok(vista(g, p).scelte.find((s) => s.id === "portello")!.disponibile, "Minuto passa dal portello");
  delete p.tratti.minuto;
  assert.equal(vista(g, p).scelte.find((s) => s.id === "portello")!.disponibile, false);
  const l = in_("liberare", 20);
  const strappa = vista(g, l).scelte.find((s) => s.id === "strappa")!;
  assert.equal(strappa.disponibile, false);
  assert.match(strappa.richiede!, /robusto, oppure una leva/);
  l.cose.leva = 1;
  assert.equal(vista(g, l).scelte.find((s) => s.id === "strappa")!.disponibile, true);
  // Chi non sa nuotare non si butta in acqua.
  const al = in_("allarme", 20);
  assert.match(vista(g, al).scelte.find((s) => s.id === "tuffo")!.richiede!, /nuotare/);
});

test("un aiuto vale +1 e costa un favore (§30.3)", () => {
  const p = in_("gallo");
  const q = vista(g, p).scelte.find((s) => s.id === "ascolta_zeno")!.quadro!;
  assert.ok(q.riesci.righe.some((r) => r.parte === "aiuto"));
  assert.equal(q.riesci.bonus, 3);
  const r = a(semeCon("gallo", "ascolta_zeno", "riesci"), "ascolta_zeno");
  assert.equal(r.persone.zeno.dim.debito, 0);
});

test("una persona che si fida di te abbassa la soglia (§29)", () => {
  const p = in_("gallo");
  const q = vista(g, p).scelte.find((s) => s.id === "oste")!.quadro!;
  assert.ok(q.riesci.righe.some((r) => r.parte === "legame" && r.conta));
  assert.equal(q.riesci.soglia, 4);
  assert.ok(q.riesci.nonSiTira, "sotto Facile non si tira");
});

test("una luce accesa annulla il buio: niente gradino in più, e niente copertura (§11)", () => {
  const p = in_("archivio_notte", 18);
  const buio = vista(g, p).scelte.find((s) => s.id === "armadio")!.quadro!;
  assert.equal(buio.riesci.soglia, 8, "al buio il lucchetto è un gradino più difficile");
  const acceso = a(p, "combina:accendi");
  assert.ok(acceso.cose.lanterna_accesa);
  const luce = vista(g, acceso).scelte.find((s) => s.id === "armadio")!.quadro!;
  assert.equal(luce.riesci.soglia, 6);
  assert.ok(luce.riesci.righe.some((r) => r.tipo === "nota" && /luce/.test(r.testo)));
});

// ---------------------------------------------------------------------------
// Confronto, violenza, ripetibilità
// ---------------------------------------------------------------------------

test("il confronto: la finestra si apre allo scoperto e non si tira", () => {
  const r = in_("bressan_nega");
  r.confronto = { scena: "bressan_nega", avversario: "bressan", esposizione: 2, partenza: 0, ultimoGrado: 0, parlato: false, inDifesa: false };
  const v = vista(g, r);
  assert.ok(v.confronto?.finestra);
  assert.deepEqual(v.scelte.map((s) => s.tipo), ["finestra", "finestra"]);
  const fine = agisci(g, r, "fine:parla");
  assert.equal(fine.partita.scena, "bressan_parla");
  assert.equal(fine.eventi.some((e) => e.tipo === "tiro"), false);
});

test("nessuna morte senza avviso: senza difese possibili il colpo si subisce, e la posta lo dice", () => {
  const p = in_("stiva_teodoro", 20);
  p.ferite.push({ nome: "una gamba rotta", gravita: "grave", ambito: "corpo", ore: 0 });
  p.confronto = { scena: "stiva_teodoro", avversario: "teodoro", esposizione: 1, partenza: 0, ultimoGrado: 2, parlato: false, inDifesa: true };
  const v = vista(g, p);
  assert.deepEqual(v.scelte.filter((s) => s.disponibile).map((s) => s.id), ["subisci"]);
  assert.match(v.scelte.find((s) => s.id === "subisci")!.testo, /ferita mortale/);
});

test("il Quasi della difesa: il colpo di striscio declassa la ferita (§38)", () => {
  for (let seme = 1; seme < 3000; seme++) {
    const p = in_("stiva_teodoro", 20);
    p.rng = seme;
    p.protezioni = {};
    p.confronto = { scena: "stiva_teodoro", avversario: "teodoro", esposizione: 1, partenza: 0, ultimoGrado: 1, parlato: false, inDifesa: true };
    const r = agisci(g, p, "difesa:muoversi");
    if (!r.partita.quasi) continue;
    const dopo = a(r.partita, "quasi:ferita");
    assert.equal(dopo.ferite[0].gravita, "lieve", "il coltello da esposto fa grave: di striscio, lieve");
    return;
  }
  assert.fail("nessun Quasi in difesa");
});

test("la stessa partita con lo stesso seme si rigioca identica (§48.3)", () => {
  const gioca = (seme: number) => {
    let p = nuovaPartita(g, seme);
    const scelte: string[] = [];
    for (let i = 0; i < 40 && !p.finita; i++) {
      const s = vista(g, p).scelte.find((x) => x.disponibile)!;
      scelte.push(`${p.scena}:${s.id}`);
      p = a(p, s.id);
    }
    return JSON.stringify({ p, scelte });
  };
  assert.equal(gioca(42), gioca(42));
});

test("simulazione: nessuna partita si blocca, nessun errore, nessun ciclo infinito", () => {
  for (const pol of ["casuale", "prudente", "temeraria", "sempre-tutto", "sempre-lascio"] as const) {
    const r = simula(g, pol, 120);
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
  assert.ok(md.includes("In pieno"));
  assert.ok(md.includes("Quasi"));
});
