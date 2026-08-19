import type { Condition, Effect } from "../../../core/src/index.ts";

/** Rende una condizione come stringa leggibile (per i riepiloghi in UI). */
export function summarizeCondition(c: Condition | undefined): string {
  if (!c) return "";
  if ("all" in c) return c.all.map(wrap).join(" E ");
  if ("any" in c) return c.any.map(wrap).join(" O ");
  if ("not" in c) return `NON ${wrap(c.not)}`;
  if ("check" in c) return `check ${c.check.skill ?? c.check.attribute ?? "?"} ≥ ${c.check.difficulty}`;
  const rhs = typeof c.rhs === "object" && c.rhs !== null && "var" in c.rhs ? c.rhs.var : JSON.stringify(c.rhs);
  return `${c.lhs} ${c.op} ${rhs}`;
}

function wrap(c: Condition): string {
  const s = summarizeCondition(c);
  return "all" in c || "any" in c ? `(${s})` : s;
}

/** Rende un effetto come stringa leggibile. */
export function summarizeEffect(e: Effect): string {
  switch (e.kind) {
    case "set": return `${e.var} = ${JSON.stringify(e.value)}`;
    case "add": return `${e.var} ${e.value >= 0 ? "+" : ""}${e.value}`;
    case "adjustSkill": return `@skill:${e.skill} ${e.value >= 0 ? "+" : ""}${e.value}`;
    case "adjustAttribute": return `@attr:${e.attribute} ${e.value >= 0 ? "+" : ""}${e.value}`;
    case "addItem": return `+${e.item}${e.qty && e.qty > 1 ? `×${e.qty}` : ""}`;
    case "removeItem": return `−${e.item}${e.qty && e.qty > 1 ? `×${e.qty}` : ""}`;
    case "adjustResource": return `${e.resource} ${e.value >= 0 ? "+" : ""}${e.value}`;
    case "startThread": return `avvia ${e.thread}`;
    case "advanceThread": return `${e.thread} → ${e.to}`;
    case "completeThread": return `completa ${e.thread}`;
    case "unlockThought": return `sblocca ${e.thread}`;
  }
}

export function summarizeEffects(effects: Effect[] | undefined): string {
  if (!effects || effects.length === 0) return "";
  return effects.map(summarizeEffect).join(", ");
}
