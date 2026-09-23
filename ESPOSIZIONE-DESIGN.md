# ESPOSIZIONE

### Documento di design 2.0

#### Un motore per romanzi di ruolo ramificati, su carta e su schermo

> Il dado decide se riesci. Tu decidi quanto rischi.

---

## Come leggere questo documento

Questo documento descrive ESPOSIZIONE, un motore per scrivere e giocare romanzi di ruolo: storie lunghe e ramificate, in cui un protagonista esplora, indaga, tratta e sceglie, e in cui i dadi decidono se un'azione riesce. Contiene tutte le regole, spiegate con esempi, e tutto ciò che serve per costruire una storia.

Lo stesso motore funziona in tre formati, con gli stessi numeri:

- **il librogame**, in cui chi legge gioca da solo, con paragrafi numerati, una scheda a matita e due dadi;
- **il tavolo**, in cui un narratore conduce e uno o più giocatori decidono;
- **il digitale**, in cui il programma fa i conti e mostra tutto sullo schermo: può essere un gioco fatto di solo testo, ma anche un gioco grafico, come un'avventura illustrata, un punta e clicca, un gioco di ruolo con una mappa da esplorare in due o tre dimensioni.

Una storia scritta per un formato si porta negli altri senza cambiare le regole. Il motore decide che cosa succede; come mostrarlo, con parole o con immagini, lo decide chi costruisce il gioco.

Il documento ha sette parti e quattro appendici. Le parti I e II spiegano l'idea e come si gioca; la III e la IV le regole della prova e del pericolo; la V la crescita del personaggio; la VI come si scrive una storia; la VII i limiti e le verifiche. L'appendice B contiene un'ambientazione d'esempio compilata per intero, e l'appendice C il glossario.

**Che cosa è provato e che cosa no.** Al 23 settembre 2026 nessuna persona ha ancora giocato una partita con queste regole. I conti di questo documento sono verificabili a mano, e i principi vengono da una versione precedente del motore, misurata con giocatori automatici su una sola storia. Le promesse che contano di più (che le scelte pesino più dei dadi, che la ricevuta insegni il gioco mentre lo si gioca) aspettano ancora la prova con persone vere. Il modo di farla è descritto alla fine, nella Parte VII.

---
---

# PARTE I — L'IDEA

## 1. Che cosa vogliamo costruire

Vogliamo un motore con cui si possano scrivere romanzi da giocare. Il lettore non assiste alla storia: la attraversa. Sceglie dove andare, con chi parlare, che cosa rischiare, e la storia si ricorda di tutto.

Cinque promesse guidano ogni regola di questo documento.

1. **Le scelte contano più dei dadi.** Il dado decide soltanto se riesci. Quanto ti costa provarci lo decidi tu, scegliendo dove, quando e come agire, e il gioco te lo mostra prima che tu tiri.
2. **Il mondo ricorda.** Ogni cosa che fai lascia qualità nella storia: un fatto, un sospetto, un debito, un'amicizia. Sono le qualità ad aprire e chiudere le scene, e per questo due partite non si somigliano.
3. **Esplorare paga.** Chi esplora trova conoscenze, accessi, persone e strade nuove. Non guadagna punti: guadagna possibilità.
4. **La violenza è reale.** Un colpo di coltello può uccidere. Il motore non ha punti ferita: la violenza è una scommessa da cui si può non tornare, e le storie scritte con questo motore la trattano come l'ultima risorsa. Nessuno però muore senza essere stato avvisato.
5. **Non resti mai bloccato.** Davanti a ogni ostacolo c'è sempre almeno una strada che non richiede il dado. Costa, ma c'è.

«Romanzo» qui indica la forma della storia, non il modo di mostrarla. Un romanzo di ruolo è una storia lunga, con personaggi che ricordano, scelte che pesano e conseguenze che restano. Si può leggere sulla pagina, raccontare al tavolo, oppure attraversare in un gioco grafico, dove i luoghi sono stanze e mappe, le vie sono oggetti e persone con cui interagire, e la ricevuta è un pannello che compare prima di agire. Il §22.4 spiega come.

Il motore non fa alcune cose, per scelta:

- non ha punti ferita né barre da svuotare;
- non ha nemici che salgono di livello insieme a te;
- non ha classi, né alberi di talenti;
- non tira mai contro di te: i dadi li tira sempre e soltanto chi gioca;
- non genera testo mentre giochi: ogni frase è stata scritta, o almeno riletta e approvata, da chi ha scritto la storia.

## 2. Una scena giocata

Prima delle regole, una scena. Viene dall'ambientazione d'esempio dell'appendice B: una città di porto, un fratello scomparso, una nave che sta per salpare.

*È l'alba. Sei nell'archivio della capitaneria. Il salone è pieno di capitani che protestano per le tariffe del porto, e l'archivista non sa più chi ascoltare. Sul banco, aperto, c'è il registro degli imbarchi: se tuo fratello Matteo è salito su una nave, il suo nome è lì dentro.*

Il gioco ti offre tre vie.

**Prendere il registro di nascosto.** È un'azione di *Sottrarre*, e prima di decidere vedi la ricevuta:

```
Sottrarre il registro
    0   Sottrarre, di suo, non si nota
   +1   nell'archivio chi tocca le carte viene guardato   — non conta: saresti comunque al coperto
   −1   all'alba la confusione del mercato copre le mani
  ───
    0   AL COPERTO
Prova: Impegnativa (8). Sei Pratico in Sottrarre (+1): riesci 58 volte su 100.
```

**Chiedere all'archivista.** È un'azione di *Persuadere*:

```
Persuadere l'archivista
    1   chi viene convinto sa di esserlo
   −1   all'alba il rumore copre le parole   — non conta: più in basso di esposto non si scende
  ───
    0   ESPOSTO   (Persuadere non scende sotto esposto)
Prova: Impegnativa (8). Sei Inesperto in Persuadere (+0): riesci 42 volte su 100.
```

**Pagare un facchino** perché ti dica che cosa sa della nave. Non si tira: costa due monete e un'ora e mezza, e ti dà soltanto metà della risposta, cioè la destinazione e non i nomi.

Scegli il registro. Tiri due dadi: 4 e 3, sette. Aggiungi 1 perché sei Pratico: otto, quanto serve. Riesci, e sei al coperto: nessuno ti ha visto. Nel registro trovi il nome di Matteo, imbarcato sulla *Santa Rita*. La nave salpa stanotte.

Se fossi entrato di notte, a archivio chiuso, i conti sarebbero stati diversi. Intrufolarti dentro (*Muoversi*) sarebbe stato facile, perché il buio copre il corpo. Prendere il registro nel silenzio, invece, ti avrebbe messo allo scoperto, perché di notte ogni rumore di carte si sente. Nessuno ha scritto questa regola: l'hai trovata tu, leggendo due ricevute.

In questa scena c'è quasi tutto il motore: due domande separate (se riesci, quanto ti costa), un costo che dipende da dove e quando agisci, una ricevuta che te lo mostra prima, una strada che non si tira, e una storia che si ricorda che adesso hai il registro.

## 3. Da dove viene questo motore

Il motore prende idee da giochi che le hanno inventate prima, e lo dichiara: *Powered by the Apocalypse* per il fallimento che fa andare avanti la storia; *Blades in the Dark* per la posizione dichiarata prima di agire; *Genesys* per la riuscita separata dalle complicazioni; *Disco Elysium* per la differenza fra prove che si possono ritentare e prove che segnano la partita; *Fallen London* per le qualità che aprono e chiudono la storia; *Fabled Lands* per le parole chiave sulla scheda di un librogame.

Aggiunge a queste idee una cosa sua: **il costo di un'azione non lo decide l'autore scena per scena, lo ricava il gioco da tabelle scritte una volta sola**, e le tabelle distinguono che cosa stai facendo. Per questo lo stesso luogo può essere ottimo per un'azione e pessimo per un'altra, come l'archivio all'alba.

---
---

# PARTE II — IL PERSONAGGIO E LA STORIA

## 4. Le qualità

Tutto ciò che il gioco ricorda è una **qualità**. Ce ne sono di due tipi: quelle del personaggio, che dicono che cosa sa fare e come sta, e quelle della storia, che dicono che cosa è successo.

### 4.1 Le capacità

Una **capacità** è un'azione che il personaggio sa fare: *Sottrarre*, *Persuadere*, *Osservare*. La scheda del personaggio è un elenco di capacità, e non contiene forza, destrezza o intelligenza: un personaggio si descrive con quello che sa fare.

Ogni capacità ha quattro dati:

| Dato | Che cosa dice | Esempio: *Persuadere* |
|---|---|---|
| **nome** | che cosa fai | convincere, trattare, chiedere |
| **ambito** | di che genere di azione si tratta: corpo, mano, mente, voce, o gli ambiti che l'ambientazione sceglie | voce |
| **partenza** | quanto l'azione espone di suo, prima di guardare dove e quando la fai: 0, 1 o 2 | 1 |
| **Fondo** | il grado sotto il quale l'azione non scende mai, per quanto ti prepari: 0, 1 o 2 | 1 |

Il Fondo non può essere più alto della partenza.

Il personaggio ha un **livello** in ogni capacità:

| Livello | Bonus | Che cosa significa |
|---|---|---|
| Inesperto | +0 | non l'hai mai fatto davvero |
| Pratico | +1 | sai farlo |
| Esperto | +2 | l'hai fatto molte volte, anche sotto pressione |
| Maestro | +3 | te l'ha insegnato qualcuno che ne sapeva più di te |

Un'ambientazione ha da 8 a 14 capacità, divise in 3–5 ambiti, con almeno due capacità per ambito. Sotto le otto, le strade davanti a un ostacolo si somigliano troppo; sopra le quattordici, chi gioca non ricorda la propria scheda.

### 4.2 Le condizioni

Le **condizioni** dicono come sta il personaggio. Sono di due tipi, descritti nella Parte IV: il **logorio**, cioè ciò che sale da solo (la fatica, la fame, i nervi), e le **ferite**, cioè ciò che ti succede e che ti impedisce qualcosa.

