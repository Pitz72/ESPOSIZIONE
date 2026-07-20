# Roadmap di continuità — InteractiveWriter

> Documento di passaggio tra sessioni di lavoro. Dice **dove siamo**, **come si esegue**, **dove si va** e
> **qual è il prossimo passo concreto**. Chi riprende (umano o AI) parte da qui.

Ultimo aggiornamento: 2026-07-20 · Versione progetto: **0.3.0**
Repository: <https://github.com/Ecosystem-Runtime/InteractiveWriter> (privata)

---

## 1. La visione in tre righe

Un framework per scrivere **storie interattive con elementi ruolistici** (stile *Disco Elysium*): tutta la
logica, la complessità e le meccaniche narrative. Non produce il gioco multimediale, ma la **logica narrativa**
come pacchetto dati portabile, il motore che la esegue e l'editor che la scrive.

Filosofia non trattabile: **rigore sotto = semplicità sopra**. Il modello dati dichiarativo e validato è ciò
che permette di nascondere una complessità avanzatissima dietro un uso semplice per un autore **senza
competenze tecniche**. Vedi [`docs/author-experience.md`](docs/author-experience.md) — è la spec che governa
tutta l'interfaccia.

## 2. Architettura (5 strati)

1. **Formato `.iwstory`** — JSON versionato, presentation-agnostic ([`schema/`](schema/), [`DESIGN.md`](DESIGN.md)).
2. **Motore** — libreria TS pura e deterministica ([`core/src/engine.ts`](core/src/engine.ts)).
3. **Validatore** — analisi statica ([`core/src/validator.ts`](core/src/validator.ts)).
4. **Editor GUI** — Tauri + React, writer-first ([`editor/`](editor/)).
5. **Ponte LLM** — co-autore in fase di scrittura (da fare).

## 3. Dove siamo — cosa è fatto

| Versione | Cosa |
|---|---|
| 0.0.0 | Fondamenta: formato, schema JSON, esempio |
| 0.0.1 | Core: motore + validatore (13 test) |
| 0.0.2 | CLI `iw` (validate / play) (6 test) |
| 0.0.3 | Formato v0.3: esiti graduati, check skill/attributo, `onFirstEnter`, `tags`, `hints` |
| 0.0.4 | Formato checkless/statless (G11) + collaudo #02 (lemmons) |
| 0.1.0 | Editor MVP (Tauri+React, editing-first) |
| 0.2.0 | Editor writer-first: layer linguistico + doppia vista Autore/Tecnica |
| 0.3.0 | **Fatti creati scrivendo + editor delle conseguenze "Cosa cambia"** |

- **Formato `.iwstory`**: `formatVersion` **0.3**. Stabile e collaudato su due migrazioni reali.
- **Collaudi**: [Corridor](docs/collaudo-01-corridor.md) (funzioni-condizione, skill check, risorse) e
  [lemmons](docs/collaudo-02-lemmons.md) (logica imperativa in HTML, stato piatto, zero dadi). Entrambi
  migrati senza forzature: la tesi (logica→dato dichiarativo) regge ai due estremi.
- **Test**: 36 verdi (16 core + 6 CLI + 14 editor).
- **Esempi**: `atrio-villa` (sintetico), `corridor-act1`, `lemmons-carli` — tutti validano contro lo schema.
- **Editor**: vista Autore (Scene per titolo, "Appare solo se…" a frase, "Cosa cambia", validazione gentile)
  + vista Tecnica (dato grezzo) sullo stesso file. Verificato dal vivo nel browser.
- **Fatti creati scrivendo**: l'autore scrive *«ora ha la chiave»* fra le conseguenze e il fatto nasce da
  solo (riconoscitore in `editor/src/lib/factLang.ts`); i riferimenti già esistenti vengono riconosciuti per
  nome, senza doppioni. Nessuna dichiarazione preliminare, nessun id a schermo.

## 4. Come si esegue

Serve **Node ≥ 22.6** (type-stripping nativo, i test girano senza build). Per l'editor Tauri serve **Rust**.

