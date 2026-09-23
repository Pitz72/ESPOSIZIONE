# Scrivere il manuale da persona a persona

*23 settembre 2026. Accompagna `ANALISI-CRITICITA-1.3.md`, che elenca i problemi di contenuto. Questo documento riguarda la lingua: come si porta la specifica in un italiano preciso che una persona legge volentieri.*

## Il lettore

La specifica parla a chi deve implementare il motore. Il concept parla a chi deve decidere se adottarlo. Il manuale di concetto ha un terzo lettore: chi vuole usare ESPOSIZIONE per progettare e scrivere una storia.

Questa persona conosce i giochi di ruolo e la narrativa interattiva, e forse ha giocato a *Blades in the Dark* o a *Disco Elysium*. Non ha letto la specifica e non la leggerà. Non sa che cosa sono N9.c o V14, e non deve impararlo. Ha un pomeriggio e vuole capire se con questo motore la sua storia viene meglio.

Qui «tradurre» vuol dire cambiare registro senza cambiare contenuto. La bozza `Esposizione_traduzione.md` mostra perché le due cose vanno controllate separatamente: la lingua è diventata più semplice, e intanto sono entrati errori di sostanza (sezione 2).

## 1. Come parlano oggi i testi

Sette abitudini rendono la specifica e il concept faticosi per chi arriva da fuori. Molte sono tipiche dei testi scritti insieme a un modello linguistico, e tutte si correggono.

**La massima al posto della regola.** «Tutto il resto è disciplina.» «Ciò che non ha porte non è un avversario: è il mondo.» Sono belle frasi e chiudono bene un ragionamento, ma non dicono al lettore che cosa fare. Nel manuale una massima può seguire la regola; non può sostituirla.

**L'antitesi a raffica.** Nella specifica la costruzione «non è X: è Y» compare 29 volte, senza contare le varianti come «non si scrive: si compone» o «non si esaurisce, si paga». Usata una volta, colpisce. Usata dieci volte per pagina, diventa un ritmo meccanico, e il lettore comincia a sentire la formula invece del contenuto. Quasi sempre basta dire Y.

**Il testo che parla di sé.** «Va detto», «alla lettera», «in chiaro», «per costruzione», e frasi come «è la parte che distingue una presentazione da una vendita» o «tolgono forza apparente al documento». Chi apre un manuale vuole sapere come funziona il gioco, non quanto è onesto chi l'ha scritto. L'onestà si dimostra con un riquadro sui limiti, senza commentarla.

**Parole usate prima di essere spiegate.** Il concept usa «Traccia», «ceppo», «Successo pieno» e «Rovescio» prima di dire che cosa sono. Per chi arriva da fuori, ogni parola non spiegata è una porta chiusa.

**Sigle e rimandi.** N9.c, D20, V14, I7, §23.6. Alla specifica servono; nel manuale spezzano la lettura. Se un rimando serve, va in una tabella di corrispondenze separata.

**La storia delle versioni dentro le regole.** Venti riquadri «DEVIAZIONE» raccontano com'era una regola prima di cambiarla. A chi incontra il motore oggi serve sapere com'è adesso.

**Metafore usate come termini.** La preparazione «atterra», il giocatore ha una «leva», la scheda di fine partita è una «silhouette», il confronto ha una «colonna di mezzo». Come immagini funzionano. Come termini tecnici costringono il lettore a tradurre due volte.

C'è infine il grassetto: nella specifica una coppia ogni 23 parole. Quando tutto è evidenziato, niente lo è.

## 2. Che cosa è successo nella bozza

`Esposizione_traduzione.md` è più leggibile del concept, e su tono e struttura ha preso la strada giusta. Nel semplificare, però, ha cambiato il contenuto in almeno nove punti.