### 4.3 Le qualità della storia

| Tipo | Che cosa ricorda | Sulla carta | Esempio |
|---|---|---|---|
| **Fatto** | una cosa successa o posseduta, sì o no | una parola chiave sulla scheda | HAI IL REGISTRO |
| **Misura** | una quantità piccola, da 0 a 5 | una fila di caselle | Fiducia dell'archivista: 2 |
| **Conoscenza** | una cosa che sai, o credi di sapere | una riga nel taccuino | «Matteo è salito sulla *Santa Rita*» |
| **Traccia** | quanto ti hanno notato in una zona, da 0 a 3 | tre caselle per zona | Archivio: 1 |
| **Oggetto** | una cosa che porti | una riga nell'inventario | un coltello, due monete |
| **Filo** | a che punto è una delle storie in corso | una fila di caselle | Il fratello: 2 su 5 |
| **Scadenza** | quanto manca a qualcosa che accadrà comunque | una fila di caselle da annerire | La *Santa Rita* salpa: 5 su 8 |

Una conoscenza può essere vera, incompleta o falsa, e chi gioca non sa quale. È uno degli strumenti migliori per chi scrive: un indizio sbagliato crea una storia. Ha un solo limite, che non si discute: **una conoscenza falsa non entra mai nella ricevuta.** Il gioco può farti credere una cosa sbagliata sul mondo, mai una cosa sbagliata su quanto ti costerà agire.

### 4.4 Come le qualità aprono e chiudono la storia

Ogni scena e ogni scelta possono avere **requisiti**, cioè condizioni sulle qualità: «se hai il registro», «se la Fiducia dell'archivista è almeno 2», «se non hai ancora parlato con il capitano». E ogni esito ha **effetti**: aggiunge o toglie fatti, sposta misure, fa avanzare fili.

È così che la storia si ramifica senza moltiplicare le pagine. Due lettori arrivano nella stessa taverna, ma uno ha il registro e l'altro no, uno ha lasciato Traccia al porto e l'altro no: la taverna offre loro scelte diverse, e l'oste li tratta in modo diverso. I rami si ricongiungono nei luoghi, ma si portano dietro la memoria di come ci si è arrivati.

Tre regole tengono in ordine le qualità.

- **Le scelte chiuse si vedono.** Se una scelta non è disponibile perché ti manca un requisito, il gioco la mostra lo stesso, con il requisito accanto: «Richiede: conoscere il nome del notaio». Così chi gioca capisce che il mondo è più grande di quello che ha visto, e sa che cosa cercare.
- **Ogni qualità scritta viene letta.** Una qualità che nessuna scena controlla non serve a niente e confonde chi scrive. Il controllo 13 della Parte VI la segnala.
- **Le scadenze si vedono.** Chi gioca sa sempre che cosa sta per succedere e quanto manca, anche se non sa che cosa troverà.

## 5. Lo spazio e il tempo

### 5.1 Luoghi, zone e passi

La storia si svolge in **luoghi**: l'archivio, la banchina, la taverna. Ogni luogo appartiene a una **zona**, che è l'unità in cui il gioco ricorda la Traccia. Nella maggior parte delle ambientazioni ogni luogo è una zona.

Il tempo avanza a **passi**. L'ambientazione dice quanto dura un passo (nel porto dell'appendice B, circa un'ora e mezza). Consumano un passo: spostarsi fra due luoghi vicini, ritentare una prova, riposare, aspettare, studiare. Il tempo non scorre mentre chi gioca pensa: scorre solo quando decide.

Ogni passo succedono quattro cose, sempre nello stesso ordine:

1. le scadenze avanzano di una casella, se l'ambientazione lo prevede;
2. il logorio sale, se è il suo turno (Parte IV);
3. la Traccia cala nelle zone dove non ne hai lasciata di nuova (Parte IV);
4. nella zona in cui sei, controlli se arriva un imprevisto (Parte IV).

### 5.2 Momenti

Il giorno è diviso in **momenti**: nel porto l'alba, il giorno, la sera e la notte, di quattro passi ciascuno. Come i luoghi, anche i momenti cambiano il costo delle azioni, e lo fanno in modo diverso per ogni ambito (Parte III, §8).

### 5.3 Esplorare

Un luogo si conosce a tre livelli:

| Livello | Che cosa sai |
|---|---|
| **Ne hai sentito parlare** | che esiste, e come arrivarci |
| **Ci sei stato** | come è fatto: le sue righe nella ricevuta non sono più una sorpresa |
| **Lo conosci bene** | i suoi segreti: una porta sul retro, una persona che ti deve un favore, un'ora in cui è vuoto |

Prima di andare in un luogo che conosci poco puoi sbagliarti su quanto ti esporrà. Quando ci sei, la ricevuta è sempre esatta.

Esplorare non dà punti. Dà conoscenze, accessi, persone e oggetti, cioè nuove strade davanti agli ostacoli. È il motivo per cui conviene farlo.

## 6. La struttura del racconto

### 6.1 Scene, ostacoli, vie

Una **scena** è un'unità della storia: una situazione e le scelte che offre. Sulla carta è un paragrafo, in un gioco testuale una schermata, in un gioco grafico una stanza o un'inquadratura, al tavolo un momento di gioco.

Un **ostacolo** è una scena in cui qualcosa ti sbarra la strada. Si affronta da più **vie**, e ogni via ha la sua capacità, la sua soglia, il suo costo. Scegliere la via conta quanto il tiro: nella scena dell'archivio, rubare e chiedere sono due scommesse diverse sullo stesso registro.

### 6.2 La via povera

> **Ogni ostacolo ha almeno una via che non si tira. È sempre disponibile e costa sempre qualcosa.**

La via povera costa tempo, denaro, un favore, una parte di ciò che volevi. Non è mai la migliore, ma c'è sempre. Senza di essa un ostacolo si trasforma in un muro con un dado davanti: chi fallisce il tiro resta fermo, e la storia si interrompe. Con la via povera la difficoltà diventa un prezzo.

### 6.3 Fili e scadenze

Una storia lunga ha più **fili**: il fratello scomparso, il debito con l'usuraio, l'amicizia con il pilota del porto. Ogni filo avanza per tappe, e le scene successive richiedono che il filo sia arrivato a un certo punto.

Le **scadenze** sono ciò che succederà comunque: la nave salpa, l'usuraio perde la pazienza, il processo comincia. Tengono viva la pressione e impediscono di aspettare all'infinito. Prepararsi con calma è quasi sempre possibile, ma costa passi, e i passi fanno avanzare le scadenze.

### 6.4 Snodi

Uno **snodo** è una scelta che non si disfa: tradire qualcuno, lasciare la città, salire sulla nave. Gli snodi li scrive l'autore uno per uno, con testi propri, e il gioco li segnala a chi gioca come scelte senza ritorno. Il resto della storia, cioè ciò che si può recuperare, lo governano le regole.

> **Le regole governano ciò che si può recuperare. L'autore governa ciò che non si recupera.**

### 6.5 Ramificare senza esplodere

Una storia a bivi scritta a paragrafi raddoppia a ogni scelta, e dopo dieci bivi è impossibile da scrivere. Questo motore evita il problema in tre modi.

- **Le conseguenze diventano qualità, non rami.** Invece di scrivere due seguiti, uno per chi ha rubato il registro e uno per chi l'ha chiesto, scrivi un seguito solo che legge la qualità e cambia ciò che serve.
- **I luoghi sono punti d'incontro.** I percorsi si separano e si ritrovano nei luoghi, portandosi dietro Traccia, conoscenze e fatti diversi.
- **I costi li calcolano le tabelle.** L'autore non deve decidere, scena per scena, quanto è rischiosa ogni azione: lo decide una volta, compilando le tabelle dell'ambientazione.

---
---

# PARTE III — LA PROVA

## 7. Quando si tira

Si tira solo quando valgono tutte e due queste condizioni.

1. **C'è una pressione.** Qualcuno si oppone, c'è fretta, o fallire ha un prezzo. Se hai tutto il tempo che vuoi e nessuno ti ostacola, non tiri: riesci, e paghi in tempo. L'ambientazione dice quanti passi costa fare le cose con calma (nel porto, due).
2. **Tutti e due gli esiti portano da qualche parte.** Se fallire significa «non succede niente, riprova», non è una prova: è un costo, e si paga senza dado.

Queste due regole tolgono di mezzo la maggior parte dei tiri inutili, e impediscono di ripetere un'azione soltanto per allenarsi.

## 8. Il tiro

> **Due dadi a sei facce, più il livello della capacità. Se il totale raggiunge la soglia, riesci.**

La soglia dipende da quanto è difficile la cosa, non da quanto sei esposto:

| Soglia | Numero | Esempio nel porto |
|---|---|---|
| Facile | 6 | aprire la porta chiusa a chiave di una casa |
| Impegnativa | 8 | una serratura di magazzino, un archivista sospettoso |
| Ardua | 10 | la cassaforte della capitaneria, un ufficiale della guardia |
| Estrema | 12 | la serratura della dogana reale, far confessare chi rischia la forca |

Le probabilità di riuscire, in percentuale:

| | Facile (6) | Impegnativa (8) | Ardua (10) | Estrema (12) |
|---|---|---|---|---|
| **Inesperto (+0)** | 72 | 42 | 17 | 3 |
| **Pratico (+1)** | 83 | 58 | 28 | 8 |
| **Esperto (+2)** | 92 | 72 | 42 | 17 |
| **Maestro (+3)** | 97 | 83 | 58 | 28 |

Salire di due livelli vale quanto scendere di una soglia. I due dadi fanno sì che i risultati medi escano più spesso degli estremi: un Maestro sbaglia raramente una cosa facile, e chi non ha mai fatto una cosa difficile raramente la indovina. È una scelta di realismo.

### 8.1 Da dove viene la soglia

