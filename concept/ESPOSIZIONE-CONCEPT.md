# ESPOSIZIONE

## Un motore di risoluzione per la narrativa interattiva

### Presentazione del concept

> Il dado decide se riesci. Lo stato decide cosa ti costa.

---

## 1. Di che cosa stiamo parlando

Esposizione è un motore di risoluzione: l’insieme di regole e di strutture dati che, ogni volta che il protagonista di una storia interattiva tenta qualcosa, decide che cosa succede dopo. Non è un gioco e non è un’ambientazione. Non contiene un nome proprio, non nomina un luogo, non descrive una creatura. Chi non sappia niente delle storie per cui è nato deve poterlo costruire leggendone la specifica, e questo è il criterio con cui la specifica è stata scritta.

Queste pagine non sono quella specifica. La specifica esiste, si chiama 1.3, occupa trentanove paragrafi e un'appendice e serve a chi deve scriverne l’implementazione. Questo documento viene prima e fa un altro mestiere: mettere in mezz’ora chiunque debba lavorarci in condizione di capire che cosa il motore fa di diverso, che cosa ha rifiutato per farlo e quanto costa adottarlo. I rimandi fra parentesi puntano ai paragrafi della specifica, per chi voglia scendere.

Una precisazione sulla parola, perché genera l’equivoco più comune. *Esposizione* qui non ha niente a che vedere con il nascondersi. È tenuta perché in italiano è già astratta: si parla di esposizione debitoria, ci si espone prendendo posizione, si vende allo scoperto. Il motore la definisce come *quanto la situazione ti può far pagare*, e lascia a ogni ambientazione il compito di dichiarare la propria lettura.

## 2. Il problema, e i tre modi in cui di solito lo si sbaglia

Un gioco di ruolo narrativo deve ottenere una cosa che sembra facile: fare in modo che riuscire e fallire non siano le uniche due cose che possono accadere. Detto così suona come un problema di scrittura. È un problema di architettura, e le tre soluzioni consuete cedono tutte, ciascuna a modo suo.

**La scala di gradi.** Fallimento grave, fallimento, successo con complicazione, successo, successo pieno. È una forma ordinata per costruzione, e una forma ordinata suggerisce a chi scrive «meglio e peggio». Gli esiti diventano versioni accese o sbiadite della stessa cosa, e ottenere una divergenza vera dipende dalla disciplina degli autori. Su un progetto di quaranta ore la disciplina cede, e cede prima nei nodi che nessuno rileggerà.

**Il danno.** Riduce ogni ostacolo alla stessa domanda: quanto gliene resta. Perché quella domanda abbia senso, quasi tutto deve possedere una riserva: il nemico, la porta, la trattativa, la febbre. E la riserva è un sottosistema privilegiato, che cresce, si specializza, attira le meccaniche migliori e finisce per mangiare le altre. Un gioco che parte narrativo arriva a essere un gioco di sottrazioni.

**La difficoltà che scala.** Alza le soglie mentre il personaggio migliora, per tenere il rischio costante. Il prezzo è l’unica esperienza che la crescita sappia produrre davvero, cioè tornare dove si era falliti e passare. In un mondo che si adegua a te, quaranta ore dopo sei allo stesso punto con nomi più altisonanti.

Esposizione rifiuta tutte e tre le soluzioni, e le pagine che seguono dicono con che cosa le sostituisce e quanto ha accettato di pagare per farlo.

## 3. Due assi, sei caselle

Un tentativo pone due domande, non una.

La prima — riesci o no — la decide il dado, ed è binaria. La seconda non la tira nessuno: è determinata da come ci sei arrivato, e misura quanto la situazione ha presa su di te. Tre livelli, detti a parole: *Coperto*, *Esposto*, *Allo scoperto*.

I due assi non si toccano mai. L’Esposizione non modifica il tiro, non sposta la soglia, non compare in nessuna formula che produca una probabilità: cambia che cosa succede, mai quanto è probabile. È la riga che tiene in piedi tutto il resto, perché nel momento in cui l’Esposizione toccasse le percentuali i due assi si richiuderebbero in una scala sola, e l’impianto tornerebbe a essere una difficoltà travestita da conseguenza.

Il loro incrocio produce sei caselle qualitativamente diverse per costruzione.

