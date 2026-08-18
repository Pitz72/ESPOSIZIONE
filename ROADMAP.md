# ROADMAP — da specifica chiusa a motore misurato

**Stabilita il 19 agosto 2026.** Sei fasi, ciascuna con criteri di uscita dichiarati qui, adesso, prima di cominciare — perché la roadmap di questo progetto è soggetta alla stessa regola che governa la specifica: *un criterio dichiarato dopo aver visto il risultato non ha validato niente* (§30.1). Se un criterio di uscita si rivelerà sbagliato, non si cancella: si scrive accanto quello riformulato e si spiega perché.

## La premessa, che è una correzione

La domanda naturale — *non dobbiamo scrivere i capitoli mancanti?* — ha una risposta precisa: **non ci sono capitoli mancanti**. Le Parti I–VII sono chiuse, l'Appendice A pubblica il modello del freno, i profili assenti sono stati scritti nella 1.2 (§21.4). Ciò che manca alla specifica non è testo: è la **misura che il §30.4 dichiara di non avere**. I capitoli che restano da scrivere — l'addendum che chiude il debito, l'eventuale 1.4 — possono nascere soltanto *dopo* i dati, perché scriverli prima è esattamente ciò che il metodo vieta. Questa roadmap esiste per produrre quei dati nell'ordine giusto.

## Le regole di marcia

1. **Nessuna fase comincia prima che i criteri di uscita della precedente siano verbalizzati** — soddisfatti o falliti, ma a verbale.
2. **Ogni blocco di lavoro chiude con commit, push e verifica di sincronia** fra locale e `origin/main`. Sempre.
3. **I criteri falliti non si cancellano.** Si aggiunge accanto la riformulazione, datata.
4. La specifica non si tocca fino alla Fase 4. Fino ad allora ogni scoperta va a verbale, non nel testo normativo.

---

## Fase 0 — La licenza *(chiusa il 19 agosto 2026)*

I testi sono passati da «tutti i diritti riservati» a CC BY-SA 4.0; marchio, logotipi e font restano esclusi. Commit `27d9805`, sincronizzato.

## Fase 1 — La firma diventa dati *(settimana del 19–25 agosto)*

La specifica dice che adattare il motore sono *otto scelte di profilo e sedici voci*: finché quelle voci vivono solo in prosa, nessuno può farle girare contro niente. Si costruisce:

- `schema/firma.schema.json` — le otto scelte e le sedici voci in formato leggibile dalla macchina, coi vincoli del §26;
- `istanze/` — le tre istanziazioni della Parte VI trascritte come dati;
- `strumenti/valida.py` — i controlli del §28 eseguibili (Python, sola libreria standard, nessuna dipendenza).

**Uscita:** il validatore accetta le tre istanze della Parte VI e rifiuta ciascuna di una lista dichiarata di istanze malformate (una per ogni controllo del §28). Ogni ambiguità della prosa scoperta trascrivendo va a verbale in `VERBALE-fase1.md` — è il primo prodotto di valore della fase, non un effetto collaterale.

## Fase 2 — Il banco di prova *(settimana del 26 agosto – 1 settembre)*

- `strumenti/freno.py` — il modello dell'Appendice A eseguibile: data una firma, calcola la regione di stabilità;
- `strumenti/banco.py` — i giocatori automatici: più politiche in concorrenza, seme fisso, log completo, verifica automatica delle invarianti del §29 su ogni run.

**Uscita:** (a) il modello riproduce esattamente i numeri dell'esempio A.5; (b) due esecuzioni con lo stesso seme producono log identici byte per byte; (c) le politiche si confrontano sulla dominanza, come impone I10.

## Fase 3 — La seconda finzione *(2–15 settembre)* — chiude il debito del §30.4

La fase più importante, in due tempi che non si scambiano:

**Prima settimana — i criteri, prima.** Si sceglie una finzione lontana dalla prima applicazione e dalle tre della Parte VI, si compila la sua firma con gli strumenti della Fase 1, e si scrive `CRITERI-seconda-finzione.md`: che cosa deve accadere nei run perché le due correzioni al nucleo della 1.2 (N9.a riscritta, N12) risultino confermate, con soglie numeriche dichiarate. **Questo file si committa prima di qualunque esecuzione**, e il commit fa fede.

**Seconda settimana — i run, e il verbale.** Si fa girare il banco, più giocatori automatici in concorrenza, seme fisso. L'esito va in `VERBALE-seconda-finzione.md`, criteri falliti compresi.

**Uscita:** il verbale esiste e risponde. *Entrambi* gli esiti chiudono la fase: se le correzioni reggono, il debito si chiude; se non reggono, si apre la riapertura dichiarata del nucleo — che è un successo del metodo, non un fallimento della roadmap. L'unico fallimento possibile è non aver fatto girare niente.

## Fase 4 — Il testo si aggiorna *(settimana del 16–22 settembre)*

Solo ora si scrivono i capitoli, perché solo ora esistono i dati che li autorizzano:

- l'**addendum al §30.4**, datato, con l'esito del debito;
- se la Fase 3 ha riaperto regole: il changelog della **1.4**, con le deviazioni numerate nello stile del §37;
- la seconda finzione entra come **test di regressione dell'agnosticismo**, come il §38 impone a tutti;
- ricostruzione dei tre PDF con la catena Typst, aggiornamento della sezione *Stato* del README.

**Uscita:** PDF ricostruiti, repository sincronizzato, il §30.4 non è più al presente.

## Fase 5 — La porta per gli altri *(stessa settimana)*

La licenza invita a contribuire; la specifica prescrive che *un profilo nuovo si aggiunge alla specifica, non si inventa per un progetto*. Le due cose insieme esigono un protocollo:

- `CONTRIBUTING.md` — come si propone un profilo o una modifica: criteri dichiarati prima, seme fisso, dataset consegnato, verbale; cioè lo standard che il progetto già applica a sé stesso, trascritto in procedura;
- collegamento dal README.

**Uscita:** un estraneo può capire, leggendo un solo file, che cosa serve perché una proposta venga considerata.

## Fase 6 — La prima ambientazione vera *(dal 23 settembre)*

Un repository esterno, un progetto reale, le sedici voci compilate per una finzione destinata a giocatori veri e non alla prova. È la verifica che la separazione motore/ambientazione regge fuori dalla teoria, e diventa la terza finzione di regressione.

**Uscita:** il repository esterno esiste, valida con gli strumenti della Fase 1, e attribuisce come la licenza richiede.

---

## Che cosa questa roadmap non promette

Non promette la 1.4: la promette *solo se la Fase 3 la impone*. Non promette un'implementazione di riferimento completa: gli strumenti delle Fasi 1–2 sono un banco di prova, non un runtime. E non fissa le date come vincoli ma come andature: se una fase sfora, sfora dichiarandolo, non comprimendo la successiva.
