import { readFileSync } from "node:fs";
import type { Story } from "../../../core/src/index.ts";
import { validateStory, hasErrors } from "../../../core/src/index.ts";
import { c } from "../format.ts";

const REQUIRED_TOP = ["meta", "ruleset", "stateSchema", "nodes", "entry"];

export function loadStory(file: string): Story {
  let raw: string;
  try {
    raw = readFileSync(file, "utf8");
  } catch {
    throw new Error(`Impossibile leggere il file: ${file}`);
  }
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    throw new Error(`JSON non valido in ${file}: ${(e as Error).message}`);
  }
  const obj = data as Record<string, unknown>;
  const missing = REQUIRED_TOP.filter((k) => !(k in obj));
  if (missing.length) throw new Error(`Chiavi di primo livello mancanti: ${missing.join(", ")}`);
  return data as Story;
}

export function cmdValidate(file: string): number {
  let story: Story;
  try {
    story = loadStory(file);
  } catch (e) {
    console.error(c.red("✗ ") + (e as Error).message);
    return 1;
  }

  const findings = validateStory(story);
  const errors = findings.filter((f) => f.severity === "error");
  const warnings = findings.filter((f) => f.severity === "warning");

  const sorted = [...errors, ...warnings].sort((a, b) => a.code.localeCompare(b.code));
  for (const f of sorted) {
    const tag = f.severity === "error" ? c.red(`[${f.code}] error `) : c.yellow(`[${f.code}] warn  `);
    console.log(`${tag} ${c.gray(f.path)}  ${f.message}`);
  }

  console.log("");
  const title = `${story.meta.title} (${story.meta.id})`;
  if (errors.length === 0) {
    console.log(c.green(`✓ ${title}: nessun errore`) + c.gray(`  ·  ${warnings.length} warning`));
    return 0;
  }
  console.log(c.red(`✗ ${title}: ${errors.length} errori`) + c.gray(`  ·  ${warnings.length} warning`));
  return hasErrors(findings) ? 1 : 0;
}