| | Riesci | Non riesci |
|---|---|---|
| **Coperto** | ottieni, e non lasci traccia | non passi di qui, ma hai imparato qualcosa: si apre un’altra via |
| **Esposto** | ottieni, e il mondo registra il tuo passaggio | la scena cambia natura sotto di te |
| **Allo scoperto** | ottieni, e qualcosa si rompe per sempre | sei in un’altra scena, non nella stessa scena andata male |

Tre conseguenze sono deliberate.

Da *Coperto* il dado non può rovinarti: il peggio che può capitarti è non riuscire. È una promessa, e il motore la mantiene ovunque, combattimento compreso.

I critici non sono facce del dado. Successo pieno e Rovescio sono righe della griglia, e la loro frequenza la decide il giocatore con il modo in cui agisce, non il caso con un 5%.

Il fallimento insegna sulla cosa, non sul gesto. Scopri com’è fatta la porta; non diventi più bravo a forzarla. È conoscenza, e la distinzione conta perché impedisce al ritentare di diventare allenamento.

## 4. L’invenzione vera: la posizione si deriva

Qui sta la differenza che giustifica l’esistenza di un altro motore.

Nei sistemi che dichiarano una posizione, e sono i migliori in circolazione, quella posizione la scrive qualcuno. Un autore guarda la scena e stabilisce che si sta agendo in condizioni rischiose. Funziona finché gli autori sono pochi e si parlano; sopra una certa dimensione produce trentamila micro-giudizi incoerenti fra loro, e nessuno se ne accorge finché il gioco non è scritto.

In Esposizione la posizione non si scrive: si compone. Tre fattori, dichiarati una volta per ambientazione.

```
grezza      = base(verbo) + Luogo[ceppo] + Momento[ceppo] + aggravanti − attenuanti
Esposizione = grezza, limitata fra il Fondo del verbo e Allo scoperto
```

Il **verbo** è l’unità di competenza, e dichiara quanto espone di suo. La scheda di un personaggio è una lista di verbi e nient’altro. Il **luogo** e il **momento** dichiarano quanto espongono, ma non in generale: **ceppo per ceppo**, dove i ceppi sono le categorie dell’azione (il corpo, la mano, la mente, la voce, o quelle che l’ambientazione decide di avere).

È il valore per ceppo il punto in cui questo motore si stacca dagli altri, ed è più facile mostrarlo che spiegarlo. Una folla nasconde le mani e scopre la voce. Una rovina espone il corpo che fa rumore e ripara le mani che lavorano. La pioggia copre il ladro e scopre il camminatore. Con un valore unico per fattore, la pioggia sarebbe genericamente *peggio*, e la scelta di quando muoversi perderebbe il suo contenuto; diventerebbe inesprimibile qualunque regola che contenga due segni opposti nello stesso momento, e sono quelle le regole migliori che un’ambientazione possiede.

Un esempio compilato, da una finzione di corte. Insinuare in cappella all’alba risulta *Coperto*. La stessa insinuazione in sala delle udienze, durante un ricevimento affollato, risulta *Esposto*. Ma **sottrarre** una lettera è più facile durante il ricevimento che all’alba, perché la folla copre le mani e il silenzio le scopre. È la pioggia che copre il ladro, in un mondo senza pioggia e senza ladri. E nessuno l’ha scritta: è uscita da sola dall’incrocio di due tabelle.

Il **Fondo** è la seconda metà dell’idea: il livello sotto il quale nessuna preparazione può far scendere un’azione. È una proprietà del verbo, non della scena. Serve a trasformare un principio di design in aritmetica: se una finzione stabilisce che un certo gesto è sempre il più caro, non lo si scrive nelle linee guida (dove verrà disatteso per distrazione): gli si dà Fondo *Allo scoperto*, e nessuno potrà più fare altrimenti. Leggere *Fondo: Allo scoperto* accanto a un verbo significa sapere in anticipo che nessuna preparazione salverà.

Il conto di tutto questo è dichiarato e non è piccolo. Un numero di caselle pari a `(luoghi + momenti) × ceppi`: con quaranta luoghi, dodici momenti e quattro ceppi sono duecentotto caselle invece di cinquantadue. È costo di **giudizio**, non di scrittura: non tocca il volume dei testi e si paga una volta per ambientazione, non una volta per nodo. Ma è giudizio interdipendente, perché ogni casella deve restare coerente con tutte le altre, e va sorvegliato con uno strumento: perché le inversioni sono precisamente la prima cosa che deriva quando la coerenza si allenta.

## 5. La ricevuta

