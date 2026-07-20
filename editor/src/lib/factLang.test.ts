import { test } from "node:test";
import assert from "node:assert/strict";
import type { Story } from "../../../core/src/index.ts";
import { parseConsequence, resolveRef, slugify, uniqueKey } from "./factLang.ts";

function story(over: Partial<Story> = {}): Story {
  return {
    meta: { id: "t", title: "T", version: "0.1.0", formatVersion: "0.3" },
    ruleset: {
      resources: [{ id: "stress", name: "Stress", default: 0 }],
      attributes: [{ id: "psiche", name: "Psiche", default: 2 }],
      skills: [{ id: "empatia", name: "Empatia", attribute: "psiche", default: 1 }],
    },
    stateSchema: {
      ha_la_chiave: { type: "boolean", default: false, label: "ha la chiave" },
      fiducia_carli: { type: "number", default: 0, label: "fiducia di Carli" },
      umore: { type: "enum", values: ["sereno", "cupo"], default: "sereno", label: "umore" },
    },
    items: { grimaldello: { name: "grimaldello" } },
    nodes: { start: { id: "start", content: [] } },
    entry: "start",
    ...over,
  };
}

// --- slug e chiavi ---------------------------------------------------------

test("slugify produce chiavi tecniche pulite", () => {
  assert.equal(slugify("ha la chiave"), "ha_la_chiave");
  assert.equal(slugify("La porta è aperta!"), "la_porta_e_aperta");
  assert.equal(slugify("3 monete"), "f_3_monete");
});

test("uniqueKey evita le collisioni", () => {
  assert.equal(uniqueKey(story(), "ha_la_chiave"), "ha_la_chiave_2");
  assert.equal(uniqueKey(story(), "nuovo"), "nuovo");
});

// --- risoluzione dei riferimenti esistenti ---------------------------------

test("resolveRef trova fatti per etichetta, chiave, indicatori e oggetti", () => {
  const s = story();
  assert.equal(resolveRef("ha la chiave", s)?.kind, "var");
  assert.equal(resolveRef("Fiducia di Carli", s)?.kind, "var");
  assert.equal(resolveRef("stress", s)?.kind, "resource");
  assert.equal(resolveRef("grimaldello", s)?.kind, "item");
  assert.equal(resolveRef("qualcosa di mai visto", s), null);
});

// --- fatti esistenti: nessuna proposta di creazione ------------------------

test("affermazione su un fatto già esistente non crea nulla", () => {
  const p = parseConsequence("ora ha la chiave", story());
  assert.deepEqual(p?.effect, { kind: "set", var: "ha_la_chiave", value: true });
  assert.equal(p?.newFact, undefined);
});

test("la negazione mette il fatto a falso", () => {
  const p = parseConsequence("non ha più la chiave", story());
  assert.deepEqual(p?.effect, { kind: "set", var: "ha_la_chiave", value: false });
});

test("variazione su un contatore esistente", () => {
  const p = parseConsequence("aumenta fiducia di Carli di 1", story());
  assert.deepEqual(p?.effect, { kind: "add", var: "fiducia_carli", value: 1 });
  assert.equal(p?.newFact, undefined);
});

test("variazione su un indicatore della scheda", () => {
  assert.deepEqual(parseConsequence("Stress +10", story())?.effect, {
    kind: "adjustResource", resource: "stress", value: 10,
  });
  assert.deepEqual(parseConsequence("diminuisci stress di 5", story())?.effect, {
    kind: "adjustResource", resource: "stress", value: -5,
  });
});

test("crescita del personaggio: abilità e caratteristiche", () => {
  assert.deepEqual(parseConsequence("aumenta Empatia di 1", story())?.effect, {
    kind: "adjustSkill", skill: "empatia", value: 1,
  });
  assert.deepEqual(parseConsequence("Psiche -1", story())?.effect, {
    kind: "adjustAttribute", attribute: "psiche", value: -1,
  });
  // e non propone di creare un fatto con lo stesso nome
  assert.equal(parseConsequence("aumenta Empatia di 1", story())?.newFact, undefined);
});

test("oggetto dichiarato: entra ed esce dall'inventario", () => {
  assert.deepEqual(parseConsequence("ottieni il grimaldello", story())?.effect, {
    kind: "addItem", item: "grimaldello",
  });
  assert.deepEqual(parseConsequence("perdi il grimaldello", story())?.effect, {
    kind: "removeItem", item: "grimaldello",
  });
});

test("stato tra alcuni: assegnazione esplicita", () => {
  assert.deepEqual(parseConsequence("l'umore diventa cupo", story())?.effect, {
    kind: "set", var: "umore", value: "cupo",
  });
});

// --- FATTI CREATI SCRIVENDO ------------------------------------------------

test("un'affermazione nuova propone un fatto sì/no", () => {
  const p = parseConsequence("la porta è aperta", story());
  assert.deepEqual(p?.newFact, {
    key: "la_porta_e_aperta",
    label: "la porta è aperta",
    decl: { type: "boolean", default: false, label: "la porta è aperta" },
  });
  assert.deepEqual(p?.effect, { kind: "set", var: "la_porta_e_aperta", value: true });
});

test("una variazione su un nome nuovo propone un contatore", () => {
  const p = parseConsequence("aumenta sospetto di 2", story());
  assert.equal(p?.newFact?.decl.type, "number");
  assert.deepEqual(p?.effect, { kind: "add", var: "sospetto", value: 2 });
});

test("un oggetto non dichiarato diventa il fatto «ha X» (convenzione G5)", () => {
  const p = parseConsequence("ottieni la lanterna", story());
  assert.equal(p?.newFact?.label, "ha lanterna");
  assert.deepEqual(p?.effect, { kind: "set", var: "ha_lanterna", value: true });
});

test("il fatto proposto non calpesta una chiave già in uso", () => {
  const s = story({ stateSchema: { ...story().stateSchema, sospetto: { type: "boolean" } } });
  const p = parseConsequence("aumenta sospetto di 2", s);
  assert.equal(p, null); // esiste già ma non è un contatore: non si indovina
});

// --- rifiuti ---------------------------------------------------------------

test("frasi vuote o ambigue non vengono interpretate", () => {
  assert.equal(parseConsequence("   ", story()), null);
  assert.equal(parseConsequence("aumenta umore di 3", story()), null); // esiste, ma è a stati
  assert.equal(parseConsequence("togli stress", story()), null); // indicatore senza quantità
});
