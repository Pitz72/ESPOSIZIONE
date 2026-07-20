/**
 * Rinomina di una variabile di stateSchema PROPAGATA a tutta la storia.
 * Prima la rinomina cambiava solo la chiave nello schema: ogni condizione ed
 * effetto che la citava restava appeso alla chiave vecchia (E02 a valle).
 * Qui si riscrivono tutti i punti in cui una variabile puo' comparire:
 * condizioni (lhs e rhs {var}), effetti set/add, modificatori dei check,
 * esiti dei check, onEnter/onFirstEnter, onComplete dei thread.
 *
 * Modulo puro (nessun React): testabile con `node --test`.
 */
import type { Story, Condition, Effect, ActiveCheck } from "../../../core/src/index.ts";

function renameInCondition(c: Condition, oldKey: string, newKey: string): void {
  if ("all" in c) { c.all.forEach((x) => renameInCondition(x, oldKey, newKey)); return; }
  if ("any" in c) { c.any.forEach((x) => renameInCondition(x, oldKey, newKey)); return; }
  if ("not" in c) { renameInCondition(c.not, oldKey, newKey); return; }
  if ("check" in c) {
    (c.check.modifiers ?? []).forEach((m) => renameInCondition(m.when, oldKey, newKey));
    return;
  }
  if (c.lhs === oldKey) c.lhs = newKey;
  if (typeof c.rhs === "object" && c.rhs !== null && "var" in c.rhs && c.rhs.var === oldKey) {
    c.rhs = { var: newKey };
  }
}

function renameInEffects(effects: Effect[] | undefined, oldKey: string, newKey: string): void {
  for (const e of effects ?? []) {
    if ((e.kind === "set" || e.kind === "add") && e.var === oldKey) e.var = newKey;
  }
}

function renameInCheck(check: ActiveCheck, oldKey: string, newKey: string): void {
  (check.modifiers ?? []).forEach((m) => renameInCondition(m.when, oldKey, newKey));
  for (const res of Object.values(check.outcomes ?? {})) {
    renameInEffects(res.effects, oldKey, newKey);
  }
}

/** Riscrive IN PLACE ogni riferimento alla variabile (da chiamare dentro update()). */
export function renameVarEverywhere(story: Story, oldKey: string, newKey: string): void {
  if (oldKey === newKey) return;
  for (const node of Object.values(story.nodes)) {
    renameInEffects(node.onFirstEnter, oldKey, newKey);
    renameInEffects(node.onEnter, oldKey, newKey);
    for (const b of node.content) if (b.requires) renameInCondition(b.requires, oldKey, newKey);
    for (const ch of node.choices ?? []) {
      if (ch.requires) renameInCondition(ch.requires, oldKey, newKey);
      renameInEffects(ch.effects, oldKey, newKey);
      if (ch.check) renameInCheck(ch.check, oldKey, newKey);
    }
  }
  for (const t of Object.values(story.threads ?? {})) {
    renameInEffects(t.onComplete, oldKey, newKey);
  }
}
