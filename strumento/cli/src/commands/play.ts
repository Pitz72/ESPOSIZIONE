import { readFileSync } from "node:fs";
import * as readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import type { Story, RuntimeState, ResolvedNode, CheckResult, OutcomeTier, CharacterBuild } from "../../../core/src/index.ts";
import { newGame, resolveNode, choose, validateStory, capacityOf, carriedOf, resolvePreset } from "../../../core/src/index.ts";
import { loadStory } from "./validate.ts";
import { c } from "../format.ts";

export interface PlayOpts {
  seed: number;
  choices?: string[]; // se presente: modalita' scriptata
  build?: string;
  preset?: string; // id di un personaggio pronto (ruleset.presets)
  force?: boolean;
}

const TIER_LABEL: Record<OutcomeTier, string> = {
  critSuccess: "SUCCESSO CRITICO",
  success: "successo",
  partial: "successo parziale",
  failure: "fallimento",
  critFailure: "FALLIMENTO CRITICO",
};

function tierColored(tier: OutcomeTier): string {
  const l = TIER_LABEL[tier];
  switch (tier) {
    case "critSuccess": return c.bold(c.green(l));
    case "success": return c.green(l);
    case "partial": return c.yellow(l);
    case "failure": return c.red(l);
    case "critFailure": return c.bold(c.red(l));
  }
}

function speakerLabel(speaker: string): string {
  if (speaker.startsWith("@skill:")) return c.italic(c.magenta(`(${speaker.slice("@skill:".length)})`));
  return c.bold(c.cyan(speaker));
}

function renderNode(resolved: ResolvedNode): void {
  if (resolved.title) console.log("\n" + c.gray("── " + resolved.title + " ──"));
  for (const b of resolved.content) console.log(`${speakerLabel(b.speaker)}  ${b.text}`);
}

function renderChoices(resolved: ResolvedNode): string[] {
  const available = resolved.choices.filter((c2) => c2.status === "available");
  console.log("");
  available.forEach((ch, i) => console.log(`  ${c.bold(String(i + 1))}. ${ch.text}`));
  for (const ch of resolved.choices) {
    if (ch.status === "locked") console.log(c.gray(`  –. ${ch.text}  [bloccata: ${ch.reason}]`));
  }
  return available.map((ch) => ch.id);
}

function renderCheck(skill: string, r: CheckResult): void {
  const mod = r.modifierTotal !== 0 ? ` ${r.modifierTotal > 0 ? "+" : ""}${r.modifierTotal}` : "";
  console.log(
    c.gray(`  🎲 ${skill}: [${r.dice.join(",")}] nat ${r.natural}${mod} → totale ${r.total} vs ${r.target}  `) +
      "→ " + tierColored(r.tier),
  );
  if (r.resolution.text) console.log("  " + c.italic(c.gray(r.resolution.text)));
}

function renderSummary(story: Story, state: RuntimeState): void {
  console.log("\n" + c.gray("stato finale:"));
  const res = (story.ruleset.resources ?? []).map((r) => `${r.name} ${state.resources[r.id]}`).join(", ");
  if (res) console.log(c.gray("  risorse: " + res));
  // Le statistiche possono essere cambiate in corsa (crescita del personaggio).
  const stats = [
    ...(story.ruleset.attributes ?? []).map((a) => `${a.name} ${state.attributes[a.id]}`),
    ...(story.ruleset.skills ?? []).map((s) => `${s.name} ${state.skills[s.id]}`),
  ].join(", ");
  if (stats) console.log(c.gray("  personaggio: " + stats));
  const threads = Object.entries(state.threads).map(([k, v]) => `${k}=${v}`).join(", ");
  if (threads) console.log(c.gray("  thread:  " + threads));
  const inv = Object.keys(state.inventory);
  if (inv.length) {
    const ingombro = story.ruleset.inventory
      ? ` (${carriedOf(state, story)}/${capacityOf(state, story)} ${story.ruleset.inventory.unitLabel ?? "posti"})`
      : "";
    console.log(c.gray("  inventario: " + inv.join(", ") + ingombro));
  }
  console.log(c.gray("  nodi visitati: " + state.history.length));
}

function loadBuild(path: string | undefined): CharacterBuild {
  if (!path) return {};
  return JSON.parse(readFileSync(path, "utf8")) as CharacterBuild;
}

export async function cmdPlay(file: string, opts: PlayOpts): Promise<number> {
  let story: Story;
  try {
    story = loadStory(file);
  } catch (e) {
    console.error(c.red("✗ ") + (e as Error).message);
    return 1;
  }

  const findings = validateStory(story);
  const errors = findings.filter((f) => f.severity === "error");
  if (errors.length && !opts.force) {
    console.error(c.red(`✗ ${errors.length} errori di validazione. Usa --force per giocare comunque, o 'iw validate' per i dettagli.`));
    return 1;
  }

  const build: CharacterBuild = { ...loadBuild(opts.build), seed: opts.seed };
  if (opts.preset) build.preset = opts.preset;
  if (build.preset && !(story.ruleset.presets ?? []).some((p) => p.id === build.preset)) {
    const ids = (story.ruleset.presets ?? []).map((p) => p.id).join(", ") || "nessuno";
    console.error(c.red(`✗ personaggio "${build.preset}" inesistente. Disponibili: ${ids}`));
    return 1;
  }

  let state = newGame(story, build);
  const preset = resolvePreset(story, build);
  console.log(
    c.bold(story.meta.title) + c.gray(`  · seed ${opts.seed}`) +
      (preset ? c.gray(`  · ${preset.name}`) : ""),
  );

  const scripted = opts.choices;
  let scriptPos = 0;
  const rl = scripted ? null : readline.createInterface({ input: stdin, output: stdout });

  try {
    while (true) {
      const resolved = resolveNode(story, state);
      renderNode(resolved);
      const availableIds = renderChoices(resolved);

      if (availableIds.length === 0) {
        console.log("\n" + c.bold("— Fine —"));
        renderSummary(story, state);
        return 0;
      }

      // seleziona una scelta
      let choiceId: string | undefined;
      if (scripted) {
        if (scriptPos >= scripted.length) {
          console.log("\n" + c.yellow("· script esaurito ·"));
          renderSummary(story, state);
          return 0;
        }
        const tok = scripted[scriptPos++].trim();
        choiceId = /^\d+$/.test(tok) ? availableIds[Number(tok) - 1] : (availableIds.includes(tok) ? tok : undefined);
        if (!choiceId) {
          console.error(c.red(`✗ scelta non valida nello script: "${tok}"`));
          return 1;
        }
        console.log(c.dim(`> ${tok}`));
      } else {
        const ans = (await rl!.question(c.bold("\n> "))).trim().toLowerCase();
        if (ans === "q") { console.log("ciao."); return 0; }
        if (ans === "s") { renderSummary(story, state); continue; }
        choiceId = /^\d+$/.test(ans) ? availableIds[Number(ans) - 1] : (availableIds.includes(ans) ? ans : undefined);
        if (!choiceId) { console.log(c.red("scelta non valida.")); continue; }
      }

      // la scelta scelta puo' avere un check: recupero la statistica per il rendering
      const rawChoice = (story.nodes[state.currentNodeId].choices ?? []).find((ch) => ch.id === choiceId);
      const stat = rawChoice?.check?.skill ?? rawChoice?.check?.attribute;

      const result = choose(story, state, choiceId);
      if (result.check && stat) renderCheck(stat, result.check);
      state = result.state;
    }
  } finally {
    rl?.close();
  }
}