Le soglie non si inventano scena per scena. Ogni ambientazione ha un **catalogo delle soglie**: un elenco di cose del mondo con la loro difficoltà, come la tabella qui sopra, ma completo. L'autore che scrive un ostacolo cerca la cosa nel catalogo; se non c'è, la aggiunge al catalogo, e da quel momento vale per tutta la storia.

Il catalogo fa due cose. Tiene coerenti autori diversi: la serratura di un magazzino è Impegnativa in ogni capitolo. E impedisce alla difficoltà di crescere di nascosto: se al decimo capitolo tutte le serrature fossero diventate Estreme, il catalogo lo mostrerebbe. **La difficoltà non cresce insieme al personaggio.** Chi torna davanti alla porta che non riusciva ad aprire la trova uguale, ed è così che si accorge di essere cresciuto.

### 8.2 Penalità

Alcune condizioni tolgono punti al tiro: una ferita lieve all'ambito della capacità toglie 1, un logorio all'ultimo stadio toglie 1 a tutte le prove (Parte IV). Le penalità si sommano, fino a un massimo di −3.

## 9. L'esposizione

Il dado risponde a una domanda: riesci? L'**esposizione** risponde all'altra: quanto ti costa, comunque vada?

Ha tre gradi:

| Grado | Valore | Che cosa significa |
|---|---|---|
| **al coperto** | 0 | la situazione non ha presa su di te: il peggio che può capitarti è non riuscire |
| **esposto** / **esposta** | 1 | la situazione può prenderti: anche se riesci, qualcosa resta |
| **allo scoperto** | 2 | qualunque cosa accada, accade dove conta |

Ogni ambientazione dice che cosa significa essere esposti nel suo mondo, con una frase. Nel porto: *essere esposti significa che qualcuno potrà dire di averti visto*. In una storia di corte potrebbe essere *quanto un gesto si può attribuire a te*; in una storia di magia, *quanto di te resta attaccato alla cosa che hai toccato*.

> **L'esposizione non cambia mai la probabilità di riuscire una prova.** Cambia che cosa succede dopo, e quante volte il mondo ti viene addosso.

### 9.1 Come si calcola

L'esposizione di un'azione è una somma:

```
somma = partenza della capacità
      + valore del luogo per quell'ambito
      + valore del momento per quell'ambito
      + 1 per ogni aggravante
      − 1 per ogni preparazione
```

Poi la somma si tiene dentro la scala: se è sotto il Fondo della capacità il grado è il Fondo, se è sopra 2 il grado è 2, altrimenti il grado è la somma.

### 9.2 Luoghi e momenti: un valore per ambito

Un luogo non è pericoloso o sicuro in generale: dipende da che cosa ci fai. Per questo la tabella dei luoghi ha una colonna per ogni ambito, e ogni casella vale −1, 0 o +1. Lo stesso vale per i momenti.

| Luogo | Corpo | Mano | Mente | Voce |
|---|---|---|---|---|
| L'archivio della capitaneria | +1 | +1 | −1 | 0 |

L'archivio espone chi si muove dove non dovrebbe e chi tocca le carte degli altri; copre chi legge, perché leggere è ciò che tutti fanno lì; non dice niente di particolare su chi parla.

| Momento | Corpo | Mano | Mente | Voce |
|---|---|---|---|---|
| L'alba, col mercato del pesce | 0 | −1 | 0 | −1 |
| La notte | −1 | +1 | 0 | +1 |

Il mercato copre le mani e le parole con la sua confusione; la notte copre il corpo col buio e scopre ogni rumore di mani e di voci.

Incrociando le tabelle, le situazioni si rovesciano da sole:

| Azione (partenza, Fondo) | Archivio, all'alba | Archivio, di notte |
|---|---|---|
| *Muoversi* (0, 0) | 0 + 1 + 0 = 1 → esposto | 0 + 1 − 1 = 0 → al coperto |
| *Sottrarre* (0, 0) | 0 + 1 − 1 = 0 → al coperto | 0 + 1 + 1 = 2 → allo scoperto |

Di notte entrare è facile e prendere è pericoloso; all'alba il contrario. La scelta di *quando* agire diventa una decisione vera, e nessuno ha dovuto scriverla.

Una regola per chi compila: **ogni luogo deve essere buono per qualcosa.** Ogni riga della tabella dei luoghi ha almeno un −1. Un luogo che espone tutto e non copre niente non è difficile: è inutile, perché non offre nessuna scelta.

### 9.3 Aggravanti e preparazioni

Le **aggravanti** sono fatti del mondo che alzano il costo, di un grado ciascuna. Non le sceglie nessuno: si applicano quando sono vere. Ogni ambientazione ne ha da tre a cinque tipi, ciascuno dicibile in poche parole. Nel porto: *qui ti hanno già visto*, *la stanchezza o i nervi ti pesano*, *sono in tanti a guardare*, *porti addosso qualcosa che non dovresti*.

Le **preparazioni** sono ciò che fai prima di agire per abbassare il costo, di un grado ciascuna: osservare il posto, procurarti un travestimento, trovare un complice, creare un diversivo. Ogni ambientazione ne ha da tre a sei tipi, e ognuna costa qualcosa: tempo, denaro, un favore, un oggetto. Ogni tipo vale una volta per prova. Le preparazioni non durano per sempre: valgono per la scena, o si consumano.

> **Il dado non si governa. L'esposizione sì.** La leva di chi gioca sono le preparazioni, e il prezzo che paga per averle.

### 9.4 Il Fondo e il tetto

Il **Fondo** è il minimo sotto il quale un'azione non scende. Con Fondo 0, preparandoti bene puoi agire senza lasciare segni. Con Fondo 1 qualcosa resta sempre: puoi ridurre il rischio, non annullarlo. Con Fondo 2 l'azione costa sempre il massimo, e le preparazioni non servono.

Il Fondo serve a trasformare un principio in un numero. Se in un'ambientazione minacciare qualcuno lascia sempre un segno, non basta scriverlo in una nota per gli autori, dove qualcuno se ne dimenticherà: si dà a *Minacciare* un Fondo alto, e da quel punto nessuno può sbagliare.

Il **tetto** è il grado massimo: allo scoperto. Una somma di 3 o di 4 vale quanto una somma di 2. Questo impedisce al costo di crescere senza fine, e ha una conseguenza da conoscere: quando la somma supera 2, una sola preparazione può non bastare a farti scendere. La ricevuta te lo dice (§10).

Ogni ambientazione deve avere almeno metà delle capacità con partenza 0, e al massimo due con partenza 2. Le capacità con partenza bassa sono quelle in cui prepararsi serve davvero: se fossero poche, il gioco perderebbe la sua leva.

## 10. La ricevuta

Prima di ogni prova il gioco mostra la **ricevuta**: l'elenco, riga per riga, di ciò che rende l'azione più o meno costosa. Chi gioca non deve indovinare che cosa pensava l'autore: lo legge, e impara il gioco giocando.

### 10.1 Com'è fatta

```
Sottrarre il registro                                   ← che cosa stai per fare
    0   Sottrarre, di suo, non si nota                  ← la partenza
   +1   nell'archivio chi tocca le carte viene guardato ← il luogo
   +1   di notte ogni rumore si sente                   ← il momento
   +1   qui ti hanno già visto                          ← un'aggravante
   −1   hai osservato il posto      — non basta: ne servirebbe un'altra
  ───
    2   ALLO SCOPERTO
Prova: Impegnativa (8). Riesci 58 volte su 100.
Se va male: la guardia ti ferma.                        ← la posta
```

Tre regole di scrittura:

- **Ogni riga nomina una causa della finzione**: «qui ti hanno già visto», non «+1 Traccia». Il numero accompagna la causa, non la sostituisce. Se una riga non si può dire in una frase breve, senza sigle e senza icone, quella regola non deve esistere.
- **Le righe che valgono zero non si scrivono.**
- **La posta si dichiara.** L'ultima riga dice che cosa succede nel caso peggiore. Se nel caso peggiore puoi morire, la ricevuta lo scrive: «Se va male: la vita».

### 10.2 Le righe che non contano

Una ricevuta onesta dice anche quali righe, in questa situazione, non cambiano niente. Le righe si dividono in righe che **alzano** (luoghi e momenti positivi, aggravanti) e righe che **abbassano** (luoghi e momenti negativi, preparazioni). La partenza non si segna mai. Si guarda la somma finale:

| La somma è… | Righe che alzano | Righe che abbassano |
|---|---|---|
| **sopra 2** | le ultime non contano, tante quanti i punti oltre il 2 | nessuna conta: «non basta, ne servirebbero *N* in più», con *N* = somma − 1 |
| **uguale a 2** | contano | nessuna conta: «non basta, ne servirebbe una in più» |
| **fra il Fondo e 2** | contano | contano |
| **uguale al Fondo** | nessuna conta | contano |
| **sotto il Fondo** | nessuna conta | le ultime non contano, tante quanti i punti sotto il Fondo |

Con Fondo 2 nessuna riga conta mai, e la ricevuta lo dice una volta sola: «questa azione costa sempre il massimo». Con Fondo 1, «ne servirebbero *N* in più» si calcola allo stesso modo, perché scendere a 1 è comunque il massimo possibile.

La tabella garantisce una cosa semplice da verificare: **togliendo insieme tutte le righe segnate, il grado non cambia.**

La riga più importante da segnalare è la preparazione che non basta. Chi ha speso tempo e denaro per prepararsi deve sapere, prima di tirare, che non è servito, e che cosa servirebbe.

### 10.3 Un esempio da rifare a mano

La ricevuta del §10.1: 0 + 1 + 1 + 1 − 1 = 2. La somma è uguale a 2, quindi le tre righe che alzano contano e la preparazione no. Prova a toglierle una alla volta. Senza una qualsiasi delle righe che alzano, la somma scende a 1: esposto, quindi ognuna conta. Senza la preparazione, la somma sale a 3 e il tetto la riporta a 2: il grado non cambia, quindi la preparazione non conta. Una seconda preparazione porterebbe la somma a 1, cioè esposto: da qui «ne servirebbe un'altra».