L’asse che il giocatore governa gli viene mostrato prima di agire, con le sue cause, riga per riga. Non come numero: come elenco di voci in lingua.

```
ALLO SCOPERTO
   Esposto      (base: forzare, di giorno, in uno spazio aperto)
   +1           sei ridotto male
   +1           questo posto ti conosce      — non conta, sei già allo scoperto
   −1           hai perlustrato prima
   Fondo: Esposto
```

Da una superficie del genere discendono più cose di quante sembri. Il giocatore non deve indovinare il modello mentale di chi ha progettato il gioco: lo legge, e impara il sistema usandolo. La terza riga mostra una voce che non muove il totale e lo dichiara, perché una ricevuta che nasconde il tetto insegna una regola falsa. E soprattutto il giocatore capisce dove sta la sua leva: non gioca contro il dado, che non si può governare, gioca contro l’Esposizione, che si può abbassare pagando tempo e preparazione.

C’è un vincolo che nasce da qui e che taglia via metà dei modificatori che verrebbero in mente: **ogni voce deve poter essere detta in una frase breve, senza abbreviazioni e senza icone.** Se non si riesce a dirla a parole, quel modificatore non deve esistere. È una regola scomoda, ed è il motivo per cui le aggravanti sono da tre a cinque famiglie e non un catalogo.

## 6. Quello che il motore non ha, e il conto di ogni assenza

Nessuna riserva, da nessuna parte. Non si chiede mai *quanto ne resta*, si chiede *com’è ridotto*. Ciò che degrada è un’entità con un decorso, che dichiara **cosa impedisce**. «Le mani non tengono il tratto» chiude un verbo e ne lascia intatto un altro. Un danno non ti rende peggiore: ti toglie una via. In cambio non esiste un sottosistema privilegiato, e le conseguenze si raccontano invece di contarsi. Il prezzo è che la sensazione di progresso dentro uno scontro va prodotta in un altro modo, e chi arriva da altri giochi la cerca dove non c’è.

La difficoltà non scala mai. La progressione si sente tornando dove si era falliti, che è l’unica forma di crescita che non si possa falsificare. Il prezzo è che la crescita non si sente sul singolo tiro, e va resa percepibile altrove: è un requisito duro, non un consiglio.

Nessun ostacolo è un muro. Ogni ostacolo ha almeno una via senza prerequisiti — sempre disponibile, sempre costosa, mai bloccata — e quella via non si tira, perché una via povera che si possa fallire è un muro con un dado davanti. La difficoltà si esprime come prezzo invece che come sbarramento. Il prezzo è una via in più per ogni ostacolo, ed è la voce che gli autori tenteranno di saltare per prima: va rifiutata in validazione, non raccomandata nelle linee guida.

E poi un elenco di assenze secche, che vale la pena leggere per intero perché ognuna è una decisione. Il motore non tira mai al posto del giocatore: esiste un solo tiratore. Non ha iniziativa e non ha ordine di turno. Non ha un orologio che scorre mentre il giocatore pensa. Non ha attributi. Non ha classi né percorsi di avanzamento. Non ha una scheda parallela per gli avversari. Non genera testo a runtime. Non ha punteggi morali, barre di reputazione, allineamenti.

## 7. Il confronto, che non è un secondo motore

Dove c’è un’opposizione capace di reagire, non entra in scena un sistema nuovo: è il comportamento del nucleo quando l’ostacolo ha una volontà. Il modulo può anche essere assente, e il motore funziona lo stesso.

La domanda *quanto gli manca* non esiste. Esiste *quanto è coperto*. L’Esposizione è reciproca, e i due lati fanno mestieri diversi: la tua decide cosa ti costa, la sua decide se l’azione decisiva vale qualcosa. Ogni tua prova riuscita lo scopre di un gradino; quando arriva allo scoperto la finestra è aperta, e quello che fai adesso la spende.

Un confronto non è togliere qualcosa a qualcuno. È creare il momento in cui l’azione decisiva costa poco. Non è una riformulazione poetica ma aritmetica del Fondo: se il gesto risolutivo della finzione ha Fondo *Allo scoperto*, ripeterlo di continuo è la strategia peggiore disponibile, e non perché qualcuno l’abbia vietata.

