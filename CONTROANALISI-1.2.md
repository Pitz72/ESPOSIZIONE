# Contro-analisi delle due letture esterne della 1.2

> **Metodo.** Ogni rilievo delle due analisi è stato verificato contro il testo, non contro il ricordo del testo. L'esito è **confermato**, **parziale** o **smentito**, e accanto sta la riga che lo decide. I rilievi smentiti restano a verbale con la loro smentita, come prescrive il §30. Nessun rilievo è stato respinto perché scomodo, e nessuno è stato accolto perché lusinghiero.
>
> Documento di lavoro, agosto 2026. Non è un addendum alla specifica: è il verbale che decide che cosa lo diventerà.

---

## 0. Giudizio sulle due analisi, prima dei loro contenuti

Le due letture non valgono lo stesso, e la differenza va detta perché cambia quanto peso dare a ciascuna.

**L'analisi 2 è nettamente la più utile.** Fa nove rilievi, e sette sono falsificabili: dicono *questa riga dice X, e X non regge, ecco perché*. Tre di questi colpiscono buchi che la specifica non ammette da nessuna parte — la definizione di «cambiato», la pressione mai validata, il controfattuale di D14 — e quei tre valgono da soli l'intera lettura. È anche l'unica delle due ad aver letto il concept oltre alla specifica, e infatti è l'unica che trova gli errori di conteggio.

**L'analisi 1 è accurata ma in larga parte parafrasi.** Su trentasei sezioni, sei contengono qualcosa che la specifica non dice già di sé:

| Sezione | Contributo reale |
|---|---|
| §18 | testare le **strategie dominanti**, non solo la convergenza |
| §23 | la **conoscenza falsa** come asse sottosviluppato |
| §25 | un test operativo contro i verbi duplicati *(sbagliato come formulato — §5.3)* |
| §28 | la tassonomia invariante / vincolo / bersaglio |
| §31–33 | il protocollo di playtest umano, e **due domande** che valgono più di molti test |
| §34 | due frasi di posizionamento migliori di quelle in uso |

Le altre trenta sezioni ripetono con approvazione cose che la specifica dichiara già di sé, spesso alla lettera: che l'Esposizione fa due mestieri (§27.2 lo scrive con queste parole), che la Traccia senza smaltimento è una bomba a miccia lunga (è la ragione dichiarata di N12), che le 208 caselle sono il prezzo vero (§10.4), che le tre istanziazioni sono state riempite e non giocate (§31). Sono conferme, non rilievi. Fanno piacere e non spostano niente.

**Un avvertimento sulla tabella dei voti dell'analisi 1.** Dodici valutazioni numeriche su scala decimale, assegnate dopo aver letto il documento, senza criterio dichiarato prima. È esattamente ciò che il §30 di questa specifica classifica come cerimonia: *un criterio dichiarato dopo aver visto il risultato non ha validato niente.* Quel «8,8/10» va trattato come una cortesia, non come una misura, e non deve comparire in nessun materiale del progetto.

**Il rischio opposto, e riguarda noi.** L'analisi 1 è gradevole da leggere perché ci dà ragione con eleganza. È precisamente il tipo di documento contro cui bisogna difendersi: conferma senza costo. L'analisi 2 costa, e per questo vale.

---

## 1. Tavola sinottica

