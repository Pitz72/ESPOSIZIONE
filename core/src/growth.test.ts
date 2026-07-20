/**
 * Formato 0.4: crescita del personaggio, capacita' di trasporto, personaggi pronti.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { Story, RuntimeState } from "./types.ts";
import { newGame, applyEffects, evaluate, validateStory, resolvePreset } from "./index.ts";
import { capacityOf, carriedOf, freeSpaceOf } from "./engine.ts";

function story(over: Partial<Story> = {}): Story {
  return {
    meta: { id: "t", title: "T", version: "0.1.0", formatVersion: "0.4" },
    ruleset: {
      attributes: [{ id: "fisico", name: "Fisico", default: 2, min: 1, max: 5 }],
      skills: [{ id: "forza", name: "Forza", attribute: "fisico", default: 1, min: 0, max: 6 }],
      resources: [{ id: "morale", name: "Morale", default: 3, min: 0, max: 10 }],
      inventory: { baseCapacity: 2 },
      presets: [
        {
          id: "poliziotto", name: "Il poliziotto", default: true,
          skills: { forza: 4 }, resources: { morale: 5 }, items: { chiave: 1 },
        },
        { id: "vagabondo", name: "Il vagabondo", attributes: { fisico: 1 } },
      ],
    },
    stateSchema: {},
    items: {
      chiave: { name: "Chiave", size: 0 },
      cassa: { name: "Cassa", size: 2 },
      zaino: { name: "Zaino", size: 1, capacityBonus: 4 },
      lanterna: { name: "Lanterna" },
    },
    nodes: { start: { id: "start", content: [] } },
    entry: "start",
    ...over,
  };
}

// --- Crescita del personaggio ---------------------------------------------

test("adjustSkill fa crescere l'abilità e rispetta il massimo", () => {
  const s = story();
  let st = newGame(s, { preset: "vagabondo" });
  assert.equal(st.skills.forza, 1);
  st = applyEffects([{ kind: "adjustSkill", skill: "forza", value: 2 }], st, s);
  assert.equal(st.skills.forza, 3);
  st = applyEffects([{ kind: "adjustSkill", skill: "forza", value: 99 }], st, s);
  assert.equal(st.skills.forza, 6); // max
});

test("adjustAttribute può anche scendere, fino al minimo", () => {
  const s = story();
  let st = newGame(s, { preset: "vagabondo" });
  assert.equal(st.attributes.fisico, 1);
  st = applyEffects([{ kind: "adjustAttribute", attribute: "fisico", value: -5 }], st, s);
  assert.equal(st.attributes.fisico, 1); // min
  st = applyEffects([{ kind: "adjustAttribute", attribute: "fisico", value: 3 }], st, s);
  assert.equal(st.attributes.fisico, 4);
});

// --- Capacità di trasporto -------------------------------------------------

test("l'ingombro conta le dimensioni, non i pezzi", () => {
  const s = story();
  let st = newGame(s, { preset: "vagabondo" });
  assert.equal(capacityOf(st, s), 2);
  assert.equal(carriedOf(st, s), 0);

  st = applyEffects([{ kind: "addItem", item: "chiave" }], st, s);
  assert.equal(carriedOf(st, s), 0); // size 0: non ingombra
  st = applyEffects([{ kind: "addItem", item: "cassa" }], st, s);
  assert.equal(carriedOf(st, s), 2);
  assert.equal(freeSpaceOf(st, s), 0);
});

test("quello che non ci sta non entra", () => {
  const s = story();
  let st = newGame(s, { preset: "vagabondo" });
  st = applyEffects([{ kind: "addItem", item: "cassa" }], st, s);
  st = applyEffects([{ kind: "addItem", item: "lanterna" }], st, s);
  assert.equal(st.inventory.lanterna, undefined); // zaino pieno
  assert.equal(carriedOf(st, s), 2);
});

test("uno zaino allarga la capacità", () => {
  const s = story();
  let st = newGame(s, { preset: "vagabondo" });
  st = applyEffects([{ kind: "addItem", item: "zaino" }], st, s);
  assert.equal(capacityOf(st, s), 6); // 2 base + 4 di zaino
  st = applyEffects([{ kind: "addItem", item: "cassa" }, { kind: "addItem", item: "lanterna" }], st, s);
  assert.equal(st.inventory.cassa, 1);
  assert.equal(st.inventory.lanterna, 1);
  assert.equal(carriedOf(st, s), 4); // zaino 1 + cassa 2 + lanterna 1
});

test("senza regole d'ingombro non c'è alcun limite", () => {
  const s = story({ ruleset: { ...story().ruleset, inventory: undefined } });
  let st = newGame(s, { preset: "vagabondo" });
  st = applyEffects([{ kind: "addItem", item: "cassa", qty: 50 }], st, s);
  assert.equal(st.inventory.cassa, 50);
  assert.equal(capacityOf(st, s), Infinity);
});

test("lo spazio libero è interrogabile in una condizione", () => {
  const s = story();
  let st: RuntimeState = newGame(s, { preset: "vagabondo" });
  assert.equal(evaluate({ lhs: "@free", op: ">=", rhs: 2 }, st, s), true);
  st = applyEffects([{ kind: "addItem", item: "cassa" }], st, s);
  assert.equal(evaluate({ lhs: "@free", op: ">=", rhs: 1 }, st, s), false);
  assert.equal(evaluate({ lhs: "@carried", op: "==", rhs: 2 }, st, s), true);
  assert.equal(evaluate({ lhs: "@capacity", op: "==", rhs: 2 }, st, s), true);
});

// --- Personaggi pronti (preset) --------------------------------------------

test("senza indicazioni si parte dal personaggio predefinito", () => {
  const s = story();
  const st = newGame(s);
  assert.equal(resolvePreset(s)?.id, "poliziotto");
  assert.equal(st.skills.forza, 4);
  assert.equal(st.resources.morale, 5);
  assert.equal(st.inventory.chiave, 1);
});

test("il build esplicito ha la precedenza sul preset", () => {
  const s = story();
  const st = newGame(s, { preset: "poliziotto", skills: { forza: 0 } });
  assert.equal(st.skills.forza, 0);
  assert.equal(st.resources.morale, 5); // dal preset
});

test("l'equipaggiamento iniziale entra anche se ingombrante", () => {
  const s = story({
    ruleset: {
      ...story().ruleset,
      presets: [{ id: "carico", name: "Il carico", default: true, items: { cassa: 2 } }],
    },
  });
  const st = newGame(s);
  assert.equal(st.inventory.cassa, 2);
  assert.equal(carriedOf(st, s), 4); // oltre la capacità: è l'autore a dichiararlo
  // ...ma il validatore lo segnala
  assert.ok(validateStory(s).some((f) => f.code === "W07"));
});

// --- Validatore -------------------------------------------------------------

test("E08: un personaggio pronto non può citare statistiche inesistenti", () => {
  const s = story({
    ruleset: { ...story().ruleset, presets: [{ id: "x", name: "X", skills: { inesistente: 3 } }] },
  });
  const f = validateStory(s).filter((x) => x.code === "E08");
  assert.equal(f.length, 1);
  assert.match(f[0].message, /inesistente/);
});

test("E08: un solo personaggio può essere il predefinito", () => {
  const s = story({
    ruleset: {
      ...story().ruleset,
      presets: [{ id: "a", name: "A", default: true }, { id: "b", name: "B", default: true }],
    },
  });
  assert.ok(validateStory(s).some((f) => f.code === "E08" && /predefinito/.test(f.message)));
});

test("E03: la crescita deve puntare a un'abilità dichiarata", () => {
  const s = story();
  s.nodes.start.onEnter = [{ kind: "adjustSkill", skill: "fantasma", value: 1 }];
  assert.ok(validateStory(s).some((f) => f.code === "E03" && /fantasma/.test(f.message)));
  s.nodes.start.onEnter = [{ kind: "adjustSkill", skill: "forza", value: 1 }];
  assert.equal(validateStory(s).filter((f) => f.code === "E03").length, 0);
});
