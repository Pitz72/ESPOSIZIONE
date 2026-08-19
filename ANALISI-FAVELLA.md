# Analisi di FAVELLA 1 — che cosa insegna a ESPOSIZIONE 1.3 e a ESPOSIZIONE Studio

**Data: 19 agosto 2026.** Fonte: `C:\Users\Utente\Documents\GitHub\FAVELLA1`, motore 1.0.1, linguaggio 1.0.0 dichiarato chiuso.

Esiste già un'analisi di FAVELLA in questo repository: [`strumento/docs/analisi-favella.md`](strumento/docs/analisi-favella.md), del 20 luglio 2026. È stata scritta quando lo strumento si chiamava ancora InteractiveWriter, viveva in un'altra sede e non conosceva la specifica; guarda quindi a un solo lato — il modello del mondo — e i suoi nove punti sono in gran parte già assorbiti nella roadmap dello strumento (punti 5, 6, 9, 11) e nella tabella dei candidati della Fase S7. **Quel documento resta valido e non si cancella.** Questo lo affianca e copre ciò che allora non poteva essere visto:

1. **il lato della specifica**, mai analizzato — che cosa FAVELLA insegna al testo normativo, al suo metodo e al suo debito aperto;
2. **il lato del processo**, cioè come un progetto della stessa famiglia è arrivato a dichiararsi finito;
3. **le parti tecniche che l'analisi di luglio non aveva toccato**, prima fra tutte il trattamento della casualità sotto l'annullamento.

---

## Le due asimmetrie, da tenere in mente leggendo

**La prima è di natura.** FAVELLA è un *linguaggio*: la sua superficie d'autore è la grammatica italiana, e il 40% del progetto — 4.590 righe di `compilatore.py` — esiste per farla tornare. ESPOSIZIONE è un *sistema di risoluzione*: la sua superficie d'autore sono otto profili scelti e sedici voci compilate. Nessuna riga di parser si trasporta, e questo era già chiaro a luglio.

**La seconda è di stadio, ed è quella che conta.** FAVELLA è arrivata alla 1.0.0 e ha dichiarato il linguaggio chiuso: manuale in 21 capitoli con edizione cartacea, installer per tre sistemi operativi costruiti in CI, pacchetto `pip`, libreria standard, galleria di storie, kit di diffusione con i luoghi dove presentarsi. ESPOSIZIONE ha una specifica chiusa con un debito di misura aperto (§30.4) e uno strumento alla 0.5.1. **La cosa di maggior valore da prendere non è un meccanismo: è la forma del traguardo.** Le due roadmap di questo repository finiscono alla prima ambientazione vera (Fase 6) e al pacchetto di consegna (S6); nessuna delle due descrive che aspetto ha una versione pubblicata. FAVELLA quella forma ce l'ha, ed è documentata.

---
---

# PARTE I — Che cosa insegna alla specifica

## 1. Il metodo delle fette verticali, e la tabella attrito → primitiva

È il ritrovamento più importante di questa analisi.

FAVELLA non ha validato l'espressività del proprio linguaggio rileggendolo. Ha costruito **quattro «fette verticali» in generi deliberatamente non nativi** — guida, sopravvivenza, dating sim, gioco di ruolo — con l'obiettivo dichiarato di *portare il linguaggio al suo limite e vedere dove si piega*. Tutte e quattro sono vincibili e perdibili end-to-end. Ognuna ha un README con la propria **tabella attrito → primitiva mancante**, e un documento separato (`documentazione/espansione-oltre-0.29.md`) le unifica per tema.

La regola di metodo sta in una riga:

> *Un attrito incontrato scrivendo una storia è un dato; una primitiva mancante è un'ipotesi di lavoro.*

E la lettura d'insieme è quella che ci riguarda da vicino. Il genere che ha prodotto la lista più lunga — otto attriti, R1–R8 — è **il gioco di ruolo** (`esempi/demo/ruolo/README.md`): statistiche, mercante, combattimento a turni, crescita di livello. Il loro commento: *«è qui che FAVELLA scricchiola di più — ed è quindi qui che si vede meglio la più piccola aggiunta che la sbloccherebbe»*. Due attriti su otto — il danno che non scala con una statistica, il confronto fra due grandezze — erano **il limite strutturale numero uno del linguaggio**, ed erano comparsi in tutte e quattro le demo. Sono stati chiusi con un solo costrutto.

**Che cosa ne discende per noi, alla lettera.**

La Fase 3 di `ROADMAP.md` prevede **una** seconda finzione, e ha ragione: serve a chiudere il debito del §30.4, che è una domanda binaria su due correzioni del nucleo. Ma FAVELLA mostra che la stessa esecuzione può produrre un secondo prodotto a costo quasi nullo, e che quel prodotto è il più informativo dei due:

- **il verbale della seconda finzione includa una tabella attrito → voce**, riga per riga, di ogni punto in cui compilare le sedici voci ha richiesto una forzatura, un compromesso o una nota a margine. È esattamente il materiale che il §26.2 chiama *la diciassettesima voce*, raccolto nel solo momento in cui è onesto raccoglierlo: mentre si compila, non mentre si rilegge;
- **la Fase 1 lo anticipa già**, e va detto a suo merito: il criterio di uscita chiede che ogni ambiguità della prosa scoperta trascrivendo vada a verbale, ed è *«il primo prodotto di valore della fase, non un effetto collaterale»*. La tabella attrito → voce è la stessa idea portata dalla trascrizione alla compilazione;
- **il genere della seconda finzione non è indifferente.** L'esperienza di FAVELLA dice che il banco più severo è il genere più vicino al mestiere del motore, non il più lontano. Per noi la lontananza serve all'agnosticismo (§38) e va tenuta; ma se la Fase 3 producesse **due** firme invece di una — una lontana per l'agnosticismo, una vicinissima per lo stress — la seconda costerebbe poco e direbbe di più. È una proposta, non una prescrizione: la decisione va a verbale prima di cominciare, o non vale.

## 2. I due cassetti, e il registro dei rifiuti

FAVELLA classifica ogni proposta di espansione in due cassetti, dichiarati:

| Cassetto | Che cos'è | Verdetto tipico |
|---|---|---|
| **A** | fix a basso costo e alto valore: diagnostica, robustezza, messaggi. Il motore fa già la cosa giusta, o quasi | si fa |
| **B** | espressività da pesare: poteri nuovi del linguaggio | *da decidere, non da fare* |

E i principi non negoziabili chiudono il quadro: *«la semplicità è una feature. Ogni aggiunta paga un costo in superficie cognitiva per l'autore. Il cassetto B esiste apposta: alcune cose è giusto che FAVELLA non le faccia, per restare una lingua che si legge.»*

La conseguenza pratica è che **i rifiuti sono pubblicati**, con la loro data e la loro ragione, nel README e nel documento di progettazione: il Tema 1c (stati ordinati) scartato perché *«le N regole esplicite sono più leggibili di un nuovo concetto di scala»*; il Tema 5a (quantità con plurali) NO-GO perché la versione ridotta non richiede codice e quella piena aprirebbe plurali e concordanza; il Tema 5b (template di entità) sconsigliato.

Noi abbiamo la regola — §26.2, *o è un sottosistema privilegiato e va rifiutata, oppure è una lacuna del motore* — e abbiamo il §36 che dichiara il perimetro. **Non abbiamo il registro**: un posto dove una proposta rifiutata resta scritta con la data e il motivo. Il §37 fa questo per le *deviazioni accolte*, numerate; manca il gemello per quelle respinte. La `CONTROANALISI-1.2.md` è il precedente esatto — un verbale con i rilievi respinti e le loro smentite — ma è legata a una revisione, non è un registro permanente.

> **Proposta, per la Fase 5.** `CONTRIBUTING.md` non descriva solo come si propone un profilo: descriva anche **dove finisce una proposta rifiutata**, e apra il file che la accoglie. La classificazione a due cassetti è già la nostra, con altri nomi — *profilo nuovo* contro *sottosistema privilegiato* — e trascriverla in procedura costa un capoverso.

## 3. Il limite onesto che viaggia col dato, non col documento

`collaudo.py:50` definisce una costante di testo:

```python
LIMITE_ONESTO = (
    "Analisi STATICA: fornisce condizioni necessarie ed euristiche, non una "
    "prova di vincibilità. ... Un avviso qui è un INDIZIO da verificare, non una sentenza."
)
```

Quella stringa **non sta nella documentazione: sta nel report**. È una chiave del dizionario restituito da `analizza_vincibilita()` e una sezione della resa testuale, stampata in fondo a ogni collaudo. Chi legge un risultato legge, nello stesso schermo, che cosa quel risultato non dimostra.

Questa specifica ha lo stesso istinto e lo esercita in prosa: il §30.4 dichiara il debito, l'A.6 dichiara che cosa l'appendice non dimostra, il §12.1 avverte che le quattro configurazioni non condividono la base, il §12.3 avverte che *si trasporta l'ordine, non le grandezze*. Sono avvertenze eccellenti, ed è precisamente per la loro assenza che la 1.2 è stata corretta. Ma sono avvertenze **staccabili**: vivono nel documento, e un numero citato fuori dal documento le perde. È già successo una volta, ed è ciò che il §12.1 rimprovera alla 1.2.

> **Proposta, per le Fasi 2 e S2.** Il banco produce misure. Ogni misura che esce dal banco porti con sé, **come campo del dato e non come frase del documento**, la finzione che l'ha prodotta, il seme, la configurazione e il proprio limite. Una percentuale senza quei quattro campi non è pubblicabile. È il §30.1 reso meccanico: un numero staccato dalla propria provenienza è la forma in cui quella violazione si propaga senza che nessuno la commetta di proposito.

## 4. Il robot accantonato: un avvertimento che riguarda il banco

`documentazione/progettazione-collaudo.md` porta in testa un blocco di stato che vale più del documento che introduce. Il collaudatore era progettato su due livelli. Il **Livello 1**, analisi statica, è stato realizzato. Il **Livello 2** — un giocatore automatico che esplora in ampiezza lo spazio degli stati per rispondere *vincibile sì o no* — è stato **tentato e accantonato** il giorno dopo, con la motivazione scritta:

> è automated planning illimitato e fragile (un'euristica buona per una storia ne regredisce un'altra) con rischio di **falsi «non vincibile»**.