```bash
# Test (36 verdi)
cd core && node --test
cd ../cli && node --test
cd ../editor && node --test        # riconoscitore delle conseguenze (14)

# Validare / giocare una storia da terminale
node cli/src/iw.ts validate examples/lemmons-carli.iwstory.json
node cli/src/iw.ts play examples/corridor-act1.iwstory.json --seed 1 --choices wake_up,who_are_you,escape_force

# Editor: frontend nel browser (verificabile senza Tauri)
cd editor && npm install && npm run dev      # http://localhost:1420
cd editor && npm run tauri:dev               # app desktop nativa (richiede Rust)
```

## 5. Mappa dei file chiave

- [`DESIGN.md`](DESIGN.md) — design generale, formato, roadmap tecnica.
- [`docs/author-experience.md`](docs/author-experience.md) — **spec dell'esperienza d'autore (governa l'UI)**.
- [`schema/iwstory.schema.json`](schema/iwstory.schema.json) — JSON Schema del formato.
- [`core/src/`](core/src/) — `types`, `rng`, `dice`, `engine`, `validator`, `index` (+ test).
- [`cli/src/`](cli/src/) — comando `iw`.
- [`editor/src/`](editor/src/) — `App`, `view` (doppia vista), `lib/authorLang` (traduttore lingua d'autore),
  `lib/factLang` (**dalla frase d'autore all'effetto + fatto proposto**, con test), `lib/summarize`,
  `components/*` (fra cui `EffectsEditor`, l'editor di "Cosa cambia").
- [`CHANGELOG.md`](CHANGELOG.md) — un file per versione in `CHANGELOG/`.

## 6. Dove si va — roadmap AX (ordine writer-first)

Dalla spec §9, ricostruzione dell'editor nella lingua dell'autore:

1. ✅ Layer linguistico + doppia vista Autore/Tecnica *(0.2.0)*.
2. ✅ **Fatti creati scrivendo** + editor delle conseguenze "Cosa cambia" *(0.3.0)*.
3. ⬜ Costruttore di condizioni composte a frase ("e anche / oppure / tranne quando") *(← prossimo)*.
4. ⬜ Wizard **Prova di abilità** con difficoltà a parole e **% dal vivo** (la matematica è già in
   `editor/src/lib/authorLang.ts` → `successChance`).
5. ⬜ **Playtest incorporato** (riuso motore) con pannello di stato in lingua naturale.
6. ⬜ Livelli 1–3 (Racconto / Con conseguenze / Ruolistico) + template d'avvio.
7. ⬜ Canvas a grafo (vista secondaria) + dialog nativi Tauri (comandi Rust).

Più avanti (non-editor): **ponte LLM** (skill che genera nodi schema-validi nel vicinato, in ciclo col
validatore), importer da Corridor/TUBO/Respiro.

## 7. Prossimo passo concreto (raccomandato)

**Costruttore di condizioni composte a frase** (§3 della roadmap sopra, spec AX §5.4). Oggi *«Appare solo
se…»* sa modificare **una sola** condizione semplice: se la condizione è articolata (`all` / `any` / `not`)
l'editor la mostra come frase ma non la lascia toccare ("la modifica a frase arriva presto" —
`LeafRequires` in `editor/src/components/NodeInspector.tsx`). È l'ultimo punto in cui l'autore resta a
guardare senza poter agire.

Da fare:

- un componente ricorsivo che renda ogni foglia modificabile e permetta di aggiungere righe con
  **"e anche" / "oppure" / "tranne quando"** — mai una parentesi, mai `all`/`any` a schermo;
- riuso di `+ nuovo fatto` (già pronto, `factLang.ts`) su ogni foglia;
- stessa griglia di editing anche per il *«appare se»* dei blocchi di racconto, oggi in sola lettura.

Sarà la **0.4.0** dell'editor. Subito dopo: wizard **Prova di abilità** con % dal vivo (la matematica è già
in `editor/src/lib/authorLang.ts` → `successChance`).

## 8. Convenzioni di lavoro

- Ogni tappa apre un file `CHANGELOG/CHANGELOG_vX.Y.Z.md` + riga indice in [`CHANGELOG.md`](CHANGELOG.md).
- `formatVersion` del formato è versionato separatamente dalla versione del progetto.
- Ogni modifica al formato deve mantenere validi i 3 esempi (rivalidare con lo schema).
- Zero dipendenze runtime nel core e nella CLI; l'editor usa solo pacchetti già in cache (React/Vite/Tauri).