| # | Rilievo | Fonte | Esito | Costo | Entra in 1.3 |
|---|---|---|---|---|---|
| **C1** | «Cambiato» non è definito, e regge il ritento | A2.3 | **confermato** | una definizione | **sì** |
| **C2** | Nessun validatore verifica che la pressione esista | A2.4 | **confermato** | un validatore | **sì** |
| **C3** | L'esperienza non è mai stata misurata | A2.2 | **confermato** | un metodo | **sì** |
| **C4** | Nessun criterio sulle strategie dominanti | A1.18 | **confermato** | un'invariante | **sì** |
| **C5** | Il confronto non dichiara la sua via povera | *nuovo* | **confermato** | una riga | **sì** |
| **C6** | §2.1 promette una divergenza che §13 nega | A2.7 | **confermato** | due righe | **sì** |
| **C7** | «Costo di scrittura nullo» senza «per nodo» | A2.1 | **parziale** | tre parole ×3 | **sì** |
| **C8** | D14 non dice rispetto a *cosa* è il controfattuale | A2.6 | **confermato** | una frase | **sì** |
| **C9** | La conoscenza falsa non ha recinto | A1.23 | **confermato** | un recinto | **sì** |
| **C10** | Il numero degli avversari non differenzia | A2.5 | **confermato**, cura da correggere | una riga | **sì** |
| **C11** | «Non genera testo a runtime» contro H1 | A2.8 | **confermato** *(dizione)* | una subordinata | **sì** |
| **C12** | Conteggi e numerazione | A2.9a-b | **confermato** | correzioni | **sì** |
| **C13** | «Mezza giornata» | A2.9c | **confermato** | una frase | **sì** |
| **C14** | I numeri di §12.1 non sono ricostruibili | *nuovo* | **confermato** | un chiarimento | **sì** |
| **C15** | I7 è circolare, e N9.a è derivabile a priori | *nuovo* | **confermato** | una riscrittura | **sì** |
| **C16** | Il nucleo è stato corretto su una sola finzione | *nuovo* | **confermato** | una dichiarazione | **sì** |
| **C17** | §16 rimanda a §23 invece che a §25 | *nuovo* | **confermato** | un carattere | **sì** |
| **C18** | Il freno è dato senza il processo che lo genera | A2.9d | **confermato** | **un'appendice** | **da decidere** |
| **C19** | La ricevuta deve nominare cause, non numeri | A1.15/20, A2.9e | **parziale** | promozione a regola | sì |
| **C20** | Budget di ripetizione dichiarato per i banchi | A2.1/3 | **confermato** | legare V12 a un numero | sì |
| **C21** | Tassonomia invariante / vincolo / bersaglio | A1.28 | **parziale** — esiste, non è dichiarata | un capoverso | sì |
| **C22** | Test contro i verbi duplicati | A1.25 | **smentito nella forma** | forma corretta | ridotto |
| **C23** | Servono due livelli di documento | A1.27 | **smentito** — esistono già | — | no |
| **C24** | «Universale» è una parola pericolosa | A1.29 | **largamente già risposto** | — | facoltativo |

---

## 2. I tre rilievi che valgono l'intera lettura esterna

### 2.1 C1 — «Solo se qualcosa è cambiato» non è definito, e sostiene due cose opposte

La regola sta al §14, in una casella di tabella:

> **Aperta** | ritentabile, ma **solo se qualcosa è cambiato**. Mai per ripetizione bruta

La parola «cambiato» compare lì una volta sola in tutto il documento e non è definita da nessuna parte. Su quella parola poggiano due promesse opposte.

**Da un lato**, il fallimento pulito produce sempre Conoscenza — la griglia del §5 lo scrive: *non passi di qui, ma hai imparato qualcosa.* Se la Conoscenza conta come cambiamento, allora ogni fallimento da Coperto autorizza il ritento, il ritento è a rischio zero per N2 (*da Coperto il dado non può rovinarti*), e la mossa ottimale diventa: fallire da coperto finché non si passa. È farming, e il §15 non lo ferma, perché entrambi gli esiti *producono* una scena.

**Dall'altro**, se la Conoscenza non conta, allora N8 racconta una storia che non può accadere: *«chi è Inesperto ci prova quattro volte, e per quattro volte la situazione ha modo di girargli contro»*. Quattro tentativi sullo stesso ostacolo sono ripetizione bruta per definizione, e la regola li vieta. **Ma N8 è il modo in cui la competenza esiste in questo motore.** Senza quei quattro tentativi, la tesi «la competenza riduce quanti tentativi servono» non ha un referente.

Una parola non definita sostiene contemporaneamente l'anti-farming e l'intera economia della competenza. È il buco più serio segnalato dalle due analisi, e l'analisi 2 lo ha visto per prima.

**La soluzione è già nel motore, e non richiede una meccanica nuova.** Il motore possiede una superficie che dichiara lo stato completo di una decisione, riga per riga, prima che l'azione sia confermata: **la ricevuta**. Da cui la definizione:

> **È cambiato ciò che cambia la ricevuta.** Un ritento è ammesso se e solo se la ricevuta della nuova prova differisce dalla precedente in almeno una voce. Una ricevuta identica è ripetizione bruta, e si rifiuta.

Questa formulazione ha quattro proprietà che nessuna alternativa ha:

1. **È verificabile dalla macchina.** Diventa un validatore, non una raccomandazione: `V14 — nessun ritento è ammesso con ricevuta identica alla precedente`. La specifica converte così un principio in aritmetica, che è esattamente ciò che il §9 dice di fare col Fondo.
2. **Salva N8 senza eccezioni.** I quattro tentativi dell'Inesperto hanno ricevute diverse perché il contenitore glielo garantisce: ogni tentativo consuma una frazione di passo (§19.3), l'attesa costa (§19.1), la Traccia sale. Se davvero *niente* è cambiato — nessuna frazione consumata, nessuna Traccia, nessun momento nuovo — allora per il §15 non si sarebbe dovuto tirare nemmeno la prima volta.
3. **Chiude il farming senza vietare la Conoscenza.** La Conoscenza appresa fallendo non entra nella ricevuta della *stessa* via: entra come apertura di un'altra via, ed è alla lettera ciò che la griglia già promette (*si apre un'altra via*). Il fallimento pulito non autorizza a ribussare alla stessa porta: apre una porta diversa.
4. **Non aggiunge superficie.** Usa una cosa che il motore ha già e che il giocatore già legge.

