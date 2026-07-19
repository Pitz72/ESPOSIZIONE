#!/usr/bin/env node
/** iw — CLI per validare e giocare storie .iwstory. */

import { cmdValidate } from "./commands/validate.ts";
import { cmdPlay } from "./commands/play.ts";
import { c } from "./format.ts";

interface Parsed {
  positional: string[];
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): Parsed {
  const positional: string[] = [];
  const flags: Record<string, string | boolean> = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (next !== undefined && !next.startsWith("--")) { flags[key] = next; i++; }
      else flags[key] = true;
    } else positional.push(a);
  }
  return { positional, flags };
}

function usage(): void {
  console.log(`${c.bold("iw")} — InteractiveWriter CLI

Uso:
  iw validate <file.iwstory>
  iw play <file.iwstory> [--seed <n>] [--choices <a,b,c>] [--build <file.json>] [--force]

Comandi:
  validate   Analizza staticamente la storia (exit 1 se ci sono errori).
  play       Gioca la storia in terminale. Con --choices gira in modo scriptato
             e deterministico (indici 1-based o id di scelta separati da virgola).

Esempi:
  iw validate examples/atrio-villa.iwstory.json
  iw play examples/atrio-villa.iwstory.json --seed 1 --choices annusa,prendi_chiave,esci`);
}

async function main(): Promise<number> {
  const { positional, flags } = parseArgs(process.argv.slice(2));
  const cmd = positional[0];
  const file = positional[1];

  if (!cmd || flags.help || flags.h) { usage(); return cmd ? 0 : 1; }

  switch (cmd) {
    case "validate":
      if (!file) { console.error(c.red("manca il file")); return 1; }
      return cmdValidate(file);
    case "play": {
      if (!file) { console.error(c.red("manca il file")); return 1; }
      const choices = typeof flags.choices === "string" ? flags.choices.split(",") : undefined;
      return await cmdPlay(file, {
        seed: flags.seed !== undefined ? Number(flags.seed) : 0,
        choices,
        build: typeof flags.build === "string" ? flags.build : undefined,
        force: Boolean(flags.force),
      });
    }
    default:
      console.error(c.red(`comando sconosciuto: ${cmd}`));
      usage();
      return 1;
  }
}

main().then((code) => process.exit(code)).catch((e) => {
  console.error(c.red("errore: ") + (e as Error).message);
  process.exit(1);
});
