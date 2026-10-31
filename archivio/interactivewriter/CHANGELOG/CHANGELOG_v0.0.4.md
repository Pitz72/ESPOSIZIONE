# v0.0.4 — Formato checkless/statless + Collaudo #02 (lemmons)

Data: 2026-07-19 · Stato: **Completata**

Chiude il [collaudo #02](../docs/collaudo-02-lemmons.md) (migrazione della Scena 12 di lemmons-porting) e
integra l'unico ritocco di sostanza emerso: **G11**, il supporto di prima classe alle storie senza dadi né
statistiche.

## Collaudo #02 — lemmons

Migrata la Scena 12 (hub di dialogo col ragionier Carli): 16 nodi, 15 variabili, 1 risorsa, 0 check.
Referto completo in [docs/collaudo-02-lemmons.md](../docs/collaudo-02-lemmons.md). Esito: schema ok,
0 errori, 4 warning (W04), playthrough di 17 nodi verificato. Conferma centrale: il **gating imperativo**
del menu hub (`if (!completedNarrativeArcs.has(...))`) diventa `requires` dichiarativo e a runtime si comporta
identico; i nodi che si ramificano sullo stato si migrano con blocchi di contenuto e scelte gated, senza
spezzare il nodo. Nuovo esempio: [`examples/lemmons-carli.iwstory.json`](../examples/lemmons-carli.iwstory.json).

## G11 — storie checkless/statless (retro-compatibile)

- **Formato:** `ruleset.check`, `ruleset.attributes`, `ruleset.resources` sono ora **opzionali**. Una storia
  a sole scelte può avere `"ruleset": {}`. `formatVersion` resta **"0.3"** (è un allentamento compatibile:
  i file esistenti restano validi).
- **Core:** `newGame`, `applyEffect` (adjustResource) e il controllo di esaurimento risorse guardano i campi
  opzionali; `checkFeasibility` esce subito se manca la formula.
- **Validatore:** nuova regola **E07** — se la storia usa dei check ma manca `ruleset.check`, è un errore.
- **Esempio lemmons:** rimossi il `check` fittizio `1d6` e l'array `attributes` vuoto; ora `ruleset` contiene
  solo la risorsa `astinenza_sigarette`.

## Findings non implementati (documentati)

- **G7** collezione di "archi completati" (`Set`): per ora modellati come N booleani (convenzione).
- **G8** corpo nodo in HTML/2-colonne: scartato (presentation-agnostic); `text` trattato come Markdown per
  convenzione.
- **G10** effetti custom: mappati sui primitivi (`add` delta / `set`).

## Test

`core/src/{engine,validator}.test.ts` — **16 core** (+ 2: storia checkless gira; E07/checkless valida) e
**6 CLI**. Totale progetto: **22 test verdi**.

## Criteri di completamento

- [x] `ruleset` opzionale; i 3 esempi conformi allo schema.
- [x] Storia checkless gira nel motore e nella CLI; E07 scatta quando serve.
- [x] Suite core + CLI verdi (22/22); collaudo lemmons ri-giocato pulito.
