import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import { cmdValidate } from "./commands/validate.ts";
import { cmdPlay } from "./commands/play.ts";

const EXAMPLE = fileURLToPath(new URL("../../examples/atrio-villa.iwstory.json", import.meta.url));
const BROKEN = fileURLToPath(new URL("../test-fixtures/broken.iwstory.json", import.meta.url));

// Silenzia l'output della CLI durante i test.
const origLog = console.log;
const origErr = console.error;
before(() => { console.log = () => {}; console.error = () => {}; });
after(() => { console.log = origLog; console.error = origErr; });

test("validate: esempio valido -> exit 0", () => {
  assert.equal(cmdValidate(EXAMPLE), 0);
});

test("validate: storia rotta -> exit 1", () => {
  assert.equal(cmdValidate(BROKEN), 1);
});

test("validate: file inesistente -> exit 1", () => {
  assert.equal(cmdValidate("non-esiste.iwstory.json"), 1);
});

test("play scriptato: percorso completo -> exit 0", async () => {
  const code = await cmdPlay(EXAMPLE, { seed: 1, choices: ["annusa", "prendi_chiave", "esci"] });
  assert.equal(code, 0);
});

test("play scriptato: token non valido -> exit 1", async () => {
  const code = await cmdPlay(EXAMPLE, { seed: 1, choices: ["scelta_inesistente"] });
  assert.equal(code, 1);
});

test("play scriptato: indici numerici -> exit 0", async () => {
  // 2 = 'Sali le scale' -> piano_superiore; 1 = 'cambia_approccio' -> fine_capitolo
  const code = await cmdPlay(EXAMPLE, { seed: 3, choices: ["2", "1"] });
  assert.equal(code, 0);
});
