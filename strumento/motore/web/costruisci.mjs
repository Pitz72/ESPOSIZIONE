// Costruisce la versione elettronica del librogame: un solo file HTML, con dentro
// il motore, i dati e l'interfaccia. Usa esbuild solo per impacchettare, mentre si
// costruisce: la pagina non ha dipendenze.
//
//   node web/costruisci.mjs          (dalla cartella strumento/motore)

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createRequire } from "node:module";

const qui = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(qui, "../../editor/package.json"));
const esbuild = require("esbuild");

const risultato = await esbuild.build({
  entryPoints: [join(qui, "gioco.ts")],
  bundle: true,
  format: "iife",
  target: "es2022",
  minify: true,
  write: false,
  legalComments: "none",
});
const js = risultato.outputFiles[0].text.replace(/<\/script/gi, "<\\/script");
const pagina = readFileSync(join(qui, "pagina.html"), "utf8").replace("<!--MOTORE-->", `<script>${js}</script>`);
const uscita = join(qui, "../libro/santa-rita.html");
writeFileSync(uscita, pagina);
console.log(`Versione elettronica scritta in ${uscita} (${Math.round(pagina.length / 1024)} KB)`);
