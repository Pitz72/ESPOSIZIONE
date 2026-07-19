import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type { Story } from "./types.ts";
import { validateStory, hasErrors } from "./index.ts";

function loadExample(): Story {
  const url = new URL("../../examples/atrio-villa.iwstory.json", import.meta.url);
  return JSON.parse(readFileSync(url, "utf8")) as Story;
}

test("la storia d'esempio non ha ERRORI (solo eventuali warning)", () => {
  const findings = validateStory(loadExample());
  const errors = findings.filter((f) => f.severity === "error");
  assert.deepEqual(errors, [], `Errori inattesi: ${JSON.stringify(errors, null, 2)}`);
  assert.equal(hasErrors(findings), false);
});

test("la storia d'esempio segnala i warning attesi (W04, W05)", () => {
  const codes = new Set(validateStory(loadExample()).map((f) => f.code));
  assert.ok(codes.has("W04"), "atteso W04 (haChiave scritta ma mai letta)");
  assert.ok(codes.has("W05"), "atteso W05 (sospetto_abbandono mai completato)");
});

test("una storia rotta produce E01/E02/E03", () => {
  const broken = {
    meta: { id: "rotta", title: "Rotta", version: "0", formatVersion: "0.2" },
    ruleset: {
      attributes: [{ id: "intelletto", name: "I" }],
      skills: [{ id: "logica", name: "L", attribute: "intelletto" }],
      resources: [],
      check: { dice: "2d6", compare: ">=" },
    },
    stateSchema: { dichiarata: { type: "boolean", default: false } },
    entry: "start",
    nodes: {
      start: {
        id: "start",
        content: [{ speaker: "N", text: "..." }],
        choices: [
          {
            id: "vai",
            text: "Vai in un nodo che non esiste",
            effects: [
              { kind: "set", var: "fantasma", value: true },              // E02
              { kind: "adjustResource", resource: "inesistente", value: 1 }, // E03
            ],
            goto: "nodo_mancante",                                          // E01
          },
        ],
      },
    },
  } as unknown as Story;

  const codes = new Set(validateStory(broken).map((f) => f.code));
  assert.ok(codes.has("E01"), "atteso E01 (goto pendente)");
  assert.ok(codes.has("E02"), "atteso E02 (variabile non dichiarata)");
  assert.ok(codes.has("E03"), "atteso E03 (risorsa inesistente)");
  assert.equal(hasErrors(validateStory(broken)), true);
});

test("E07 quando c'è un check ma manca ruleset.check", () => {
  const s = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.3" },
    ruleset: { attributes: [{ id: "forza", name: "F" }] },
    stateSchema: {},
    entry: "n",
    nodes: {
      n: { id: "n", content: [], choices: [{ id: "c", text: "", check: { attribute: "forza", difficulty: 8, onSuccess: "n", onFailure: "n" } }] },
    },
  } as unknown as Story;
  const codes = new Set(validateStory(s).map((f) => f.code));
  assert.ok(codes.has("E07"), "atteso E07 (check senza ruleset.check)");
});

test("una storia checkless valida non produce errori", () => {
  const s = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.3" },
    ruleset: {},
    stateSchema: {},
    entry: "n",
    nodes: { n: { id: "n", content: [{ speaker: "N", text: "." }] } },
  } as unknown as Story;
  assert.equal(hasErrors(validateStory(s)), false);
});

test("E06 quando l'entry non esiste", () => {
  const s = {
    meta: { id: "x", title: "x", version: "0", formatVersion: "0.2" },
    ruleset: { attributes: [], skills: [], resources: [], check: { dice: "2d6", compare: ">=" } },
    stateSchema: {},
    entry: "assente",
    nodes: { altro: { id: "altro", content: [] } },
  } as unknown as Story;
  const codes = new Set(validateStory(s).map((f) => f.code));
  assert.ok(codes.has("E06"));
});
