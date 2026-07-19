# Collaudo #02 — Migrazione da lemmons-porting

Data: 2026-07-19 · Formato: `.iwstory` 0.3 · Core/CLI: 0.0.3 / 0.0.2

## Obiettivo

Stressare il modello dati dall'estremo **opposto** a Corridor: una storia senza tiri di dado, con
**tantissimo stato piatto** e una logica di scelta/contenuto **imperativa**. Sorgente: **lemmons-porting**,
dove i nodi sono *funzioni che generano HTML* e le scelte sono `<button>` con attributi `data-*`.

## Cosa è stato migrato

La **Scena 12** (dialogo investigativo col ragionier Carli): un hub di dialogo con menu dinamico, archi
narrativi, una relazione numerica (`fiducia_carli`) e un nodo che si ramifica sullo stato. 16 nodi,
15 variabili, 1 risorsa, 0 check. Sorgenti reali: `scena12.ts`, `types.ts` (`NarrativeVariables`),
`useGameStore.ts`. Risultato: [`examples/lemmons-carli.iwstory.json`](../examples/lemmons-carli.iwstory.json).

## Esito dei tre setacci

| Setaccio | Esito |
|---|---|
| Schema JSON | ✅ conforme |
| Validatore statico | ✅ **0 errori**, 4 warning (W04) |
| Playthrough deterministico (CLI) | ✅ 17 nodi, menu dinamico e branch di stato verificati |

## Cosa il modello ha assorbito bene (conferme)

1. **Gating imperativo → `requires` dichiarativo — la conferma centrale.** Il menu dell'hub in lemmons è
   costruito con JS imperativo:
   ```ts
   if (!state.completedNarrativeArcs.has('carli_pagamenti')) content += `<button ...>`;
   if (hasAskedInitialQuestions && !...has('carli_comportamento') && isCalm) content += `<button ...>`;
   ```
   È diventato `requires` con `all`/`any`/`not`. **Verificato a runtime:** dopo aver chiuso l'arco
   "pagamenti", quella voce sparisce e ne compare una nuova ("comportamento") perché la sua precondizione
   composita è ora soddisfatta; poi si sblocca "Sante o Lisa". Il grafo si comporta *identico* all'originale,
   ma la logica è dato editabile e validabile.

2. **Nodo che si ramifica sullo stato → blocchi di contenuto + scelte con `requires`.** In lemmons
   `Scena12_ChiediPrelievi` è una funzione con `if ((fiducia_carli||0) < 0 || stressed) return {…freddo…}
   else return {…dettagliato…}`. Migrato senza spezzare il nodo: due blocchi `content` e due `choices`,
   ciascuno con la propria `requires`. **Verificato:** con `fiducia_carli = 1` è comparsa la variante
   dettagliata e la scelta "Chiedi di più".

3. **Contenuto gated da relazione.** In `RispostaProgettoTensione` il paragrafo extra appare solo con
   `fiducia_carli >= 1` (approccio "diretto" la porta a 1). Verificato: il paragrafo è comparso.

4. **`@resource` nelle condizioni.** `isCalm = astinenza_sigarette < 70 || effetto_nicotina_attivo` è
   diventato `any:[ {@resource:astinenza_sigarette < 70}, {effetto_nicotina_attivo == true} ]`. Funziona.

5. **Lo stato piatto scala.** I ~160 flag di `NarrativeVariables` diventano `stateSchema` dichiarato; per
   questo slice 15 variabili + 1 risorsa. Il validatore ha subito segnalato 4 flag scritti-ma-mai-letti
   (nel gioco completo sono riletti in scene successive; entro lo slice sono lecitamente orfani).

6. **Storia senza dadi.** Nessun check: il motore e la CLI eseguono una narrativa puramente state-driven
   senza problemi.

## Buchi e frizioni emersi

### G7 — Nessuna collezione di "archi completati" *(frizione ergonomica)*
`completedNarrativeArcs: Set<string>` è un pattern diffuso (un sacchetto di flag "fatto/non fatto",
`.has()` / `.add()`). L'ho modellato con N variabili booleane (`arc_pagamenti`, `arc_prelievi`, …): fedele e
funzionante, ma verboso. I nostri `threads` sono più pesanti (stage con nome) e non calzano per archi binari.
**Proposta:** valutare un tipo collezione leggero (un set di tag/archi con `has`/`add`), oppure documentare
la convenzione "un booleano per arco". Non è un buco bloccante.

### G8 — Corpo del nodo in HTML e layout a due colonne *(atteso, presentation-agnostic)*
I nodi lemmons hanno corpo HTML e uno split `left`/`right`. Il formato è presentation-agnostic *per scelta*:
in migrazione ho convertito in blocchi di testo piano con `speaker`, scartando HTML e layout. Corretto, ma
per sorgenti HTML-heavy serve un convertitore, e gli autori potrebbero volere markup inline leggero.
**Proposta:** trattare `text` come **Markdown** per convenzione (nessuna modifica di schema), lo shell decide
la resa.

### G10 — Effetti di gioco custom *(mappati sui primitivi)*
`data-reset-nicotine`, valori calcolati (`fiducia - 2`) sono stati mappati sui primitivi esistenti:
`add fiducia_carli -2` (delta) e `set effetto_nicotina_attivo false`. Il vocabolario fisso degli effetti ha
retto; un vero effetto scriptato non ha escape hatch *per scelta* (mantiene la validabilità).

### G11 — `ruleset.check` (e attributi/risorse) obbligatori anche per storie senza dadi *(frizione reale)*
Lemmons non ha tiri: ho dovuto fornire un `check` fittizio (`1d6`) e un array `attributes` vuoto solo per
soddisfare lo schema. Molte storie a scelte non hanno alcun sistema di dadi/statistiche.
**Proposta (cheap, retro-compatibile):** rendere opzionali `ruleset.check`, `ruleset.attributes`,
`ruleset.resources`. Una storia diventa così "checkless/statless" di prima classe.

## Verdetto

Questo è il collaudo più probante: il sorgente più *ostile* al modello (logica dentro funzioni + HTML) si è
tradotto **senza spezzare nodi né forzare la struttura**, e la tesi centrale del progetto — *la logica esce
dal codice e diventa dato dichiarativo, validabile* — è confermata proprio dove faceva più male. L'unico
ritocco di sostanza è G11 (supporto checkless/statless); G7/G8/G10 sono convenzioni o estensioni opzionali.