## 11. Le sei caselle

Incrociando la risposta del dado con il grado di esposizione si ottengono sei esiti:

| | **Riesci** | **Non riesci** |
|---|---|---|
| **Al coperto** | **Successo pieno.** Ottieni ciò che volevi, senza lasciare segni. | **Fallimento pulito.** Non passi di qui, ma impari qualcosa sull'ostacolo: si apre un'altra via. Nessun danno. |
| **Esposto** | **Successo sporco.** Ottieni ciò che volevi, ma il mondo registra il tuo passaggio. | **Rovescio minore.** Non ottieni niente, e la scena si complica. |
| **Allo scoperto** | **Successo a caro prezzo.** Ottieni ciò che volevi, e perdi qualcosa che non torna. | **Rovescio.** La situazione precipita: sei in un'altra scena, non nella stessa andata male. |

Ogni casella ha effetti predefiniti, che valgono sempre se la scena non dice altro:

| Esito | Effetto predefinito |
|---|---|
| Successo pieno | nessuno |
| Successo sporco | +1 Traccia nella zona |
| Successo a caro prezzo | +1 Traccia, e perdi ciò che la scena indica come prezzo (un oggetto, un favore, tempo, una persona) |
| Fallimento pulito | ottieni una conoscenza sull'ostacolo, che la scena indica |
| Rovescio minore | +1 Traccia, e una complicazione dal repertorio della zona (§21) |
| Rovescio | +1 Traccia, sale il logorio che tocca l'ambito della capacità, si perde il travestimento, e vai alla scena di rovescio indicata |

Tre conseguenze di questa tabella vanno tenute a mente.

**Al coperto il dado non può farti male.** Il peggio che ti può capitare è non riuscire. Il gioco mantiene questa promessa ovunque, scontri compresi.

**I successi e i disastri non dipendono da un numero fortunato.** Nessun doppio sei regala un successo pieno, e nessun doppio uno provoca un disastro. Un successo pieno o un rovescio dipendono da quanto hai scelto di esporti.

**Il fallimento insegna qualcosa sulla cosa, non sul gesto.** Se non riesci a forzare una serratura al coperto, scopri com'è fatta: magari che si apre dall'altra parte, o che la chiave ce l'ha il custode. Non diventi più bravo a forzarla. Per questo fallire non serve ad allenarsi.

### 11.1 Che cosa cambia un esito

Ogni esito cambia almeno una di queste quattro cose:

| | Che cosa |
|---|---|
| **Obiettivo** | ottieni o no ciò per cui eri lì |
| **Costo** | tempo, denaro, oggetti, salute |
| **Traccia** | che cosa il mondo ricorda di te |
| **Conoscenza** | che cosa sai (o credi di sapere) |

> **Due esiti dello stesso ostacolo non possono differire soltanto nel costo.** Almeno uno dei due deve cambiare Traccia o conoscenza.

Gli effetti predefiniti della tabella rispettano già questa regola. Chi riscrive una casella a mano deve controllarla.

## 12. Ritentare

Le prove sono di due tipi.

- **Prova ritentabile.** Puoi riprovare, ma ogni nuovo tentativo costa un passo, con tutto ciò che un passo comporta: le scadenze avanzano, il logorio sale, può arrivare un imprevisto, e il momento del giorno può cambiare. Prima di ogni tentativo il gioco rifà la ricevuta.
- **Prova da un colpo solo.** Si tenta una volta, e segna la partita: una bugia detta a un giudice, un salto fra due tetti, un'offerta a un nemico. Il gioco la segnala prima, con le parole «una volta sola». Una prova da un colpo solo non è mai l'unica via di un ostacolo.

Qui sta anche il senso della competenza. Chi è Esperto forza una serratura Impegnativa quasi sempre al primo tentativo (72 volte su 100); chi è Inesperto ci mette in media due tentativi e mezzo. Ogni tentativo in più è un passo in più, con la sua fatica e il suo rischio di imprevisti.

> **Chi è bravo non è meno esposto. Ci resta meno tempo.**

---
---

# PARTE IV — IL CORPO, IL TEMPO, IL PERICOLO

## 13. Il logorio

Il **logorio** è ciò che sale da solo: la fatica, la fame, il freddo, i nervi. Ogni ambientazione ne sceglie da due a quattro. Ognuno ha tre stadi, detti a parole, e un rimedio suo:

| Stadio | Effetto |
|---|---|
| **1 — leggero** | nessuno |
| **2 — pesante** | è un'aggravante («il logorio ti pesa») per gli ambiti che quel logorio tocca |
| **3 — allo stremo** | resta un'aggravante, e in più −1 a tutte le prove. Finché non usi il rimedio, a ogni passo fai una prova di resistenza, annunciata, con la probabilità e la via d'uscita scritte accanto |

Il rimedio riporta il logorio al primo stadio, e costa: dormire costa passi, mangiare costa denaro, calmarsi richiede un posto sicuro. Ogni logorio ha un rimedio diverso, e nessun rimedio ne cura due. Un logorio senza rimedio sarebbe una condanna a tempo, e non è ammesso.

L'ultimo stadio non è un po' peggio del secondo: è un'altra cosa. Per questo chi gioca lo teme, invece di sopportarlo.

## 14. Le ferite

Nel motore non esistono punti ferita. Una ferita è una cosa precisa, con un nome e un posto, e **dice che cosa ti impedisce**.

| Gravità | Che cosa impedisce | Come evolve |
|---|---|---|
| **Lieve** | −1 alle prove dell'ambito colpito (una mano tagliata: le prove di *mano*) | guarisce da sola dopo un giorno di riposo |
| **Grave** | non puoi più usare le capacità dell'ambito colpito: ti restano le vie povere | curata, diventa lieve; senza cure, dopo un giorno diventa mortale |
| **Mortale** | puoi solo muoverti piano, parlare e cercare aiuto | curata, diventa grave; senza cure muori entro quattro passi |

La scena, o l'arma, dice dove colpisce. Curare è una capacità come le altre: Facile per una ferita lieve, Impegnativa per una grave, Ardua per una mortale, e la cura richiede quello che serve (bende, un medico, un posto pulito).

> **Una ferita non ti rende più debole in generale. Ti toglie una strada.**

Una mano ferita chiude *Forzare* e lascia intatto *Persuadere*. Chi gioca continua a scegliere, con meno strade. Il danno si racconta invece di contarsi.

## 15. La Traccia e gli imprevisti

### 15.1 La Traccia

La **Traccia** è ciò che il mondo ricorda di te in una zona: chi ti ha visto, chi ha fatto domande, chi ti cerca. Si segna da 0 a 3 tacche per zona.

- **Sale** di una tacca a ogni esito esposto o allo scoperto, come dice la tabella del §11. Mai più di una tacca per prova.
- **Pesa**: con 2 tacche o più, nella zona vale l'aggravante «qui ti hanno già visto».
- **Cala** di una tacca ogni due passi in cui non ne lasci di nuova in quella zona.

La Traccia è il modo in cui il mondo ti si chiude intorno. Chi agisce spesso allo scoperto trova i luoghi sempre più ostili; chi agisce al coperto li trova aperti. Non è una barra di reputazione e non giudica quello che fai: misura soltanto quanto ti hanno notato.

La Traccia cala sempre, se smetti di alimentarla. Quindi non può crescere fuori controllo: chi è nei guai può sempre scegliere di sparire per un po', e pagarlo in tempo mentre le scadenze avanzano.

### 15.2 Gli imprevisti

A ogni passo, nella zona in cui ti trovi, tiri due dadi. Se il risultato è pari o inferiore al numero della tabella, arriva un **imprevisto**:

| Traccia nella zona | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Imprevisto se i dadi fanno al massimo | 2 | 4 | 6 | 8 |
| Probabilità | 3% | 17% | 42% | 72% |

L'imprevisto si pesca dal repertorio della zona (§21): un doganiere che chiede i documenti, un conoscente che ti chiama per nome, un carico che cade. Gli imprevisti non aggiungono Traccia da soli; aggiungono complicazioni, e a volte ostacoli, con la loro via povera.

Il caso smette di essere arbitrario. Non sai *che cosa* succederà, ma sai esattamente *quanto* stai rischiando: più ti hanno notato, più spesso il mondo ti viene addosso.

## 16. La violenza

In questo motore la violenza è realistica. Un colpo di coltello può uccidere, e un colpo di pistola quasi sempre lo fa. Non ci sono punti ferita da consumare: c'è un corpo che si rompe. Per questo le storie scritte con ESPOSIZIONE si giocano soprattutto con l'esplorazione, la parola e l'astuzia, e la violenza è un rischio che si corre raramente, a occhi aperti.

Quattro regole rendono il pericolo onesto.

> **1. Nessuna morte senza avviso.** Una prova può ucciderti solo se la ricevuta, prima del tiro, dice «Se va male: la vita».

> **2. Un agguato non comincia con la morte.** Chi ti tende un agguato comincia in posizione migliore della tua, ma la prima decisione è sempre tua.

> **3. Andarsene si può sempre.** In ogni scontro c'è una via povera: fuggire, arrendersi, consegnare ciò che vogliono. Non si tira, e costa: Traccia, l'obiettivo perso, un oggetto, la libertà.

> **4. Le armi dichiarano che cosa fanno.** Ogni arma ha due ferite: quella che infligge se ti colpisce quando sei esposto, e quella che infligge se ti colpisce quando sei allo scoperto.

| Arma | Da esposto | Da allo scoperto |
|---|---|---|
| pugni, bastone | lieve | grave |
| coltello, bottiglia rotta | grave | mortale |
| spada, pistola | mortale | morte |

