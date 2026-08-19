# InteractiveWriter

> **Questa è la traccia-strumento di ESPOSIZIONE.** InteractiveWriter è stato importato qui — repository [Pitz72/ESPOSIZIONE](https://github.com/Pitz72/ESPOSIZIONE), cartella `strumento/` — il 19 agosto 2026, con tutta la sua storia; la vecchia sede `Ecosystem-Runtime/InteractiveWriter` è stata chiusa lo stesso giorno. Il nome **InteractiveWriter è definitivo** (decisione D-S1); il logotipo, in stile ESPOSIZIONE, è in lavorazione. Codice e testi stanno sotto CC BY-SA 4.0 (vedi [`../LICENSE`](../LICENSE)). La trasformazione nello strumento fisico di ESPOSIZIONE è governata da [`../ROADMAP-STRUMENTO.md`](../ROADMAP-STRUMENTO.md); la roadmap interna qui sotto resta come documento del progetto d'origine.

Continuità tra sessioni: [ROADMAP.md](ROADMAP.md)

Framework per scrivere **storie interattive con elementi ruolistici** (stile *Disco Elysium*): modella
tutta la logica, la complessità e le meccaniche della parte narrativa. **Non** produce il gioco
multimediale — produce la *logica narrativa* come pacchetto dati portabile, il motore che la esegue e
l'editor grafico che la scrive.

## Idea in una riga

Le storie interattive smettono di scalare perché lo stato vive nel posto sbagliato (funzioni o flag scritti
a mano). InteractiveWriter lo esternalizza in un **modello dati dichiarativo, serializzabile e validabile**,
così l'autore — umano o LLM — scrive contenuto *locale* dentro slot tipizzati, con un validatore che
garantisce la coerenza globale.

## Struttura

| Percorso | Cos'è |
|---|---|
| [`DESIGN.md`](DESIGN.md) | Documento di design completo: diagnosi, architettura a 5 strati, modello dati, roadmap |
| [`schema/iwstory.schema.json`](schema/iwstory.schema.json) | JSON Schema (Draft 2020-12) del formato `.iwstory` (`formatVersion 0.2`) |
| [`examples/`](examples/) | Storie dimostrative: `atrio-villa` (sintetica), `corridor-act1` e `lemmons-carli` (migrazioni di collaudo da progetti reali) |
| [`core/`](core/) | Libreria `@interactivewriter/core`: motore + validatore deterministici (TypeScript, zero dipendenze) |
| [`cli/`](cli/) | CLI `iw`: `validate` e `play` (interattivo o scriptato) da terminale |
| [`editor/`](editor/) | Editor grafico Tauri + React (editing-first): ispettori, editor di condizione, validazione live |
| [`docs/author-experience.md`](docs/author-experience.md) | **Spec dell'esperienza d'autore**: la lingua e l'UX che governano tutto l'editor |
| [`CHANGELOG.md`](CHANGELOG.md) | Registro delle versioni (un file per fase in `CHANGELOG/`) |

## Uso rapido

Serve Node ≥ 22.6 (type-stripping nativo, nessuno step di build).

```bash
# Validare una storia
node cli/src/iw.ts validate examples/atrio-villa.iwstory.json

# Giocarla in terminale (interattivo)
node cli/src/iw.ts play examples/atrio-villa.iwstory.json --seed 1

# Playthrough deterministico e scriptato (per test / ponte LLM)
node cli/src/iw.ts play examples/atrio-villa.iwstory.json --seed 1 --choices annusa,prendi_chiave,esci

# Test (17 verdi: 11 core + 6 CLI)
cd core && node --test
cd ../cli && node --test
```

## Architettura (5 strati)

1. **Formato `.iwstory`** — JSON versionato, presentation-agnostic (ruleset configurabile, stateSchema, nodi, scelte, voci, thread).
2. **Motore** — libreria TS pura e deterministica: `(storia, stato, scelta) → nuovo stato + nodo risolto`.
3. **Validatore** — analisi statica: goto pendenti, softlock, check impossibili, flag orfani…
4. **Editor GUI** — app desktop Tauri: canvas a grafo + ispettori generati dallo schema + playtest.
5. **Ponte LLM** — co-autore in fase di scrittura, opera sul sotto-grafo locale con feedback del validatore.

## Decisioni di progetto

- Sistema RPG **configurabile per progetto** (non cablato).
- Logica come **mini-espressioni dichiarative** (no funzioni JS).
- Editor come **app desktop Tauri + React**.

## Stato

- **Fase 0** (fondamenta) — completata: formato, schema, esempio validato.
- **Fase 1** (core) — completata: libreria `@interactivewriter/core` con motore deterministico, esiti
  graduati dei check e validatore statico; **11 test verdi**.
- **Fase 2** (CLI) — completata: `iw validate` e `iw play` (interattivo/scriptato); **6 test verdi**.
- **Collaudo #01** — migrato uno slice reale di Corridor2193 in `.iwstory` per stressare il modello
  ([referto](docs/collaudo-01-corridor.md)). Esito: nessuna forzatura strutturale.
- **Formato v0.3** (post-collaudo) — check su skill *o* attributo, `onFirstEnter`, `tags` sulle scelte,
  `hints` sui dialoghi.
- **Collaudo #02** — migrata la Scena 12 di lemmons ([referto](docs/collaudo-02-lemmons.md)): il gating
  imperativo del menu hub diventa `requires` dichiarativo. Ne è seguito il supporto **checkless/statless**
  (`ruleset` opzionale). **22 test verdi** (16 core + 6 CLI).
- **Fase 3** (editor) — MVP: app Tauri+React con ispettori, **editor di condizione a foglia** (menù generati
  da `stateSchema`/`ruleset`), editor dello stateSchema e **validazione live** (riusa il core). Verificato
  in preview. Vedi [editor/](editor/) e [CHANGELOG_v0.1.0](CHANGELOG/CHANGELOG_v0.1.0.md).

Prossimo: completare la Fase 3 — editor strutturale di condizioni/effetti, editing del ruleset/check,
playtest incorporato, canvas a grafo, dialog nativi. Vedi la roadmap in [`DESIGN.md`](DESIGN.md#7-roadmap-proposta).