Un avversario si descrive con quattro voci e nessun punto vita: che cosa lo copre, che cosa lo scopre, che cosa costa avvicinarlo, che cosa vuole e che cosa lo fa smettere. L’ultima non si lascia mai vuota, e va riempita anche per chi non ascolta: tutto ciò che ha una volontà vuole qualcosa, ma non tutto ciò che vuole qualcosa ti ascolta. Chi ti ascolta si ferma con le parole; chi non ti ascolta si ferma col costo, cioè il fuoco, il rumore, una preda più facile. E ciò che non vuole niente non si ferma affatto. Si evita. Il freddo, la carestia e il tempo non sono avversari: sono il mondo.

Si finisce in tre modi, e si leggono identici nei due sensi: uno dei due non può più, uno dei due non vuole più, uno dei due non c’è più. La colonna di mezzo è la più larga, ed è una decisione di produzione prima che di design. Nella realtà quasi nessuno scontro finisce con qualcuno tolto di mezzo: finisce perché uno dei due ha smesso di volerlo. La maggior parte del testo di un confronto, in un gioco costruito così, non descrive ferite: descrive gente che si ferma.

Resta la domanda che tutto questo apre. Se non si cresce per vincere, a che serve crescere? Un principiante apre la finestra al quarto tentativo e ci arriva con tre danni addosso; uno bravo la apre al primo. Stessa opposizione, stessa soglia, stessa scena, conto finale completamente diverso. **Non si cresce per vincere i confronti: si cresce per uscirne con meno addosso.**

## 8. Nucleo e moduli: come si adatta senza inventare niente

Un motore universale non è un motore che va bene per tutto senza toccarlo. È un motore in cui ciò che non si tocca è piccolo e non negoziabile, e tutto il resto si sceglie da un elenco chiuso.

Il **nucleo** è dodici regole. Non si adattano, non si profilano, non si negoziano; un progetto che ne tocca una non sta più usando questo motore, il che è legittimo, ma va detto. I **moduli** sono nove — il randomizzatore, la scala di competenza, il contenitore, il lessico, la crescita, il logorio, il confronto, il testo, la mitigazione — e otto si scelgono fra profili dichiarati, con un predefinito motivato. Il nono è il lessico, che non si sceglie: si compila, sotto cinque vincoli.

Una sola disciplina impedisce a questa architettura di degenerare in un vocabolario: **un profilo nuovo si aggiunge alla specifica, non si inventa per un progetto.** Se un’ambientazione ha bisogno di qualcosa che nessun profilo copre, quella è una lacuna del motore e va portata dove stanno le altre, non risolta in casa.

Adattare Esposizione a una finzione significa quindi due cose e non una terza: **otto scelte di profilo** e **sedici voci da compilare**. Le voci sono elencate, hanno una forma dichiarata, e finiscono lì. Se una finzione ne pretende una diciassettesima, delle due l’una: o è un sottosistema privilegiato e va rifiutata, oppure è una mancanza del motore e va discussa come tale.

## 9. Tre generi lontani, la stessa firma

La prova che un motore sia astratto non è un’argomentazione: è una compilazione. La firma è stata riempita per tre finzioni scelte apposta lontane fra loro.

**Intrigo di corte.** Lettura dell’Esposizione: *quanto un atto è attribuibile a te*. Coperto significa che nessuno può risalire a te; allo scoperto significa che l’hai fatto davanti a tutti e non lo puoi rinnegare. Il criterio del Fondo: ha un Fondo ciò che, per funzionare, ha bisogno che qualcuno sappia che sei stato tu. Un favore chiesto richiede che qualcuno sappia di averlo concesso; un’accusa non esiste finché non è pubblica. Il logorio non sta nel corpo ma nella posizione: credito, sfinimento, pazienza del patrono.

**Fantasy con una disciplina.** Lettura: *quanto di te resta attaccato alla cosa che hai toccato*. Il risultato più forte dei tre, perché la magia entra senza un sottosistema. Non un verbo *lanciare incantesimi*, che concentrerebbe in un punto ciò che la finzione vuole pervasivo, ma tre verbi distribuiti sui ceppi: tracciare, leggere, chiamare, e il corpo dichiaratamente scoperto. Il costo della disciplina si paga in Esposizione e in danni, e non esiste nessun serbatoio da consumare. Ne discende senza una regola dedicata tutto ciò che di solito ne richiede una dozzina. La magia è sempre disponibile e sempre la più cara. Non si esaurisce, si paga.

**Indagine contemporanea.** Lettura: *quanto chi stai guardando sa di essere guardato*. Qui il logorio non sta nel corpo dell’investigatore ma nell’oggetto del lavoro: il caso che si raffredda, la pressione dall’alto, la credibilità. È un profilo che il motore non aveva previsto, e lo regge. Un interrogatorio si compila nelle quattro voci dell’avversario senza una riga di adattamento: la sua versione lo copre, una contraddizione lo scopre, e se chiede un avvocato non c’è più.