La prova con cui ti difendi usa la capacità che scegli (nel porto: *Battersi* per parare, *Muoversi* per scansarti), con la soglia che dipende da quanto è abile chi ti attacca. Il grado è quello della tua ultima azione nello scontro: chi ha appena attaccato allo scoperto si difende allo scoperto. Se sei al coperto, l'arma non ti raggiunge: il peggio è non ottenere ciò che volevi.

### 16.1 Protezioni

Una **protezione** è qualcosa che paga al posto tuo una conseguenza già decisa: una giacca imbottita che attutisce una coltellata, un protettore che ti tira fuori di prigione, un avvocato che trasforma un'accusa in una multa.

- **Declassa, non annulla.** Una ferita mortale diventa grave, un arresto diventa una multa.
- **Si consuma.** Ha tre stati: intatta, intaccata, inservibile. Ogni volta che serve scende di uno.
- **Vale solo sulla conseguenza.** Non cambia mai il tiro, la soglia o l'esposizione. Senza questo limite, le protezioni diventerebbero punti ferita cuciti dentro una giacca.

## 17. Il confronto

Un **confronto** è un ostacolo che reagisce: una guardia, un testimone ostile, un rivale, un cane da guardia. Può essere uno scontro armato, ma quasi sempre non lo è: un interrogatorio, una trattativa, un inseguimento sono confronti.

Il confronto usa le stesse regole di tutto il resto (la prova, la ricevuta, le sei caselle) e aggiunge quattro cose: la scheda dell'avversario, la sua copertura, la finestra e le tre fini.

### 17.1 La scheda dell'avversario

Un avversario non ha punti vita, né attacco, né difesa. Ha cinque righe:

| Riga | Che cosa dice |
|---|---|
| **Natura** | *chi si chiude* (difende una posizione) o *chi avanza* (ti viene addosso) |
| **Copertura** | da quale grado parte: al coperto, esposto, allo scoperto. Per chi si chiude è quanto è protetto; per chi avanza è quanto è lontano |
| **Punti deboli** | che cosa lo scopre, con quale capacità, e di quanti gradi (1 o 2) |
| **Pericolo** | che cosa può farti: l'arma, oppure la conseguenza sociale (chiama la guardia, ti denuncia, ti rovina) |
| **Movente** | che cosa vuole, che cosa lo fa smettere, e se mantiene la parola data |

Il movente non si lascia mai vuoto. Chi ti ascolta si ferma con le parole: un accordo, uno scambio, una minaccia. Chi non ti ascolta, come una bestia affamata o un fanatico, si ferma col costo: il fuoco, il rumore, una preda più facile. Ciò che non vuole niente, come una tempesta o il freddo, non è un avversario: è il mondo, e non si sconfigge, si evita.

### 17.2 Lo scambio

Un confronto avanza a **scambi**. Ogni scambio va così:

1. **Scegli che cosa fare.** Una prova contro uno dei suoi punti deboli, una prova per fare altro (fuggire, nasconderti, prendere ciò per cui sei venuto), una via povera, oppure parlare (§17.4).
2. **Risolvi.** Ricevuta, tiro, casella. Se la prova contro un punto debole riesce, la sua copertura scende di quanto dice il punto debole. Lo stesso punto debole si può usare più volte.
3. **Se ora è allo scoperto, si apre la finestra** (§17.3), prima che l'avversario possa reagire.
4. **Altrimenti reagisce**, secondo la sua natura:
   - **chi si chiude**, se la tua prova è fallita, si ricopre di un grado (mai oltre la copertura da cui era partito). Ti attacca solo se sei allo scoperto e alla sua portata;
   - **chi avanza** si avvicina: la sua copertura scende di un grado da sola. Quando è esposto o allo scoperto ti ha raggiunto, e da quel punto ogni sua reazione è un attacco: tu fai la prova di difesa.

> **Chi si chiude devi aprirlo tu, e per aprirlo devi esporti. Chi avanza si apre da solo, e intanto ti arriva addosso.**

Quanti sono non moltiplica le reazioni: l'avversario reagisce una volta per scambio anche se è un gruppo. Il numero conta in un altro modo: vale l'aggravante «sono in tanti a guardare», e ogni via d'uscita costa di più. Il numero alza i prezzi, ma non chiude mai una via.

### 17.3 La finestra

Quando l'avversario è allo scoperto, all'inizio del tuo turno di scelta oppure subito dopo una tua prova riuscita, si apre la **finestra**. Nella finestra non tiri: decidi tu come finisce, scegliendo fra le fini che la scena rende possibili (lo metti fuori combattimento, lo costringi a cedere, prendi ciò che volevi, te ne vai senza che possa seguirti). Ogni scelta ha il suo prezzo, scritto nella scena: mettere fuori combattimento qualcuno davanti a testimoni, per esempio, è allo scoperto e lascia Traccia.

> **Un confronto non consiste nel togliere qualcosa a qualcuno. Consiste nel creare il momento in cui decidi tu.**

### 17.4 Parlare

Puoi provare a far desistere l'avversario, o a trovare un accordo, in qualunque scambio, anche mentre stai perdendo. È una prova da un colpo solo: se fallisce, quella porta si chiude per tutto il confronto. Se si potesse ritentare, parlare sarebbe la mossa gratuita da provare per prima, sempre.

Un accordo si può tradire, ma solo da chi era già dichiarato capace di farlo nella riga del movente. Il tradimento non è un tiro nascosto: è un'informazione che era lì, e che magari potevi scoprire.

### 17.5 Come finisce

> **Uno dei due non può più. Uno dei due non vuole più. Uno dei due non c'è più.**

| Fine | Se tocca a lui | Se tocca a te |
|---|---|---|
| **Non può** | fermato, disarmato, smascherato | catturato, ferito gravemente, rovinato |
| **Non vuole** | desiste, accetta uno scambio | cedi, paghi, accetti le sue condizioni |
| **Non c'è** | fugge, si ritira | te ne vai, con ciò che ti costa |

Nella vita vera quasi nessuno scontro finisce con qualcuno a terra: finisce perché uno dei due smette di volerlo. Nelle storie scritte con questo motore, la fine più comune è la seconda.

Un esempio dal porto: l'archivista che nega di aver visto Matteo è *chi si chiude*, parte al coperto, e ha tre punti deboli. Una data nel registro che non torna (*Osservare*, scopre di 1), la paura di perdere il posto (*Persuadere*, scopre di 1), il debito di suo figlio con l'usuraio, se lo conosci (*Minacciare*, scopre di 2). Il suo pericolo è sociale: chiama la guardia. Vuole tenersi il posto, smette se gli garantisci che non verrà coinvolto, e mantiene la parola. Con due prove riuscite, oppure con il segreto del figlio, l'archivista è allo scoperto (ma ogni tua prova fallita lo fa ricoprire di un grado): si apre la finestra, e decidi tu se farlo parlare, lasciarlo in pace o rovinarlo.

---
---

# PARTE V — CRESCERE

## 18. Come cresce il personaggio

La competenza cresce in tre modi, e ognuno ha una ragione:

| Fonte | Che cosa dà | Come |
|---|---|---|
| **Pratica** | fa salire le capacità che usi | ogni prova riuscita dà una tacca a quella capacità, al massimo una per scena |
| **Punti** | ti permette di scegliere chi diventare | la storia li dà negli snodi e alla fine dei fili; ogni punto è una tacca su una capacità a scelta |
| **Insegnamento** | apre l'ultimo livello | Maestro non si raggiunge da soli: serve qualcuno, o qualcosa, che insegni |

Tacche necessarie per salire:

| Da … a … | Tacche | Condizione |
|---|---|---|
| Inesperto → Pratico | 3 | — |
| Pratico → Esperto | 5 | — |
| Esperto → Maestro | 5 | un maestro, una bottega, un libro |

Anche **studiare** fa crescere: due passi passati a studiare con un maestro o su un libro danno una tacca in ciò che quella fonte insegna. Lo studio costa tempo, quindi compete con tutto il resto. In una storia dove il sapere è potere, *resto a leggere o esco?* diventa una decisione vera.

I pagatori non si sovrappongono: **la storia paga in punti, il mondo paga in cose, le persone pagano in accesso.** Se esplorare desse punti, esplorare tutto diventerebbe sempre la scelta migliore, e il gioco un elenco di caselle da spuntare.

Per le storie brevi, o a episodi, il personaggio può restare **fisso**: nessuna crescita, e tutto il gioco sta nelle situazioni.

### 18.1 La forma del personaggio

Una storia lunga dovrebbe portare il personaggio, alla fine, più o meno qui: una capacità a Maestro, due a Esperto, tre a Pratico, le altre basse. Non è una regola ma un bersaglio per chi tara la storia. Un personaggio bravo in tutto non sceglie più da che parte affrontare gli ostacoli, e le vie diventano un menù. Le capacità rimaste basse sono la ragione per cui, alla quarantesima ora, scegliere la via conta ancora.

### 18.2 Far vedere la crescita

Siccome la competenza fa risparmiare tentativi e non cambia l'esposizione, chi gioca rischia di non accorgersene. Il gioco deve mostrarglielo, confrontandolo con il suo passato sulla stessa capacità:

```
Hai forzato la serratura.                          1 tentativo
La prima volta che ne hai forzata una così:        4 tentativi
```

Nel digitale questo è obbligatorio. Al tavolo lo dice il narratore. Nel librogame la scheda ha, accanto a ogni capacità, lo spazio per annotare i tentativi della prima volta.

---
---

# PARTE VI — SCRIVERE UNA STORIA

## 19. La scheda dell'ambientazione

Adattare il motore a un mondo significa compilare questa scheda. È l'elenco completo: una storia che la riempie ha tutto ciò che serve per essere giocata.

