# v0.0.3 — Consolidamento formato v0.3 (post-collaudo #01)

Data: 2026-07-19 · Stato: **Completata**

Raccoglie le quattro estensioni retro-compatibili emerse dal [collaudo #01](../docs/collaudo-01-corridor.md)
sulla migrazione di Corridor2193. `formatVersion` del formato passa a **"0.3"**.

## Formato (`.iwstory`) — `formatVersion: "0.3"`

- **G1 — check su skill o attributo.** Un check (attivo o passivo) può ora puntare a una `skill` **oppure**
  a un `attribute`. Il layer skill diventa opzionale: i giochi che tirano su statistiche dirette
  (es. Corridor: `strength/agility/tech`) migrano senza inventare skill fittizie. `ruleset.skills` non è
  più obbligatorio.
- **G2 — `hints` sui blocchi di dialogo.** Campo opzionale `hints` (oggetto libero) su ogni `contentBlock`:
  ignorato dal motore, preservato nel round-trip per lo shell (es. `glitch`, `typingSpeed`).
- **G3 — `tags` sulle scelte.** Campo opzionale `tags: string[]` su `choice` per categoria/affinità
  (combat/stealth/tech…). Riportato in `ResolvedChoice`.
- **G4 — `onFirstEnter`.** Effetti di nodo che partono **solo alla prima visita**, distinti da `onEnter`
  (sempre). Risolve l'impilamento degli effetti nei cicli/hub. Il motore lo calcola da `history`.

Tutte le modifiche sono additive: gli esempi 0.2 restano concettualmente validi (aggiornati a 0.3 nel
campo `formatVersion`).

## Core (`@interactivewriter/core`)

- `engine.ts`: risoluzione del valore di check per skill **o** attributo; `newGame`/`choose` usano un
  singolo helper `enter()` che applica `onFirstEnter` alla prima visita.
- `validator.ts`: il target del check (skill/attributo) viene verificato (E03); walk anche di `onFirstEnter`.
- `types.ts`: `ActiveCheck`/`PassiveCheck` con `skill?`/`attribute?`; `ContentBlock.hints`; `Choice.tags`;
  `StoryNode.onFirstEnter`.

## Esempi

- `examples/atrio-villa.iwstory.json` → `formatVersion 0.3`.
- `examples/corridor-act1.iwstory.json` → riscritto come **showcase**: statistiche come attributi (niente
  skill fittizie, G1), `tags` sulle scelte (G3), `hints` su un blocco glitch (G2), e lo stress della console
  spostato in `onFirstEnter` (G4) — così rientrare non lo impila più.

## Criteri di completamento

- [x] Schema aggiornato; entrambi gli esempi conformi (`formatVersion 0.3`).
- [x] Check su attributo funzionante e testato; `onFirstEnter` non si ripete al rientro.
- [x] Suite core + CLI verdi (**19 test**: 13 core + 6 CLI); collaudo Corridor ri-giocato pulito
  (stress finale 45 invece di 55 grazie a `onFirstEnter`).
