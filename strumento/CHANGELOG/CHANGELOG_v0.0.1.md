# v0.0.1 — Fase 1: Core (motore + validatore)

Data: 2026-07-19 · Stato: **Completata**

Prima versione con codice eseguibile: la libreria core `@interactivewriter/core` che esegue e valida un
pacchetto `.iwstory`. Introduce inoltre gli **esiti graduati** dei check.

## Formato (`.iwstory`) — salto a `formatVersion: "0.2"`

- **Esiti graduati dei check.** Un check attivo non è più binario: produce una fascia nello spettro
  `critFailure < failure < partial < success < critSuccess`, ciascuna con `goto`, `effects` e `text` propri.
  Le fasce non specificate **degradano** alla più vicina inferiore. Mantenuta la forma breve
  `onSuccess`/`onFailure`.
- **`ruleset.outcomeModel`** — definisce come il totale del tiro diventa una fascia (`partial`, `partialBand`,
  `crits`, `critMargin`), una volta per tutta la storia.
- Schema aggiornato (`$defs`: `outcomeModel`, `outcomes`, `outcomeResolution`; `activeCheck` rivisto).
- Esempio `atrio-villa` aggiornato: il check `forza_porta` mostra tutte e cinque le fasce.

## Libreria core `@interactivewriter/core`

Libreria TypeScript pura, senza dipendenze runtime. Gira con `node --test` sfruttando il type-stripping
nativo di Node ≥ 22.6 (nessuno step di build). Moduli:

- `src/types.ts` — tipi TypeScript allineati allo schema (`formatVersion "0.2"`).
- `src/rng.ts` — RNG seedabile mulberry32, deterministico e con stato filato (puro).
- `src/dice.ts` — parsing e tiro della notazione dadi (`NdM`), con min/max assoluti.
- `src/engine.ts` — `newGame`, `resolveNode`, `choose`, `evaluate`, `applyEffects`, `rollCheck`,
  `gradeTier`, `degrade`, `resolveRef`, `passiveSucceeds`. Check passivi (voci) deterministici; check
  attivi con esiti graduati + regola di degrado; red-check non ripetibili; risorse esaurite → nodo forzato.
- `src/validator.ts` — regole statiche **E01–E06** (goto pendente, var non dichiarata, riferimento invalido,
  tipo incompatibile, enum/stage fuori dominio, entry mancante) e **W01/W03/W04/W05** (irraggiungibile,
  check impossibile/banale, flag orfano, thread mai completato).
- `src/index.ts` — API pubblica (barrel).

Regole validatore rimandate a fasi successive: **W02** (softlock su rami condizionali), **W06** (scelta
sempre nascosta per condizione insoddisfacibile) — richiedono un mini-solver sulle condizioni.

## Test

`core/src/engine.test.ts` e `core/src/validator.test.ts` — **11 test, tutti verdi**. Coprono: init partita
e `onEnter`, filtro voci/scelte, navigazione con effetti, determinismo di `rollCheck` a seed fisso, mappatura
delle fasce di `gradeTier`, degrado di `degrade`, redirezione su risorsa esaurita, assenza di errori sulla
storia d'esempio, presenza dei warning attesi (W04/W05) e rilevamento di E01/E02/E03/E06 su storie rotte.

## Criteri di completamento della fase

- [x] Motore esegue la storia d'esempio end-to-end.
- [x] `rollCheck` deterministico a seed fisso, con esiti graduati e degrado.
- [x] Validatore segnala almeno E01–E06 sui casi di prova.
- [x] Suite di test verde (11/11).