| La bozza scrive | Fonte | Il problema |
|---|---|---|
| «76,5% di successo» per i verbi cauti | §12.3 | è la quota di situazioni in cui la preparazione abbassa il grado, non la probabilità di riuscire; e la specifica avverte che quel numero non vale per altre finzioni |
| «milioni di scenari simulati» | nessuna | nelle fonti non c'è |
| il «pedaggio» è la riga che non conta perché sei già al massimo | §12.2 | il pedaggio è dover pagare due preparazioni per scendere di un grado |
| «Rovescio pieno» | §5 | la casella si chiama Rovescio |
| «Lo Stress (Logorio)» | §22 | dà un secondo nome alla stessa cosa |
| la festa vale Mano −1 e Voce +1, la cappella all'alba Mano +1 e Voce −1 | §32 | valori inventati: le tabelle dicono altro (rilievo 2 dell'analisi) |
| freno e smaltimento: «ogni quanti passi le complicazioni scendono di intensità» | §27, voce 14 | descrive solo lo smaltimento; il freno è il grado oltre il quale l'esposizione smette di far aumentare gli imprevisti |
| il confronto su tre generi «dimostra che il livello di astrazione è solido e funzionante»; «la matematica garantisce che il mondo reagisca sempre con coerenza» | §30.3, §31 | le istanziazioni sono state riempite, non giocate |
| il sistema bistabile reggeva «finché il giocatore giocava con prudenza» | §27.2 | reggeva finché non capitava una brutta giornata: la causa è la sfortuna, non l'imprudenza |

La bozza ha anche tolto quasi tutti i «Costa:», cioè i prezzi che la specifica dichiara accanto a ogni scelta. Per chi progetta sono la parte più utile.

La lezione riguarda il metodo. Semplificare e verificare sono due passate distinte, e la seconda va fatta su ogni paragrafo.

## 3. Dieci regole per il manuale

1. **Un solo lettore.** Scrivi per chi progetta e scrive una storia. Chi deve programmare ha la specifica.
2. **Prima la scena, poi la regola, poi il perché.** Ogni capitolo si apre con un momento di gioco concreto. La regola arriva quando il lettore ha già visto che cosa produce.
3. **Una scena che torna.** Usa lo stesso esempio per tutto il manuale, per esempio una lettera da sottrarre durante un ricevimento. Il lettore impara una storia sola e vede il motore cambiare intorno a lei.
4. **Una parola, un significato.** Usa solo i termini del glossario, sempre nella stessa forma. In un manuale il sinonimo messo per variare fa pensare a una cosa diversa.
5. **Definisci prima di usare.** La frase in cui una parola compare per la prima volta la spiega.
6. **La regola come istruzione.** «Se la somma supera allo scoperto, il grado resta allo scoperto.» La massima, se proprio serve, viene dopo.
7. **Numeri che il lettore può rifare.** Entrano solo numeri ricalcolabili dalle tabelle del manuale stesso. Un numero misurato su una finzione sola porta scritto da dove viene.
8. **Tre cose tenute separate.** Come funziona; perché è fatto così; che cosa non sappiamo ancora. La storia delle versioni resta fuori.
9. **Dai del tu a chi legge.** «Scegli otto opzioni», «il tuo personaggio». La forma impersonale («si compila», «si deriva») va bene per le regole generali, con misura.
10. **Il prezzo accanto al vantaggio.** Ogni volta che presenti una scelta, di' anche che cosa costa. È la qualità migliore della specifica, e il manuale deve conservarla.

E alcune convenzioni tipografiche, da decidere una volta per tutte: virgolette basse «» per le citazioni e le parole dette; un solo tipo di apostrofo in tutto il testo; il segno meno vero (−1) nei valori; la virgola nei decimali (2,2); il simbolo di percentuale attaccato al numero (45%); il grassetto solo per il termine che viene definito in quel punto.

## 4. Il glossario

Le voci segnate *proposta* cambiano un termine della specifica e richiedono una tua decisione. Nel manuale il termine della specifica compare una sola volta, tra parentesi, dove la parola viene definita.

### Il tiro e il costo

| Nel manuale | Che cosa vuol dire | Nella specifica | Da evitare |
|---|---|---|---|
| prova | un tentativo che si risolve col dado | prova, tiro, tentativo | check, tiro come sinonimo |
| riesci / non riesci | la risposta del dado | Esito | «successo» e «fallimento» da soli, che sono anche nomi di caselle |
| esposizione | quanto ti può costare l'azione che stai per fare, comunque vada il dado | Esposizione | rischio, pericolo, visibilità |
| al coperto · esposto · allo scoperto *(proposta)* | i tre gradi dell'esposizione; due su tre non cambiano col genere | Coperto · Esposto · Allo scoperto | i numeri 0, 1, 2 nel testo corrente |
| grado | uno dei tre livelli dell'esposizione | livello, gradino | gradino |
| le sei caselle | Successo pieno, Successo sporco, Successo a caro prezzo, Fallimento pulito, Rovescio minore, Rovescio | la griglia (N2) | Rovescio pieno, critico |