**Conseguenza da dichiarare, e non è gratis:** l'implementazione deve conservare la ricevuta dell'ultimo tentativo per via, e confrontarla. È memoria per nodo, piccola ma reale, e va scritta come requisito.

### 2.2 C2 — La pressione è un assunto portante, e nessuno la controlla

Il §23.5 dichiara che contro chi si chiude lo stallo da Coperto è previsto, e che a romperlo è *quello che stava già scorrendo*: logorio, scadenze, Traccia, attraverso la frazione di passo.

Il ragionamento è corretto. **Il problema è che è un assunto sull'ambientazione, e la Parte V non lo controlla.** V13 verifica che ogni logorio abbia un rimedio; nessun controllo verifica che una pressione *esista e arrivi* dove serve. I2 chiede che ogni scambio abbia una via d'uscita disponibile, che è un'altra cosa. Un'ambientazione può soddisfare tutti e tredici i controlli e tutte e nove le invarianti, e contenere un confronto in una stanza dove non scade niente, dove il logorio non sale, dove la Traccia non conta. In quella stanza la strategia ottimale è non uscire mai da Coperto, e il motore non ha niente per accorgersene.

> **V15 — Ogni nodo che può ospitare un confronto è raggiunto da almeno una pressione attiva entro un numero dichiarato di frazioni.** Dove «pressione attiva» significa: un logorio che sale, una scadenza che scorre, o una Traccia che alza l'Esposizione di quel nodo.

Il numero è un parametro dell'ambientazione, come il freno e lo smaltimento, e va nella voce 14 accanto a loro. Costo: una riga di validatore, e la disciplina di compilarla.

### 2.3 C3 e C4 — Abbiamo misurato la stabilità e l'abbiamo chiamata funzionamento

L'analisi 2 lo dice nel modo giusto: *allo stato attuale non sapete se il motore funziona, sapete che è stabile.* Tutte le misure della 1.2 — 76,5/48,5/26,1%, la saturazione, il pedaggio, la bistabilità, il 4% degli avversari — vengono da giocatori automatici. Le tre istanziazioni della Parte VI sono state riempite e non giocate, e il documento lo dichiara.

Ma le promesse centrali sono esperienziali, e la specifica le enuncia come tali:

- la divergenza *percepita* (§2.1);
- la crescita sentita come tentativi risparmiati (§24.4, D14);
- la ricevuta che insegna il sistema usandolo (§2.2).

D14 individua il rischio con una precisione che nessuna delle due analisi migliora — *il giocatore concluderà che il gioco è casuale, avendo torto sui fatti e ragione sull'esperienza* — e poi il documento non lo misura, perché nessun bot può misurarlo.

**Qui le due analisi convergono, ed è l'unico punto in cui l'analisi 1 aggiunge qualcosa di sostanziale.** Le due domande del suo §32–33 sono la migliore operazionalizzazione disponibile, perché sono pre-registrabili e producono risposte classificabili:

> **Dopo ogni scena:** *«Perché pensavi che sarebbe successo quello che è successo?»*
> Vince chi risponde nominando la propria posizione. Perde chi risponde «non lo so, ho tirato».
>
> **A fine partita:** *«Qual è stata la decisione più importante?»*
> Vince una decisione. Perde un numero uscito sul dado.

E l'analisi 1 aggiunge il pezzo che manca al §30: la specifica prescrive **più giocatori automatici in concorrenza** senza dire *che cosa si guarda quando hanno finito*. La risposta è la dominanza.

> **I10 — Fra le politiche di gioco dichiarate, nessuna domina tutte le altre su tutte le metriche dichiarate insieme.** Se una politica è la migliore su obiettivo, Traccia, danni e tempo contemporaneamente, il motore ha una soluzione, e il nodo a più vie è un menù.

Le sette politiche proposte dall'analisi 1 — conservatore, temerario, preparatore, opportunista, narratore, minimizzatore, obiettivo — sono un buon punto di partenza e non vanno prese come elenco chiuso. La domanda decisiva è la sua, ed è quella che deciderà il motore: **esiste una situazione in cui Esposto è strategicamente migliore di Coperto?** Se la risposta è no, l'asse del giocatore ha un solo verso e tutto il §12 ha misurato la leva sbagliata.

---

## 3. Quello che nessuna delle due analisi ha visto

Sono cinque, e due riguardano il metodo — cioè la parte del progetto che entrambe le analisi lodano di più.