| # | Voce | Che cosa contiene |
|---|---|---|
| 1 | **La frase dell'esposizione** | *In questo mondo, essere esposti significa…* |
| 2 | **Il criterio del Fondo** | *Ha un Fondo ciò che…* |
| 3 | **Gli ambiti** | da 3 a 5, con nome |
| 4 | **Le capacità** | da 8 a 14, con ambito, partenza e Fondo |
| 5 | **I luoghi** | con zona e un valore per ambito (−1, 0, +1) |
| 6 | **I momenti** | quanti passi dura ciascuno, e un valore per ambito |
| 7 | **Le aggravanti** | da 3 a 5 tipi, ciascuno con quando vale |
| 8 | **Le preparazioni** | da 3 a 6 tipi, ciascuno con il suo costo e quanto dura |
| 9 | **Il catalogo delle soglie** | le cose del mondo e la loro difficoltà |
| 10 | **Il tempo** | quanto dura un passo, quanti passi costa fare con calma |
| 11 | **Il logorio** | da 2 a 4, con stadi, ogni quanti passi sale, gli ambiti che tocca e il rimedio |
| 12 | **Le ferite e le armi** | come si curano, e che cosa fa ciascuna arma |
| 13 | **La Traccia** | le zone, e ogni quanti passi cala (il valore consigliato è 2) |
| 14 | **Gli avversari** | con le cinque righe del §17.1 |
| 15 | **Le protezioni** | che cosa declassano, e come si consumano |
| 16 | **Il repertorio** | le complicazioni e gli imprevisti di ogni zona (§21) |
| 17 | **La crescita** | chi insegna, chi dà punti, o se il personaggio è fisso |
| 18 | **Le qualità della storia** | i fili, le scadenze, i fatti e le misure principali |

Se un mondo ha bisogno di qualcosa che questa scheda non prevede, conviene fermarsi a chiedersi se si tratta di un sottosistema che mangerebbe gli altri (una barra della magia, per esempio, che replicherebbe i punti ferita), e in quel caso rifiutarlo, oppure di una lacuna del motore, e in quel caso aggiungerlo qui, per tutti.

### 19.1 Come si compila

L'ordine conta. Prima la frase dell'esposizione, perché dà il tono a tutto il resto; poi gli ambiti e le capacità; solo dopo i luoghi e i momenti, perché i loro valori si decidono pensando alle capacità. Per ultimo il catalogo delle soglie, che cresce mentre si scrive.

Le tabelle dei luoghi e dei momenti sono il lavoro più delicato. Con venti luoghi, sei momenti e quattro ambiti sono 104 caselle, e ognuna deve restare coerente con le altre. Non è lavoro di scrittura: è lavoro di giudizio, si fa una volta sola per tutto il mondo, e in cambio l'autore non deve più decidere il costo di nessuna azione, in nessuna scena. È il prezzo vero di questo motore, e conviene saperlo prima di cominciare.

## 20. I controlli

Una storia è pronta quando passa questi controlli. Nel digitale li fa un programma; sulla carta si fanno con una lista.

| # | Controllo |
|---|---|
| 1 | Ogni ostacolo ha almeno una via povera, che non si tira |
| 2 | Nessuna prova da un colpo solo è l'unica via di un ostacolo |
| 3 | Ogni scontro ha una via per andarsene che non si tira |
| 4 | Nessuna prova può uccidere senza che la ricevuta lo dica |
| 5 | Nessun agguato uccide prima della prima decisione di chi gioca |
| 6 | Ogni ferita dice che cosa impedisce |
| 7 | Ogni logorio ha il suo rimedio, e nessun rimedio ne cura due |
| 8 | Almeno metà delle capacità ha partenza 0, al massimo due hanno partenza 2, e nessuna ha il Fondo più alto della partenza |
| 9 | Ogni luogo ha almeno un ambito a −1 |
| 10 | Tutti i valori di luoghi e momenti sono −1, 0 o +1 |
| 11 | Ogni soglia usata viene dal catalogo |
| 12 | Due esiti dello stesso ostacolo non differiscono solo nel costo |
| 13 | Ogni qualità della storia scritta da una scena è letta da almeno un'altra scena |
| 14 | Ogni snodo ha testi scritti a mano |
| 15 | Ogni avversario ha tutte e cinque le righe, movente compreso |
| 16 | Ogni avversario ha almeno due punti deboli, che si affrontano con capacità di ambiti diversi |
| 17 | Nessun ostacolo offre due vie che differiscono soltanto nel nome della capacità |
| 18 | Ogni confronto è raggiunto da una pressione (una scadenza, un logorio che sale, la Traccia): restare al coperto per sempre non deve essere gratis |
| 19 | Nessun fallimento al coperto o esposto porta a un finale o a una ferita: solo il rovescio può chiudere la storia |

## 21. Scrivere i testi

### 21.1 Che cosa si scrive per una prova

Per ogni via con una prova, l'autore scrive:

- il testo di chi riesce e quello di chi non riesce;
- il prezzo del successo a caro prezzo, se la scena ne ha uno suo;
- la conoscenza del fallimento pulito;
- la scena di rovescio, oppure un rimando a una scena di rovescio già scritta.

Il resto viene dagli effetti predefiniti del §11 e dal repertorio. Un'azione che l'autore non ha bisogno di ritoccare non richiede altro lavoro: è il caso normale. Quando serve, l'autore può intervenire a tre livelli: **nessuno** (valgono le regole), **ritocco** (una riga: un'aggravante di scena, un Fondo diverso, una complicazione esclusa) e **scrittura piena** (la casella si riscrive tutta). Gli snodi sono sempre a scrittura piena.

### 21.2 Il repertorio

Il **repertorio** è l'insieme delle complicazioni e degli imprevisti, zona per zona. È il vero contenuto del gioco, non un ripiego per risparmiare lavoro. Ogni voce dice:

- quando può uscire (in quale zona, in quale momento, con quali qualità);
- che cosa colpisce (obiettivo, costo, Traccia, conoscenza);
- quando colpisce: subito, oppure dopo un numero dichiarato di passi. Le complicazioni che arrivano dopo sono le più efficaci, perché arrivano quando non si può più tornare indietro.