Il risultato che conta più degli altri è che **il confronto si è trasportato per intero**. L’udienza di corte, l’interrogatorio di polizia e il combattimento sono lo stesso sistema, con le stesse tre uscite e la stessa finestra. Le prove hanno anche corretto il motore in quattro punti, ed è il motivo per cui sono state fatte prima di scrivere una riga di gioco.

## 10. Come si sa che funziona

Un criterio dichiarato dopo aver visto il risultato non ha validato niente. La specifica prescrive di scrivere il criterio prima, con seme fisso, e di non cancellare i criteri falliti: si aggiunge quello riformulato accanto e si spiega perché. Un criterio fallito e riscritto in silenzio è la cosa che distingue una verifica da una cerimonia.

Questo non è un proposito. La versione 1.2 esiste perché due regole della 1.1 sono state misurate contro dei dati e sono risultate sbagliate, e la 1.3 esiste perché quelle misure sono state riesaminate e una di esse non era una misura.

La prima puntava sulla proprietà sbagliata. Vincolava un rapporto fra due parametri del lessico; la misura dice che la probabilità che la preparazione atterri dipende dalla **base** dei verbi e non da quel rapporto: 76,5% per i verbi a base *Coperto*, 48,5% a *Esposto*, 26,1% a *Allo scoperto*. La vecchia regola colpiva cinque verbi che stavano benissimo e lasciava stare i due che stavano peggio.

La seconda era più grave, perché riguardava la stabilità. Il motore fa dipendere la frequenza dell’imprevisto dall’Esposizione corrente, e questo è un anello di retroazione positivo che va frenato. Il freno era formulato come tetto sul flusso in entrata, e con il flusso in uscita a zero nessun valore del tetto stabilizza niente. L’uscita era a zero davvero: nella prima applicazione del motore l’accumulatore non aveva smaltimento in nessuna riga di dieci capitoli, e il sistema risultava **bistabile**. Reggeva finché non capitava una brutta giornata, e da lì non tornava più: che è alla lettera il muro che il motore vieta, e non era un rischio di taratura ma una regione dei parametri in cui si poteva stare senza saperlo.

Da lì è nata la dodicesima regola di nucleo, **ogni stato che si accumula dichiara come si smaltisce**, e il freno è stato riscritto come disuguaglianza fra entrata e uscita. La 1.3 ne pubblica il modello, perché una disuguaglianza data senza il processo che la genera non si può verificare e nemmeno contestare.

E la 1.3 corregge il metodo in tre punti che tolgono forza apparente al documento, che è la ragione per cui vale la pena farli. La prima delle due regole non era stata scoperta misurando: **era derivabile dall'aritmetica del motore**, perché una scala che satura in alto rende inerte la preparazione tanto più spesso quanto più in alto si parte. La regola ne esce più forte — vale per costruzione — ma le percentuali che la accompagnavano valgono per la finzione che le ha prodotte e non si esportano. La soglia che quelle misure suggerivano è stata tolta, perché dichiarare un criterio guardando un risultato già visto è precisamente ciò che questo metodo vieta. E soprattutto: **le due correzioni al nucleo poggiano su una finzione sola**, non sono mai ripassate da una seconda, e la specifica esige da chi la adotta esattamente quella seconda prova. È debito, ed è scritto dov'è leggibile.

Va detto anche quello che le misure **non** hanno risolto, perché è la parte che distingue una presentazione da una vendita. La scala satura, e la saturazione non si riduce. La somma grezza percorre undici valori su una scala che ne ha tre, e nessuna correzione locale sposta la cosa di più di quattro punti: è il comportamento previsto di una scala limitata, ed è anche la difesa che impedisce alla preparazione di diventare una spirale. Il difetto vero è più piccolo e ha un nome. Si chiama **pedaggio**, e sono le situazioni in cui il primo gradino comprato non atterra e il secondo sì, tanto che bisogna pagarne due per ottenerne uno. Vale un caso su quattro fra quelli in cui la preparazione ha un senso, e si risolve dichiarandolo nella ricevuta invece di nasconderlo.

## 11. Dove non arriva

Un motore che non sa dire dove finisce non è universale: è soltanto vago.