### 3.1 C15 — La regola che la 1.2 celebra è più forte di come è motivata, e la sua soglia è circolare

La 1.2 riscrive N9.a e ne fa la sua correzione principale. La motivazione dichiarata è una misura: *la probabilità che la preparazione atterri è monotona nella base* — 76,5% a base *Coperto*, 48,5% a *Esposto*, 26,1% ad *Allo scoperto*.

**Quella monotonia non è una scoperta empirica. È una proprietà aritmetica della formula del §10, e si deriva senza tirare un dado.**

L'Esposizione è `clamp(grezza, Fondo, Allo scoperto)`. Un'attenuante atterra se e solo se la grezza, dopo il decremento, cade ancora dentro la scala. Alzare la base trasla verso l'alto l'intera distribuzione della grezza, quindi sposta massa oltre il tetto, quindi rende l'attenuante inerte più spesso. **L'ordinamento fra le tre basi è determinato dalla struttura del motore, non dal lessico misurato.** Nessuna tabella dei luoghi può invertirlo.

Ne discendono tre cose, e nessuna è cosmetica:

1. **La regola è giusta per una ragione migliore di quella scritta.** Vale per costruzione, non per osservazione. Motivarla con una misura la indebolisce: la fa sembrare contingente quando è strutturale, e lascia credere che un altro lessico potrebbe smentirla.
2. **I tre numeri non sono esportabili.** 76,5 / 48,5 / 26,1 dipendono dalle tabelle di *quella* finzione. L'ordine si trasporta; le grandezze no. Presentarli in una specifica indipendente dall'ambientazione, senza dire questo, invita chi adotta il motore a usarli come riferimento.
3. **E qui il metodo si contraddice.** I7 chiede che la preparazione atterri in almeno l'X% dei casi *«con X dichiarato»*, e offre fra parentesi *«riferimento misurato: 82,9%»*. Quel numero viene dallo stesso dataset che ha prodotto la regola. Chi adotterà il motore dichiarerà una soglia guardando un risultato già visto — che è, parola per parola, ciò che il §30 vieta: **un criterio dichiarato dopo aver visto il risultato non ha validato niente.**

**Correzione proposta.** N9.a si motiva con la derivazione, non con la misura; la misura resta accanto come conferma su un caso. I7 perde il riferimento fra parentesi, oppure lo qualifica come *valore osservato su una finzione, non soglia raccomandata*.

### 3.2 C16 — Il nucleo è stato corretto su una finzione sola, e la specifica esige dagli altri più di quanto abbia fatto per sé

Il §38 impone a chi riconcilia un progetto: *compilare una seconda finzione di prova e tenerla come test di regressione dell'agnosticismo. Ogni modifica futura al nucleo ci ripassa.*

Le due modifiche al nucleo della 1.2 — la riscrittura di N9.a e la nascita di N12 — vengono entrambe dalla stessa e unica applicazione del motore, e non sono ripassate da nessuna seconda finzione. Le tre istanziazioni della Parte VI non contano: sono compilazioni, non misure, e sono state riempite *dopo*.

Non è un'accusa di malafede: è la situazione normale di un progetto con un'applicazione sola. Ma va **dichiarato in testa alla 1.2**, dove oggi si legge soltanto che le misure vengono «dall'applicazione del motore a un progetto reale». La riga onesta è: *le due correzioni del nucleo poggiano su una sola finzione, e la loro regressione su una seconda è debito aperto.*

Questo è il rilievo che dovrebbe far male più di tutti gli altri, perché tocca la parte del documento che entrambe le analisi indicano come la sua forza.

### 3.3 C14 — I quattro numeri della saturazione non si ricostruiscono

Il §12.1 sostiene la sua tesi più importante — *nessuna correzione locale riduce la saturazione* — con questa riga:

> vincolare le tabelle porta la saturazione dal 62,7% al 56,2%; correggere il lessico la porta dal 50,0% al 46,1%; **tutte e due insieme la lasciano al 50,9%.**

I due interventi partono da basi diverse (62,7 e 50,0) senza che sia detto perché, e la combinazione cade fuori da entrambi gli intervalli d'arrivo: peggiore di 46,1, migliore di 56,2. Sono numeri compatibili con due esperimenti diversi presentati come una serie. **Un lettore non può ricostruire che cosa è stato variato**, e quindi non può riprodurre la misura né contestarla — che è la condizione minima perché una misura conti come tale.

La tesi resta probabilmente vera, e la sua giustificazione forte è quella dichiarata subito dopo, che è strutturale e non ha bisogno di numeri: *il rapporto fra l'ampiezza della composizione e l'ampiezza della scala è il fatto primo.* Il passaggio va riscritto dichiarando le configurazioni, oppure asciugato fino a quella frase.

### 3.4 C5 — Il confronto non dichiara la sua via povera

