# v0.0.2 — Fase 2: CLI headless

Data: 2026-07-19 · Stato: **Completata**

Interfaccia a riga di comando per **validare** e **giocare** un pacchetto `.iwstory` da terminale, prima
di costruire la GUI. Utile anche come banco di prova per il ponte LLM (modalità scriptata deterministica).

## Aggiunto — `@interactivewriter/cli` (`iw`)

- `iw validate <file>` — esegue il validatore statico e stampa i findings raggruppati per severità;
  exit code `1` se ci sono errori, `0` altrimenti.
- `iw play <file>` — playthrough testuale:
  - **interattivo** (readline) quando manca `--choices`;
  - **scriptato/deterministico** con `--choices <a,b,c>` (indici 1-based o id di scelta) — stampa l'intero
    transcript senza input umano.
  - opzioni: `--seed <n>`, `--build <file.json>` (attributi/skill del personaggio), `--force`
    (gioca anche con errori di validazione).
- Rendering senza dipendenze: colori ANSI disattivati automaticamente fuori da TTY / con `NO_COLOR`
  (così il transcript scriptato è testo pulito e diffabile).

## Struttura

- `cli/src/iw.ts` — entrypoint, parsing argomenti e dispatch.
- `cli/src/commands/validate.ts` — `loadStory` (lettura + JSON + check chiavi di primo livello) e `cmdValidate`.
- `cli/src/commands/play.ts` — `cmdPlay` (interattivo/scriptato), rendering nodi/voci/scelte/tiri/finale.
- `cli/src/format.ts` — colori ANSI senza dipendenze.

## Test

`cli/src/cli.test.ts` — **6 test, tutti verdi**: validate su esempio (0), storia rotta (1), file inesistente
(1); play scriptato completo (0), token non valido (1), selezione per indice numerico (0).
Totale progetto: **17 test verdi** (11 core + 6 CLI).

## Criteri di completamento della fase

- [x] `iw validate` esce 0 sull'esempio (warning ammessi) e 1 su una storia con errori.
- [x] `iw play --choices ...` completa un percorso fino a un finale, in modo deterministico a seed fisso.
- [x] Test end-to-end della CLI verdi.
