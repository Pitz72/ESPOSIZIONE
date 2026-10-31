# 0.5.1 — Revisione totale: irrobustimento di motore, validatore ed editor

**Data:** 2026-07-20
**Tipo:** patch (nessuna modifica al formato `.iwstory`; `formatVersion` resta "0.4")

Revisione completa del codice esistente a caccia di criticità. Tutti i difetti elencati
sono stati **riprodotti sperimentalmente** prima della correzione e coperti da test.

## Motore (`core/src/engine.ts`)

- **BUG — `completeThread` perdeva gli effetti `onComplete`.** Venivano applicati a un clone
  dello stato subito scartato (`applyEffects` restituisce una copia che nessuno raccoglieva).
  Ora si applicano in place allo stato reale.
- **Coerenza — `advanceThread` all'ultimo stage ora completa il thread** e scatena `onComplete`
  (una sola volta). Prima il validatore contava quell'avanzamento come completamento (W05),
  ma il motore non applicava gli effetti: le due viste ora coincidono.

## Validatore (`core/src/validator.ts`)

- **CRASH — `checkFeasibility` lanciava un'eccezione** (`Cannot read properties of undefined`)
  se `ruleset.attributes` mancava ma un check citava un attributo (direttamente o tramite
  `adds: ["attribute"]`). Siccome l'editor valida a ogni modifica, il crash abbatteva l'intera
  interfaccia. Ora le ricerche sono guardate (`?.`).
- **Nuove regole** (colmano il buco tra schema JSON — che nessuno applica a runtime — e
  validatore, che è l'unica guardia viva in CLI ed editor):
  - **E09** — scelta senza via d'uscita (né `goto` né `check`), o con entrambi (il `goto`
    verrebbe ignorato). Prima: crash a runtime.
  - **E10** — check senza alcun esito (`outcomes` vuoto, niente `onSuccess`/`onFailure`).
    Prima: crash a runtime («Check senza alcun esito risolvibile»).
  - **E11** — notazione dadi non parsabile in `ruleset.check.dice`. Prima: crash al primo tiro.
  - **E12** — skill che dipende da un attributo non dichiarato (riferimento pendente creato
    p.es. cancellando una caratteristica dalla scheda).
  - **W08** — check senza esito di fallimento: il degrado risale e un tiro fallito userebbe
    l'esito di successo più vicino. Legale, ma quasi sempre una svista.

## CLI (`cli/src/commands/play.ts`)

- **BUG — il tiro dei check su attributo non veniva mai mostrato** (la riga 🎲 compariva solo
  per i check su skill). Ora si mostra la statistica bersaglio, skill o attributo che sia.

## Editor

- **BUG — `stripArticle` mangiava l'inizio delle parole** («ottieni lampada» → fatto «ha mpada»,
  «ottieni lettera» → «ha ttera»): l'articolo veniva riconosciuto anche senza uno spazio dopo.
  Ora le forme in lettere richiedono lo spazio, quelle con apostrofo si delimitano da sole;
  aggiunte anche le preposizioni articolate (`della`, `dello`, `dei`, `degli`, `delle`).
- **Rinomina propagata dei fatti** (nuovo `lib/renameVar.ts`): rinominare la chiave tecnica di
  una variabile ora riscrive ogni riferimento nella storia (condizioni `lhs`/`rhs {var}`,
  effetti `set`/`add`, modificatori e esiti dei check, `onEnter`/`onFirstEnter`, `onComplete`
  dei thread). Prima la rinomina rompeva silenziosamente tutti i riferimenti (E02 a valle).
- **Personaggi pronti: lo 0 è un valore legittimo.** Impostare una statistica a 0 cancellava
  l'override e il valore tornava al default. Ora il campo vuoto = nessun override (default in
  filigrana), 0 = «parte da zero».
- **`conditionToAuthor`**: le prove passive su attributo ora mostrano il nome dell'attributo
  (prima la frase usciva monca: «una prova di riesce»).
- **`successChance`**: il default dell'attributo genitore è 1 come nel motore (era 0 → le
  percentuali mostrate erano leggermente sballate).

## Test

- **60 verdi** (36 core + 6 CLI + 18 editor), +11 rispetto alla 0.5.0.
- I tre esempi validano senza errori con gli stessi warning attesi di prima (2 / 5 / 4).
- Editor verificato dal vivo (preview browser): parse «ottieni lampada» → oggetto dichiarato,
  pannello personaggi con default in filigrana, console pulita.

## Difetti noti rimandati (annotati, non corretti)

- `addItem` con `overflow: "block"` scarta l'oggetto **senza segnalarlo allo shell**: il testo
  dell'esito può dire «prendi la lampada» mentre l'inventario resta vuoto. Serve un canale di
  ritorno (es. `ChooseResult.dropped`) — da progettare col playtest incorporato.
- `CheckFormula.critSuccess/critFailure` (schema+tipi) non sono mai letti dal motore: i critici
  vivono in `outcomeModel`. Da rimuovere alla prossima revisione del formato.
- `history` cresce senza limiti nei cicli hub (è anche il formato di salvataggio) e
  `enter()` fa una scansione lineare: da rivedere quando nascerà il playtest.
