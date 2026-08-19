import { test } from "node:test";
import assert from "node:assert/strict";
import type { Story, ConditionLeaf } from "../../../core/src/index.ts";
import { renameVarEverywhere } from "./renameVar.ts";

function story(): Story {
  return {
    meta: { id: "t", title: "T", version: "0", formatVersion: "0.4" },
    ruleset: {
      attributes: [{ id: "psiche", name: "Psiche", default: 2 }],
      skills: [{ id: "empatia", name: "Empatia", attribute: "psiche" }],
      check: { dice: "2d6", compare: ">=" },
    },
    stateSchema: {
      vecchio: { type: "boolean", default: false },
      soglia: { type: "number", default: 0 },
    },
    threads: {
      filo: { name: "Filo", type: "quest", stages: ["a", "b"], onComplete: [{ kind: "set", var: "vecchio", value: true }] },
    },
    entry: "n",
    nodes: {
      n: {
        id: "n",
        onFirstEnter: [{ kind: "set", var: "vecchio", value: true }],
        onEnter: [{ kind: "add", var: "soglia", value: 1 }],
        content: [{ speaker: "N", text: ".", requires: { lhs: "vecchio", op: "==", rhs: true } }],
        choices: [
          {
            id: "c1", text: "", goto: "n",
            requires: { all: [{ lhs: "vecchio", op: "==", rhs: true }, { not: { lhs: "soglia", op: ">", rhs: { var: "vecchio" } } }] },
            effects: [{ kind: "set", var: "vecchio", value: false }],
          },
          {
            id: "c2", text: "",
            check: {
              skill: "empatia", difficulty: 8,
              modifiers: [{ when: { lhs: "vecchio", op: "==", rhs: true }, value: 2 }],
              outcomes: { success: { goto: "n", effects: [{ kind: "set", var: "vecchio", value: true }] }, failure: { goto: "n" } },
            },
          },
        ],
      },
    },
  };
}

test("renameVarEverywhere segue la variabile in condizioni, effetti, check e thread", () => {
  const s = story();
  renameVarEverywhere(s, "vecchio", "nuovo");

  const n = s.nodes.n;
  assert.deepEqual(n.onFirstEnter, [{ kind: "set", var: "nuovo", value: true }]);
  assert.deepEqual(n.content[0].requires, { lhs: "nuovo", op: "==", rhs: true });

  const c1 = n.choices![0];
  const all = (c1.requires as { all: unknown[] }).all;
  assert.deepEqual(all[0], { lhs: "nuovo", op: "==", rhs: true });
  assert.deepEqual(all[1], { not: { lhs: "soglia", op: ">", rhs: { var: "nuovo" } } });
  assert.deepEqual(c1.effects, [{ kind: "set", var: "nuovo", value: false }]);

  const check = n.choices![1].check!;
  assert.deepEqual(check.modifiers![0].when, { lhs: "nuovo", op: "==", rhs: true });
  assert.deepEqual(check.outcomes!.success!.effects, [{ kind: "set", var: "nuovo", value: true }]);

  assert.deepEqual(s.threads!.filo.onComplete, [{ kind: "set", var: "nuovo", value: true }]);

  // le altre variabili non vengono toccate
  assert.equal((n.onEnter![0] as { var: string }).var, "soglia");
});

test("renameVarEverywhere non tocca nulla se la chiave non compare", () => {
  const s = story();
  const prima = JSON.stringify(s);
  renameVarEverywhere(s, "inesistente", "altro");
  assert.equal(JSON.stringify(s), prima);
});