Il §2.6 è una tesi, e il §14 la rende aritmetica: *ogni ostacolo ha almeno una via senza prerequisiti: sempre disponibile, sempre costosa, mai bloccata. E non si tira.* V1 la controlla. Il §14 aggiunge che una via povera che si può fallire sarebbe **un muro con un dado davanti**.

Un confronto è un ostacolo. Quali sono le sue uscite?

- Le due sempre disponibili — *farlo desistere*, *trovare un accordo* — sono dichiarate **prove sigillate** (§23.8): si tirano, e se falliscono la porta si chiude.
- *Prendere quello per cui eri lì* e *andartene mentre non può seguirti* «si possono **tentare** sempre», e la finestra le rende gratis: prima della finestra, non lo sono.
- Il §23.4 aggiunge che quando l'avversario ti raggiunge il gioco chiede a te una prova di resistenza.

**Il Modulo G, come è scritto, non dichiara nessuna via non tirata.** Un confronto può quindi essere compilato in modo da soddisfare I2 — una via d'uscita *disponibile* esiste — e violare V1, perché tutte quelle vie si tirano. È il muro che il §2.6 vieta, dentro il modulo dove la promessa è più difficile da mantenere e più facile da rompere.

La riparazione non richiede una meccanica nuova: richiede di dire quale uscita è la via povera. Il §23.7 già la contiene, nella famiglia *non c'è*: **«te ne vai, con quello che ti costa»** — un prezzo, non un tiro.

> **Da aggiungere al §23:** l'uscita è la via povera di ogni confronto. È sempre disponibile, non si tira, e quello che varia è il prezzo: Traccia, obiettivo mancato, posizione persa. Un confronto in cui andarsene richiede un tiro è un errore di dati, non una scena tesa.

### 3.5 C17 — Un rimando sbagliato

Il §16 chiude la pipeline così: *«il quinto è un modulo che può essere assente (§23)»*. La mitigazione è il **§25**; il §23 è il Modulo G. Un carattere.

---

## 4. I rilievi confermati che costano poco e vanno chiusi tutti

**C6 — §2.1 promette ciò che §13 nega.** Il §2.1 scrive: *«Non serve ricordarsi di divergere: non si può fare altrimenti.»* Il §13, con la deviazione D8, dichiara il contrario: *«Si affermava che la regola fosse garantita dalla struttura… Non lo è. È un validatore, non una proprietà.»* La 1.2 ha corretto §13 e ha dimenticato §2.1. La formulazione onesta: le sei caselle differiscono per **ruolo** per costruzione; che il loro contenuto diverga davvero lo verifica V5, coppia per coppia.

**C7 — «a costo di scrittura nullo».** Il §2.3 lo dice bene: *«un costo di scrittura **per nodo** pari a zero»*. Le altre tre occorrenze perdono il qualificatore: il colofone §39, il concept, il README. Fuori contesto la frase promette che scrivere il gioco è gratis, mentre §24.2 dichiara che il banco delle complicazioni **è il vero contenuto del gioco** — cioè il costo di scrittura, intero. Va aggiunto «per nodo» in tutte e tre.
*L'analisi 2 chiama questa una contraddizione centrale: è un'esagerazione, perché §2.3 e §10.4 prezzano il costo con precisione. È uno slogan che ha perso tre parole, e va corretto per questo.*

**C13 — «si fa in mezza giornata».** In contraddizione con §2.3 (*«un costo di giudizio… non è scrittura e non si parallelizza. È il costo reale di questo motore»*) e con §10.4 (208 caselle di **giudizio interdipendente**). Mezza giornata basta per le **otto scelte di profilo**; le sedici voci e le tabelle sono un'altra scala di lavoro. La frase va spaccata in due, e non serve altro.

**C8 — D14 non dice rispetto a cosa.** *«Quanti tentativi sono stati spesi, e quanti se ne spendevano prima»* — prima di che? La risposta migliore è quella dell'analisi 2, ed è l'unica che non richiede dati fuori dalla partita: **il proprio passato sullo stesso verbo.** *«La prima volta che hai forzato una porta così: quattro tentativi. Oggi: uno.»* Va scritto, perché se questa superficie manca il modulo E è invisibile e la tesi §2.5 non è verificabile dal giocatore.

**C11 — «Non genera testo a runtime».** H1 compone quattro segmenti congelati a runtime. Non è generazione, è assemblaggio, e §24.3 lo dice bene; ma il §3 è un elenco di assenze letto senza contesto. Basta la subordinata: *non genera testo a runtime: lo compone da materiale congelato.*

