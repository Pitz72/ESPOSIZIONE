# Roadmap di continuità — InteractiveWriter

> Documento di passaggio tra sessioni di lavoro. Dice **dove siamo**, **come si esegue**, **dove si va** e
> **qual è il prossimo passo concreto**. Chi riprende (umano o AI) parte da qui.

Ultimo aggiornamento: 2026-07-20 · Versione progetto: **0.2.0**

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
| 0.2.0 | **Editor writer-first: layer linguistico + doppia vista Autore/Tecnica** |

- **Formato `.iwstory`**: `formatVersion` **0.3**. Stabile e collaudato su due migrazioni reali.
- **Collaudi**: [Corridor](docs/collaudo-01-corridor.md) (funzioni-condizione, skill check, risorse) e
  [lemmons](docs/collaudo-02-lemmons.md) (logica imperativa in HTML, stato piatto, zero dadi). Entrambi
  migrati senza forzature: la tesi (logica→dato dichiarativo) regge ai due estremi.
- **Test**: 22 verdi (16 core + 6 CLI).
- **Esempi**: `atrio-villa` (sintetico), `corridor-act1`, `lemmons-carli` — tutti validano contro lo schema.
- **Editor**: vista Autore (Scene per titolo, "Appare solo se…" a frase, "Cosa cambia", validazione gentile)
  + vista Tecnica (dato grezzo) sullo stesso file. Verificato dal vivo nel browser.

## 4. Come si esegue

Serve **Node ≥ 22.6** (type-stripping nativo, i test girano senza build). Per l'editor Tauri serve **Rust**.

```bash
# Test del core e della CLI (22 verdi)
cd core && node --test
cd ../cli && node --test

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
  `lib/summarize`, `components/*`.
- [`CHANGELOG.md`](CHANGELOG.md) — un file per versione in `CHANGELOG/`.

## 6. Dove si va — roadmap AX (ordine writer-first)

Dalla spec §9, ricostruzione dell'editor nella lingua dell'autore:

1. ✅ Layer linguistico + doppia vista Autore/Tecnica *(0.2.0)*.
2. ⬜ **Fatti creati scrivendo** + editor delle conseguenze "Cosa cambia" *(← prossimo)*.
3. ⬜ Costruttore di condizioni composte a frase ("e anche / oppure / tranne quando").
4. ⬜ Wizard **Prova di abilità** con difficoltà a parole e **% dal vivo** (la matematica è già in
   `editor/src/lib/authorLang.ts` → `successChance`).
5. ⬜ **Playtest incorporato** (riuso motore) con pannello di stato in lingua naturale.
6. ⬜ Livelli 1–3 (Racconto / Con conseguenze / Ruolistico) + template d'avvio.
7. ⬜ Canvas a grafo (vista secondaria) + dialog nativi Tauri (comandi Rust).

Più avanti (non-editor): **ponte LLM** (skill che genera nodi schema-validi nel vicinato, in ciclo col
validatore), importer da Corridor/TUBO/Respiro.

## 7. Prossimo passo concreto (raccomandato)

**Fatti creati scrivendo** (§2 della roadmap sopra, leva n.1 della spec AX). Oggi per aggiungere una
condizione o una conseguenza si sceglie da un elenco di fatti che devono già esistere. Il passo che elimina
il terrore della pagina bianca:

- mentre l'autore scrive una conseguenza ("ora ha la chiave"), l'editor **riconosce e propone** di creare il
  fatto *«ha la chiave»* (sì/no) — lo `stateSchema` si popola come sottoprodotto della scrittura;
- costruire in parallelo l'**editor delle conseguenze "Cosa cambia"** (oggi in sola lettura), così il cerchio
  scrittura → memoria → condizioni si chiude tutto in lingua d'autore.

Sarà la **0.3.0** dell'editor. Il primo file da toccare: `editor/src/components/NodeInspector.tsx`
(sezione effetti/conseguenze) + un nuovo componente per l'aggiunta guidata di conseguenze con creazione
del fatto al volo.

## 8. Convenzioni di lavoro

- Ogni tappa apre un file `CHANGELOG/CHANGELOG_vX.Y.Z.md` + riga indice in [`CHANGELOG.md`](CHANGELOG.md).
- `formatVersion` del formato è versionato separatamente dalla versione del progetto.
- Ogni modifica al formato deve mantenere validi i 3 esempi (rivalidare con lo schema).
- Zero dipendenze runtime nel core e nella CLI; l'editor usa solo pacchetti già in cache (React/Vite/Tauri).