### La scheda e le tabelle

| Nel manuale | Che cosa vuol dire | Nella specifica | Da evitare |
|---|---|---|---|
| verbo | un'azione che il personaggio sa fare: Persuadere, Sottrarre | verbo | abilità, skill |
| livello di competenza | quanto bene sai fare un verbo, da Inesperto a Maestro | scala di competenza | gradino |
| ambito *(proposta)* | la famiglia a cui appartiene un verbo: corpo, mano, mente, voce | ceppo | categoria, famiglia (già usata per le aggravanti) |
| esposizione di partenza | quanto un verbo espone di suo, prima di guardare dove e quando | base | base da sola |
| Fondo | il grado sotto cui un verbo non scende mai, per quanto ti prepari | Fondo | pavimento, che nella specifica indica un'altra cosa (il dado A2) |
| luogo · momento | dove e quando agisci; ognuno ha un valore per ambito | Luogo · Momento | |
| aggravante | un fatto del mondo che alza il grado di uno | aggravante | malus |
| preparazione | ciò che fai prima di agire per abbassare il grado di uno; nella ricevuta è un'attenuante | attenuante | bonus, leva |
| ricevuta | l'elenco delle cause del grado, riga per riga, mostrato prima di agire | ricevuta | |
| tetto | allo scoperto è il massimo; ciò che spinge oltre non aggiunge niente | saturazione | saturazione |
| riga che non conta | una riga della ricevuta che non cambia il grado | voce inerte | inerte |
| preparazione che non basta | serve una seconda preparazione per scendere di un grado | pedaggio | atterrare; «pedaggio» senza definizione |

### Dopo il tiro

| Nel manuale | Che cosa vuol dire | Nella specifica | Da evitare |
|---|---|---|---|
| obiettivo · costo · Traccia · conoscenza | le quattro cose che un esito può cambiare | i quattro assi della conseguenza | «asse», che confonde con i due assi del tiro |
| Traccia | ciò che il mondo ricorda di te; alza l'esposizione delle prove successive | Traccia | reputazione, attenzione; «traccia» in qualunque altro senso |
| tacca *(proposta)* | l'unità con cui salgono e scendono Traccia e logorio | gradino | gradino |
| logorio | ciò che sale da solo, come fame, credito o pressione, e ha un rimedio | logorio | stress |
| indicatore di logorio | uno dei logorii dichiarati, con i suoi gradi a parole | «una traccia per ogni rimedio» | traccia |
| danno | una ferita, o una macchia, che ti impedisce certi verbi | danno | |
| imprevisto | un evento che capita tanto più spesso quanto più sei esposto | imprevisto | evento casuale |
| smaltimento | ogni quanti passi la Traccia cala di una tacca | smaltimento | |
| freno | il grado oltre il quale l'esposizione smette di far aumentare gli imprevisti | freno | |

### Scene, strade, tempo

| Nel manuale | Che cosa vuol dire | Nella specifica | Da evitare |
|---|---|---|---|
| scena | un momento della storia | nodo | nodo |
| ostacolo | una scena che si può affrontare da più vie | ostacolo | |
| via | uno dei modi di affrontare un ostacolo, con il suo verbo | via | opzione |
| via povera | la via che c'è sempre: costa, e non si tira | via senza prerequisiti | |
| prova ritentabile · prova da un colpo solo | si può ritentare se qualcosa è cambiato · si tenta una volta e segna la partita | aperta · sigillata | |
| cornice *(proposta)* | la struttura del tempo della storia: un percorso, una stagione, un caso, un incarico | contenitore | contenitore |
| passo · frazione | l'unità di tempo della cornice, e le sue parti | passo · frazione | turno |
| anteprima *(proposta)* | ciò che puoi sapere in anticipo su un passo, con tre livelli di dettaglio | profilo a tre risoluzioni | profilo |
| repertorio delle complicazioni *(proposta)* | le frasi e gli eventi che il gioco pesca dopo un esito | banco | banco |
| intervento dell'autore: nessuno · ritocco · scrittura piena | quanto l'autore interviene su una scena | gradini di autorialità 0, 1, 2 | gradino |

### Adattare il motore