Se il testo si compone a pezzi (il gesto, l'esito, la complicazione, il luogo), **ogni pezzo è una frase intera**. Mai buchi da riempire dentro una frase: è ciò che fa sembrare un testo generato da una macchina.

Il repertorio si dimensiona dalla parte di chi legge: si decide quante volte, al massimo, chi gioca potrà rileggere la stessa frase in una partita, e da lì si ricava quante varianti servono.

### 21.3 L'intelligenza artificiale

Un modello linguistico può aiutare a scrivere il repertorio, durante la produzione. L'autore rilegge, taglia e congela. Durante il gioco non si genera nessun testo, per tre ragioni: un testo generato può contraddire lo stato della storia, rende i salvataggi imprevedibili, e toglie all'autore l'ultima parola.

## 22. Tre formati

### 22.1 Il librogame

Chi legge ha una scheda con le capacità, i logorii, le ferite, le parole chiave, le tacche di Traccia per zona, le scadenze e l'inventario. Ha due dadi e una matita.

Una prova, in un paragrafo, si presenta così:

> **112.** L'archivio è pieno di capitani che protestano per le tariffe. Il registro degli imbarchi è aperto sul banco, sotto il naso dell'archivista.
>
> ◆ *Sottrarre il registro.* Impegnativa (8). Partenza con archivio e alba: 0. Aggiungi le tue aggravanti, togli le preparazioni. Se va male: la guardia (vai al 140). Riesci: 57. Non riesci: 88.
> ◆ *Persuadere l'archivista:* vai al 203.
> ◆ *Pagare un facchino* (due monete, un passo): vai al 19.

Il paragrafo stampa la somma di partenza, cioè capacità, luogo e momento, già calcolata dall'autore. Se lo stesso paragrafo si può raggiungere in momenti diversi, ne stampa una per momento. Chi legge aggiunge soltanto ciò che dipende da lui: le aggravanti della sua scheda e le preparazioni che ha fatto. Gli effetti predefiniti delle sei caselle sono stampati sulla scheda, e i paragrafi di esito dicono soltanto ciò che è proprio della scena.

La tabella degli imprevisti e il repertorio di ogni zona stanno in fondo al libro, con un numero per voce: chi legge tira e va alla voce.

### 22.2 Il tavolo

Il **narratore** ha la scheda dell'ambientazione e conduce la storia; i giocatori decidono. Valgono le regole di tutto il documento, con quattro precisazioni.

- **Il narratore non tira mai contro i giocatori.** I dadi li tirano solo loro. Gli avversari reagiscono secondo la loro natura, senza dadi.
- **La ricevuta si fa ad alta voce.** Il narratore dice le righe, il giocatore aggiunge le sue preparazioni, e decide se agire.
- **Il narratore gioca il mondo**: gli imprevisti, le reazioni degli avversari, le complicazioni del repertorio, le scadenze. Non decide mai quanto costa un'azione: lo dicono le tabelle.
- **Con più giocatori**, ognuno ha la sua esposizione, e nel confronto l'avversario reagisce dopo l'azione di ciascuno, verso chi ha agito.

### 22.3 Il digitale

Il programma fa tutti i conti. Deve soddisfare sei requisiti:

1. mostrare la ricevuta, con la posta, prima che chi gioca confermi l'azione;
2. mostrare le scelte chiuse, con il requisito che manca;
3. mostrare le scadenze e la Traccia delle zone conosciute;
4. mostrare i tentativi risparmiati (§18.2);
5. salvare in modo che la stessa partita, con lo stesso seme dei dadi, si possa rigiocare identica;
6. non generare testo durante il gioco.

I gradi di esposizione si mostrano a parole, non solo con colori o icone.

### 22.4 Il gioco grafico

Il motore non disegna niente. Tiene lo stato della storia, sa quali scelte sono disponibili e con quale ricevuta, e risolve le prove. Il gioco grafico gli chiede queste cose e le mostra a modo suo. Per questo la stessa storia può diventare un librogame e un gioco con immagini, senza cambiare una regola.

| Nel motore | In un gioco grafico |
|---|---|
| luogo | un'area della mappa, una stanza, un quartiere |
| scena | ciò che hai davanti: un'inquadratura, una stanza con le sue persone e i suoi oggetti |
| via | un oggetto da usare, un punto della stanza, una persona a cui parlare, una battuta di dialogo |
| scelta chiusa | un oggetto o una battuta visibile ma non utilizzabile, con il requisito scritto accanto |
| ricevuta | un pannello che compare quando scegli un'azione, prima della conferma |
| passo e momento | un orologio che avanza quando agisci, non in tempo reale; la luce e le persone cambiano con il momento |
| Traccia | persone che ti riconoscono, guardie più attente, porte che si chiudono |
| qualità della storia | ciò che vedi cambiare nel mondo: un personaggio che ti saluta, una nave che non c'è più |
| confronto | una scena in cui l'avversario si muove dopo ogni tua azione, e la sua copertura si vede |

Per chi costruisce il gioco valgono due regole in più.

- **Esplorare liberamente è gratis, agire costa.** Il giocatore può muoversi in una stanza, guardare, avvicinarsi, senza che il tempo del motore avanzi. Il tempo avanza quando sceglie una via: una prova, uno spostamento fra luoghi, un'attesa.
- **Nessuna abilità di mani.** Il risultato di un'azione lo decidono la ricevuta e i dadi, mai la mira o i riflessi di chi gioca. Un gioco che chiede di premere un tasto al momento giusto sta usando un altro motore.

Il motore di ESPOSIZIONE Studio (§25) espone esattamente queste informazioni: lo stato, le scelte con le loro ricevute, e il risultato di ogni azione. Un gioco testuale le scrive, un gioco grafico le disegna.

---
---

# PARTE VII — LIMITI E VERIFICHE

## 23. Dove questo motore non funziona

Il motore presuppone quattro cose:

1. un protagonista che agisce e può fallire;
2. un'azione divisa in decisioni, con il tempo di leggere una ricevuta prima di agire;
3. conseguenze che restano;
4. una differenza che valga la pena fare fra *quanto è probabile riuscire* e *quanto costa provarci*.

Dove una di queste manca, il motore non si adatta: semplicemente non serve. Restano fuori i giochi d'azione in tempo reale, la gestione di risorse senza un protagonista, i giochi tattici a squadre su mappa, gli enigmi a soluzione unica.

La grafica non è un limite. Un gioco con immagini, mappe ed esplorazione libera rientra pienamente, purché le azioni che contano si decidano scegliendo e non con i riflessi (§22.4).

Resta dentro quasi tutta la narrativa interattiva che vale la pena progettare: avventure, indagini, drammi, viaggi, intrighi, in cui un protagonista sceglie e il mondo se ne ricorda.

## 24. Come si verifica

Un motore si verifica in tre modi, e nessuno sostituisce gli altri.

**I controlli sui dati** (§20). Dicono se una storia è scritta secondo le regole. Si possono automatizzare del tutto.

**Le simulazioni.** Si fanno giocare a un programma molte partite con strategie diverse: il prudente, che resta sempre al coperto; il temerario, che non si prepara mai; lo scrupoloso, che si prepara sempre; l'opportunista, che aspetta il luogo e il momento giusti. Se una strategia batte tutte le altre su tutto (obiettivi raggiunti, Traccia, ferite, tempo speso), il motore ha una soluzione, e le scelte sono finte. Una domanda vale più di tutte: *esiste una situazione in cui conviene essere esposti invece che al coperto?* Deve esistere, di solito quando una scadenza incalza.

**Le persone.** Le promesse che contano di più riguardano l'esperienza, e le misura soltanto chi gioca. Dopo una scena tesa si chiede: *«Perché pensavi che sarebbe successo quello che è successo?»*. Se la risposta parla della posizione, della preparazione, del luogo, la ricevuta funziona; se la risposta è «non so, ho tirato», non funziona. A fine partita si chiede: *«Qual è stata la decisione più importante?»*. Se la risposta è una decisione, il motore funziona; se è un numero uscito sui dadi, no.

Per ogni verifica si scrive prima che cosa deve succedere perché la si consideri superata. Deciderlo dopo aver visto i risultati non verifica niente.

## 25. Prossimi passi

Il motore di ESPOSIZIONE Studio è stato riscritto su questo documento, in `strumento/motore/`: formato dei dati, regole, controlli del §20, simulazione e generatore del librogame. L'ambientazione del porto è trascritta come dati, e con lei una storia di prova, *Il registro della Santa Rita*, di cinquantadue scene. Dagli stessi dati escono la partita nel terminale e il librogame da stampare.

1. **Far giocare il librogame** ad almeno cinque persone, e fare loro le due domande del §24. Prima di cominciare si scrive che cosa deve succedere perché la prova sia superata.
2. **Simulare meglio.** Le strategie di oggi scelgono a caso fra le vie che preferiscono, e dicono se il motore regge, non se la storia è equilibrata. Serve un giocatore automatico che insegua un obiettivo.
3. **Ricostruire l'editor** di ESPOSIZIONE Studio sopra il motore nuovo: capacità al posto degli attributi, le sei caselle, la ricevuta, le qualità della storia.
4. **Un'interfaccia grafica di prova**, anche minima, che usi il motore così com'è, per verificare il §22.4.
5. **Provare il tavolo** con una sessione e un narratore.
6. Correggere questo documento con ciò che le prove insegnano, dichiarando ogni cambiamento.

---
---

# APPENDICE A — Tabelle da tenere sottomano

**Probabilità di due dadi a sei facce**

| Almeno | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| % | 100 | 97 | 92 | 83 | 72 | 58 | 42 | 28 | 17 | 8 | 3 |

**Tentativi medi per riuscire** (uno diviso la probabilità)

| | Facile | Impegnativa | Ardua | Estrema |
|---|---|---|---|---|
| Inesperto | 1,4 | 2,4 | 6 | 36 |
| Pratico | 1,2 | 1,7 | 3,6 | 12 |
| Esperto | 1,1 | 1,4 | 2,4 | 6 |
| Maestro | 1,0 | 1,2 | 1,7 | 3,6 |

**La ricevuta, punto per punto**

1. Scrivi la partenza della capacità.
2. Aggiungi il valore del luogo e quello del momento per l'ambito della capacità.
3. Aggiungi 1 per ogni aggravante vera, togli 1 per ogni preparazione fatta.
4. Il grado è la somma, tenuta fra il Fondo e 2.
5. Segna le righe che non contano (§10.2) e scrivi la posta.

**Dopo ogni prova**

| | Riesci | Non riesci |
|---|---|---|
| Al coperto | niente | una conoscenza |
| Esposto | +1 Traccia | +1 Traccia, una complicazione |
| Allo scoperto | +1 Traccia, un prezzo | +1 Traccia, la scena di rovescio |

---

# APPENDICE B — Il porto: un'ambientazione compilata

Una città di porto in un Seicento senza nome. Il protagonista cerca il fratello Matteo, sparito da tre giorni. L'ambientazione è volutamente piccola, e serve a mostrare la scheda del §19 compilata in ogni voce.

**1. La frase dell'esposizione.** *Nel porto, essere esposti significa che qualcuno potrà dire di averti visto.* Al coperto: nessuno ti ha notato. Esposto: qualcuno ti ha notato e se ne ricorderà. Allo scoperto: sanno chi sei e che cosa hai fatto.

**2. Il criterio del Fondo.** *Ha un Fondo ciò che lascia un segno che resta: un corpo ferito, una porta forzata, una parola detta a qualcuno che se la ricorderà.*

**3. Gli ambiti.** Corpo, mano, mente, voce.

**4. Le capacità.** Undici; sette con partenza 0, due con partenza 2.

| Ambito | Capacità | Partenza | Fondo | Perché |
|---|---|---|---|---|
| Corpo | Muoversi | 0 | 0 | arrampicarsi, correre, nuotare, scansarsi: al porto tutti corrono |
| | Battersi | 2 | 1 | colpire, lottare, parare: la violenza si vede e si ricorda |
| | Resistere | 0 | 0 | fatica, freddo, dolore: reggere non si nota |
| Mano | Forzare | 1 | 1 | serrature, casse, porte: una serratura forzata resta forzata |
| | Sottrarre | 0 | 0 | borseggiare, nascondere, scambiare: fatto bene, non lascia niente |
| | Curare | 0 | 0 | medicare, ricucire |
| Mente | Osservare | 0 | 0 | notare, cercare, seguire qualcuno |
| | Sapere | 0 | 0 | leggere documenti, conoscere rotte, leggi, lingue |
| Voce | Persuadere | 1 | 1 | convincere, trattare: chi viene convinto sa di esserlo |
| | Mentire | 0 | 0 | ingannare: una bugia ben detta non lascia traccia |
| | Minacciare | 2 | 2 | intimidire: una minaccia esiste solo se l'altro sa da chi viene |

**5. I luoghi.** Ogni luogo è una zona.

| Luogo | Corpo | Mano | Mente | Voce | In breve |
|---|---|---|---|---|---|
| La banchina | 0 | −1 | 0 | +1 | tra i carichi le mani spariscono; le voci arrivano lontano |
| La taverna del Gallo | +1 | −1 | 0 | −1 | chi fa a botte si nota; nel chiasso mani e parole passano |
| L'archivio della capitaneria | +1 | +1 | −1 | 0 | chi legge è a posto; chi tocca le carte o gira dove non deve no |
| I magazzini | −1 | 0 | +1 | 0 | i corridoi bui nascondono; chi guarda in giro è sospetto |
| La chiesa dei marinai | 0 | +1 | −1 | −1 | si sussurra e si prega; le mani sulle offerte si vedono |
| La Santa Rita | −1 | 0 | +1 | +1 | sottocoperta il buio copre il corpo; uno sconosciuto che si guarda intorno e ogni voce danno nell'occhio |

**6. I momenti.** Quattro passi ciascuno.

| Momento | Corpo | Mano | Mente | Voce | In breve |
|---|---|---|---|---|---|
| L'alba, col mercato del pesce | 0 | −1 | 0 | −1 | la confusione copre mani e parole |
| Il giorno | 0 | 0 | 0 | 0 | il porto lavora, niente di particolare |
| La sera, con le taverne piene | 0 | 0 | +1 | −1 | tutti parlano, nessuno ascolta; chi resta sobrio a guardare si nota |
| La notte | −1 | +1 | 0 | +1 | il buio copre il corpo; ogni rumore di mani e di voci si sente |

**7. Le aggravanti.**

| Aggravante | Quando vale |
|---|---|
| Qui ti hanno già visto | Traccia della zona a 2 o più |
| La stanchezza o i nervi ti pesano | un logorio al secondo stadio o oltre, per gli ambiti che tocca |
| Sono in tanti a guardare | più di un avversario, o una guardia presente |
| Porti addosso qualcosa che non dovresti | un oggetto compromettente in vista |

**8. Le preparazioni.**

| Preparazione | Costo | Durata |
|---|---|---|
| Hai osservato il posto | un passo sul luogo | la scena |
| Hai un travestimento adatto | procurarlo; si perde con un rovescio | finché lo porti |
| Qualcuno ti copre | un favore da restituire | una prova |
| Hai creato un diversivo | un oggetto o una moneta | una prova |

**9. Il catalogo delle soglie** (estratto).

| Facile (6) | Impegnativa (8) | Ardua (10) | Estrema (12) |
|---|---|---|---|
| la porta di una casa | una serratura di magazzino | la cassaforte della capitaneria | la serratura della dogana reale |
| convincere un facchino | un archivista sospettoso | un ufficiale della guardia | far confessare chi rischia la forca |
| arrampicarsi su una rete di carico | nuotare nel porto di notte | scalare il muro della dogana | — |
| difendersi da un ubriaco | difendersi da un marinaio col coltello | difendersi da un soldato | — |

**10. Il tempo.** Un passo dura circa un'ora e mezza. Fare le cose con calma costa due passi.

**11. Il logorio.**

| Logorio | Stadi | Sale | Ambiti | Rimedio |
|---|---|---|---|---|
| Fatica | leggera · pesante · allo stremo | ogni 8 passi senza dormire, e a ogni rovescio fisico | corpo, mano | dormire al sicuro: 4 passi |
| Nervi | saldi · tesi · a pezzi | a ogni ferita, e quando vedi la violenza da vicino | mente, voce | fermarsi in un posto sicuro finché le mani non smettono di tremare |

**12. Ferite e armi.** Come nel §14 e nel §16. Le cure si trovano dal medico degli annegati, vicino alla chiesa; una ferita grave curata da lui diventa lieve in un giorno.

**13. La Traccia.** Cala di una tacca ogni due passi senza nuova Traccia nella zona.

**14. Gli avversari.**

*L'archivista Bressan.* Natura: chi si chiude. Copertura: al coperto. Punti deboli: una data del registro che non torna (*Osservare*, 1); la paura di perdere il posto (*Persuadere*, 1); il debito del figlio con l'usuraio, se lo sai (*Minacciare*, 2). Pericolo: chiama la guardia. Movente: tenersi il posto; smette se gli garantisci che non verrà coinvolto; mantiene la parola.

*Teodoro detto il Pesce.* Natura: chi avanza. Copertura: al coperto, ma gli basta uno scambio per esserti addosso. Punti deboli: quello che gli rovesci addosso (*Muoversi*, 1); il nome del suo capitano, che non vuole morti a bordo (*Sapere*, 2); colpirlo per primo (*Battersi*, 1). Pericolo: coltello (grave da esposto, mortale da allo scoperto); difendersi da lui è Impegnativo. Movente: la taglia che qualcuno ha messo su di te; smette se gli offri di più o se il rumore attira la guardia; non mantiene la parola.

**15. Le protezioni.** Una giacca imbottita, che declassa una ferita da taglio o da botta.

**16. Il repertorio** (estratto, la banchina).

| Voce | Quando | Che cosa colpisce | Quando colpisce |
|---|---|---|---|
| Un doganiere chiede i documenti | giorno | costo: un passo, o una moneta | subito |
| Un carico si sgancia dalla gru | sempre | obiettivo: la strada è bloccata | subito |
| Un ragazzo ti riconosce e corre a dirlo a qualcuno | Traccia 1 o più | Traccia: +1 al Gallo | dopo due passi |
| Una voce: Matteo è stato visto con una donna | sempre, una volta | conoscenza (incompleta) | subito |

**17. La crescita.** Arco lungo. Insegnano: un vecchio scassinatore alla taverna (*Forzare*), il medico degli annegati (*Curare*), il libro dei portolani in archivio (*Sapere*). Danno punti: la chiusura di ogni filo.

**18. Le qualità della storia.** Filo *Il fratello* (0–5). Scadenza *La Santa Rita salpa* (8 caselle, una ogni due passi, a partire dall'alba del primo giorno). Fatti: HAI IL REGISTRO, SAI DEL FIGLIO, DEBITO CON L'USURAIO. Misure: Fiducia di Bressan (0–3). Conoscenze: *Matteo è salito sulla Santa Rita* (vera), *Matteo era con una donna* (incompleta).

**Verifica.** Undici capacità, sette con partenza 0 (più della metà) e due con partenza 2; nessun Fondo sopra la partenza; ogni luogo ha un −1; tutti i valori sono −1, 0 o +1; ogni logorio ha il suo rimedio; entrambi gli avversari hanno cinque righe e almeno due punti deboli di ambiti diversi.

---

# APPENDICE C — Glossario

| Termine | Che cosa vuol dire |
|---|---|
| **aggravante** | un fatto del mondo che alza l'esposizione di un grado |
| **ambito** | il genere di un'azione: corpo, mano, mente, voce, o quelli scelti dall'ambientazione |
| **avversario** | un ostacolo con una volontà; si descrive con cinque righe |
| **capacità** | un'azione che il personaggio sa fare, con un livello da Inesperto a Maestro |
| **catalogo delle soglie** | l'elenco delle cose del mondo con la loro difficoltà |
| **conoscenza** | una cosa che il personaggio sa o crede di sapere; può essere falsa |
| **confronto** | un ostacolo che reagisce |
| **copertura** | il grado di esposizione di un avversario |
| **esposizione** | quanto ti costa un'azione, comunque vada il dado; ha tre gradi |
| **fatto** | una qualità della storia che vale sì o no |
| **ferita** | un danno con un nome e un posto, che impedisce qualcosa; lieve, grave o mortale |
| **filo** | una delle storie in corso, con le sue tappe |
| **finestra** | l'istante in cui un avversario è allo scoperto e decidi tu come finisce |
| **Fondo** | il grado sotto il quale un'azione non scende mai |
| **grado** | uno dei tre livelli dell'esposizione: al coperto, esposto, allo scoperto |
| **imprevisto** | un evento che arriva tanto più spesso quanta più Traccia hai nella zona |
| **livello** | quanto sai fare una capacità: Inesperto, Pratico, Esperto, Maestro |
| **logorio** | ciò che sale da solo e ha un rimedio; ha tre stadi |
| **luogo** | dove si svolge una scena; ha un valore per ambito |
| **misura** | una qualità della storia che vale un numero piccolo |
| **momento** | una parte del giorno; ha un valore per ambito |
| **narratore** | chi conduce la storia al tavolo; non tira mai i dadi |
| **partenza** | quanto una capacità espone di suo |
| **passo** | l'unità di tempo della storia |
| **posta** | che cosa succede nel caso peggiore; si scrive nella ricevuta |
| **preparazione** | ciò che fai prima di agire per abbassare l'esposizione di un grado |
| **protezione** | qualcosa che declassa una conseguenza e si consuma |
| **prova** | un'azione che si risolve con i dadi |
| **qualità** | tutto ciò che il gioco ricorda, del personaggio o della storia |
| **repertorio** | le complicazioni e gli imprevisti di ogni zona |
| **ricevuta** | l'elenco delle cause dell'esposizione, mostrato prima di agire |
| **scadenza** | una cosa che accadrà comunque, con il conto alla rovescia |
| **scena** | un'unità della storia; sulla carta, un paragrafo |
| **scheda dell'ambientazione** | le diciotto voci che adattano il motore a un mondo |
| **snodo** | una scelta che non si disfa, scritta a mano dall'autore |
| **soglia** | il numero che il tiro deve raggiungere: 6, 8, 10 o 12 |
| **stadio** | uno dei tre livelli di un logorio |
| **tacca** | l'unità della Traccia e della crescita |
| **Traccia** | quanto ti hanno notato in una zona, da 0 a 3 |
| **via** | uno dei modi di affrontare un ostacolo |
| **via povera** | la via che c'è sempre: costa, e non si tira |
| **zona** | la parte del mondo in cui si conta la Traccia |

---

# APPENDICE D — Che cosa viene dalla versione 1.3

Per chi conosceva la specifica precedente, che si trova in `archivio/`.

| | |
|---|---|
| **Resta** | le due domande separate, i tre gradi, le sei caselle, l'esposizione ricavata da tabelle per ambito, il Fondo, la ricevuta con le righe che non contano, la via povera, il fallimento che insegna, niente punti ferita, la difficoltà che non cresce, il confronto con le due nature, la finestra e le tre fini, la crescita a tre fonti, nessun testo generato durante il gioco |
| **Cambia nome** | verbo → capacità · ceppo → ambito · base → partenza · attenuante → preparazione · contenitore → spazio e tempo · banco → repertorio · firma → scheda |
| **Cambia sostanza** | due dadi a sei facce invece di un venti, per il realismo e per la carta · quattro livelli invece di cinque · la soglia viene da un catalogo · ritentare costa un passo · la Traccia cala sempre se non la alimenti, e gli imprevisti non la fanno salire · la ricevuta dichiara la posta · le armi e le ferite realistiche · le qualità della storia e le scelte chiuse visibili · tre formati · una scheda completa di diciotto voci |
| **Esce** | l'architettura a nucleo e moduli con i profili · le deviazioni numerate · i vincoli di metodo sulla riscrittura del documento |