**C19 — La ricevuta nomina cause.** Entrambe le analisi arrivano allo stesso rischio da strade diverse: la trasparenza totale può trasformare il gioco in un puzzle di ottimizzazione, e il giocatore smette di chiedersi *cosa farebbe il personaggio* per chiedersi *come scendo di un gradino*. Il §24.4 chiede oggi che ogni voce sia **dicibile in una frase breve**, che è una condizione sulla lunghezza. L'esempio di N9.c invece mostra la cosa giusta — *«questo posto ti conosce»*, *«sei ridotto male»* — cioè cause in lingua, col numero come annotazione. La regola c'è per esempio e non per enunciato, e va promossa: **ogni voce nomina una causa della finzione; il numero è l'annotazione, non la voce.**

**C20 — Il budget di ripetizione.** V12 chiede *«almeno N varianti valide, con N dichiarato»*. Il §24.3 mostra che il numero che conta davvero è un altro: quante volte il giocatore rilegge la stessa frase in una partita — 38 volte con otto varianti, 100 con tre. Il vincolo va espresso lì, come si fa già per I7 e I8: **dichiarare il numero massimo di riletture per contesto per partita, e derivare N da quello**, invece del contrario.

**C12 — Conteggi e numerazione.** Tre difetti reali, tutti verificati:

- la nota di lettura e l'epigrafe della Parte II dicono **undici** regole; il nucleo ne ha **dodici**, perché N12 è nata al §27.1, fuori dalla Parte II, e la Parte II non è stata riallineata;
- entrambi i concept scrivono *«i moduli sono otto»* e **ne elencano nove**. I moduli sono nove (A–I); **otto** sono le scelte di profilo, perché D si compila e non si sceglie. La stessa ambiguità è nell'epigrafe della Parte III;
- la tabella del §37 elenca D1…D13, poi **D18 e D19**, poi D14…D17. Il raggruppamento tematico è comprensibile e sembra un errore.

In un documento la cui identità è la disciplina del conteggio, questi tre pesano più che altrove. Entrambe le analisi lo dicono, e hanno ragione.

---

## 5. Dove le analisi sbagliano, e la cura va corretta prima di prenderla

### 5.1 C10 — Il numero degli avversari: diagnosi giusta, rimedio pericoloso

La diagnosi è confermata dalla nostra stessa misura, dichiarata al §23.2: fra un avversario e quattro, il 4% in logorio medio. Meccanicamente è coerente — l'Esposizione satura, e non esiste un quarto livello. Esperienzialmente è insostenibile: essere circondati da quattro deve sentirsi diverso, o il sistema viene letto come rotto.

La cura proposta dall'analisi 2 è buona nella direzione — **far pesare il numero sulle uscite invece che sull'aggravante** — e va accettata solo con un vincolo, perché così com'è formulata («il numero di vie che restano aperte») **produce esattamente il muro che il §2.6 vieta**. Se quattro avversari chiudono vie, prima o poi ne chiudono l'ultima.

> **Forma corretta: il numero alza il *prezzo* delle uscite, non ne toglie nessuna.** Andarsene in quattro contro uno resta sempre possibile e non si tira (C5), ma costa di più: più Traccia, l'obiettivo lasciato dietro, una posizione persa. La differenziazione vive nel conto dell'uscita, non nella sua disponibilità.

Così la promessa del §2.6 regge e il numero smette di essere un interruttore. È anche coerente col §23.9, dove i danni sono l'orologio e la fine arriva per accumulo.

### 5.2 C9 — La conoscenza falsa: l'analisi 1 ha ragione, e serve un recinto

La Conoscenza falsa compare una volta sola, in una subordinata del §13: *«e il gioco può darti conoscenza falsa»*. Poi non torna mai. L'analisi 1 ha ragione a chiamarla una miniera, ed è il suo miglior contributo di contenuto.

Ma prima di svilupparla va notata una tensione che l'analisi 1 non vede. La tesi §2.2 promette che il giocatore vede il vero **prima di agire**, riga per riga. Se il motore può mentire, dove passa il confine?

> **Recinto — la conoscenza falsa non entra mai nella ricevuta.** Il gioco può darti un'idea sbagliata del mondo; non può darti un conto sbagliato di quanto ti costerà. La ricevuta dice sempre la verità intera, N9.c compreso.

È lo stesso mestiere del recinto del §25 sulla mitigazione, ed è la ragione per cui questo asse si può sviluppare senza incrinare la tesi. Con quel recinto, la Conoscenza falsa diventa la voce che manca alla firma di un'ambientazione: *che cosa, in questa finzione, si può credere per sbaglio, e come si scopre di averlo creduto.*

### 5.3 C22 — Il test sui verbi duplicati, smentito dalla nostra stessa Parte VI

L'analisi 1 propone: due verbi con stesse situazioni, stessi ceppi, stessi Fondi, stessi danni, stessi risultati sono duplicati anche se sembrano diversi.