| Nel manuale | Che cosa vuol dire | Nella specifica | Da evitare |
|---|---|---|---|
| nucleo | le regole che non cambiano mai | nucleo | |
| modulo · opzione | una parte che si configura · una delle scelte possibili per quella parte | modulo · profilo | profilo |
| scheda dell'ambientazione | le otto scelte e le voci da compilare | firma | firma |
| scheda del verbo | nome, ambito, esposizione di partenza, Fondo | firma di un verbo | firma |

### Il confronto

| Nel manuale | Che cosa vuol dire | Nella specifica | Da evitare |
|---|---|---|---|
| confronto | un ostacolo che reagisce | confronto | combattimento, che ne è solo un caso |
| chi si chiude · chi avanza | le due nature di un avversario | le due nature | |
| scheda dell'avversario | le quattro domande: che cosa lo copre, che cosa lo scopre, che cosa costa avvicinarlo, che cosa vuole | firma di un avversario | firma |
| punto debole *(proposta)* | ciò che scopre un avversario, e di quanti gradi | «cosa lo scopre», leva | leva |
| finestra | il momento in cui l'avversario è allo scoperto e decidi tu come finisce | finestra | |
| non può · non vuole · non c'è | i tre modi in cui finisce un confronto | le tre famiglie | |
| l'accordo | la fine per rinuncia, la più frequente | colonna di mezzo | colonna di mezzo |

Resta un caso da decidere: il nome del motore e il nome del grado coincidono. Una soluzione semplice è scrivere ESPOSIZIONE, in maiuscolo come nel logotipo, quando si parla del motore, ed esposizione, in minuscolo, quando si parla del grado.

## 5. Prima e dopo

Sei passi presi dai testi attuali, riscritti con le regole della sezione 3. I termini seguono il glossario, comprese le proposte.

**Le due domande** (concept, §3)

> *Prima.* Un tentativo pone due domande, non una. La prima — riesci o no — la decide il dado, ed è binaria. La seconda non la tira nessuno: è determinata da come ci sei arrivato, e misura quanto la situazione ha presa su di te.

> *Dopo.* Quando il tuo personaggio tenta qualcosa di rischioso, il gioco risponde a due domande separate. La prima è se ci riesce: la decide il dado, e la risposta è sì o no. La seconda è quanto gli costerà, comunque vada. Su questa il dado non ha voce: contano che cosa fa, dove e quando lo fa, e come si è preparato. La risposta ha tre gradi: al coperto, esposto, allo scoperto.

**Il Fondo** (specifica, §9)

> *Prima.* Tre valori possibili, e due dicono la stessa cosa in modi diversi: *Coperto* significa nessun fondo — con la preparazione giusta si può fare pulito; *Esposto* significa non si può mai fare pulito; *Allo scoperto* significa che niente aiuta, mai.

> *Dopo.* Ogni verbo ha un Fondo: il grado più basso che quell'azione può avere, anche con la migliore preparazione. Con il Fondo al coperto, se ti prepari bene puoi agire senza lasciare segni. Con il Fondo esposto qualcosa resta sempre: puoi ridurre il rischio, non annullarlo. Con il Fondo allo scoperto la preparazione non serve, e quell'azione costa sempre il massimo.

**Le inversioni** (specifica, §10.2). I valori del *dopo* sono quelli della tabella corretta il 23 settembre (analisi, rilievo 2).

> *Prima.* Le inversioni sono la parte interessante di tutte e tre le tabelle. Una folla nasconde le mani e scopre la voce. […] E soprattutto diventerebbe inesprimibile qualunque regola che contenga due segni opposti nello stesso momento — che sono le regole migliori che un'ambientazione possiede.

> *Dopo.* Un luogo o un momento non è pericoloso o sicuro in generale: dipende da che cosa ci fai. Per questo le tabelle dei luoghi e dei momenti hanno una colonna per ogni ambito. Durante un ricevimento affollato la ressa copre chi sfila una lettera da una tasca, quindi nella colonna Mano il ricevimento vale −1. Chi invece sparge una voce ha intorno troppe orecchie, e nella colonna Voce il ricevimento vale +1. All'alba succede il contrario: Mano +1, Voce −1. Nessuno ha scritto la regola «ruba alla festa, sussurra all'alba». Il gioco la ricava sommando i valori, e tu la scopri giocando.

**La preparazione che non basta** (specifica, §12.2)

> *Prima.* Il difetto è il pedaggio: il primo gradino non atterra e il secondo sì, quindi bisogna pagarne due per ottenerne uno. E la ricevuta oggi non lo dichiara.

