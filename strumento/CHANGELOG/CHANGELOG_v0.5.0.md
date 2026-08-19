# v0.5.0 — Configurazione iniziale (e cosa prendere da FAVELLA 1)

Data: 2026-07-20 · Stato: **Completata**

Il formato 0.4 aveva già `setting`, `presets` e `inventory`, ma nell'editor non si vedevano da nessuna
parte: si entrava dritti nelle scene. Questa versione dà una casa a tutto il lavoro che l'autore fa
**prima** di scrivere.

## Aggiunto — pannello "Impostazioni"

`editor/src/components/SetupPanel.tsx`, quattro domande in fila (era il tab "Personaggio", in sola lettura):

1. **La storia** — titolo, dove e quando siamo, che aria tira, chi è il protagonista, appunti
   (`story.setting`). Nulla di questo compare nel gioco: serve all'autore, all'editor e — più avanti — al
   ponte LLM.
2. **Chi sei** — i **personaggi pronti**: nome, descrizione, quale è il predefinito (uno solo, in un
   click), statistiche per caratteristica/abilità/indicatore, ed equipaggiamento iniziale scelto a
   pulsanti dagli oggetti della storia. Sotto l'equipaggiamento, **l'ingombro dal vivo**: *«3 di 5 tasche»*,
   in rosso con *«è sovraccarico»* se si sfora (la stessa cosa che il validatore segnala con W07).
3. **Cosa puoi portare** — l'ingombro si accende e si spegne con un pulsante; posti a mani nude, come si
   chiamano ("tasche"), e cosa fare quando non c'è spazio.
4. **Di che cosa sei fatto** — la scheda del personaggio, **ora modificabile**: caratteristiche, abilità
   (con "dipende da"), indicatori, valori iniziali/minimo/massimo, e la regola dei dadi in parole
   (*«si riesce quando il totale arriva almeno alla difficoltà»*).

Il vecchio `RulesetPanel` in sola lettura è stato rimosso. La vista Tecnica mostra gli stessi campi con i
nomi del formato (`setting.world`, `ruleset.presets`, `baseCapacity`, `overflow`…).

## Analisi di FAVELLA 1

`docs/analisi-favella.md`: cosa prendere e cosa no dal progetto gemello (motore per avventure testuali in
italiano naturale, 312 test). In sintesi — da prendere: **proprietà come aggettivi con registro di coppie
opposte** (`aperto↔chiuso`, estendibile dall'autore), **sentinelle a due modalità** (*ogni volta che* vs
*quando diventa vera*) con una sola valutazione ordinata per passo, **salvataggio come elenco di scelte**
invece che come stato, **diff per turno** nel debugger, **analisi statica di vincibilità**, due controlli
di linter che ci mancano. Da non prendere: il parser italiano, e soprattutto **l'assenza di archetipi per
gli oggetti** — che loro dichiarano come limite noto e hanno scelto di non risolvere per non complicare la
grammatica. Noi quel vincolo non ce l'abbiamo.

Conferma utile: il loro `capacita_base` + `bonus_capacita` è identico al nostro `baseCapacity` +
`capacityBonus` della 0.4. Due strade diverse, stesso modello.

## Roadmap riordinata

Dal confronto: il **playtest** sale al punto 6 (era 8) e porta con sé diff per turno e salvataggio come
elenco di scelte; il pannello **Oggetti** guadagna gli **archetipi** (`extends`) e un **catalogo di
modelli** fornito con l'editor e *copiato* nella storia — il motore non conosce alcun oggetto predefinito,
o smetterebbe di essere configurabile. Nuove voci in coda: **sentinelle** e **analisi di vincibilità**.

## Verificato dal vivo

Su `atrio-villa`: le quattro sezioni si aprono e si modificano; *L'investigatore consumato* mostra
★ predefinito e *«1 di 5 tasche»*, che diventa *«3 di 5 tasche»* cliccando la lampada; la scheda mostra
Caratteristiche/Abilità/Indicatori modificabili con "dipende da". Su una storia vuota, *Crea personaggio*
produce un personaggio già marcato come predefinito e avverte che non ci sono ancora oggetti.

## Prossimo

Pannello **Oggetti**: database della singola storia modificabile mentre si scrive, con archetipi, stato
degli oggetti a coppie opposte e catalogo di modelli di partenza.
