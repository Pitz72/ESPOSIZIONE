import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Story, RuntimeState } from "./types.ts";
import { newGame, resolveNode, choose, gradeTier, degrade, applyEffects } from "./index.ts";

function loadExample(): Story {
  const url = new URL("../../examples/atrio-villa.iwstory.json", import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as Story;
}

test("newGame inizializza stato e applica onEnter dell'entry", () => {
  const story = loadExample();
  const s = newGame(story, { seed: 1 });
  assert.equal(s.currentNodeId, "atrio");
  assert.equal(s.vars.haChiave, false);
  assert.equal(s.vars.approccio, "cauto");
  assert.equal(s.resources.morale, 3);
  // onEnter: startThread indagine_villa
  assert.equal(s.threads.indagine_villa, "avviata");
});

test("resolveNode filtra le voci e nasconde le scelte non disponibili", () => {
  const story = loadExample();
  const senzaEmpatia = newGame(story, { seed: 1 });
  let r = resolveNode(story, senzaEmpatia);
  // empatia = 0 < 9 -> voce nascosta; resta solo il Narratore
  assert.equal(r.content.length, 1);
  assert.equal(r.content[0].speaker, "Narratore");
  // forza_porta richiede il grimaldello -> nascosta
  const forza = r.choices.find((c) => c.id === "forza_porta");
  assert.equal(forza?.status, "hidden");

  // con empatia alta la voce appare
  const conEmpatia = newGame(story, { seed: 1, skills: { empatia: 10 } });
  r = resolveNode(story, conEmpatia);
  assert.ok(r.content.some((b) => b.speaker === "@skill:empatia"));
});

test("choose applica effetti e naviga (percorso 'annusa')", () => {
  const story = loadExample();
  const s0 = newGame(story, { seed: 1 });
  const { state } = choose(story, s0, "annusa");
  assert.equal(state.currentNodeId, "corridoio");
  assert.equal(state.vars.notatoOdore, true);
  assert.equal(state.threads.sospetto_abbandono, "intuizione");
  // immutabilita': lo stato precedente non e' toccato
  assert.equal(s0.vars.notatoOdore, false);
  assert.equal(s0.currentNodeId, "atrio");
});

test("rollCheck e' deterministico a parita' di seed", () => {
  const story = loadExample();
  let s = newGame(story, { seed: 42, skills: { forza: 3 } });
  s = applyEffects([{ kind: "addItem", item: "grimaldello" }], s, story);

  const a = choose(story, s, "forza_porta");
  const b = choose(story, s, "forza_porta");
  assert.deepEqual(a.check, b.check);
  assert.ok(a.check);
  assert.ok(["retro_aperto", "retro_resiste"].includes(a.state.currentNodeId));
  assert.ok(["critFailure", "failure", "partial", "success", "critSuccess"].includes(a.check!.tier));
});

test("gradeTier mappa correttamente margini e critici (partial band 2, crits natural)", () => {
  const story = { ruleset: { check: { dice: "2d6", compare: ">=" }, outcomeModel: { partial: true, partialBand: 2, crits: "natural" } } } as unknown as Story;
  // natural neutro (7), variando il totale rispetto a difficolta' 10
  assert.equal(gradeTier(9, 7, 10, story), "failure");   // margine -1
  assert.equal(gradeTier(10, 7, 10, story), "partial");  // margine 0
  assert.equal(gradeTier(11, 7, 10, story), "partial");  // margine 1
  assert.equal(gradeTier(12, 7, 10, story), "success");  // margine 2
  // critici naturali (2d6: min 2, max 12) hanno la precedenza
  assert.equal(gradeTier(30, 12, 10, story), "critSuccess");
  assert.equal(gradeTier(30, 2, 10, story), "critFailure");
});

test("degrade fa scendere le fasce mancanti verso il fallimento", () => {
  const outcomes = { success: { goto: "S" }, failure: { goto: "F" } };
  assert.equal(degrade("partial", outcomes).goto, "F");     // scende a failure
  assert.equal(degrade("critSuccess", outcomes).goto, "S"); // sale a success (niente sotto)
  assert.equal(degrade("critFailure", outcomes).goto, "F"); // sale a failure
  assert.equal(degrade("success", outcomes).goto, "S");
});

test("G11: una storia checkless/statless (ruleset vuoto) gira", () => {
  const story = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.3" },
    ruleset: {},
    stateSchema: { visto: { type: "boolean", default: false } },
    entry: "a",
    nodes: {
      a: { id: "a", content: [{ speaker: "N", text: "..." }], choices: [{ id: "go", text: "", effects: [{ kind: "set", var: "visto", value: true }], goto: "b" }] },
      b: { id: "b", content: [{ speaker: "N", text: "fine" }] },
    },
  } as unknown as Story;

  const s0 = newGame(story);
  assert.equal(s0.currentNodeId, "a");
  const { state, resolved } = choose(story, s0, "go");
  assert.equal(state.currentNodeId, "b");
  assert.equal(state.vars.visto, true);
  assert.equal(resolved.choices.length, 0); // finale
});