> *Dopo.* A volte una preparazione sola non basta. Se le aggravanti ti spingono oltre allo scoperto, la prima preparazione ti riporta soltanto al tetto e il grado non cambia. Ne serve una seconda per scendere a esposto. La ricevuta te lo dice prima che tu agisca, sulla riga della preparazione: «non basta: ne servirebbe un'altra».

**Il confronto** (concept, §7)

> *Prima.* La domanda *quanto gli manca* non esiste. Esiste *quanto è coperto*. L'Esposizione è reciproca, e i due lati fanno mestieri diversi: la tua decide cosa ti costa, la sua decide se l'azione decisiva vale qualcosa.

> *Dopo.* Nel confronto l'avversario non ha punti vita. Ha un grado di esposizione, come te. Il tuo dice quanto rischi a ogni mossa. Il suo dice se puoi chiudere la partita. Finché lui è al coperto, un colpo decisivo non va a segno. Quando lo porti allo scoperto si apre la finestra: per un momento decidi tu come finisce.

**I limiti** (concept, §10)

> *Prima.* Va detto anche quello che le misure **non** hanno risolto, perché è la parte che distingue una presentazione da una vendita. La scala satura, e la saturazione non si riduce.

> *Dopo.* Due cose le misure non le hanno risolte. La prima: con tre gradi soltanto, molte situazioni finiscono al tetto, e nessuna tabella cambia questo fatto. La seconda: […]

Il sesto esempio è il più corto perché toglie il commento e lascia il contenuto.

## 6. Una scaletta per il manuale

La scena che torna è sempre la stessa: la lettera da sottrarre durante il ricevimento, con i numeri corretti.

1. **Una partita in una pagina.** La scena raccontata dal punto di vista di chi gioca, con la ricevuta e il tiro, senza spiegare niente.
2. **Due domande.** Riesci, e quanto ti costa. Le sei caselle, ciascuna con un esito della stessa scena.
3. **Da dove viene il grado.** Verbo, luogo, momento, con una tabella piccola e i conti fatti davanti al lettore.
4. **La ricevuta.** Come si legge, il tetto, la riga che non conta, la preparazione che non basta.
5. **Prepararsi.** Aggravanti e preparazioni; il Fondo; perché la leva del giocatore è l'esposizione e non il dado.
6. **Che cosa resta dopo.** Obiettivo, costo, Traccia, conoscenza. La Traccia che sale e si smaltisce; gli imprevisti; il freno.
7. **Ritentare, e la via che c'è sempre.** Prove ritentabili e da un colpo solo; la via povera.
8. **Crescere.** La competenza che fa risparmiare tentativi, con i numeri veri della tabella di competenza.
9. **Il confronto.** Le due nature, la finestra, i tre modi in cui finisce.
10. **Adattare il motore alla tua storia.** Le otto scelte e le voci da compilare, con il riquadro sulle voci che mancano (analisi, rilievo 4).
11. **Che cosa il motore non fa, e perché.**
12. **Dove non funziona.**
13. **Che cosa è provato e che cosa no.** Questo capitolo si può anche mettere in apertura, come riquadro.
14. **Glossario.**
15. **Da dove viene ogni regola.** La tabella di corrispondenze fra capitoli del manuale e paragrafi della specifica, per chi vuole scendere.

## 7. Prima di pubblicare

Una lista di controllo per ogni capitolo.

- [ ] Ogni numero è stato ricalcolato a mano, o con il validatore quando esisterà, a partire dalle tabelle del manuale.
- [ ] Ogni paragrafo ha il suo paragrafo di provenienza nella tabella di corrispondenze.
- [ ] Nessuna parola esce dal glossario, e nessun termine ha un sinonimo.
- [ ] Nessun prezzo è andato perso: ogni vantaggio ha accanto il suo costo.
- [ ] Nessuna affermazione su cose non provate compare senza una parola che lo dica.
- [ ] Nessuna frase commenta il documento invece di spiegare il gioco.
- [ ] La prova della persona. Dai il capitolo a qualcuno che non conosce il progetto e chiedigli di rispiegarti la regola a voce, poi di dirti che cosa succede nella scena di esempio se cambi il momento. Se sbaglia, il capitolo è da riscrivere. È la stessa idea del banco umano della specifica (§30.3), applicata al manuale.