Le sezioni che lo progettavano restano nel documento, marcate come cronaca, con l'istruzione di non implementarle. È la stessa disciplina del nostro §30.1 applicata a una decisione tecnica: *i criteri falliti non si cancellano*.

**Perché ci riguarda.** Le Fasi 2 e S2 costruiscono un banco di giocatori automatici, e la tentazione di farne un giudice è strutturale: abbiamo sedici vincoli, dieci invarianti e un'ambientazione da dichiarare valida o no. La differenza fra il loro robot e il nostro banco è tutta nella domanda che gli si pone:

| | Domanda | Natura della risposta |
|---|---|---|
| Il loro Livello 2 | *questa storia è vincibile?* | esistenziale — un fallimento della ricerca si traveste da fallimento della storia |
| Il nostro banco | *fra le politiche dichiarate, ne esiste una che domina tutte le altre?* (I10) | comparativa — misura ciò che ha fatto girare, e nient'altro |

La nostra domanda è per costruzione al riparo dal falso negativo, **finché resta comparativa**. Il rischio è che una delle invarianti la faccia scivolare: I2 (*non esiste uno scambio senza via d'uscita disponibile*) e V1 (*ogni ostacolo ha almeno una via senza prerequisiti*) sono affermazioni universali, e verificarle simulando significa non trovare un controesempio — che non è la stessa cosa che dimostrarle.

> **Proposta.** Il banco distingua nel proprio referto, meccanicamente, **ciò che ha osservato** da **ciò che non ha osservato**: «nessuna violazione di I2 in diecimila run col seme S» non si stampi mai nella forma «I2 vale». La distinzione della Parte V — vincolo che si conta, invariante che si simula, bersaglio che si tara — vive già nella specifica; qui va portata nel formato del referto.

## 5. La chiusura dichiarata, e il numero di versione

Alla 1.0.0 FAVELLA scrive: *«il linguaggio è dichiarato completo e chiuso»*, e aggiunge la frase che riorienta tutto il progetto:

> Da qui in avanti l'evoluzione del progetto è di **ecosistema** (distribuzione, libreria di moduli, galleria di storie, pacchetto installabile), **non più di linguaggio**.

Poi fa una seconda cosa, di igiene: dalla 0.18.0 adotta la **linea unica di versione**. Motore, compilatore e specifica della grammatica avanzano insieme, con una sola sorgente di verità (`strutture.VERSIONE_MOTORE`), e il README pubblica la tabella dei componenti con la loro versione. La 1.0.1 è dichiarata patch di sola distribuzione, con la nota esplicita che **la specifica del linguaggio resta la 1.0.0**.

Noi abbiamo due linee — specifica 1.3, strumento 0.5.1 — e non possono unificarsi: una è normativa, l'altro è un'implementazione, e la roadmap prevede espressamente che la specifica resti ferma mentre lo strumento avanza (o che si muova, se la Fase 3 imponesse la 1.4). Ma **il legame fra le due va reso esplicito e verificabile**, e oggi non lo è:

> **Proposta, per la Fase S1.** Lo schema della firma dichiari il campo `specifica` — la versione della specifica che quella firma implementa — obbligatorio e vincolato a un enum. Il validatore rifiuti una firma che dichiara una versione che non conosce. Costa tre righe di schema e chiude in anticipo la classe di derive più prevedibile di tutte: firme compilate contro la 1.3 fatte girare da uno strumento che nel frattempo ha assorbito la 1.4.

La stessa disciplina risolve anche un dettaglio già visibile: il README dello strumento dichiara `formatVersion 0.2` nella tabella della struttura, mentre `strumento/ROADMAP.md` dice 0.4. Non è un errore di sostanza — è la prova che senza una sorgente unica i numeri si allontanano da soli.

## 6. Il manuale che qui non c'è

FAVELLA ha un manuale d'autore: 21 capitoli, 84 pagine, seconda edizione, PDF gratuito nel repository e **edizione cartacea**. La catena è Typst, con un file per capitolo, una libreria di template (`lib/manuale-template.typ`) che tiene l'identità tipografica e, soprattutto, **cinque tipi di riquadro semantico**: `sintassi`, `tranello`, `prova`, `nota`, `esempio`. Una sola sorgente produce due tirature — l'ebook con copertina e il kit di stampa — con un interruttore (`--input kdp=1`).

Questo repository ha una catena Typst matura ma di natura diversa: `md2typ.py` converte i sorgenti Markdown e applica una politica tipografica dichiarata senza toccare i file. È la scelta giusta per la specifica, che deve restare un testo Markdown diffabile e leggibile dalla macchina. Ma i tre PDF esistenti sono **una norma e due presentazioni**. Non c'è un manuale, e nessuna delle due roadmap ne prevede uno.

Il momento in cui servirà è determinabile: la Fase S5 consegna un editor con cui un autore compila una firma senza aprire un file JSON, e la S6 consegna un pacchetto a sviluppatori terzi. **Un autore che non ha mai letto la specifica non può usare un editor governato dalle sedici voci senza un testo che gliele spieghi**, e la specifica non è quel testo: è normativa, si rivolge a chi implementa, e lo dichiara nella Nota di lettura. Il riquadro `tranello` è la forma esatta di ciò che a noi servirebbe di più — il pedaggio, la saturazione, il verbo a base massima che è una leva morta *per progetto*, la conoscenza falsa che non entra mai nella ricevuta.

> **Proposta.** Il manuale non è lavoro da roadmap adesso, e va detto: prima viene la misura. Ma vada messo **a registro come prodotto previsto della S5**, con la struttura già decisa — capitoli separati, riquadri semantici, sorgente Typst nativa e non convertita — perché è il genere di documento che, se non è previsto, viene scritto in fretta alla fine.

---
---

# PARTE II — Che cosa insegna allo strumento

## 7. La casualità dentro l'istantanea: l'annullamento riavvolge il dado

È il ritrovamento tecnico che l'analisi di luglio non aveva fatto, e quello con la conseguenza più diretta sul nostro nucleo.

Il mondo di FAVELLA possiede un generatore casuale con seme fisso (`strutture.py:830`), e ogni pesca d'autore — il numero fra 2 e 6, la scelta fra tre valori di stato, la condizione probabilistica *càpita (1 su 4)* — passa da lì. Le istantanee dell'annullamento sono una `deepcopy` dello stato mutabile, con una lista **dichiarata** di campi esclusi (`strutture.py:890`):

```python
_CAMPI_VOLATILI = ("_storia_stati", "ultimo_comando", "azioni",
                   "mappa_verbi_giocatore", "annunci", "_snap_dialogo")
```

`rng` **non è in quella lista**. Lo stato del generatore viene quindi catturato e ripristinato con tutto il resto, e l'annullamento riavvolge anche la casualità. Il codice lo ripete a ogni costrutto casuale, con la stessa formula: *riproducibile e ANNULLA-safe*.

**Perché ci riguarda, e in un punto preciso della specifica.** Lo strumento avrà un playtest incorporato (punto 6 della roadmap dello strumento) e quindi un annullamento. Dopo la S4 avrà anche un d20 e una Traccia. Se l'annullamento non riavvolge il generatore, annullare e riprovare **ritira il dado** — e non è un difetto di comodità: è una violazione della griglia. Il §5 promette che da Coperto il dado non può rovinarti; il §14 vieta il ritento a ricevuta identica proprio per impedire la ripetizione bruta. Un annullamento che ripesca è la ripetizione bruta resa gratuita e invisibile, sotto un pulsante.

> **Da fissare come regola di marcia in S4, prima di scrivere il playtest.** L'annullamento è un **riavvolgimento, mai una ripescata**: lo stato del generatore fa parte dell'istantanea. Il contrario — che ogni annullamento consumi flusso — è altrettanto sbagliato e va escluso dallo stesso test. Il test: annulla, ripeti la stessa scelta, e il tiro dev'essere identico.

La seconda metà del ritrovamento vale quanto la prima: **l'elenco dei campi esclusi è dichiarato, con la ragione accanto** — riferimenti statici immutabili dopo la compilazione, e stato di sessione. È esattamente il documento che manca al `RuntimeState` quando la S4 gli aggiungerà la Traccia, i contatori dei tentativi per verbo e la memoria della ricevuta per nodo: quali di quei campi sono stato del mondo e quali sono sessione è una domanda che, se non si risponde per iscritto, si risponde per caso.

## 8. La chiave di stato, e la correzione che la salva

Il documento di progettazione del collaudatore (§3.2) definisce `chiave_stato(mondo)`: una **serializzazione canonica leggera** dello stato rilevante per la logica — posizione, inventario, variabili, proprietà degli oggetti, fronti di salita già scattati, esito della partita. Con un elenco altrettanto esplicito di ciò che è **escluso**: il generatore, gli indici cosmetici delle descrizioni a varianti, il contatore dei turni grezzo, la cronologia.

E poi la correzione, che è la parte istruttiva: escludere il turno grezzo è necessario — altrimenti ogni stato è unico e la potatura non pota niente — **ma è sbagliato se la storia ha eventi a tempo**, perché due stati a turni diversi non sono equivalenti. La soluzione è una *firma temporale* compatta, inclusa nella chiave solo quando gli eventi esistono. È una definizione di equivalenza fra stati che ha già incontrato la propria eccezione e l'ha assorbita.

**Ci serve, e non per un esploratore.** Il vincolo V14 — *nessun ritento con ricevuta identica alla precedente* — è un confronto fra due stati sotto una relazione di equivalenza, ed è la stessa domanda. La specifica ne dichiara anche il costo (§14: *si conserva la ricevuta dell'ultimo tentativo per via, e la si confronta*). Il lavoro di progetto che resta è dire **che cosa entra nel confronto**, e la lezione di FAVELLA è che quell'elenco va scritto per esteso, con le esclusioni motivate, prima di implementarlo — e che l'errore che si commette è escludere qualcosa che in un profilo diverso conta. Per noi il candidato è già visibile: il contenitore. Con il profilo *stagione* o *incarico* (§19.2) il passaggio del tempo cambia la ricevuta; con un altro profilo potrebbe non cambiarla.

## 9. Un passaggio ordinato per turno — che è il posto dove vive lo smaltimento

L'analisi di luglio aveva registrato le sentinelle a due modalità (a livello e sul fronte di salita) e la regola di valutazione (`gioco.py:227`): *una sola valutazione per turno, in ordine di dichiarazione*, con la conseguenza scritta nel commento del codice — le cascate sono deterministiche e i cicli infiniti **impossibili per costruzione**, non per patch.

Quello che a luglio non si poteva vedere è che questa non è solo la macchina del pannello Oggetti. **È la macchina di N12.**

Il §27.1 impone che ogni stato che si accumula dichiari il proprio tasso di smaltimento, e che quel tasso non sia zero. La voce 14 della firma lo rende dato: *ogni quanti passi un accumulo cala di un gradino*. Il V15 chiede che ogni nodo che può ospitare un confronto sia raggiunto da una **pressione attiva** entro un numero dichiarato di frazioni — *un logorio che sale, una scadenza che scorre, o una Traccia che alza l'Esposizione*. Sono tutti e tre effetti per passo, che devono comporsi in un ordine e non devono né ripetersi né innescarsi a vicenda.

> **Conseguenza per la S4.** Il decadimento della Traccia, l'avanzamento del logorio e lo scorrere del contenitore non si scrivano come tre effetti sparsi nel ciclo, ma come **un passaggio unico e ordinato per frazione di passo**, con l'ordine dichiarato nel formato e non nel codice. È l'unico modo perché due esecuzioni con lo stesso seme producano log identici byte per byte — criterio di uscita (b) della S2 — quando gli accumulatori saranno più di uno.

## 10. Il canale del protocollo separato dalla stampa

FAVELLA ha un sidecar (`favella_server.py`) che parla NDJSON con l'editor, e la sua disciplina è dichiarata: *i `print()` del motore non toccano mai il canale di protocollo*. Ma l'ammissione che conta sta nell'analisi di luglio, ed è un difetto loro: nel resto del progetto il motore stampa direttamente, e il server è costretto a catturare lo stdout. **La loro eccezione indica la strada; la regola no.**

Il criterio di uscita della S2 chiede log identici byte per byte fra due esecuzioni con lo stesso seme. Quel criterio non regge se il flusso di log e il flusso destinato a una persona sono lo stesso flusso: basta una riga di progresso, un avviso, un carattere di terminale diverso.

E c'è un corollario piccolo e molto concreto, che FAVELLA ha pagato in un crash: l'attrito R8 della demo di ruolo è **un carattere fuori da Windows-1252 in un testo stampato che termina il gioco con un traceback** sulla console Windows. La logica era corretta; a cadere era solo la stampa. La correzione è di una riga (`errors="replace"`), e la resa testuale del collaudo porta ancora il vincolo scritto nell'intestazione della sezione: *cp1252-safe: niente frecce o box-drawing*.

La nostra ricevuta usa `⚠`, la specifica usa frecce e trattini lunghi ovunque, e la CLI gira su Windows. Non è un rischio ipotetico.

## 11. Una revisione UX fatta prima di toccare il codice

`studio/UX-EDITOR-REVISIONE.md` è una valutazione euristica completa dell'editor: inventario di ciò che ogni pannello fa oggi, poi i problemi ordinati per gravità, poi l'esecuzione. In testa, il vincolo di metodo:

> **nessuna riga di codice toccata finché la visione non è approvata.**

L'autore-tipo è dichiarato in una riga — *uno scrittore, non un programmatore* — e ogni scelta si misura su di lui. È lo stesso principio della nostra `docs/author-experience.md`, applicato a un editor già costruito.

I risultati sono quasi tutti riutilizzabili **in anticipo**, perché la S5 costruirà le stesse tre famiglie di pannelli (definire il mondo, ispezionare il nodo, osservare la partita):

| Rilievo di FAVELLA Studio | Come si presenterà da noi |
|---|---|
| il menu delle conseguenze ha dieci voci piatte in un solo elenco, che mescolano l'80% dei casi quotidiani con primitive rare | le sedici voci della firma non sono equivalenti per frequenza: il lessico e le due tabelle si toccano ogni giorno, il banco delle complicazioni una volta per ambientazione |
| due schede quasi omografe — *Stato* (ispettore della partita) e *Stati* (editor del mondo) | *Esposizione* come valore corrente e *Esposizione* come lettura dichiarata (voce 1) sono la stessa parola per due cose; il §6 avverte già che è astratta di proposito |
| tre dialetti per gli stessi tre concetti (innesco, condizione, effetto) fra pannelli gemelli | aggravanti e attenuanti compaiono nella firma, nella prova del nodo e nella ricevuta: tre superfici, un solo vocabolario da tenere |
| ordine delle schede diverso fra due punti dell'interfaccia, senza raggruppamento *definisci* contro *osserva* | la mappa dei regimi del freno **osserva**, l'editor delle tabelle **definisce**: vanno separati, o si scambiano |

> **Proposta, per la S5.** La revisione euristica si scriva **prima** dell'editor, non dopo, e riusi questa lista come lista di partenza. Il costo è un documento; il risparmio è che quei quattro rilievi non si commettono.

## 12. Gli archetipi che mancheranno agli avversari

L'attrito R5 della demo di ruolo: *«Nessun modello di mostro/personaggio. Ogni nemico = un blocco di contatori e regole ricopiato. Dieci goblin = dieci copie.»* FAVELLA ha **scelto** di non risolverlo, per non complicare la grammatica italiana, e l'analisi di luglio aveva già registrato che quel vincolo non è nostro: un formato JSON può avere `extends` senza costo di grammatica, e la roadmap dello strumento lo prevede per gli oggetti (punto 5).

Va esteso, perché il §23.6 descrive **la firma di un avversario** — quattro voci più la natura — che è alla lettera un archetipo, e il V6 impone che tutte e quattro siano riempite, movente compreso. La voce 11 della firma chiede *gli avversari*, al plurale. La fixture dell'intrigo di corte ne ha uno solo, e per questo il problema non si vedrà nella S1: si vedrà nella Fase 6, con un'ambientazione vera, esattamente dove FAVELLA lo ha visto.

> **Conseguenza per la S1.** Lo schema della firma modelli gli avversari come **archetipo più istanze** dal primo giorno, anche se la prima istanza è una sola. Aggiungere `extends` a uno schema con `additionalProperties: false` dopo che tre istanze sono già scritte costa una migrazione; aggiungerlo adesso costa una chiave.

## 13. La libreria e la galleria: dare un manifesto alle istanze

FAVELLA distribuisce due cose che noi non abbiamo pensato come cose:

- **una libreria standard** (`favella1/libreria/`): moduli riusabili — sinonimi, coppie di proprietà opposte, verbi d'azione pronti — inclusi con una direttiva, con l'avvertenza che includere tutto è sicuro perché ciò che non si usa non produce avvisi;
- **una galleria** (`favella1/galleria/galleria.json`): tre storie brevi complete e vincibili, con un manifesto che per ciascuna dichiara genere, difficoltà, durata **e che cosa dimostra** (`"mostra": ["dialogo a nodi", "opzione di dialogo condizionale", "proprietà opposte custom", …]`).

Quel campo `mostra` è la parte da prendere. È una **matrice di copertura resa leggibile**: dice quale esempio esercita quale costrutto, e quindi anche quale costrutto non è esercitato da nessuno.

Il nostro `istanze/` della Fase S1 avrà tre istanze e una lista dichiarata di istanze malformate — una per ogni controllo statico. Il criterio di uscita è già il migliore possibile. Quello che manca è il manifesto:

> **Proposta, per la S1.** `istanze/manifesto.json` dichiari, per ciascuna istanza, quali degli otto profili esercita e quali dei sedici vincoli copre; e per ciascuna malformata, quale controllo deve far scattare. Il file diventa poi verificabile da un test: **nessun controllo di V1–V16 resti senza almeno un'istanza che lo fa scattare.** Trasforma il criterio di uscita da «esiste una lista» a «la lista è completa», che è una proprietà diversa e più forte.

Sulla libreria standard la trasposizione è meno ovvia, e va detta con cautela. Un catalogo di verbi pronti sarebbe un lessico predefinito, e il §20 vincola il lessico a essere il vocabolario di *una* finzione: distribuirne uno generico contraddirebbe l'agnosticismo che il motore difende. Ma **le tre istanze della Parte VI sono già la libreria**, se le si guarda come materiale da copiare e modificare invece che come prove di agnosticismo. È il modello dei cataloghi che la roadmap dello strumento ha già scelto per gli oggetti: *forniti con l'editor e copiati dentro la storia, mai conosciuti dal motore*. La stessa formula regge per le firme, ed è l'unica che regge.

## 14. Il file unico, e la firma che va staccata dalla storia

Le storie di FAVELLA si compongono con una direttiva `Includi`, e la demo ufficiale è divisa in sei file: stanze, oggetti, regole, dialoghi, echi, traduzioni. È un preprocessore testuale, e noi non ne vogliamo uno.

Ma il problema che risolve arriverà anche da noi, da un'altra porta. La firma **è per ambientazione**, non per storia — lo dice il §26, lo assume la Fase 6 (*un repository esterno, un progetto reale*) e lo implica il §38, che chiede una finzione di regressione da far ripassare a ogni modifica futura al nucleo. Se la firma vive dentro il file della storia, due storie della stessa ambientazione hanno due copie della stessa firma, e la seconda diverge dalla prima appena qualcuno tocca una tabella.

> **Decisione da prendere nella S1, non nella S4.** La firma sia **un documento a sé**, con la propria identità e la propria versione, e la storia la **riferisca**. Lo schema della Fase S1 la sta già scrivendo come file autonomo (`istanze/`), quindi la decisione è di fatto già presa: va solo dichiarata, perché la tavola delle corrispondenze della S4 prevede `Story.firma` *dentro* la storia, in alternativa esclusiva a `ruleset`. Le due cose vanno riconciliate ora, che costa una riga di roadmap.

---
---

# PARTE III — Il traguardo: che aspetto ha «finito»

Nessuna delle due roadmap descrive una pubblicazione. FAVELLA la descrive, e vale la pena elencare che cosa comprende, perché è l'elenco che un giorno servirà.

| Cosa | Come l'ha fatto FAVELLA | Il nostro corrispettivo, e dove |
|---|---|---|
| **Installazione senza clonare il repository** | installer per Windows, macOS e Linux costruiti in CI, più pacchetto `pip` per chi ha Python | manca. L'editor è Tauri, quindi la strada esiste; nessuna fase la nomina |
| **Un solo eseguibile con sottocomandi** | `favella1 gioca / compila / collaudo / playground / esporta / libreria / galleria`, con alias inglesi | la CLI `iw` ha `validate` e `play`; la S2 aggiunge `banco`. Il rinomina è già in coda alla S0 |
| **Procedura di rilascio scritta** | `PACKAGING.md`: che cosa contiene la distribuzione, come si costruisce, come si taglia una release, come si allineano le versioni | manca del tutto |
| **Integrazione continua** | due workflow: rilascio su tag, build manuale dell'editor. La suite gira **prima** del congelamento del pacchetto, e blocca le regressioni | manca. I 60 test verdi girano a mano |
| **Un artefatto giocabile e condivisibile** | `favella1 esporta` produce **un solo file HTML autoportante** | è, alla lettera, la forma che dovrebbe prendere lo *shell dimostrativo minimo* della S6 |
| **Avvertenze oneste all'utente** | «gli eseguibili non sono firmati: al primo avvio accetta l'avviso di SmartScreen o Gatekeeper», con la procedura | da scrivere quando ci sarà un binario |
| **Kit di diffusione** | `branding/materiale/dove-presentare-favella.md`: i luoghi, le loro regole di autopromozione, i testi pronti, e la regola d'oro — *prima partecipi, poi presenti* | la Fase 5 apre la porta ai contributi ma non dice a chi si bussa |

Due osservazioni, e sono le sole che aggiungo a un elenco altrimenti autoevidente.

**L'esporta autoportante è il contratto della S6 reso eseguibile.** Il criterio di uscita della S6 chiede che uno shell scritto da mani terze — o da una sessione che veda *solo* il pacchetto e il contratto — renda correttamente l'intrigo di corte. Un singolo file che gira senza installare niente è la forma in cui quel criterio si può davvero mettere alla prova, perché toglie dal giudizio ogni variabile di ambiente: se non funziona, il difetto è del contratto.

**La CI che fa girare la suite prima di impacchettare è l'unica difesa contro la deriva che le nostre regole di marcia si sono date a mano.** Entrambe le roadmap ripetono che ogni blocco chiude con commit, push e verifica di sincronia. È una disciplina, e le discipline reggono finché regge chi le applica. Un workflow che rifiuta il tag se un test è rosso costa mezza giornata e non si stanca.

---
---

# PARTE IV — Che cosa non prendere

L'elenco di luglio resta valido — il parser di linguaggio naturale italiano, il mondo come singleton mutabile con `deepcopy` sul `__dict__`, l'editor come codice, l'assenza di archetipi come limite ereditato. Si aggiungono tre voci, e la prima è la più importante perché è anche la più seducente.

**1. La superficie d'autore come linguaggio, e il round-trip testo ↔ visuale.** *«L'italiano è il linguaggio di programmazione»* è l'idea che dà a FAVELLA la sua identità, ed è anche la ragione per cui il suo editor si è fermato. Favella Studio dichiara sé stesso *«un esperimento in fase primordiale, un cantiere fermo a metà»*, ed è stato pubblicato così com'è, sotto MIT, dopo essere nato come progetto separato e a pagamento. Il suo vincolo strutturale è scritto nella revisione UX: ogni editor deve **rileggere il sorgente e riscrivere frasi `.fav` canoniche**, applicate con splice dentro Monaco, mantenendo la stabilità byte per byte. Quel round-trip è il costo permanente di aver scelto il testo come fonte di verità.

Noi la fonte di verità ce l'abbiamo già in forma di dati, e la nostra `author-experience.md` ha già trovato il compromesso giusto senza chiamarlo così: `factLang` è un **riconoscitore in una direzione sola** — l'autore scrive *«ora ha la chiave»*, il sistema propone l'effetto tipizzato e il fatto, e da lì in avanti la verità è il dato. È quasi tutto il valore della prosa a una frazione del costo.

> **Regola da scrivere, prima che qualcuno la proponga in buona fede: riconoscimento sì, round-trip mai.** Nessuna superficie testuale di ESPOSIZIONE Studio dev'essere rileggibile come sorgente. Il giorno in cui lo diventasse, avremmo comprato un compilatore e una grammatica da mantenere, e il caso FAVELLA dice quanto costano: 4.590 righe e un IDE fermo a metà.

**2. L'architettura a sidecar.** Electron più React più Monaco davanti, motore Python dietro, JSON-RPC su NDJSON in mezzo, con timeout per metodo, riavvio con backoff e disciplina dello stdout. È una soluzione ottima **al problema di non voler riscrivere un motore che è in un altro linguaggio**. Noi quel problema non ce l'abbiamo: nucleo, validatore, CLI ed editor stanno tutti in TypeScript, ed è la ragione dichiarata della deviazione sulla Fase 1. Vale la pena registrarlo come un vantaggio da non dissipare.

**3. Il playtester dinamico** — già trattato al §4. Non è che «non funziona»: è che risponde a una domanda esistenziale con un metodo che non la può reggere.

---
---

# Conseguenze, in ordine di fase

Ogni riga è una proposta con una collocazione. Nessuna è una modifica al testo normativo: la specifica non si tocca fino alla Fase 4, e questo documento non fa eccezione.

> **Innestate il 19 agosto 2026.** Tutte e diciannove sono state distribuite nelle due roadmap, nella fase indicata qui sotto: il dettaglio operativo sta dentro le fasi, la mappa di provenienza nell'*Addendum sull'analisi del progetto vicino* di [`ROADMAP-STRUMENTO.md`](ROADMAP-STRUMENTO.md), e la registrazione sul lato sovrano nell'addendum omonimo di [`ROADMAP.md`](ROADMAP.md). Nessun criterio di uscita già dichiarato è stato modificato: dove ne è stato aggiunto uno, è scritto accanto al precedente e datato. Due proposte hanno prodotto una decisione invece di un lavoro — **D-S7**, dove vive la firma, che si chiude all'inizio di S1 — e tre hanno prodotto un rischio a registro (R7, R8, R9).

| # | Proposta | Dove | Costo |
|---|---|---|---|
| 1 | Campo `specifica` obbligatorio e vincolato nello schema della firma | S1 | tre righe di schema |
| 2 | Avversari modellati come **archetipo + istanze** dal primo schema | S1 | una chiave adesso, una migrazione dopo |
| 3 | `istanze/manifesto.json` con la copertura dichiarata, e il test che nessun controllo V1–V16 resti senza istanza | S1 | mezza giornata; rende il criterio di uscita completo invece che esistenziale |
| 4 | La firma è un documento a sé; la storia la riferisce. Riconciliare con la tavola delle corrispondenze della S4 | S1 | una riga di roadmap ora, una migrazione poi |
| 5 | Ogni misura del banco porta con sé finzione, seme, configurazione e limite **come campi del dato** | S2 | piccolo; è la difesa meccanica del §30.1 |
| 6 | Il referto del banco distingue *osservato* da *non osservato*; nessuna invariante si stampa come «vale» | S2 | piccolo |
| 7 | Il flusso di log del banco è separato dal flusso destinato a una persona, ed è cp1252-safe | S2 | piccolo; senza, il criterio «byte per byte» non regge |
| 8 | Il verbale della seconda finzione include la **tabella attrito → voce**, compilata durante, non dopo | S3 | nullo se deciso prima; impossibile se deciso dopo |
| 9 | Valutare una **seconda firma vicinissima al mestiere del motore** accanto a quella lontana, e verbalizzare la decisione prima di eseguire | S3 | una firma in più; l'esperienza altrui dice che è la più informativa |
| 10 | L'annullamento è riavvolgimento, mai ripescata: lo stato del generatore sta nell'istantanea, con un test dedicato | S4 | piccolo, se fatto subito |
| 11 | L'elenco dei campi di `RuntimeState` esclusi dall'istantanea è **dichiarato con la ragione accanto** | S4 | una costante e un commento |
| 12 | Traccia, logorio e contenitore avanzano in **un passaggio unico e ordinato per frazione**, con l'ordine nel formato | S4 | una scelta di architettura, non un lavoro in più — se fatta prima |
| 13 | Elenco esplicito di che cosa entra nel confronto delle ricevute per V14, esclusioni motivate comprese | S4 | un capoverso di progetto |
| 14 | Revisione euristica dell'interfaccia scritta **prima** dell'editor, con i quattro rilievi di FAVELLA Studio come lista di partenza | S5 | un documento |
| 15 | Il **manuale d'autore** entra a registro come prodotto previsto, con struttura decisa: capitoli separati, riquadri semantici, Typst nativo | S5 | zero adesso; molto, se ci si arriva senza averlo previsto |
| 16 | Lo shell dimostrativo prende la forma di **un solo file autoportante** | S6 | è la forma che rende verificabile il criterio di uscita |
| 17 | `PACKAGING.md` e un workflow di CI che fa girare la suite prima di impacchettare | S6 | mezza giornata; è l'unica difesa che non si stanca |
| 18 | `CONTRIBUTING.md` dichiara anche **dove finisce una proposta rifiutata**, e apre il registro che la accoglie | Fase 5 | un capoverso |
| 19 | Il kit di diffusione — dove si bussa, con quali regole — come documento, non come improvvisazione | Fase 5/6 | il loro esiste ed è in gran parte riusabile: stessi pubblici, progetto diverso |

---

## Limite onesto di questo documento

Questa è **una lettura, non una misura.** Ha letto il codice di FAVELLA e i suoi documenti; non ha fatto girare niente, non ha compilato una storia, non ha verificato che le 681 asserzioni siano verdi oggi né che i numeri dichiarati nei suoi README corrispondano allo stato del repository. Le righe di codice citate sono state verificate una per una alla data di oggi; tutto il resto è riportato dalle fonti del progetto, comprese le sue autovalutazioni — che sono ben scritte, e per questo tanto più facili da prendere per buone.

E vale la regola che governa tutto il resto: **niente di quanto è scritto qui ha validato qualcosa.** Le diciannove proposte della tabella sono ipotesi di lavoro, e ciascuna diventa un fatto solo quando qualcuno ne dichiara il criterio prima di eseguirla.