test("G1: un check può puntare a un attributo (senza layer skill)", () => {
  const story = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.3" },
    ruleset: {
      attributes: [{ id: "str", name: "Forza", default: 5, min: 0, max: 10 }],
      resources: [],
      check: { dice: "1d6", adds: ["modifiers"], compare: ">=" },
      outcomeModel: { crits: "off" },
    },
    stateSchema: {},
    entry: "n",
    nodes: {
      n: { id: "n", content: [], choices: [{ id: "c", text: "", check: { attribute: "str", difficulty: 3, onSuccess: "s", onFailure: "f" } }] },
      s: { id: "s", content: [] },
      f: { id: "f", content: [] },
    },
  } as unknown as Story;

  const s0 = newGame(story, { seed: 5 });
  const { check } = choose(story, s0, "c");
  assert.ok(check);
  const diceSum = check!.dice.reduce((a, b) => a + b, 0);
  assert.equal(check!.total - diceSum, 5); // l'attributo bersaglio (5) è sommato al dado
});

test("G4: onFirstEnter parte solo alla prima visita, onEnter sempre", () => {
  const story = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.3" },
    ruleset: { attributes: [], resources: [], check: { dice: "1d6", compare: ">=" } },
    stateSchema: { first: { type: "number", default: 0 }, every: { type: "number", default: 0 } },
    entry: "a",
    nodes: {
      a: {
        id: "a",
        onFirstEnter: [{ kind: "add", var: "first", value: 1 }],
        onEnter: [{ kind: "add", var: "every", value: 1 }],
        content: [],
        choices: [{ id: "toB", text: "", goto: "b" }],
      },
      b: { id: "b", content: [], choices: [{ id: "toA", text: "", goto: "a" }] },
    },
  } as unknown as Story;

  let s = newGame(story); // entra in 'a': first=1, every=1
  assert.equal(s.vars.first, 1);
  assert.equal(s.vars.every, 1);
  s = choose(story, s, "toB").state; // -> b
  s = choose(story, s, "toA").state; // ritorno in 'a'
  assert.equal(s.vars.first, 1); // NON si ripete
  assert.equal(s.vars.every, 2); // si ripete
});

test("completare un thread applica davvero gli effetti onComplete", () => {
  const story = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.4" },
    ruleset: {},
    stateSchema: { premio: { type: "boolean", default: false }, premio2: { type: "boolean", default: false } },
    threads: {
      via_completa: { name: "A", type: "quest", stages: ["inizio", "fine"], onComplete: [{ kind: "set", var: "premio", value: true }] },
      via_avanza: { name: "B", type: "quest", stages: ["inizio", "fine"], onComplete: [{ kind: "set", var: "premio2", value: true }] },
    },
    entry: "a",
    nodes: {
      a: {
        id: "a", content: [],
        choices: [{
          id: "c", text: "", goto: "b",
          effects: [
            { kind: "startThread", thread: "via_completa" },
            { kind: "completeThread", thread: "via_completa" },
            { kind: "startThread", thread: "via_avanza" },
            { kind: "advanceThread", thread: "via_avanza", to: "fine" },
          ],
        }],
      },
      b: { id: "b", content: [] },
    },
  } as unknown as Story;

  const { state } = choose(story, newGame(story), "c");
  assert.equal(state.threads.via_completa, "fine");
  assert.equal(state.vars.premio, true, "completeThread deve applicare onComplete allo stato reale");
  // anche arrivare all'ultimo stage con advanceThread conta come completamento
  assert.equal(state.vars.premio2, true, "advanceThread all'ultimo stage deve scatenare onComplete");
});

test("onComplete non si ripete se il thread e' gia' completo", () => {
  const story = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.4" },
    ruleset: {},
    stateSchema: { volte: { type: "number", default: 0 } },
    threads: { t: { name: "T", type: "quest", stages: ["s0", "s1"], onComplete: [{ kind: "add", var: "volte", value: 1 }] } },
    entry: "a",
    nodes: {
      a: {
        id: "a", content: [],
        choices: [{
          id: "c", text: "", goto: "b",
          effects: [
            { kind: "completeThread", thread: "t" },
            { kind: "completeThread", thread: "t" },
          ],
        }],
      },
      b: { id: "b", content: [] },
    },
  } as unknown as Story;

  const { state } = choose(story, newGame(story), "c");
  assert.equal(state.vars.volte, 1);
});

test("l'esaurimento di una risorsa forza il nodo onDepleted", () => {
  const story = loadExample();
  let s = newGame(story, { seed: 1 });
  const afterAnnusa = choose(story, s, "annusa").state; // -> corridoio
  const low: RuntimeState = { ...afterAnnusa, resources: { ...afterAnnusa.resources, morale: 1 } };
  const res = choose(story, low, "ignora"); // morale -1 -> 0 -> crollo
  assert.equal(res.state.resources.morale, 0);
  assert.equal(res.state.currentNodeId, "crollo");
});