**Applicato ai nostri dati, quel test boccia la nostra migliore istanziazione.** Nell'intrigo di corte, tre verbi hanno firma identica — ceppo MENTE, base *Coperto*, Fondo *Coperto*:

| Verbo | Ceppo | Base | Fondo |
|---|---|---|---|
| Osservare | MENTE | Coperto | Coperto |
| Ricordare | MENTE | Coperto | Coperto |
| Prevedere | MENTE | Coperto | Coperto |

E non sono duplicati: rispondono a tre domande diverse — *cosa vedo adesso*, *cosa so da prima*, *cosa sta per succedere* — e nel confronto del §32 sono tre leve distinte sullo stesso avversario. **La firma non è ciò che distingue un verbo.** Il §20 lo dice già meglio del test proposto: *se due verbi si scelgono con la stessa domanda, uno è di troppo.*

Del rilievo si salva la parte operativa, in forma corretta e più debole:

> **V16 — Nessun ostacolo offre due vie i cui verbi siano intercambiabili senza cambiare nient'altro.** Se sostituire un verbo con l'altro lascia identici Esposizione, prezzo e conseguenza, una delle due vie è decorativa.

Si controlla sui nodi, non sul lessico, ed è l'unico posto dove la duplicazione fa danno davvero.

---

## 6. I rilievi respinti, con il numero che li respinge

**C23 — «Servono due livelli di documento: un CORE di venti pagine e la spec di ingegneria».** Esistono da prima dell'analisi. `concept/ESPOSIZIONE-CONCEPT.md` sono dieci pagine e fanno esattamente quel mestiere; `EXPOSURE-CONCEPT-EN.md` undici, con glossario. L'analisi 1 dichiara di aver letto la Specifica 1.2, e infatti non li nomina mai. **Rilievo smentito dall'esistenza di due file.** Ne resta un'osservazione minore e vera: il concept non è raggiungibile da dentro la specifica, che non lo cita mai. Una riga nella nota di lettura risolve.

**C24 — «Universale è una parola pericolosa».** La Parte VII esiste apposta, dichiara quattro assunzioni e un elenco esplicito di ciò che sta fuori, e il §36 usa la parola contro sé stessa: *un motore che non sa dire dove finisce non è universale: è soltanto vago.* La specifica è già più severa dell'analisi. **Resta adottabile** la formula proposta — *motore generale per GDR narrativi a conseguenze persistenti* — come posizionamento nel README, dove oggi «indipendente dall'ambientazione» dice meno e promette di più.

**C21 — La tassonomia invariante / vincolo / bersaglio.** Esiste già in sostanza: la Parte V separa i controlli sui dati (V) dalle invarianti di sistema (I), e la silhouette è dichiarata *bersaglio* e non regola al §21.5. Manca solo l'enunciato in testa alla Parte V. Costo un capoverso, guadagno modesto: si fa, senza contarlo fra i rilievi.

**Le parafrasi.** Non sono rilievi e non generano lavoro: l'Esposizione che fa due mestieri (§27.2 lo scrive), la Traccia senza smaltimento (è la ragione di N12), le 208 caselle come prezzo vero (§10.4), la complessità spostata sull'autore (§2.3), le istanziazioni non giocate (§31), il rischio di gamificazione (§24.4). Vanno lette come conferma che il documento dice quello che crede di dire — che è un risultato, ma di leggibilità, non di design.

---

## 7. Che cosa NON integrare, e perché conta quanto il resto

L'analisi 1 chiude con il consiglio migliore delle due, e lo chiude contraddicendo sé stessa: *«io non aggiungerei altre meccaniche adesso. Bloccherei il core della 1.2»* — dopo trentaquattro sezioni di suggerimenti.

**Ha ragione sul principio, e il principio governa questa contro-analisi.** Il criterio con cui è stata compilata la colonna «entra in 1.3» è uno solo:

> **Entra ciò che chiude un buco, dichiara un limite o rende verificabile una promessa già fatta. Non entra niente che aggiunga superficie.**

Contate contro questo criterio, le ventiquattro voci si dividono così: diciassette **definiscono, dichiarano o validano**; nessuna aggiunge una meccanica nuova. Le sole due che aggiungerebbero davvero qualcosa sono la Conoscenza falsa (C9) — e infatti entra solo il **recinto**, non lo sviluppo — e il modello stocastico del freno (C18), che è debito tecnico e non design.

**Restano fuori, dichiaratamente:**