Il nucleo assume quattro cose. Che esista un protagonista che agisce e possa fallire. Che l’azione sia discreta, cioè che ci siano momenti in cui si decide e si risolve. Che le conseguenze persistano. E che valga la pena distinguere *quanto è probabile* da *quanto costa*. Quest’ultima è l’assunzione più profonda: in un gioco dove il fallimento ha un solo prezzo possibile i due assi collassano, e resta un sistema più complicato del necessario.

Dove una di queste non vale, il motore non si adatta: non si applica, e conviene saperlo prima di provarci. Restano fuori i giochi in tempo reale, la pura gestione di risorse senza un soggetto, i tattici a squadra (servirebbero iniziativa e posizionamento, e qui sono rifiutati entrambi), i puzzle a soluzione unica, dove non può esistere una via povera che non sia la soluzione, e le finzioni che riguardano un sistema invece di una persona.

Resta dentro qualunque gioco di ruolo narrativo con un protagonista, azione a turni o a scene e conseguenze che restano. Che è, per inciso, quasi tutta la narrativa interattiva che valga la pena progettare.

## 12. Che cosa serve per adottarlo

Il lavoro di adattamento è dichiarato e finito, e chi lo fa non deve inventare niente.

Si comincia scegliendo gli otto profili, **anche dove la scelta coincide col predefinito**, perché una scelta implicita è una scelta che nessuno potrà rimettere in discussione. Poi si compilano le sedici voci, e la prima è quella che decide il tono di tutto il resto: la frase che dice, in questa finzione, che cosa significa essere esposti. Le due voci che vanno dichiarate insieme e che nessuno ricorda sono il freno e lo smaltimento: sono due numeri, non uno, e nessuno dei due significa qualcosa senza l’altro.

Le tabelle si compilano dopo il lessico, mai prima, e si controllano contando: metà dei verbi a base *Coperto*, non più di due a base massima, e ogni luogo con almeno un ceppo negativo. Un posto che espone tutto e non ripara niente non è un luogo difficile: è un luogo che non fa il suo mestiere. **Ogni posto deve essere buono per qualcosa.**

Restano sedici controlli sui dati e dieci invarianti da verificare simulando, e conviene farlo con più giocatori automatici in concorrenza: uno solo non misura il motore, misura il giocatore. Quello che si guarda quando hanno finito è la **dominanza**: se una singola politica di gioco batte tutte le altre su tutte le metriche insieme, il motore ha una soluzione e il nodo a più vie è un menù.

E resta la prova che nessun automa può fare. Tutto ciò che è stato misurato dice che il motore è **stabile**, e stabile non vuol dire che funzioni: le promesse centrali — che le sei caselle si sentano diverse, che la crescita si veda come tentativi risparmiati, che la ricevuta insegni il sistema mentre lo si usa — vivono in una testa umana. Si misurano con due domande, dichiarate prima come tutto il resto: *perché pensavi che sarebbe successo quello che è successo*, chiesto dopo una scena, e *qual è stata la decisione più importante*, chiesto a fine partita. Passa chi nomina una posizione e una decisione. Non passa chi nomina il dado.

Il debito verso le scuole che hanno reso possibile tutto questo è reale, e riconoscerlo rafforza la posizione invece di indebolirla: *Powered by the Apocalypse* per il fallimento come evento, *Forged in the Dark* per la posizione come stato dichiarato, *Genesys* per riuscita e complicazione su assi indipendenti, *Disco Elysium* per la distinzione fra prove ritentabili e prove che marchiano. Il linguaggio del d20 è tenuto perché si spiega da solo a schermo in tre secondi, e non porta con sé niente altro: nessuna classe, nessun attributo, nessuna difficoltà che scala col livello.

Ciò che questo motore aggiunge a quelle scuole, e che ne giustifica l’esistenza, è una cosa sola.

> La posizione non si dichiara: si deriva, da tabelle con una firma per ceppo, a costo di scrittura nullo per nodo — e le inversioni, che sono la parte interessante di ogni ambientazione, escono come effetto collaterale.

*Per nodo* è la misura esatta di quello che la derivazione compra, e va letto come un limite e non come una cautela. Il costo di giudizio resta, e si paga una volta per ambientazione. Il costo di scrittura resta intero, e vive nei banchi delle complicazioni, che sono il vero contenuto del gioco. Ciò che va a zero è una cosa sola: quella che negli altri sistemi si paga a ogni nodo, per sempre.

Tutto il resto è disciplina.
