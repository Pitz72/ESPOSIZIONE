# v0.1.0 — Fase 3: Editor GUI (MVP editing-first, Tauri)

Data: 2026-07-20 · Stato: **MVP completato**

Primo slice dell'editor grafico: app **Tauri v2 + React 19 + Vite**, editing-first. Riusa
`@interactivewriter/core` per la validazione live. Il frontend è anche eseguibile in un browser normale
(adapter di I/O in `src/lib/fileIO.ts`), quindi verificabile senza il guscio nativo.

## Aggiunto — `editor/`

- **Scaffold Tauri v2** (`src-tauri/`): `Cargo.toml`, `tauri.conf.json`, `build.rs`, `capabilities`,
  `lib.rs`/`main.rs`. Solo crate già in cache (tauri 2, opener, serde). Avvio: `npm run tauri:dev`.
- **Frontend React** (`src/`):
  - Caricamento storia: apri file (`.iwstory`/`.json`), storia vuota, o i 3 esempi bundlati.
  - **Lista nodi** con nodo iniziale (★) e badge errori/warning per nodo.
  - **Ispettore nodo**: titolo, tag, blocchi di contenuto (speaker + testo, add/remove), scelte
    (testo, `goto` via dropdown di nodi, `tags`, riepilogo `check`/`effects`), riepilogo `onEnter`/`onFirstEnter`.
  - **Editor di condizione a foglia** su `requires`: menù `lhs` **generati dallo stateSchema e dal ruleset**
    (variabili + `@resource:` + `@skill:` + `@attr:`), operatore, e valore `rhs` tipizzato (select booleano/enum,
    numero, testo) in base al tipo della variabile. Le condizioni composite (all/any/not) sono mostrate in
    riepilogo (editor strutturale nella prossima iterazione).
  - **Editor dello stateSchema**: dichiara/rinomina/elimina variabili, tipo (boolean/number/string/enum),
    default, min/max, valori enum. È il rimpiazzo dei flag scritti a mano.
  - **Pannello di validazione live**: esegue `validateStory` a ogni modifica; click su un finding → seleziona
    il nodo. Vista ruleset in sola lettura.
  - **Salvataggio**: download del JSON (adapter; dialog nativi Tauri come rifinitura successiva).

## Verificato dal vivo (browser preview)

Caricato l'esempio `corridor-act1`: lista dei 16 nodi, ispettore, pannello di validazione con i 5 warning
W04, editor di stato con le 6 variabili, ed editor di condizione su `go_labs_unlocked`/`go_labs_locked` con i
dropdown generati da `stateSchema`+`ruleset` e `rhs` booleano per `key_beta_labs`. Bug risolto in corso
d'opera: gli input non-controllati non si resettavano al cambio nodo → remount dell'ispettore via `key`.

## Non ancora fatto (prossime iterazioni della Fase 3)

- Editor strutturale delle condizioni composite (all/any/not) e degli **effetti** (oggi in sola lettura).
- Editing del **ruleset** e dei **check** (esiti graduati) dall'UI.
- **Playtest incorporato** (riuso del motore `newGame/resolveNode/choose`).
- **Canvas a grafo** con archi `goto`/check.
- Dialog di apertura/salvataggio **nativi Tauri** (comandi Rust).