- **Sviluppare la Conoscenza falsa come sottosistema.** Il recinto sì, le regole no. Una finzione che ne ha bisogno la compila come dati; se scoprisse che il motore non la regge, sarebbe una lacuna da portare alla specifica — che è la procedura, e vale anche qui.
- **Un quarto livello di Esposizione**, che nessuno ha proposto e che qualcuno proporrà leggendo il §12.1. La saturazione è dichiarata come comportamento previsto e come difesa contro la spirale: non si cura allargando la scala.
- **Qualunque rimedio alla saturazione.** Il §12.1 ha già misurato che nessuna correzione locale la sposta di più di quattro punti, e il difetto vero — il pedaggio — è coperto da N9.c.
- **La tabella dei voti dell'analisi 1**, per la ragione del §0.

---

## 8. C18 — L'unico rilievo caro, e va deciso

Il §27.2 dà la condizione di stabilità:

```
f(Coperto) × [ 1 + (guadagno − 1) × freno / 2 ]   <   1 / smaltimento
```

I termini sono definiti; **il processo che la genera no.** Non è dichiarato che cosa sia la Traccia come processo stocastico — una catena con quali stati, quali transizioni, quale relazione fra frequenza dell'imprevisto ed Esposizione corrente — né da dove venga il fattore `/2`, che sembra un valor medio su una distribuzione mai dichiarata.

Ne discende un problema operativo serio: **I6 non è verificabile da chi non ha scritto la formula.** L'invariante chiede che il loop converga *«per tutti gli intervalli di parametri dichiarati»*, e chi implementa deve indovinare il modello per controllarla. Un'invariante che richiede di indovinare non è un'invariante: è un atto di fiducia.

Le opzioni sono tre, e la scelta è tua perché è l'unica voce di questo documento che costa giorni e non minuti:

1. **Appendice con il modello** — il processo, le assunzioni, la derivazione della disuguaglianza, e un esempio numerico completo. È il lavoro giusto e chiude I6 per chiunque.
2. **Uno strumento invece di un'appendice** — un simulatore che, dati freno e smaltimento, risponde converge / diverge / bistabile. Costa meno da scrivere e più da mantenere, e sposta l'onere su del codice che qualcuno dovrà tenere in vita.
3. **Dichiarare il debito** — una riga che dice che la disuguaglianza è ricavata da un modello non pubblicato, e che I6 va verificata simulando. Costa un'ora ed è onesto, ma lascia la formula in uno stato in cui nessuno la può contestare — cioè fuori dal metodo del §30.

Fra le tre, la seconda ha un vantaggio che le altre non hanno: la bistabilità è **una regione dello spazio dei parametri**, e uno strumento la mostra dove una formula la nasconde.

---

## 9. Sequenza proposta per la 1.3

Prima di ogni altra cosa, una nota di ordine: sei di queste voci **cambiano il nucleo o la Parte V**, e per il §38 ogni modifica al nucleo ripassa da una seconda finzione di regressione. Che, come dice C16, non esiste ancora. **Quindi la 1.3 non si chiude prima che quella finzione esista** — e questo è il vero contenuto della sequenza, non un dettaglio di calendario.

| Ordine | Voce | Perché in questa posizione |
|---|---|---|
| **1** | C1 · definizione di «cambiato» + V14 | Regge N8 e l'anti-farming insieme. È il buco più grande |
| **2** | C5 · la via povera del confronto | Un modulo può oggi violare il §2.6, che è una tesi |
| **3** | C2 · V15, la pressione | Senza, lo stallo da Coperto è compilabile |
| **4** | C6, C7, C11, C12, C13, C17 · le correzioni di dizione | Costano minuti e tolgono ogni appiglio |
| **5** | C15, C16, C14 · l'onestà sul metodo | Le sole voci che *tolgono* forza apparente al documento. Vanno fatte per questo |
| **6** | C8, C19, C20 · le tre superfici | Rendono verificabili tre promesse già fatte |
| **7** | C9 recinto, C10 uscite, C22 V16, C21 tassonomia | Chiusure locali |
| **8** | C4 · I10, le strategie dominanti | Si scrive adesso, si misura col banco |
| **9** | C3 · il banco umano, con criteri scritti prima | **Il gradino vero.** Tutto il resto lo prepara |
| **10** | C18 · il modello del freno | Debito tecnico, e la sua forma è una decisione |

**E la conclusione che entrambe le analisi raggiungono da strade diverse, che è anche la mia.** Il documento è arrivato al punto in cui ogni riga aggiunta lo rende più difendibile e non più vero. Le diciassette correzioni qui sopra non lo migliorano: **gli tolgono il margine di plausibilità in cui un difetto potrebbe nascondersi.** Dopo di quelle, la domanda che decide il progetto non si risolve scrivendo:

> Quando una persona gioca venti ore con questo motore, continua a prendere decisioni narrative, o impara a manipolare la matrice?

Il motore, allo stato, non ha nessun dato su questa domanda. Ed è la sola per cui è stato costruito.
