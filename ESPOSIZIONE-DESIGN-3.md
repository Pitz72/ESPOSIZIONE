# ESPOSIZIONE

### Documento di design 3.0

#### Un modello per romanzi di ruolo, su carta e su schermo

> Ogni azione pone quattro domande: puoi farlo, ci riesci, quanto ti costa, che cosa cambia dopo.

---

## Come leggere questo documento

Questo documento descrive ESPOSIZIONE, un motore per scrivere e giocare romanzi di ruolo: storie lunghe e ramificate, in cui un personaggio esplora, indaga, tratta, sceglie, e in cui il mondo, gli oggetti e le persone reagiscono a quello che fa. Contiene le regole, spiegate con esempi, e tutto ciò che serve per costruire una storia.

Lo stesso motore funziona in quattro formati, con gli stessi numeri:

- **il librogame**, in cui chi legge gioca da solo, con paragrafi numerati, una scheda a matita e due dadi;
- **il tavolo**, in cui un narratore conduce e uno o più giocatori decidono;
- **l'app testuale**, in cui il programma fa i conti e mostra tutto sullo schermo, con parole;
- **il gioco grafico**: un'avventura illustrata, un punta e clicca, un gioco con una mappa da esplorare.

Una storia scritta per un formato si porta negli altri senza cambiare le regole. Il motore decide che cosa succede; come mostrarlo lo decide chi costruisce il gioco.

Il documento ha undici parti e cinque appendici. La Parte I racconta l'idea con una scena giocata. La II descrive il personaggio, la III il mondo. La IV spiega come si agisce, con le quattro domande. La V affronta le gradazioni fra successo e insuccesso, con tre modelli messi a confronto. La VI tratta le persone, la VII il pericolo, la VIII la crescita. La IX spiega come si scrive una storia, la X mostra il motore in tre generi lontani dal porto, la XI dice dove non funziona e come lo si mette alla prova. In appendice ci sono le tabelle, l'ambientazione d'esempio ricompilata, il glossario, il confronto con il 2.0 e l'elenco di ciò che andrà cambiato nel codice.

Chi conosce il 2.0 trova nell'appendice D che cosa resta, che cosa cambia e che cosa esce. Alcune parole sono cambiate, perché nell'italiano di tutti i giorni dicevano un'altra cosa: la via povera si chiama **ripiego**, il passo è diventato l'**ora**, la ricevuta è il **quadro**, le qualità della storia sono la sua **memoria**, le conoscenze si dividono in **notizie** e **convinzioni**.

## Che cosa è provato e che cosa no

**Provato.** Il motore 2.0 esiste, in `strumento/motore/`: legge i dati, applica le regole, fa i diciannove controlli sui dati, passa i suoi test, e i giocatori automatici hanno giocato migliaia di partite senza restare bloccati. Una storia di cinquantadue scene, *Il registro della Santa Rita*, si gioca nel terminale, nell'app e sul librogame stampato. Il 24 settembre 2026 una persona l'ha giocata nell'app dall'inizio alla fine, vincendo. Da quella partita vengono tre correzioni di questo documento: le parole che non dicevano la cosa giusta, le scelte che restavano sullo schermo quando non servivano più, e il bisogno di una struttura per la difficoltà.

Il 25 settembre 2026 il motore è stato adeguato al 3.0 (appendice E). Passa 38 test, che controllano anche che i numeri di questo documento siano quelli che il motore produce, e i trenta controlli del §47 sui dati della Santa Rita riscritta. Mille partite simulate per ciascuna di nove strategie finiscono tutte, senza blocchi né errori, e le fasce vi escono con le frequenze delle tabelle. Le strategie contano: chi si prepara vince il 45% delle volte, chi sceglie a caso il 20%, e un giocatore automatico che gioca per vincere l'81%, dopo che ha scoperto, e si è corretta, una strada che vinceva sempre (§54.2). Un primo risultato non va nella direzione sperata: nel *Quasi*, scegliere secondo la situazione vince quanto scegliere sempre «tutto», e il criterio 3 del §54.2 non è ancora superato.

**Non provato.** Nessuno ha ancora giocato il 3.0. I conti delle probabilità sono esatti e si rifanno a mano dalle tabelle dell'appendice A. Ma che le quattro fasce si sentano diverse, che il *Quasi* sia davvero una scelta, che i tratti e i legami arricchiscano la scheda senza appesantirla, che un quadro con quattro sezioni si legga in pochi secondi: tutto questo lo possono dire soltanto le persone che giocano. Il rischio più grande è proprio il quadro: il 2.0 chiedeva di leggere una ricevuta, il 3.0 chiede di leggerne una più lunga. La Parte XI dice come lo si verifica, e che cosa deve succedere perché la prova sia superata.

Una persona sola, per di più l'autore del progetto, non fa una prova. Le osservazioni di quella partita sono servite a correggere la lingua e due regole; non dicono niente sul resto.

---
---

# PARTE I — L'IDEA

## 1. Che cosa vogliamo costruire

Vogliamo un motore con cui si possano scrivere romanzi da giocare. Chi gioca non assiste alla storia: la attraversa. Sceglie dove andare, con chi parlare, che cosa rischiare, e la storia si ricorda di tutto.

Il modello è quello del romanzo di ruolo, che *Disco Elysium* ha portato in alto: un personaggio con una vita interiore, un mondo in cui ogni oggetto, ogni luogo e ogni persona reagiscono, un ritmo che è quello della lettura e della scelta, mai quello del combattimento. ESPOSIZIONE ne prende la profondità e la costruisce con mezzi suoi, che funzionano anche sulla carta.

Sette promesse guidano ogni regola di questo documento.

1. **Il personaggio è fatto di ciò che sa, di ciò che è e di ciò che gli è successo.** Non ha forza, destrezza e intelligenza in numeri: ha capacità, tratti detti a parole, cose, notizie, convinzioni, legami con le persone, e condizioni che dicono come sta.
2. **Il mondo reagisce.** Gli oggetti si usano, si combinano, si rompono e si perdono. I luoghi hanno proprietà (buio, rumore, folla, altezza, acqua) che ogni azione legge. Le persone ricordano, aiutano, tradiscono e cambiano opinione.
3. **Le scelte contano più dei dadi.** Il dado dice quanto ti riesce una cosa. Se puoi tentarla, con quali probabilità e a che prezzo dipende da chi sei, da che cosa hai, da che cosa sai, da dove e quando agisci.
4. **Vedi prima di agire.** Prima di ogni azione che conta il gioco ti mostra il **quadro**: se puoi farla, quanto è probabile riuscirci, quanto ti costa, che cosa può cambiare.
5. **Senti la differenza fra un esito e l'altro.** Riuscire in pieno, riuscire, quasi riuscire e non riuscire sono quattro cose diverse, e nessuna è una versione più debole di un'altra.
6. **La violenza è reale.** Un colpo di coltello può uccidere. Non ci sono punti ferita da consumare: c'è un corpo che si rompe. Nessuno però muore senza essere stato avvisato.
7. **Non resti mai bloccato.** Davanti a ogni ostacolo c'è almeno una strada che non richiede il dado: il **ripiego**. Costa, ma c'è.

Il motore non fa alcune cose, per scelta:

- non ha punti ferita né barre da svuotare;
- non ha attributi in numeri, e non ha livelli in cui si spendono punti su Forza per diventare forti;
- non ha classi, né alberi di talenti;
- non ha nemici che crescono insieme a te;
- non tira mai contro di te: i dadi li tira soltanto chi gioca;
- non genera testo mentre giochi: ogni frase è stata scritta, o almeno riletta e approvata, da chi ha scritto la storia.

Il nome del motore viene da uno dei suoi meccanismi, l'**esposizione**: quanto la situazione ha presa su di te, e quindi quanto ti costa agire. Nel 2.0 era quasi tutto il gioco. Nel 3.0 risponde a una delle quattro domande, e le altre tre contano quanto lei.

## 2. Una scena giocata

Prima delle regole, una scena. Viene dall'ambientazione d'esempio dell'appendice B: una città di porto nel Seicento, un fratello scomparso, una nave che sta per salpare.

*È l'alba. Sei nell'archivio della capitaneria. Il salone è pieno di capitani che protestano per le nuove tariffe, e l'archivista Bressan non sa più chi ascoltare. Sul banco, aperto, c'è il registro degli imbarchi: se tuo fratello Matteo è salito su una nave, il suo nome è lì dentro.*

Sulla tua scheda, fra le altre cose, ci sono due tratti, *Vista acuta* e *Sa leggere*, una borsa da facchino presa in prestito, e nessun legame con Bressan: per lui sei una faccia fra cento. Il gioco ti offre queste scelte:

1. **Prendo il registro di nascosto.**
2. **Leggo il registro al contrario, dall'altra parte del banco.** Questa scelta c'è solo perché hai *Vista acuta* e *Sa leggere*: un altro personaggio non la vedrebbe.
3. **Chiedo a Bressan di Matteo.**
4. **Pago un facchino perché legga il registro al posto mio** (due monete, un'ora). È il ripiego: non si tira, e ti dà soltanto metà della risposta, perché il facchino non sa leggere bene i nomi.
5. *Chiedo a Lucia di parlare a Bressan per me.* Chiusa: richiede di conoscere Lucia. La vedi lo stesso, e sai che cosa ti manca.

Scegli la prima, e prima di tirare il gioco ti mostra il quadro:

```
Prendo il registro di nascosto                          Sottrarre · mano

PUOI?     sì · il registro è aperto sul banco, a portata di mano

RIESCI?    8  Impegnativa: prendere qualcosa sotto gli occhi di chi lo sorveglia
          +1  sei Pratico in Sottrarre
          +1  nella borsa da facchino il registro sparisce
          ──  in pieno 17 · riesci 56 · quasi 19 · non riesci 8

COSTA?     0  Sottrarre, di suo, non si nota
          +1  nell'archivio chi tocca le carte viene guardato   — non conta
          −1  all'alba la folla dei capitani copre le mani
          ──  0  AL COPERTO

DOPO?     riesci: hai il registro
          quasi: tutto, ma qualcuno ti vede · oppure la metà: la nave, non i nomi
          non riesci: scopri qualcosa sul registro e su chi lo custodisce
          se va male: niente di peggio che non riuscire
```

Il quadro risponde a quattro domande. **Puoi farlo?** Sì: non ti serve niente che non hai. **Ci riesci?** Devi fare almeno 8 con due dadi, più 1 perché sai farlo e più 1 per la borsa: riesci 72 volte su 100, e di queste 17 in pieno. **Quanto ti costa?** Niente: sei al coperto. L'archivio espone chi tocca le carte, ma la folla dell'alba ti copre, e Sottrarre non scende sotto il coperto: la riga del +1 non cambia niente, e il quadro la segna. **Che cosa cambia dopo?** Dipende dalla fascia in cui cadrà il tiro, e il quadro te le elenca.

Tiri: 3 e 2, cinque. Aggiungi 2: sette. Ti manca 1 per arrivare a 8. È un **Quasi**, e il gioco ti chiede di scegliere:

- **tutto, ma un grado più esposto**: prendi il registro, ma un capitano ti vede infilarlo nella borsa. La Traccia dell'archivio sale di una tacca;
- **la metà**: fai in tempo a leggere soltanto la riga della nave, *Santa Rita*, e il suo carico, ma non l'equipaggio. È quello che ti avrebbe dato il facchino;
- **lasci perdere**: ritiri la mano prima che qualcuno se ne accorga. Non ottieni niente, e non paghi niente.

Prendi tutto. Nel registro trovi il nome di Matteo, aggiunto dopo con un inchiostro più chiaro, e al posto della firma una croce. Matteo sa scrivere meglio di chiunque in questo porto: quella croce non l'ha fatta lui. Esci con il registro nella borsa e un capitano che ricorderà la tua faccia.

Con un altro tiro sarebbe andata diversamente, e non solo di poco:

- se i dadi avessero fatto 10 o più, il totale avrebbe superato la soglia di 4 e saresti **riuscito in pieno**: oltre al registro avresti notato la chiave dell'armadio appesa alla cintura di Bressan, e avresti saputo che di notte il registro sta chiuso lì dentro;
- con un tiro da 6 a 9 saresti **riuscito**: il registro, e basta;
- con 3 o meno **non saresti riuscito**: Bressan posa il gomito sul registro proprio in quel momento, senza nemmeno guardarti. Ma avresti visto la chiave alla sua cintura, e capito dove finisce il registro la notte.

Se fossi venuto di notte, a archivio chiuso, il quadro sarebbe stato un altro. Entrare dalla finestra del cortile sarebbe costato poco, perché il buio copre il corpo; prendere il registro ti avrebbe messo allo scoperto, perché nel silenzio ogni rumore di carte si sente. E allo scoperto un *Non riesci* non ti lascia soltanto a mani vuote: chiama la ronda. Nessuno ha scritto questa regola scena per scena. Il gioco la ricava dalle proprietà del luogo e del momento, e tu la scopri leggendo due quadri.

In questa scena c'è quasi tutto il motore: un personaggio fatto di tratti e di cose, una via che esiste solo per lui, una scelta chiusa che mostra che cosa manca, un quadro con quattro domande, un tiro che cade in una di quattro fasce, e una storia che si ricorda che adesso hai il registro e che un capitano ti ha visto.

## 3. Da dove viene

Il motore prende idee da giochi che le hanno inventate prima, e lo dichiara.

- Da *Powered by the Apocalypse* viene il successo con un prezzo, la fascia di mezzo del tiro: il nostro *Quasi*. Da quei giochi ci allontaniamo in un punto preciso: nel *Quasi* il prezzo non lo sceglie un narratore fra mosse sue, ma chi gioca, fra opzioni dichiarate prima.
- Da *Blades in the Dark* viene la separazione fra quanto rischi e quanto ottieni, dichiarate prima del tiro. La nostra esposizione somiglia alla loro posizione; ma da noi si ricava da tabelle scritte una volta, non da un accordo al tavolo.
- Da *Genesys* viene l'idea che la riuscita e le complicazioni siano due letture diverse dello stesso tiro.
- Da *Disco Elysium* vengono la profondità del personaggio, le scelte che si aprono per chi è fatto in un certo modo, la differenza fra prove che si possono ritentare e prove che segnano la partita. Prendiamo le distanze in due punti. Il personaggio non ha voci interiori che parlano: la sua vita interiore sta nelle convinzioni, frasi scritte dall'autore che chi gioca legge sulla scheda. E non c'è un armadio dei pensieri in cui un'idea matura col tempo e dà un bonus: una convinzione cambia soltanto quando chi gioca, davanti a una notizia che la smentisce, decide di lasciarla andare.
- Da *Burning Wheel* vengono le convinzioni come parte della scheda. Là le scrive chi gioca; qui le scrive l'autore, perché devono aprire e chiudere scene scritte da lui.
- Da *Fallen London* viene la memoria della storia che apre e chiude le scene; da *Fabled Lands* le parole chiave sulla scheda di un librogame.

Il motore aggiunge a queste idee due cose sue. La prima: **il costo di un'azione non lo decide l'autore scena per scena, lo ricava il gioco da tabelle scritte una volta sola**, e le tabelle distinguono che cosa stai facendo. Per questo lo stesso luogo può essere ottimo per un'azione e pessimo per un'altra. La seconda: **le stesse proprietà del mondo rispondono a tutte e quattro le domande.** Il buio nasconde chi si muove (costo), rende più difficile leggere (riuscita), e senza una luce ti impedisce di leggere del tutto (puoi farlo?). L'autore scrive «qui è buio» una volta, e il motore ne ricava le conseguenze.

---
---

# PARTE II — IL PERSONAGGIO

## 4. Sei parti

Ecco la scheda del personaggio della Santa Rita all'inizio della storia, com'è scritta sulla carta:

```
CAPACITÀ     Osservare: Esperto
             Muoversi, Resistere, Sottrarre, Sapere, Mentire: Pratico
             le altre: Inesperto
TRATTI       Vista acuta · Sa leggere · Minuto · Soffre il mare
COSE         quattro monete · il biglietto di Matteo · una borsa da facchino
             una lanterna spenta e l'olio per accenderla · la giacca imbottita
NOTIZIE      —
CONVINZIONI  Matteo non scapperebbe mai di casa
             Non fidarti di chi lavora per Grimani
LEGAMI       Zeno, l'oste del Gallo: si fida di te · ti deve un favore
CONDIZIONI   Fatica: leggera · Nervi: saldi · nessuna ferita
```

La scheda ha sei parti, e ognuna agisce su una cosa precisa:

| Parte | Che cosa dice | Su che cosa agisce |
|---|---|---|
| **Capacità** | che cosa sai fare, e quanto bene | la riuscita |
| **Tratti** | che cosa sei, a parole e senza numeri | se puoi tentare, e la difficoltà in casi dichiarati |
| **Cose** | che cosa hai con te | se puoi tentare, e la riuscita, come attrezzi |
| **Notizie e convinzioni** | che cosa sai del mondo, e che cosa credi di te e degli altri | le vie che vedi, la difficoltà, la verità del quadro |
| **Legami** | chi conosci, e come stai con lui | aiuti, favori, tradimenti, la memoria delle persone |
| **Condizioni** | come stai | ferite, logorio, stati d'animo |

Nessuna parte fa il lavoro di un'altra. Se ti chiedi perché una prova è difficile, la risposta sta nella cosa che affronti e in ciò che sai di lei; se ti chiedi perché ci riesci, nelle tue capacità e nei tuoi attrezzi; se ti chiedi perché puoi tentarla, nei tuoi tratti, nelle tue cose e nelle tue notizie. Il quadro (§21) riporta ogni riga con la parte da cui viene.

## 5. Le capacità

*Nell'archivio prendi il registro con Sottrarre, lo leggi da lontano con Osservare, chiedi di Matteo con Persuadere.*

Una **capacità** è un genere di azione che il personaggio sa fare: *Sottrarre*, *Persuadere*, *Osservare*. Ha quattro dati:

| Dato | Che cosa dice | Esempio: *Persuadere* |
|---|---|---|
| **nome** | che cosa fai | convincere, trattare, chiedere |
| **ambito** | di che genere di azione si tratta: corpo, mano, mente, voce, o gli ambiti che l'ambientazione sceglie | voce |
| **partenza** | quanto l'azione espone di suo, prima di guardare dove e quando la fai: 0, 1 o 2 | 1 |
| **Fondo** | il grado di esposizione sotto il quale l'azione non scende mai: 0, 1 o 2 | 1 |

La partenza e il Fondo servono alla terza domanda, quella del costo, e sono spiegati nel §19.

Il personaggio ha un **livello** in ogni capacità:

| Livello | Si aggiunge al tiro | Che cosa significa |
|---|---|---|
| Inesperto | +0 | non l'hai mai fatto davvero |
| Pratico | +1 | sai farlo |
| Esperto | +2 | l'hai fatto molte volte, anche sotto pressione |
| Maestro | +3 | te l'ha insegnato qualcuno che ne sapeva più di te |

Un'ambientazione ha da 8 a 14 capacità, divise in 3–5 ambiti, con almeno due capacità per ambito. Sotto le otto, le strade davanti a un ostacolo si somigliano troppo; sopra le quattordici, chi gioca non ricorda la propria scheda.

Le capacità sono l'unica parte della scheda che si esprime con un numero, ed è un numero piccolo. Tutto il resto si dice a parole.

## 6. I tratti

*Il tuo personaggio è minuto. Nella stiva della Santa Rita c'è una finestrella da cui passa soltanto un ragazzo: tu ci passi. Più tardi un marinaio ti afferra per il collo, e divincolarti ti costa più che a chiunque altro.*

Un **tratto** è una parola, o una frase breve, che dice com'è fatto il personaggio: *robusto*, *minuto*, *vista acuta*, *soffre il mare*, *sa leggere*, *mancino*. Non ha un numero e non entra in una somma. Agisce soltanto nelle situazioni che l'ambientazione dichiara, in uno di quattro modi:

| Effetto | Che cosa fa | Esempio |
|---|---|---|
| **apre** | rende possibile una via che gli altri non hanno | *Minuto*: passare dalla finestrella della stiva |
| **chiude** | rende impossibile una via che gli altri hanno | *Soffre il mare*: arrampicarsi sulle sartie col mare mosso |
| **sposta** | alza o abbassa di un gradino la soglia di un genere di prova | *Vista acuta*: notare qualcosa da lontano, un gradino in meno. *Minuto*: trattenere qualcuno o liberarsi da una presa, un gradino in più |
| **aggrava** | fa valere un'aggravante del mondo (§19) | *Conosciuto al porto*: nelle zone del porto vale «qui ti riconoscono» |

Il **gradino** è la distanza fra due soglie vicine del catalogo: da Facile a Impegnativa, da Impegnativa ad Ardua. Vale due punti sul tiro, cioè quanto due livelli di capacità. Per questo un tratto conta soltanto nei casi dichiarati: se valesse sempre, peserebbe più di una capacità.

L'ambientazione elenca i tratti possibili, ciascuno con i suoi effetti. Sulla scheda di chi gioca c'è solo la parola; gli effetti li conosce il motore, o sono stampati in fondo al librogame.

### 6.1 «Non hai la forza»

Alcune cose del mondo chiedono un corpo adatto. Una porta di magazzino sprangata non si sfonda con l'abilità: si sfonda con la forza. Il catalogo delle difficoltà (§44) lo dichiara così:

```
Sfondare una porta sprangata              Ardua (10)
Serve forza: Robusto, oppure una leva, oppure qualcuno che spinga con te.
```

Se non hai nessuna delle tre cose, la via è chiusa, e il gioco te lo mostra con le alternative: «Richiede forza: essere robusto, una leva, o qualcuno che ti aiuti». La regola è sempre la stessa: **un tratto del corpo che ti manca non chiude mai una via senza dire che cosa lo sostituisce.** Una cosa, una persona, oppure il ripiego. È il controllo 9 del §47.

### 6.2 Regole per i tratti

- Un personaggio comincia con **da tre a cinque tratti**. Di più, e chi gioca non li ricorda; di meno, e i personaggi si somigliano.
- **Ogni tratto iniziale dovrebbe tagliare in due direzioni**: aprire qualcosa e chiudere, o rendere più difficile, qualcos'altro. *Minuto* apre la finestrella e rende più difficile liberarsi da una presa. Un tratto soltanto buono fa della scelta del personaggio una somma di vantaggi. Il motore lo segnala come avviso, non come errore: in una storia per ragazzi, per esempio, può andar bene.
- **Un tratto che nessuna scena legge non serve.** Il controllo 8 lo segnala.
- I tratti **si guadagnano e si perdono** con la storia: una cicatrice, un nome che si fa conoscere, una paura superata. Se ne parla nella Parte VIII.

Perché parole e non numeri? Perché un numero chiede di essere sommato, e presto il gioco diventa la ricerca della somma più alta. Una parola dice dove conta. *Robusto* non ti rende migliore in tutto: ti apre le porte sprangate e ti chiude la finestrella della stiva.

## 7. Le cose

*Nella borsa da facchino il registro sparisce. Più tardi, nella stiva buia, la lanterna non si accende: l'olio è finito. Ne trovi un fiasco dietro una cassa, e la lanterna torna a fare luce.*

Le **cose** sono ciò che il personaggio porta con sé. Ogni cosa ha un nome, alcune **proprietà** (fa luce, taglia, fragile, pesante, compromettente, si nasconde bene) e uno o più **usi**:

| Uso | Che cosa fa | Esempio |
|---|---|---|
| **attrezzo** | +1 al tiro per un genere di azione | un grimaldello per *Forzare*, una corda per arrampicarsi |
| **chiave** | apre una via | la chiave dell'armadio, un lasciapassare |
| **preparazione** | abbassa il costo (§19) | una casacca da facchino, come travestimento |
| **protezione** | declassa una conseguenza (§38) | la giacca imbottita |
| **prova** | fa scattare una scena, se la mostri | la bolla di carico di Grimani |
| **scorta** | si consuma | le monete, l'olio, le candele |

Una cosa ha un solo uso per volta: nella stessa prova la borsa è un attrezzo oppure un nascondiglio, non tutte e due le cose.

### 7.1 Usare, combinare, rompere, perdere

- **Usare.** Le cose del personaggio compaiono nel quadro quando servono, con la loro riga. Anche i luoghi hanno le loro cose: la lanterna appesa al muro, la scala a pioli, la cassa di chiodi. Sono vie, e si usano come le altre.
- **Combinare.** L'ambientazione dichiara le combinazioni: la lanterna più l'olio fa una lanterna accesa; la corda più il rampino fa un rampino con la corda. Quando hai tutte le parti, il gioco ti offre la scelta di combinarle, con il suo costo in tempo.
- **Rompere.** Una cosa ha tre stati: **intatta**, **rovinata**, **rotta**. Rovinata funziona ancora; rotta non funziona più. Una cosa *fragile* scende di uno stato ogni volta che una prova in cui l'hai usata finisce in *Non riesci*; le altre soltanto con un rovescio.
- **Perdere.** Con un rovescio perdi ciò che avevi in mano, se la scena lo dice. Ciò che cade in acqua è perso. Ciò che ti sequestrano può tornare, se la storia lo prevede.

L'ambientazione può anche dire **quanto porti**: per esempio sei cose, e una sola ingombrante. È un'opzione, utile nei viaggi e negli horror, dove scegliere che cosa lasciare è già una decisione.

### 7.2 Attrezzi e preparazioni: la divisione

*La borsa da facchino ti aiuta a far sparire il registro. La casacca da facchino fa sì che nessuno si chieda che cosa ci fai lì.*

**Gli attrezzi e gli aiuti agiscono sulla riuscita. Le preparazioni agiscono sul costo.** La domanda che le separa è semplice:

- *ti aiuta a farlo meglio?* È un attrezzo, o un aiuto: +1 al tiro;
- *fa sì che nessuno ti noti, o che non resti niente di te?* È una preparazione: −1 all'esposizione.

Il grimaldello apre meglio la serratura, ma non ti nasconde. La casacca ti nasconde, ma non apre niente. Un complice che tiene la scala è un aiuto; un complice che fa il palo è una preparazione.

Questa divisione tiene separate due domande che devono restare separate: quanto è probabile riuscire, e quanto ti costa provarci. Se un'unica cosa potesse abbassare tutte e due, diventerebbe la scelta ovvia in ogni situazione, e il gioco si ridurrebbe a procurarsela. Così invece ogni ostacolo chiede di scegliere su che cosa investire: tempo e denaro per nasconderti, oppure per riuscire meglio.

### 7.3 Raccogliere, portare, lasciare

*Proposta del 25 settembre 2026, da approvare: non è ancora nel motore.*

*Nel magazzino sette, su un barile, c'è una leva di ferro. La vedi perché hai la lanterna accesa. La prendi, ma la borsa è piena: per portarla devi lasciare lì il fiasco d'olio. Quando ci torni, due ore dopo, il fiasco è ancora sul barile.*

**Le cose stanno nei luoghi.** Ogni luogo, o ogni scena, elenca le cose che contiene. Il gioco offre da solo «Prendo la leva», «Lascio il fiasco», «Do la corda a Lucia», senza che l'autore scriva queste scelte. Ciò che lasci resta dove l'hai lasciato, e il luogo se lo ricorda.

**Per prendere una cosa servono tre condizioni**, e il quadro le mostra come ogni altro «Puoi farlo?»:

1. **La vedi.** Una cosa in vista si prende e basta. Una cosa nascosta dichiara che cosa serve per vederla: una luce, al buio; una notizia, se è nascosta dove solo chi sa guarda; una prova di *Osservare*, quando la cerchi sotto una pressione. Senza pressione cercare non si tira: costa tempo, come fare le cose con calma.
2. **La riconosci.** Una cosa può avere un nome finché non la riconosci: «un foglio pieno di timbri». Diventa «la bolla di carico di Grimani» con un tratto (*Sa leggere*), con una notizia, oppure con una prova di *Sapere* o di *Osservare* quando c'è una pressione. Una cosa che non riconosci la puoi portare, ma non la puoi usare per ciò che è: una bolla che non sai leggere non convince nessun ufficiale.
3. **Hai la forza.** Le cose pesanti chiedono forza come le porte sprangate (§6.1): essere robusto, una leva, qualcuno che ti aiuti. La scelta chiusa dice le alternative.

**Quanto porti si conta in posti.** L'ambientazione dice quanti posti ha il personaggio a mani vuote: nel porto, quattro. Una cosa normale occupa un posto, una ingombrante due, le cose piccole (monete, un biglietto, una chiave) nessuno. I contenitori aggiungono posti finché li porti: una borsa tre, uno zaino sei. Quando i posti sono pieni, per prendere devi lasciare qualcosa, e il quadro lo dice: «Puoi farlo? Sì, se lasci qualcosa». Un compagno ha i suoi posti, e gli puoi dare le tue cose. Una ferita grave al braccio toglie un posto.

Sulla carta i posti sono una fila di caselle sulla scheda: una cosa ingombrante ne annerisce due, e lo zaino sblocca le caselle tratteggiate.

Il limite serve a una cosa sola: rendere una decisione ciò che porti. Senza, il personaggio raccoglie tutto, e le cose smettono di contare. Con i posti, ogni cosa presa è una cosa lasciata, e chi torna in un luogo trova ciò che ha lasciato lì.

## 8. Le notizie e le convinzioni

*Un facchino ti dice che Matteo è scappato con una donna. Lo scrivi sul taccuino. Ma sulla tua scheda c'è scritto «Matteo non scapperebbe mai di casa», e il gioco non ti offre di cercare la donna: non ci credi. Due ore dopo, nel registro, trovi la croce al posto della firma di Matteo, e sul taccuino la voce del facchino diventa «smentita».*

### 8.1 Le notizie

Una **notizia** è una cosa che il personaggio sa del mondo, o crede di sapere: «Matteo è stato imbarcato sulla *Santa Rita*», «La porta del magazzino sette ha una serratura nuova, di Genova». Può essere **vera**, **incompleta** o **falsa**, e chi gioca non sa quale.

Le notizie agiscono in quattro modi:

| Modo | Che cosa fa | Esempio |
|---|---|---|
| **apre** | una via richiede di sapere qualcosa | «Vado alla Santa Rita» richiede di sapere che Matteo è a bordo |
| **rivela** | una via resta invisibile finché non sai che esiste | la porta sul retro del magazzino sette compare solo a chi ne ha sentito parlare |
| **abbassa** | la soglia scende di un gradino per chi sa | sapere che la serratura è di Genova, e come sono fatte, la porta da Ardua a Impegnativa |
| **rende esatto** | il quadro di un luogo che conosci è esatto; di uno che non conosci è una stima (§13) | chi è già stato nei magazzini sa che di notte sono bui |

> **Una notizia falsa non entra mai nel quadro.** Il gioco può farti credere una cosa sbagliata sul mondo, mai una cosa sbagliata su quanto ti è probabile riuscire o su quanto ti costerà agire.

Una notizia falsa può aprire vie, e anzi è fatta per questo: chi crede che Matteo sia scappato con una donna andrà a cercarla, e nella scena in cui la trova scoprirà che non è così. Non abbassa mai una soglia e non entra mai in una riga del quadro.

### 8.2 Come si scopre una notizia falsa

Sul taccuino ogni notizia ha uno stato che chi gioca vede:

- **sentita dire**: l'hai saputa, ma nessuno l'ha confermata;
- **verificata**: hai visto con i tuoi occhi, o l'hai confermata;
- **smentita**: sai che non è vera.

Una notizia cambia stato in tre modi. **Un'altra notizia la smentisce**: l'autore dichiara che «Matteo è tenuto legato nella stiva» smentisce «Matteo è scappato con una donna». **Due notizie sono in contrasto**: se ne hai due che non possono essere vere insieme, il taccuino le unisce con un segno, «non possono essere vere tutte e due», e sta a te scoprire quale cade. **La verifichi**: alcune scene offrono di controllare una notizia, con il suo costo in tempo o con una prova.

Una notizia vera non è mai segnata come smentita, e una falsa non è mai segnata come verificata. Il taccuino può restare incompleto; non mente.

### 8.3 Mettere insieme

*Sai che la Santa Rita porta un carico di Grimani. Sai che le casse pesano più di quanto dovrebbero pesare dei tessuti. Seduto in chiesa, ci pensi su, e capisci.*

Alcune notizie, messe insieme, ne danno una nuova. L'autore lo dichiara: da «il carico è di Grimani» e «le casse pesano troppo» si ricava «nelle casse ci sono armi». Quando hai tutte le notizie di partenza, in un posto tranquillo il gioco ti offre **«Metto insieme quello che so»**. Costa un'ora e non si tira: ragionare è una scelta, e il gioco la premia con una notizia. È ciò che serve a un giallo, dove l'indagine si fa più con il taccuino che con i grimaldelli.

### 8.4 Le convinzioni

Una **convinzione** è una frase che il personaggio crede su di sé o sugli altri: «Matteo non scapperebbe mai di casa», «Non fidarti di chi lavora per Grimani», «Nessuno in questo porto mi aiuterà». Le scrive l'autore; il personaggio ne ha due o tre all'inizio, e altre gli nascono dagli eventi della storia.

Una convinzione agisce su quali scelte ti vengono in mente:

- **apre** vie che vede soltanto chi ci crede: chi è sicuro che Matteo non sia scappato può andare dritto a cercarlo sulla nave, senza passare dalle voci del porto;
- **chiude** vie che chi ci crede non prende. La scelta chiusa si vede, con la ragione: «Parlo con il capitano Serra. *Credi che non ci si possa fidare di chi lavora per Grimani.*»

Una convinzione non tocca mai i numeri: non sposta soglie, non aggiunge al tiro, non cambia il costo. Agisce solo su che cosa ti viene in mente di fare.

### 8.5 Cambiare idea

*Teodoro, prima di scappare, ti dice che il capitano Serra non vuole morti sulla sua nave. Adesso lo sai. Seduto sui gradini della chiesa, ripensi a quello che Matteo ha scritto su chi lavora per Grimani.*

L'autore dichiara per ogni convinzione quali notizie la **mettono in dubbio**. Quando ne hai una, in un posto tranquillo il gioco ti offre **«Ci ripenso»**. Costa un'ora, non si tira, e finisce con una scelta tua:

- **«La lascio andare»**: la convinzione sparisce dalla scheda, e con lei le scelte che chiudeva. Parlare con Serra diventa possibile;
- **«Ci credo ancora»**: la convinzione resta, e da quel momento la scheda la segna come *messa in dubbio*. Tenere una convinzione contro le prove è una scelta di carattere, e la storia può tenerne conto.

Cambiare idea può avere altri effetti, che l'autore dichiara: un tratto nuovo, un legame che si sposta, una scena che si apre.

È questa la vita interiore del personaggio: che cosa crede, e quando smette di crederlo. Tre ragioni la tengono fuori dai dadi. Cambiare idea è una decisione, e le decisioni in questo motore le prende chi gioca. Una convinzione che cambiasse con un tiro fortunato non direbbe niente del personaggio. E sulla carta basta una riga sulla scheda e un paragrafo di ripensamento, senza tabelle.

## 9. I legami

*Zeno, l'oste del Gallo, si fida di te e ti deve un favore. Quando gli chiedi di tenere d'occhio la porta mentre parli con il marinaio, lo fa; ma adesso non ti deve più niente.*

Un **legame** è il rapporto del personaggio con una persona, descritto da alcune dimensioni fra cinque: **fiducia**, **debito**, **paura**, **affetto**, **rancore**. Ogni persona usa soltanto quelle che le servono, ciascuna da 0 a 3. Le persone ricordano quello che hai fatto, ti aiutano, ti chiedono favori, ti tradiscono, cambiano opinione. Se ne parla per intero nella Parte VI.

## 10. Le condizioni

*Dopo una notte senza dormire la fatica è pesante, e ogni cosa che fai con il corpo lascia più tracce. Dopo aver visto il coltello di Teodoro sei spaventato, e la stiva buia ti sembra più buia di prima.*

Le **condizioni** dicono come sta il personaggio. Sono di tre tipi:

- il **logorio**, ciò che sale da solo e ha un rimedio: la fatica, la fame, i nervi;
- le **ferite**, ciò che ti succede e ti impedisce qualcosa: una mano tagliata, una caviglia storta;
- gli **stati d'animo**, ciò che provi adesso e passa: spaventato, furioso, umiliato, sicuro di te.

Sono spiegate nella Parte VII.

---
---

# PARTE III — IL MONDO

## 11. I luoghi e le loro proprietà

*Nei magazzini, di notte, è buio. Chi si muove fra i vicoli non si vede; chi cerca il numero sette sulle porte deve avvicinarsi con la lanterna; chi non ha una luce non legge niente. Tre conseguenze, e l'autore ha scritto una parola sola: buio.*

### 11.1 Le proprietà

La storia si svolge in **luoghi**: l'archivio, la banchina, la taverna. Un luogo si descrive con le sue **proprietà**: buio, silenzio, folla, sorveglianza, acqua, altezza, freddo. L'ambientazione ne sceglie da sei a dodici, e per ognuna scrive una volta sola che effetto ha su ciascuna delle domande:

| Proprietà | Quanto ti costa (per ambito) | Ci riesci? | Puoi farlo? |
|---|---|---|---|
| **buio** | corpo −1 («il buio copre il corpo»), se non porti una luce accesa | cercare, riconoscere, lavorare di precisione: un gradino in più, se non hai una luce | leggere: no, senza una luce |
| **silenzio** | mano +1, voce +1 («nel silenzio ogni rumore si sente») | cogliere un discorso: un gradino in meno | — |
| **folla** | mano −1, voce −1 («la folla copre mani e parole») | seguire qualcuno: un gradino in più | — |
| **sorveglianza** | corpo +1, mano +1 («chi gira dove non deve, o tocca ciò che non deve, viene guardato») | — | — |
| **acqua** | — | nuotare di notte: un gradino in più | nuotare: soltanto se sai nuotare (*Sa nuotare*), altrimenti serve una barca |
| **altezza** | — | *Soffre le vertigini*: un gradino in più | — |

Un luogo ha:

- una **zona**, cioè la parte del mondo in cui si conta la Traccia (§37). Di solito ogni luogo è una zona;
- un elenco di **proprietà**;
- se serve, qualche **riga propria**, per ciò che nessuna proprietà dice: nell'archivio «leggere è ciò che fanno tutti» vale mente −1, e riguarda soltanto l'archivio.

I **momenti** del giorno aggiungono le loro proprietà: la notte porta buio e silenzio, l'alba porta la folla del mercato. Una proprietà vale una volta sola: all'alba nella taverna c'è folla comunque, e il momento non ne aggiunge un'altra. Un luogo può anche sospendere una proprietà del momento, con una riga: «all'alba i magazzini restano vuoti».

Due regole tengono in misura le proprietà:

- **L'ambiente conta al massimo 2**, in su o in giù, per ogni ambito. Le righe in più compaiono sul quadro come righe che non contano (§21).
- **Ogni luogo deve essere buono per qualcosa.** In almeno un momento, almeno un ambito vale −1. Un luogo che espone tutto e non copre niente non offre scelte: è soltanto un posto da evitare.

### 11.2 Perché le proprietà

Nel 2.0 ogni luogo e ogni momento avevano un valore per ogni ambito, scritto a mano: con venti luoghi, sei momenti e quattro ambiti, 104 caselle da tenere coerenti. Con le proprietà l'autore compila una tabella di dieci righe per quattro ambiti, e poi descrive ogni luogo con qualche parola. Le caselle diventano una quarantina, e restano coerenti da sole: il buio vale −1 al corpo in ogni luogo buio.

C'è una seconda ragione, più importante. Nel 2.0 un luogo influiva soltanto sul costo. Con le proprietà, lo stesso buio che ti nasconde ti impedisce di leggere, e la stessa folla che copre le tue mani ti fa perdere di vista chi stai seguendo. Il mondo reagisce in modo coerente su tutte le domande, e chi gioca impara a leggerlo: *qui è buio, quindi*.

### 11.3 I luoghi che cambiano

*Dopo che hai preso il registro, all'archivio c'è una guardia alla porta. Dopo che la Santa Rita ha preso il largo, sulla banchina c'è un posto vuoto in fondo al molo.*

Un luogo può avere degli **stati**, che dipendono dalla memoria della storia (§14): se è vero un certo fatto, il luogo aggiunge o toglie proprietà, cambia il testo, apre o chiude vie. «Se il registro è sparito: l'archivio ha la sorveglianza anche di notte, e il testo dice che c'è una guardia alla porta.» Il tempo cambia i luoghi attraverso i momenti e le scadenze; le tue azioni li cambiano attraverso gli stati.

### 11.4 Lo stato del mondo

*Proposta del 25 settembre 2026, da approvare: non è ancora nel motore.*

*Hai forzato il portone dell'archivio. Il giorno dopo il portone è ancora scardinato, e c'è una guardia. Nella stiva hai acceso la lanterna appesa alla trave, e adesso la stiva non è più buia, per nessuno: né per te né per chi ti cerca. Poi dal mare sale la nebbia, e per sei ore sulla banchina non si vede a dieci passi.*

**Luoghi e cose hanno uno stato.** Un luogo, o una cosa di un luogo, può avere uno stato scelto da un elenco che l'autore dichiara: il portone chiuso, aperto o forzato; la lanterna della stiva spenta o accesa; il porto tranquillo o in allarme. Le azioni lo cambiano, e ogni stato aggiunge o toglie proprietà, vie e testo. Oggi il motore fa questo con i fatti e con gli stati del §11.3; lo stato esplicito lo rende leggibile, anche nel quadro: «il portone è forzato: +1, chi entra lascia un segno».

**Gli stati possono durare e propagarsi.** Uno stato può scadere dopo un certo numero di ore («in allarme, per sei ore»). Un evento può cambiare lo stato di più luoghi insieme: l'allarme alla capitaneria mette in allarme tutto il porto, e la sorveglianza vale in ogni zona finché dura.

**L'ambiente logora.** Una proprietà può far salire un logorio per ogni ora passata lì: l'acqua gelida la fatica, il freddo un logorio del freddo, il fumo il respiro. Lo dichiara la tabella delle proprietà; il rimedio resta quello del logorio.

**Il tempo che fa.** Il meteo è uno stato del mondo che cambia con le ore o con un evento, e porta le sue proprietà in tutti i luoghi all'aperto: la nebbia (chi si muove non si vede, chi cerca non trova), la pioggia (il rumore copre le voci), la tempesta (niente barche). Si annuncia come una scadenza, perché chi gioca veda che arriva.

**Salute e ambiente insieme.** Molto c'è già: una ferita chiude un ambito, il logorio pesa, gli stati d'animo spostano la soglia, al buio non si legge e in acqua serve saper nuotare. La proposta aggiunge due cose: le ferite contano anche per ciò che porti (una ferita grave al braccio toglie un posto) e per ciò che puoi prendere (una ferita grave al corpo toglie la forza).

La scheda dell'ambientazione (§43) si allargherebbe di quattro voci: le cose di ogni luogo, i posti e i contenitori, gli stati dichiarati dei luoghi e delle cose, il meteo.

## 12. Il tempo

### 12.1 Le ore

Il tempo della storia si conta in **ore**. Consumano tempo gli spostamenti fra luoghi, i tentativi dopo il primo, riposare, aspettare, studiare, e ogni scelta che lo dichiara: «Pago un facchino (due monete, un'ora)». Il tempo non scorre mentre chi gioca pensa, e non scorre mentre esplora una scena: scorre soltanto quando sceglie qualcosa che lo consuma.

Una storia che dura settimane può contare in giorni, e una che dura anni in stagioni. L'ambientazione dichiara la sua unità, e il gioco la usa in tutte le frasi: «ritentare ti costa un giorno». In questo documento si dice «ora» per tutte.

Ogni volta che il tempo avanza succedono quattro cose, sempre nello stesso ordine:

1. le **scadenze** avanzano, se è il loro turno (§15.4);
2. il **logorio** sale, se è il suo turno (§34);
3. la **Traccia** cala nelle zone dove non ne hai lasciata di nuova (§37);
4. nella zona in cui sei, si controlla se arriva un **imprevisto** (§37). Il controllo si fa una volta per ogni scelta che consuma tempo, qualunque sia la durata: aspettare sei ore in cella è una scelta, e un controllo.

### 12.2 I momenti

Il giorno è diviso in **momenti**: nel porto l'alba, il giorno, la sera e la notte, di sei ore ciascuno. Ogni momento porta le sue proprietà, e quindi cambia il costo, la riuscita e le vie di ogni azione, in modo diverso per ogni ambito.

### 12.3 Con calma

Se hai tutto il tempo che vuoi e nessuno ti ostacola, non tiri: riesci, e paghi in tempo. L'ambientazione dice quanto costa fare le cose con calma; nel porto, tre ore. È la ragione per cui una prova ha senso solo sotto una pressione (§16).

## 13. Esplorare

Un luogo si conosce a tre livelli:

| Livello | Che cosa sai |
|---|---|
| **Ne hai sentito parlare** | che esiste, come arrivarci, e le proprietà che qualcuno ti ha detto |
| **Ci sei stato** | com'è fatto: le sue proprietà e le sue righe proprie non sono più una sorpresa |
| **Lo conosci bene** | i suoi segreti: una porta sul retro, un'ora in cui è vuoto, qualcuno che ti deve un favore |

Prima di andare in un luogo che conosci poco, il quadro delle azioni che vorresti fare lì è una **stima**, e lo dice: «stima: ci sei stato solo di giorno». Quando ci sei, il quadro è sempre esatto.

Anche le persone si conoscono a tre livelli: **l'hai vista**, **ci hai parlato**, **la conosci bene**. Più la conosci, più il gioco ti dice di lei: prima soltanto che «sembra diffidente», poi quanto si fida di te e quanto ha paura, infine che cosa farebbe se avesse l'occasione di tradirti (§30).

Esplorare non dà punti. Dà notizie, cose, persone, accessi: nuove strade davanti agli ostacoli.

## 14. La memoria della storia

*Due lettori arrivano nella stessa taverna. Uno ha il registro, l'altro no; uno ha lasciato Traccia al porto, l'altro no; uno ha fatto un favore all'oste, l'altro l'ha minacciato. La taverna offre loro scelte diverse, e l'oste li tratta in modo diverso.*

Tutto ciò che il gioco ricorda è la **memoria della storia**. Una parte sta sulla scheda del personaggio (capacità, tratti, cose, notizie, convinzioni, legami, condizioni); il resto riguarda il mondo:

| Tipo | Che cosa ricorda | Sulla carta | Esempio |
|---|---|---|---|
| **Fatto** | una cosa successa, sì o no | una parola chiave sulla scheda | HAI IL REGISTRO |
| **Misura** | una quantità piccola, da 0 a 5 | una fila di caselle | Sospetti della guardia: 2 |
| **Traccia** | quanto ti hanno notato in una zona, da 0 a 3 | tre caselle per zona | Archivio: 1 |
| **Filo** | a che punto è una delle storie in corso | una fila di caselle | Dov'è Matteo: 2 su 4 |
| **Scadenza** | quanto manca a qualcosa che succederà comunque | una fila di caselle da annerire | La *Santa Rita* salpa: 5 su 8 |

Ogni scena e ogni scelta possono avere **requisiti**, cioè condizioni sulla memoria: «se hai il registro», «se Bressan si fida di te almeno 2», «se sei *Minuto*», «se non credi più che chi lavora per Grimani sia un nemico». E ogni esito ha **effetti**: aggiunge o toglie fatti, sposta misure, fa avanzare fili, cambia legami, dà o toglie tratti.

Tre regole tengono in ordine la memoria:

- **Le scelte chiuse si vedono**, con ciò che manca: «Richiede: conoscere il nome del notaio». Chi gioca capisce che il mondo è più grande di quello che ha visto, e sa che cosa cercare. Fanno eccezione le vie che una notizia rivela (§8.1): esistono solo per chi sa che esistono.
- **Ogni memoria scritta viene letta.** Un fatto, una misura, un tratto che nessuna scena controlla non servono a niente, e confondono chi scrive.
- **Le scadenze si vedono.** Chi gioca sa sempre che cosa sta per succedere e quanto manca.

## 15. Scene, ostacoli, vie

### 15.1 Scene e vie

Una **scena** è un'unità della storia: una situazione e le scelte che offre. Sulla carta è un paragrafo, in un'app una schermata, in un gioco grafico una stanza o un'inquadratura, al tavolo un momento di gioco.

Un **ostacolo** è una scena in cui qualcosa ti sbarra la strada. Si affronta da più **vie**, e ogni via ha la sua capacità, la sua difficoltà, il suo costo, i suoi requisiti. Scegliere la via conta quanto il tiro: prendere il registro e chiederlo sono due scommesse diverse sullo stesso obiettivo.

### 15.2 Il ripiego

> **Ogni ostacolo ha almeno un ripiego: una via che non si tira, sempre disponibile, che costa sempre qualcosa.**

Il ripiego costa tempo, denaro, un favore, oppure ti dà soltanto una parte di ciò che volevi. Non è mai la via migliore, ma c'è sempre. Senza di esso un ostacolo diventa un muro con un dado davanti: chi non riesce resta fermo, e la storia si interrompe. Con il ripiego la difficoltà diventa un prezzo.

Il ripiego serve anche al *Quasi* (§28): quando il tiro manca di poco, una delle scelte è ottenere **la metà**, e la metà è di solito ciò che dà il ripiego. L'autore la scrive una volta, e vale due volte.

### 15.3 Come si scrivono le scelte

Le scelte si scrivono **in prima persona, al presente**, come le direbbe il personaggio: «Vado a cercarlo», «Prendo il registro di nascosto», «Chiedo a Bressan di Matteo». Chi gioca risponde con la voce del personaggio. L'infinito («Prendere il registro») suona come la voce di un menu.

Il costo in tempo o in denaro, quando c'è, si scrive fra parentesi dopo la scelta: «Pago un facchino perché legga il registro (due monete, un'ora)».

### 15.4 Fili e scadenze

Una storia lunga ha più **fili**: il fratello scomparso, il debito con l'usuraio, l'amicizia con il pilota del porto. Ogni filo avanza per tappe, e le scene successive richiedono che il filo sia arrivato a un certo punto.

Le **scadenze** sono ciò che succederà comunque: la nave salpa, l'usuraio perde la pazienza, il processo comincia. Ogni scadenza avanza di una casella ogni tante ore, e quando è piena succede ciò che dichiara, salvo che una condizione dichiarata lo eviti. Tengono viva la pressione: prepararsi con calma è quasi sempre possibile, ma costa ore, e le ore fanno avanzare le scadenze.

### 15.5 Gli snodi

Uno **snodo** è una scelta che non si disfa: tradire qualcuno, lasciare la città, salire sulla nave. Gli snodi li scrive l'autore uno per uno, con testi propri, e il gioco li segnala a chi gioca come scelte senza ritorno.

> **Le regole governano ciò che si può recuperare. L'autore governa ciò che non si recupera.**

### 15.6 Le scelte che si esauriscono

*Hai già osservato il salone dell'archivio. Tornandoci un'ora dopo, la scelta «Osservo il salone» non c'è più: sai già quello che potresti vedere. Ricompare quando cambia il momento, perché la sera il salone è un altro.*

Una scelta che non può più cambiare niente sparisce. Ogni scelta dichiara che cosa dà: una notizia, una cosa, un fatto, una preparazione, una tappa di un filo. Se hai già tutto quello che può darti, il motore non te la offre più. Lo fa da solo, leggendo gli effetti: l'autore non deve ricordarsene.

Fanno eccezione le scelte che servono a muoversi («Torno sulla banchina») e quelle che l'autore segna come **sempre disponibili**. Le scelte da **una volta sola** («Offro una moneta ai facchini») spariscono dopo che le hai fatte, anche se darebbero ancora qualcosa.

### 15.7 Ramificare senza esplodere

Una storia a bivi scritta a paragrafi raddoppia a ogni scelta, e dopo dieci bivi è impossibile da scrivere. Questo motore lo evita in tre modi.

- **Le conseguenze diventano memoria, non rami.** Invece di scrivere due seguiti, uno per chi ha rubato il registro e uno per chi l'ha chiesto, l'autore scrive un seguito solo, che legge la memoria e cambia ciò che serve.
- **I luoghi sono punti d'incontro.** I percorsi si separano e si ritrovano nei luoghi, portandosi dietro Traccia, notizie, legami diversi.
- **I costi e le difficoltà li calcolano le tabelle.** L'autore non decide scena per scena quanto è rischiosa o difficile un'azione: lo decide una volta, compilando le proprietà e il catalogo.

---
---

# PARTE IV — AGIRE: LE QUATTRO DOMANDE

## 16. Quando si tira

Ogni scelta passa dalla prima domanda: *puoi farlo?* Solo alcune passano dal dado. Si tira quando valgono tutte e due queste condizioni.

1. **C'è una pressione.** Qualcuno si oppone, c'è fretta, o non riuscire ha un prezzo. Se hai tutto il tempo che vuoi e nessuno ti ostacola, non tiri: riesci con calma, e paghi in tempo (§12.3).
2. **Tutti gli esiti portano da qualche parte.** Se non riuscire significa «non succede niente, riprova», non è una prova: è un costo, e si paga senza dado.

Queste due regole tolgono di mezzo la maggior parte dei tiri inutili, e impediscono di ripetere un'azione soltanto per allenarsi.

Una scelta con un tiro si chiama **prova**. Prima di ogni prova il gioco mostra il **quadro**, che risponde alle quattro domande in quest'ordine. Le prossime sezioni le prendono una alla volta.

## 17. Puoi farlo?

*Nella stiva della Santa Rita c'è una finestrella che dà sul ponte di sotto. «Passo dalla finestrella» c'è solo perché sei minuto. «Sfondo la porta della stiva» c'è, ma è chiusa: «Richiede forza: essere robusto, una leva, o qualcuno che spinga con te». Anche «Mi calo in acqua e nuoto fino alla banchina» è chiusa: «Richiede: saper nuotare, o una barca». E se qualcuno ti avesse parlato della barca legata sotto la poppa, vedresti una scelta in più: «Scendo nella barca sotto la poppa».*

La prima domanda non si risponde con i dadi. Il personaggio sa una cosa o non la sa, ha un oggetto o non ce l'ha, è in un posto o non c'è: sono fatti, e il motore li tratta come tali. Una via può richiedere:

| Requisito | Da quale parte viene | Esempio |
|---|---|---|
| un **tratto** | tratti | *Minuto* per la finestrella; *Sa leggere* per leggere il registro |
| una **cosa** | cose | la chiave dell'armadio; una luce per leggere al buio |
| una **notizia** | notizie | sapere che Matteo è a bordo, per andare alla nave |
| un **legame** | legami | conoscere Lucia, per chiederle aiuto |
| chi è **con te** | legami | con Lucia, che sa nuotare, puoi entrare in acqua anche se tu non sai |
| una **posizione** | il mondo | essere nell'archivio; che sia notte; essere a portata di mano |
| una **condizione** | condizioni | non avere una ferita grave al corpo, per arrampicarti |

Il controllo ha quattro risposte possibili, e il gioco le mostra in modo diverso:

- **aperta**: la via si può prendere;
- **chiusa**: la via si vede, con ciò che manca scritto accanto;
- **chiusa da una convinzione**: la via si vede, con la frase che la chiude: «Credi che non ci si possa fidare di chi lavora per Grimani» (§8.4);
- **invisibile**: la via non c'è, perché nessuno ti ha detto che esiste (§8.1), oppure perché non ha senso in questo momento. Di giorno non si mostra «Mi arrampico sulla grondaia ed entro dalla finestra», perché il portone è aperto.

Tre regole per chi scrive:

- **Un tratto del corpo che manca non chiude mai una via senza un'alternativa**: una cosa, una persona, il ripiego (§6.1).
- **Una ferita grave chiude le capacità del suo ambito**, e ti lascia i ripieghi (§36).
- **Se la difficoltà supera Estrema, la via è chiusa**, e il quadro dice che cosa la farebbe scendere: «Troppo difficile per te adesso: una luce, o sapere com'è fatta la serratura».

## 18. Ci riesci?

*Il lucchetto dell'armadio è vecchio: Facile. Ma è buio, e al buio le mani lavorano peggio: la soglia sale a Impegnativa. Accendi la lanterna, e torna Facile. Sul banco c'è un fermacarte di ferro, che fa da leva: +1.*

### 18.1 La soglia

La difficoltà di una prova è la **soglia**: il numero che il tiro deve raggiungere.

| Soglia | Numero | Esempio nel porto |
|---|---|---|
| Facile | 6 | la porta chiusa a chiave di una casa, un lucchetto da armadio |
| Impegnativa | 8 | una serratura di magazzino, un archivista sospettoso |
| Ardua | 10 | la cassaforte della capitaneria, un ufficiale della guardia |
| Estrema | 12 | la serratura della dogana reale, far confessare chi rischia la forca |

La soglia non si inventa scena per scena. Si prende dal **catalogo delle difficoltà** dell'ambientazione (§44), che elenca le cose del mondo con la loro soglia e, accanto, ciò che la sposta. Poi il motore guarda la situazione, e la sposta di un **gradino** (due punti) per le ragioni dichiarate:

- un **tratto**: *Vista acuta*, per notare qualcosa da lontano, un gradino in meno;
- una **notizia**: sapere com'è fatta la serratura di Genova, un gradino in meno;
- una **proprietà del luogo**: il buio, per chi cerca o lavora di precisione senza luce, un gradino in più;
- un **legame**: persuadere chi si fida di te, un gradino in meno; chi ti porta rancore, uno in più;
- uno **stato d'animo**: chi è spaventato fa più fatica a stare fermo e zitto, un gradino in più.

> **La soglia si sposta al massimo di un gradino in giù e di uno in su.** Basta una ragione per scendere, e una per salire. Altre ragioni nella stessa direzione non cambiano niente, e il quadro le segna come righe che non contano. Una ragione in giù e una in su si annullano.

Se la soglia scende sotto Facile, non si tira: riesci, come con un *Riesci*, e paghi il costo del tuo grado. Se sale sopra Estrema, la via è chiusa (§17).

Questa è la struttura della difficoltà, ed è tutta nei dati: l'autore sceglie la cosa dal catalogo; le ragioni che la spostano stanno nelle schede dei tratti, delle notizie, delle proprietà, dei legami. L'autore può aggiungere a una prova una ragione sua, scritta come riga («il registro è legato al banco con una catenella: un gradino in più»), ma il limite di un gradino per parte vale anche per lui.

### 18.2 Il tiro

> **Due dadi a sei facce, più il livello della capacità, più gli attrezzi e gli aiuti, meno le penalità.**

| Che cosa si aggiunge | Quanto | Limite |
|---|---|---|
| il livello della capacità | da +0 a +3 | — |
| ogni **attrezzo** adatto (§7) | +1 | attrezzi e aiuti insieme, al massimo +2 |
| ogni **aiuto**: qualcuno che fa la cosa con te (§30) | +1 | |
| ogni **penalità**: una ferita lieve all'ambito della capacità, il logorio allo stremo, uno stato d'animo che lo dichiara | −1 | al massimo −3 |

Il **margine** è il tiro meno la soglia. Dice in quale delle quattro **fasce** cade la prova:

| Fascia | Margine |
|---|---|
| **In pieno** | +4 o più |
| **Riesci** | da 0 a +3 |
| **Quasi** | −1 o −2 |
| **Non riesci** | −3 o meno |

Che cosa succede in ciascuna fascia lo dice il §28.

### 18.3 Le probabilità

Per sapere quanto è probabile ogni fascia, togli dalla soglia tutto ciò che si aggiunge ai dadi (livello, attrezzi, aiuti, meno le penalità): ottieni **quanto devono fare i dadi** per raggiungere la soglia. Poi leggi la riga:

| I dadi devono fare | In pieno | Riesci | Quasi | Non riesci |
|---|---|---|---|---|
| 2 o meno | 72–83 | 17–28 | 0 | 0 |
| 3 | 58 | 39 | 3 | 0 |
| 4 | 42 | 50 | 8 | 0 |
| 5 | 28 | 56 | 14 | 3 |
| 6 | 17 | 56 | 19 | 8 |
| 7 | 8 | 50 | 25 | 17 |
| 8 | 3 | 39 | 31 | 28 |
| 9 | 0 | 28 | 31 | 42 |
| 10 | 0 | 17 | 25 | 58 |
| 11 | 0 | 8 | 19 | 72 |
| 12 | 0 | 3 | 14 | 83 |
| 13 | 0 | 0 | 8 | 92 |
| 14 | 0 | 0 | 3 | 97 |

I valori sono su 100 e arrotondati: una riga può sommare 99 o 101. I valori esatti, in trentaseiesimi, sono nell'appendice A, e si ricavano dalla tabella dei due dadi.

Per le sole capacità, senza attrezzi né penalità, la tabella diventa questa:

| | Facile (6) | Impegnativa (8) | Ardua (10) | Estrema (12) |
|---|---|---|---|---|
| **Inesperto (+0)** | 17 · 56 · 19 · 8 | 3 · 39 · 31 · 28 | 0 · 17 · 25 · 58 | 0 · 3 · 14 · 83 |
| **Pratico (+1)** | 28 · 56 · 14 · 3 | 8 · 50 · 25 · 17 | 0 · 28 · 31 · 42 | 0 · 8 · 19 · 72 |
| **Esperto (+2)** | 42 · 50 · 8 · 0 | 17 · 56 · 19 · 8 | 3 · 39 · 31 · 28 | 0 · 17 · 25 · 58 |
| **Maestro (+3)** | 58 · 39 · 3 · 0 | 28 · 56 · 14 · 3 | 8 · 50 · 25 · 17 | 0 · 28 · 31 · 42 |

Tre cose si leggono subito. *In pieno* più *Riesci* dà la stessa probabilità di riuscire del 2.0: chi aveva 42 su 100 ha ancora 42 su 100 di ottenere ciò che vuole senza patti. Un gradino vale due righe della tabella: sapere com'è fatta la serratura, per un Inesperto davanti a un'Ardua, porta la probabilità di riuscire da 17 a 42. E un attrezzo vale quanto un livello di capacità: per questo attrezzi e aiuti insieme non superano +2, altrimenti comprare vorrebbe dire più che imparare.

## 19. Quanto ti costa?

*All'alba, nell'archivio, prendere il registro non costa niente: la folla dei capitani copre le mani. Di notte, nello stesso archivio, la stessa mano sullo stesso registro ti mette allo scoperto: nel silenzio ogni fruscio di carta si sente.*

### 19.1 L'esposizione

Il dado risponde alla domanda «ci riesci?». L'**esposizione** risponde a un'altra: *quanto ti costa, comunque vada?* Ha tre **gradi**:

| Grado | Valore | Che cosa significa |
|---|---|---|
| **al coperto** | 0 | la situazione non ha presa su di te: il peggio che può capitarti è non riuscire |
| **esposto** / **esposta** | 1 | la situazione può prenderti: anche se riesci, qualcosa resta |
| **allo scoperto** | 2 | qualunque cosa accada, accade dove conta |

Ogni ambientazione dice che cosa significa essere esposti nel suo mondo, con una frase. Nel porto: *essere esposti significa che qualcuno potrà dire di averti visto*. In una villa, durante un'indagine: *che qualcuno della casa potrà dire dov'eri*. In un faro abitato da qualcosa: *che la cosa nel faro sa dove sei*.

> **L'esposizione non cambia mai la probabilità di riuscire.** Cambia che cosa succede dopo, e quante volte il mondo ti viene addosso.

### 19.2 Come si calcola

```
somma = partenza della capacità
      + ambiente: le proprietà del luogo e del momento per quell'ambito,
        e le righe proprie del luogo (in tutto, fra −2 e +2)
      + 1 per ogni aggravante
      − 1 per ogni preparazione
```

Poi la somma si tiene dentro la scala: se è sotto il Fondo della capacità il grado è il Fondo, se è sopra 2 il grado è 2, altrimenti il grado è la somma.

Le **aggravanti** sono fatti del mondo che alzano il costo, di un grado ciascuna. Non le sceglie nessuno: valgono quando sono vere. Ogni ambientazione ne ha da tre a cinque tipi. Nel porto: *qui ti hanno già visto*, *la stanchezza o i nervi ti pesano*, *sono in tanti a guardare*, *porti addosso qualcosa che non dovresti*. Un tratto può far valere un'aggravante (§6).

Le **preparazioni** sono ciò che fai prima di agire per abbassare il costo, di un grado ciascuna: osservare il posto, procurarti un travestimento, trovare qualcuno che faccia il palo, creare un diversivo. Ogni ambientazione ne ha da tre a sei tipi, e ognuna costa qualcosa: tempo, denaro, un favore, una cosa. Ogni tipo vale una volta per prova, e le preparazioni non durano per sempre: valgono per il luogo, per una prova, o finché hai la cosa.

> **Il dado non si governa. L'esposizione sì.** La leva di chi gioca sono le preparazioni, il luogo e il momento, e il prezzo che paga per sceglierli.

### 19.3 Il Fondo e il tetto

Il **Fondo** è il grado sotto il quale un'azione non scende. Con Fondo 0, preparandoti bene puoi agire senza lasciare segni. Con Fondo 1 qualcosa resta sempre: puoi ridurre il rischio, non annullarlo. Con Fondo 2 l'azione costa sempre il massimo, e le preparazioni non servono. Ogni ambientazione dice con una frase che cosa ha un Fondo; nel porto, *ciò che lascia un segno che resta: un corpo ferito, una porta forzata, una parola detta a qualcuno che se la ricorderà*.

Il **tetto** è il grado più alto: allo scoperto. Una somma di 3 o di 4 vale quanto una somma di 2. Per questo, quando la somma supera 2, una sola preparazione può non bastare a farti scendere, e il quadro te lo dice.

Almeno metà delle capacità di un'ambientazione ha partenza 0, e al massimo due hanno partenza 2. Sono le capacità a partenza bassa quelle in cui prepararsi serve davvero.

### 19.4 Le inversioni

Incrociando le proprietà, le situazioni si rovesciano da sole. L'archivio ha la sorveglianza (corpo +1, mano +1); l'alba porta la folla (mano −1, voce −1); la notte porta il buio (corpo −1) e il silenzio (mano +1, voce +1).

| Azione (partenza, Fondo) | Archivio, all'alba | Archivio, di notte |
|---|---|---|
| *Muoversi* (0, 0) | 0 + 1 = 1 → esposto | 0 + 1 − 1 = 0 → al coperto |
| *Sottrarre* (0, 0) | 0 + 1 − 1 = 0 → al coperto | 0 + 1 + 1 = 2 → allo scoperto |

Di notte entrare è facile e prendere è pericoloso; all'alba il contrario. La scelta di *quando* agire diventa una decisione vera, e nessuno ha dovuto scriverla.

## 20. Che cosa cambia dopo?

*Allo scoperto, se riesci a prendere il registro, lo hai: ma un capitano ti ha visto, la Traccia dell'archivio sale, e perdi qualcosa che non torna. Se non riesci, arriva la ronda.*

Dopo il tiro l'esito si legge due volte: una volta dal dado, una volta dall'esposizione.

- **Il dado dice quanto ottieni**, con le quattro fasce: *In pieno*, *Riesci*, *Quasi*, *Non riesci*.
- **L'esposizione dice quanto paghi**: al coperto niente; esposto un segno, cioè una tacca di Traccia; allo scoperto un prezzo. Se non ottieni ciò che volevi, esposto diventa una complicazione e allo scoperto un **rovescio**: la situazione precipita, e sei in un'altra scena.

Le due letture sono spiegate per intero nella Parte V, che racconta anche perché sono separate. Oltre a queste, un esito può cambiare tutto ciò che la memoria della storia ricorda: un legame («Bressan non si fiderà più di te»), un tratto («una cicatrice alla mano»), una convinzione, una cosa che si rompe.

Il quadro mostra che cosa può cambiare prima che tu tiri, con una regola: **nessuna sorpresa sui rischi, sorprese sulle scoperte.** Il quadro dice che cosa ottieni in ogni fascia e che cosa rischi nel caso peggiore. Non dice che cosa scoprirai: per il *Non riesci* scrive soltanto «scopri qualcosa sul lucchetto».

## 21. Il quadro

Prima di ogni prova il gioco mostra il **quadro**: le risposte alle quattro domande, riga per riga, con la causa di ogni riga. Chi gioca non deve indovinare che cosa pensava l'autore: lo legge, e impara il gioco giocando.

### 21.1 Com'è fatto

Di notte, dentro l'archivio, con la lanterna accesa:

```
Forzo il lucchetto dell'armadio                          Forzare · mano

PUOI?     sì · sei dentro l'archivio · l'armadio è davanti a te

RIESCI?    6  Facile: un lucchetto vecchio o da armadio
          +0  sei Inesperto in Forzare
          +1  il fermacarte di ferro, come leva                    cosa
              (il buio non conta: hai la lanterna accesa)
          ──  i dadi devono fare 5
              in pieno 28 · riesci 56 · quasi 14 · non riesci 3

COSTA?     1  Forzare: una serratura forzata resta forzata
          +1  nell'archivio chi tocca ciò che non deve viene guardato
          +1  di notte, nel silenzio, ogni rumore di mani si sente
          −1  hai aspettato che la ronda passasse     — non basta: ne servirebbe un'altra
          ──  2  ALLO SCOPERTO

DOPO?     riesci: hai il registro
          quasi: tutto, ma la ronda arriva mentre esci · oppure lasci perdere
          non riesci: scopri qualcosa sul lucchetto
          se va male: la ronda ti trova col ferro in mano
```

Le quattro sezioni seguono sempre questo ordine. Accanto alle righe della riuscita, al margine, c'è la parte della scheda da cui vengono: cosa, tratto, notizia, legame. Chi gioca impara così dove guardare per cambiare le cose.

### 21.2 Tre regole di scrittura

- **Ogni riga nomina una causa della finzione**: «di notte, nel silenzio, ogni rumore di mani si sente», non «+1 silenzio». Il numero accompagna la causa, non la sostituisce. Se una riga non si può dire in una frase breve, senza sigle e senza icone, quella regola non deve esistere.
- **Le righe che valgono zero non si scrivono.** Fa eccezione la riga che spiega perché qualcosa *non* vale, quando chi gioca se lo aspetterebbe: «il buio non conta: hai la lanterna accesa».
- **La posta si dichiara.** L'ultima riga dice che cosa succede nel caso peggiore. Se nel caso peggiore puoi morire, il quadro lo scrive: «Se va male: la vita».

### 21.3 Le righe che non contano

Un quadro dice anche quali righe, in questa situazione, non cambiano niente. Nella riuscita è semplice: non contano le ragioni oltre il primo gradino in una direzione (§18.1), gli attrezzi e gli aiuti oltre +2, le penalità oltre −3.

Nel costo le righe si dividono in righe che **alzano** (ambiente positivo, aggravanti) e righe che **abbassano** (ambiente negativo, preparazioni). La partenza non si segna mai. Si guarda la somma finale:

| La somma è… | Righe che alzano | Righe che abbassano |
|---|---|---|
| **sopra 2** | le ultime non contano, tante quanti i punti oltre il 2 | nessuna conta: «non basta, ne servirebbero *N* in più», con *N* = somma − 1 |
| **uguale a 2** | contano | nessuna conta: «non basta, ne servirebbe una in più» |
| **fra il Fondo e 2** | contano | contano |
| **uguale al Fondo** | nessuna conta | contano |
| **sotto il Fondo** | nessuna conta | le ultime non contano, tante quanti i punti sotto il Fondo |

Con Fondo 2 nessuna riga conta mai, e il quadro lo dice una volta sola: «questa azione costa sempre il massimo».

Nel quadro del §21.1 la somma è 1 + 1 + 1 − 1 = 2. Le righe che alzano contano tutte: togline una qualsiasi e la somma scende a 1, esposto. La preparazione non conta: senza di lei la somma sarebbe 3, e il tetto la riporterebbe a 2. Una seconda preparazione porterebbe la somma a 1: da qui «ne servirebbe un'altra». La riga che più importa segnalare è proprio questa: chi ha speso tempo per prepararsi deve sapere, prima di tirare, che non è bastato.

### 21.4 Il quadro sulla carta e al tavolo

Sulla carta il quadro è già in parte stampato nel paragrafo, e chi legge aggiunge soltanto ciò che dipende da lui (§48.1). Al tavolo il narratore lo dice ad alta voce, sezione per sezione, e chi gioca aggiunge le sue cose e le sue preparazioni prima di decidere.

## 22. Ritentare

Le prove sono di due tipi.

- **Prova ritentabile.** Puoi riprovare, ma ogni nuovo tentativo ti costa un'ora, con tutto ciò che un'ora comporta: le scadenze avanzano, il logorio sale, può arrivare un imprevisto, e il momento del giorno può cambiare. Prima di ogni tentativo il gioco rifà il quadro.
- **Prova da una volta sola.** Si tenta una volta, e segna la partita: una bugia detta a un giudice, un salto fra due tetti, un'offerta a un nemico. Il gioco la segnala prima, con le parole «una volta sola». Una prova da una volta sola non è mai l'unica via di un ostacolo.

Il *Quasi* offre anche di lasciar perdere (§28.3): chi lo sceglie non paga il costo pieno e, se la prova è ritentabile, può riprovare più tardi.

Qui sta il senso della competenza. Chi è Esperto forza una serratura Impegnativa al primo tentativo 72 volte su 100; chi è Inesperto ci mette in media due tentativi e mezzo. Ogni tentativo in più è un'ora in più, con la sua fatica e il suo rischio di imprevisti. E chi è bravo, oltre a metterci meno, riesce in pieno più spesso: 17 volte su 100 l'Esperto, 3 l'Inesperto.

> **Chi è bravo non è meno esposto. Ci mette meno tempo, e ottiene di più.**

---
---

# PARTE V — LE GRADAZIONI

## 23. Il problema

*Due persone giocano la stessa scena dell'archivio e arrivano allo stesso tiro: manca 1. La prima prende il registro e accetta che un capitano la veda. La seconda si accontenta del nome della nave e se ne va senza lasciare segni. Tre ore dopo, al Gallo, la prima si sente chiamare per nome da uno sconosciuto; la seconda entra in una taverna che non sa niente di lei, ma non conosce il nome del capitano della Santa Rita.*

Nel 2.0 il dado rispondeva sì o no. Il resto lo faceva l'esposizione: sei esiti, riesci o non riesci per tre gradi, ognuno con un ruolo diverso. Un tiro di 7 contro una soglia di 8 valeva quanto un tiro di 2: non riesci. Un tiro di 12 valeva quanto un tiro di 8: riesci. Chi gioca lo sente, e il dado finisce per sembrare una moneta.

La specifica 1.3 aveva rifiutato la scala di gradi (fallimento grave, fallimento, successo parziale, successo pieno) con una ragione precisa, scritta nel suo §1: una scala ordinata suggerisce a chi scrive «meglio» e «peggio», e spinge a scrivere versioni più o meno forti della stessa conseguenza. Il successo parziale diventa il successo con qualcosa in meno; il fallimento grave diventa il fallimento con qualcosa in più. Dopo cento prove, le quattro caselle dicono la stessa cosa a volume diverso, e tenerle distinte diventa una questione di disciplina degli autori. Su un progetto lungo, la disciplina cede. Il 2.0 ha ereditato questo rifiuto senza riscriverlo.

La ragione è buona, e il 3.0 la tiene. Ma le gradazioni servono: chi gioca deve sentire la differenza fra mancare di poco e mancare di molto, fra riuscire e riuscire in pieno. Il compito è costruire gradazioni che non cadano nel difetto della scala.

Prima di confrontare i modelli, ecco che cosa ciascuno deve garantire. I criteri sono scritti qui, prima dei conti.

1. **Natura.** Due esiti vicini differiscono per che cosa succede, non soltanto per quanto.
2. **Al coperto il dado non può rovinarti.** Il peggio, al coperto, è non ottenere.
3. **Nessuna morte senza avviso.** Nessuna fascia può uccidere se il quadro non lo ha detto.
4. **Le scelte contano più dei dadi.** Il costo di un'azione resta nelle mani di chi gioca.
5. **Scrivere non costa più del 2.0.** Nel 2.0 una prova chiedeva tre testi obbligatori.
6. **Si legge a colpo d'occhio**, sul quadro e sulla carta.
7. **I conti si rifanno a mano**, con la tabella dei due dadi.

Tutti e tre i modelli usano il **margine**, cioè il tiro meno la soglia, e le stesse quattro fasce: +4 o più, da 0 a +3, −1 o −2, −3 o meno. Cambia che cosa se ne fa. Le probabilità delle fasce sono quelle del §18.3.

## 24. Modello A: la griglia a dodici

Il modello più diretto incrocia le quattro fasce con i tre gradi di esposizione. Ne escono dodici caselle, ciascuna con il suo esito predefinito:

| | +4 o più | da 0 a +3 | −1 o −2 | −3 o meno |
|---|---|---|---|---|
| **Al coperto** | successo brillante | successo pieno | successo mancato | fallimento pulito |
| **Esposto** | successo netto | successo sporco | mezzo successo sporco | rovescio minore |
| **Allo scoperto** | successo netto a caro prezzo | successo a caro prezzo | rovescio lieve | rovescio |

**I conti.** Il grado lo sceglie chi gioca, il dado sceglie la colonna. Per un Pratico davanti a un'Impegnativa, allo scoperto: successo netto a caro prezzo 8, successo a caro prezzo 50, rovescio lieve 25, rovescio 17. Le stesse quattro probabilità valgono in ogni riga: il grado sposta la riga, non la colonna.

**Il difetto.** Basta leggere i nomi. *Rovescio lieve* e *rovescio*, *successo netto* e *successo sporco* sono coppie ordinate: la stessa conseguenza a volume diverso. È proprio ciò che la 1.3 temeva. Per tenere distinte dodici caselle ogni ambientazione dovrebbe scrivere dodici predefiniti di natura diversa, e ogni autore dovrebbe rispettarli.

**Quanto costa scrivere.** Con i predefiniti, da sei a otto testi per prova, perché le caselle vicine chiedono sfumature che nessun predefinito dà. Senza, dodici.

**Leggibilità.** Dodici nomi non si ricordano. Sul quadro il modello si mostra, ma chi gioca non lo impara.

## 25. Modello B: due letture dello stesso tiro

Il secondo modello tiene le fasce e l'esposizione su due assi separati, e dà a ciascun asse le sue gradazioni.

- **Il dado dice quanto ottieni**, in quattro fasce, ciascuna di natura diversa: un dono, l'obiettivo, una scelta, una scoperta.
- **L'esposizione dice quanto paghi**, nei tre gradi del 2.0: niente, un segno, un prezzo. E se non ottieni ciò che volevi, una complicazione o un rovescio.

| Fascia | Che cosa ottieni | Di che natura |
|---|---|---|
| **In pieno** | ciò che volevi, e un **dono**: una notizia, tempo risparmiato, una persona che ti nota, una cosa | un regalo del mondo |
| **Riesci** | ciò che volevi | l'obiettivo |
| **Quasi** | scegli tu: tutto, ma un grado più esposto; oppure **la metà**; oppure lasci perdere | una decisione |
| **Non riesci** | non ottieni, ma **scopri qualcosa** sull'ostacolo | una notizia |

| Grado | Se ottieni | Se non ottieni |
|---|---|---|
| **Al coperto** | niente | niente |
| **Esposto** | +1 Traccia | +1 Traccia e una complicazione |
| **Allo scoperto** | +1 Traccia e il prezzo | +1 Traccia e il rovescio |

La seconda tabella è quella delle sei caselle del 2.0, letta come costo. La prima è ciò che il 3.0 aggiunge.

**I conti.** Le probabilità delle fasce sono quelle del §18.3. Il fallimento gravissimo, cioè il rovescio, arriva soltanto con *Non riesci* allo scoperto, oppure quando chi gioca, nel *Quasi*, sceglie di prendere tutto allo scoperto. Rispetto al 2.0 il rovescio diventa più raro, perché i tiri che mancano di poco passano al *Quasi*:

| Probabilità del rovescio, allo scoperto, per un Pratico | Facile | Impegnativa | Ardua | Estrema |
|---|---|---|---|---|
| nel 2.0 (non riesci) | 17 | 42 | 72 | 92 |
| nel 3.0 (*Non riesci*) | 3 | 17 | 42 | 72 |
| nel 3.0, più il *Quasi* in cui scegli di rischiare | 17 | 42 | 72 | 92 |

L'ultima riga dice una cosa importante: il 3.0 non rende il mondo più clemente di nascosto. Il pericolo del 2.0 c'è ancora tutto, ma una parte ora passa da una scelta. Chi manca di poco decide se tentare la sorte o ritirarsi.

**Il difetto della scala, evitato.** Le quattro fasce non sono quattro intensità dello stesso esito: il dono è una cosa che non cercavi, l'obiettivo è ciò che cercavi, il *Quasi* è una domanda che il gioco ti fa, la notizia del *Non riesci* è una scoperta. Ognuna riempie nei dati una casella di tipo diverso, e l'autore non può fare del *Quasi* un *Riesci* più debole, perché il *Quasi* per costruzione offre una scelta a chi gioca. Il costo, dall'altra parte, resta quello del 2.0, che aveva già sei caselle di natura diversa.

**Quanto costa scrivere.** Tre testi obbligatori, come nel 2.0: che cosa ottieni, la notizia del *Non riesci*, il rovescio (una scena o un rimando). Tutto il resto ha un predefinito (§28.6).

**Leggibilità.** Due timbri: la fascia e il grado. Sul quadro, una fila di quattro numeri sotto la riuscita e un grado sotto il costo.

## 26. Modello C: il margine da spendere

Il terzo modello, sul modello di *Genesys*, trasforma il margine in una moneta. Ogni punto sopra la soglia compra un vantaggio da una lista (un'ora risparmiata, una notizia, una tacca di Traccia in meno, una persona che si fida di più); ogni punto sotto si paga con uno svantaggio (un'ora persa, una tacca di Traccia, un attrezzo rovinato, una ferita).

**I conti.** Per un Pratico davanti a un'Impegnativa, i dadi devono fare 7, e il margine si distribuisce così:

| Margine | −5 | −4 | −3 | −2 | −1 | 0 | +1 | +2 | +3 | +4 | +5 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| su 36 | 1 | 2 | 3 | 4 | 5 | 6 | 5 | 4 | 3 | 2 | 1 |
| su 100 | 3 | 6 | 8 | 11 | 14 | 17 | 14 | 11 | 8 | 6 | 3 |

In media un tiro dà poco meno di un punto da spendere (35 trentaseiesimi) e poco meno di un punto da pagare: moltiplica ogni margine per quante volte esce, somma i positivi e dividi per 36.

**I difetti.** Il modello dà molta scelta, e ha tre problemi. Il primo: il dado entra nel costo. Se un punto di margine compra una tacca di Traccia in meno, un buon tiro cancella il prezzo di una cattiva scelta, e le scelte smettono di contare più dei dadi. Si potrebbe togliere la Traccia dalla lista, ma resterebbe il secondo problema: al coperto, un margine negativo si paga, e il dado torna a poterti rovinare. Il terzo è il tempo: ogni tiro diventa una piccola spesa, sulla carta bisogna contare e scegliere da una lista, e ogni scena deve dire che cosa si compra lì.

**Quanto costa scrivere.** Le liste possono stare nell'ambientazione, ma una prova che conta ne vuole una sua: da cinque a otto testi.

## 27. Il confronto e la scelta

| Criterio | A: la griglia | B: due letture | C: il margine da spendere |
|---|---|---|---|
| 1. Natura | no: caselle vicine differiscono per intensità | sì: dono, obiettivo, scelta, scoperta | sì, ma sono voci di una lista |
| 2. Al coperto il dado non rovina | sì | sì | no, salvo eccezioni |
| 3. Nessuna morte senza avviso | sì | sì | sì |
| 4. Le scelte contano più dei dadi | sì | sì: il dado non tocca il costo | no: il margine compra costo |
| 5. Scrivere non costa più del 2.0 | no: 6–12 testi | sì: 3 testi | no: 5–8 testi |
| 6. Si legge a colpo d'occhio | no: dodici nomi | sì: due timbri | no: una spesa a ogni tiro |
| 7. I conti si rifanno a mano | sì | sì | sì |

**Il 3.0 adotta il modello B.** È l'unico che rispetta tutti i criteri. Ha una ragione in più, che nessuna tabella misura: fa del tiro vicino alla soglia il momento più interessante della prova. Nel 2.0 mancare di uno era una delusione; nel 3.0 è una domanda. Quanto vuoi quella cosa, e che cosa sei disposto a lasciare dietro di te per averla?

Il modello ha un costo. Nel 2.0 un Inesperto davanti a un'Impegnativa otteneva ciò che voleva 42 volte su 100. Nel 3.0 lo ottiene 42 volte senza patti, e altre 31 volte può ottenerlo pagando. Le storie diventano più facili da attraversare, e più care. Se le simulazioni e le prove mostreranno che sono troppo facili, la leva è il catalogo delle difficoltà, non le fasce.

## 28. Le fasce nel dettaglio

### 28.1 In pieno: il dono

Chi supera la soglia di 4 o più ottiene ciò che voleva e qualcosa in più. Il **dono** può essere:

- **una notizia**: vedi di più di quanto cercavi;
- **tempo**: l'azione ti costa un'ora in meno, o nessuna;
- **una persona**: chi era presente ti nota. La fiducia sale, o la paura, secondo che cosa hai fatto e come l'autore lo dichiara;
- **una cosa**: trovi qualcosa che non cercavi.

Se la scena non dichiara un dono, vale il primo di questi predefiniti che ha senso: **la notizia del *Non riesci***, se non ce l'hai già, perché chi riesce benissimo vede anche ciò che avrebbe visto fallendo; altrimenti **un'ora risparmiata**, se l'azione ne costava; altrimenti niente.

> **Il dono non tocca mai il costo.** Nemmeno *In pieno* toglie la Traccia o il prezzo del tuo grado. Il costo lo governi tu, con il luogo, il momento e le preparazioni.

### 28.2 Riesci: l'obiettivo

Chi raggiunge la soglia, o la supera di meno di 4, ottiene ciò che voleva, né più né meno.

### 28.3 Quasi: la scelta

Chi manca la soglia di 1 o 2 sceglie fra tre possibilità, che il gioco gli mostra con il loro costo:

- **Tutto, un grado più esposto.** Ottieni ciò che volevi, e il costo si legge un grado più su: al coperto diventa esposto, esposto diventa allo scoperto. Allo scoperto, più su non si va: ottieni ciò che volevi, e arriva il rovescio lo stesso. Esci dall'archivio con il registro sotto la giacca e la ronda alle calcagna.
- **La metà.** Ottieni una parte di ciò che volevi, al tuo grado, come se fossi riuscito. La metà la scrive l'autore; se non la scrive e nella scena c'è un ripiego con lo stesso obiettivo, la metà è ciò che dà il ripiego. Se non c'è né l'una né l'altro, questa possibilità non c'è.
- **Lasci perdere.** Non ottieni niente, e paghi solo il segno del tuo grado: una tacca di Traccia se eri esposto o allo scoperto, niente al coperto. Niente complicazione, niente prezzo, niente rovescio. Se la prova è ritentabile, puoi riprovare più tardi.

| Grado | Tutto, un grado più esposto | La metà | Lasci perdere |
|---|---|---|---|
| **Al coperto** | ottieni · +1 Traccia | la metà · niente | niente |
| **Esposto** | ottieni · +1 Traccia e il prezzo | la metà · +1 Traccia | niente · +1 Traccia |
| **Allo scoperto** | ottieni · +1 Traccia e il rovescio | la metà · +1 Traccia e il prezzo | niente · +1 Traccia |

Nessuna delle tre possibilità vince sempre. Al coperto *tutto* costa una tacca di Traccia, e *lasci perdere* non costa niente ma ti fa perdere tempo; quale convenga dipende da quanto manca alla scadenza e da quanta Traccia hai già in quella zona. Allo scoperto *tutto* ti dà l'obiettivo e un rovescio, e *lasci perdere* ti salva dal rovescio a mani vuote. Se le prove con le persone mostreranno che una delle tre viene scelta quasi sempre, il modello andrà corretto (§54).

Il *Quasi* è l'unica fascia in cui chi gioca può scegliere di pagare di più. Per questo non viola la promessa del coperto: al coperto il dado da solo non ti fa mai male, e sei tu a decidere se una tacca di Traccia vale il registro.

**Nei confronti e nella difesa** il *Quasi* ha una forma propria, descritta nel §32 e nel §38: contro un punto debole, l'avversario si scopre ma tu sali di un grado; quando ti difendi, il colpo ti prende di striscio, e scegli fra una ferita più lieve e perdere qualcosa.

### 28.4 Non riesci: la scoperta

Chi manca la soglia di 3 o più non ottiene ciò che voleva, e **scopre qualcosa sull'ostacolo**: com'è fatta la serratura, dove Bressan tiene la chiave, che la porta si apre dall'altra parte. La notizia del *Non riesci* è obbligatoria per ogni prova, a ogni grado.

Non diventi più bravo a fare quella cosa: impari qualcosa sulla cosa. Per questo fallire non serve ad allenarsi.

Al coperto la scoperta è tutto ciò che succede. Esposto, in più, la scena si complica: arriva una complicazione dal repertorio della zona (§46). Allo scoperto arriva il rovescio.

### 28.5 Il rovescio

Il **rovescio** è l'esito peggiore: la situazione precipita, e sei in un'altra scena, non nella stessa andata male. Porta con sé una tacca di Traccia, il logorio che sale nell'ambito della capacità, il travestimento perduto, e ciò che l'autore dichiara (ciò che avevi in mano, una ferita, se la posta lo ha detto). Arriva soltanto allo scoperto, e soltanto se il quadro ha dichiarato la posta.

### 28.6 I predefiniti

Ecco che cosa succede in ogni combinazione se la scena non dice altro:

| | Al coperto | Esposto | Allo scoperto |
|---|---|---|---|
| **In pieno** | ottieni + il dono | ottieni + il dono · +1 Traccia | ottieni + il dono · +1 Traccia, il prezzo |
| **Riesci** | ottieni | ottieni · +1 Traccia | ottieni · +1 Traccia, il prezzo |
| **Quasi** | scegli (§28.3) | scegli | scegli |
| **Non riesci** | la notizia | la notizia · +1 Traccia, una complicazione | la notizia · +1 Traccia, il rovescio |

Il **prezzo**, se la scena non lo dichiara, si pesca dai prezzi del repertorio della zona: un'ora persa, una cosa che resta indietro, un favore che adesso devi. La **complicazione** si pesca dal repertorio (§46). La Traccia non sale mai di più di una tacca per prova.

### 28.7 Quanto costa scrivere una prova

| | Obbligatori | Facoltativi, con predefinito |
|---|---|---|
| **2.0** | il riesci · il non riesci con la sua conoscenza · il rovescio | il prezzo |
| **3.0** | il riesci · la notizia del *Non riesci* · il rovescio, se la prova può essere allo scoperto | il dono (la notizia del *Non riesci*, poi un'ora) · la metà (il ripiego) · il prezzo (il repertorio) |

Il numero di testi obbligatori è lo stesso. Il *Non riesci* non ha più un testo suo diverso dalla notizia: la notizia è il testo. Ecco la prova del registro scritta come dati, in forma leggibile:

```
Prendo il registro di nascosto
  capacità   Sottrarre
  difficoltà prendere qualcosa sotto gli occhi di chi lo sorveglia
  posta      Se va male: Bressan chiama la guardia.
  riesci     → Il registro
  la metà    → dal ripiego: «Pago un facchino perché legga il registro»
  non riesci → notizia: «Di notte Bressan chiude il registro nell'armadio,
               e la chiave la porta alla cintura.»
  rovescio   → Guardie
```

Il dono non è scritto: vale il predefinito, cioè la notizia dell'armadio. Il prezzo non è scritto: si pesca dal repertorio dell'archivio.

### 28.8 Sul quadro e sulla carta

Sul quadro, sotto la riuscita, c'è sempre la fila delle quattro fasce: «in pieno 17 · riesci 56 · quasi 19 · non riesci 8». Nell'app la fila è anche una barra divisa in quattro, con le parole sopra ogni parte, perché i colori da soli non bastano a chi non li distingue. Dopo il tiro, sul quadro cadono due timbri: la fascia e il grado.

Sulla carta, la scheda porta una riga sola:

> **Supera la soglia di 4: in pieno. La raggiungi: riesci. Manca 1 o 2: quasi. Di più: non riesci.**

Il paragrafo del librogame dice dove andare in ogni caso (§48.1).

---
---

# PARTE VI — LE PERSONE

## 29. I legami

*La prima volta che entri nell'archivio, Bressan non alza gli occhi. La seconda, dopo che gli hai promesso che il suo nome non verrà fuori, ti fa un cenno. La terza, dopo che un capitano gli ha raccontato di averti visto con il registro sotto la giacca, chiama la guardia appena ti vede sulla porta.*

Una persona, per il motore, non è un ostacolo con una difficoltà. Ha un **legame** con il personaggio, fatto di alcune **dimensioni**, e una memoria di ciò che le hai fatto. Le dimensioni sono cinque, e ciascuna va da 0 a 3:

| Dimensione | Che cosa dice | Che cosa fa |
|---|---|---|
| **fiducia** | quanto crede a ciò che dici | 1: se glielo chiedi, ti dice ciò che sa · 2: persuaderla costa un gradino in meno, e ti aiuta se glielo chiedi · 3: si espone per te, e ti copre come una preparazione, una volta per scena |
| **debito** | chi deve un favore a chi: «ti deve 2», «gli devi 1» | se ti deve: puoi chiedergli un favore, e il debito scende · se gli devi: prima o poi te lo chiede, e rifiutare fa salire il rancore |
| **paura** | quanto teme ciò che puoi fargli | 2: minacciarla costa un gradino in meno · ogni minaccia che va a segno fa salire anche il rancore di 1 |
| **affetto** | quanto tiene a te | 2: ti perdona uno sgarbo, e il rancore quella volta non sale · 3: rischia per te |
| **rancore** | quanto ce l'ha con te | 2: non ti aiuta, e persuaderla costa un gradino in più · 3: ti danneggia alla prima occasione, se il suo movente lo permette |

Ogni persona usa soltanto le dimensioni che le servono, di solito due o tre. Bressan ha fiducia, paura e rancore; l'affetto non gli serve. Zeno, l'oste, ha fiducia e debito.

Chi gioca vede i legami **a parole**, e tanto più chiaramente quanto meglio conosce la persona (§13). Chi l'ha soltanto vista legge «sembra diffidente». Chi ci ha parlato legge «si fida poco di te, e ha paura di perdere il posto». Chi la conosce bene legge anche che cosa farebbe se ne avesse l'occasione. Sulla carta, la scheda ha una riga per persona con le caselle delle sue dimensioni.

Le persone non sono tutte legami. Il facchino che ti dice due cose sulla banchina resta una frase del repertorio. Un'ambientazione di solito ha da sei a dodici persone con un legame: quelle con cui chi gioca avrà a che fare più di una volta.

## 30. Ricordare, aiutare, tradire, cambiare idea

### 30.1 Ricordare

Una persona ricorda ciò che le hai fatto, e ciò che ha visto fare. L'autore lo scrive come fatti legati a lei: *Bressan ti ha visto prendere il registro*, *hai salvato il figlio di Bressan*. Le scene leggono questi ricordi come ogni altra memoria.

La Traccia (§37) e i ricordi sono due cose diverse. La Traccia è la memoria anonima di una zona: qualcuno, lì, ti ha notato, e con il tempo se ne dimentica. Un ricordo è la memoria di una persona, e non cala: Bressan non dimentica chi gli ha rubato il registro.

Quando un esito può creare un ricordo, il quadro lo dice fra i «dopo»: «se qualcuno ti vede: Bressan lo saprà».

### 30.2 Reagire

Ogni persona ha le sue **reazioni**: che cosa cambia in lei quando succede qualcosa. «Se Bressan sa che hai preso il registro: fiducia −2, rancore +1.» «Se gli restituisci il registro prima di sera: fiducia +1.» L'autore le scrive una volta, nella scheda della persona, e valgono in tutta la storia, da qualunque strada chi gioca ci arrivi.

### 30.3 Aiutare

*Chiedi a Zeno di tenere occupato il marinaio al bancone mentre gli frughi nella sacca. Zeno ti deve un favore: accetta, e adesso non ti deve più niente.*

Chiedere aiuto a qualcuno è una scelta, disponibile se si fida di te almeno 2, oppure se ti deve un favore. L'aiuto può essere:

- **un aiuto nella prova**: fa la cosa con te, +1 al tiro (§18.2);
- **una preparazione**: fa il palo, crea un diversivo, ti copre;
- **una notizia**: ti dice ciò che sa, o va a chiederlo per te.

L'aiuto ha un prezzo. Se ti doveva un favore, il debito scende di 1. Altrimenti sei tu a dovergliene uno. E chi ti aiuta si espone con te: se la prova finisce in un rovescio, ci finisce dentro anche lui, e il suo rancore sale di 1.

### 30.4 Tradire

Una persona tradisce quando valgono tutte e due queste cose:

1. **le sue dimensioni lo dicono**: rancore 3, oppure paura 2 e rancore 2;
2. **ne ha l'occasione**: una scena dichiara che lì può tradirti, e il suo movente lo permette.

Il tradimento non è mai un tiro nascosto. È un'informazione che c'era: nelle dimensioni della persona, nel suo movente, in ciò che le hai fatto. Chi la conosceva bene poteva vederlo arrivare.

### 30.5 Cambiare idea

Le dimensioni si muovono con quello che fai: un favore restituito, una bugia scoperta, una minaccia, un aiuto nel momento giusto. Una bugia scoperta toglie 1 alla fiducia e aggiunge 1 al rancore, se la scena non dice altro. Una persona che ti portava rancore può cambiare idea, se le dai una ragione per farlo; una che si fidava può smettere. Il motore non decide al posto dell'autore che cosa conta per ciascuna: lo dicono le reazioni.

## 31. Parlare

*Lucia ti aspetta in fondo alla chiesa, con il velo sugli occhi. Puoi chiederle di Matteo, raccontarle del biglietto, mentirle su chi sei, oppure restare in silenzio e aspettare che parli lei.*

Una conversazione è una scena come le altre: ogni battuta che puoi dire è una via. Quasi nessuna si tira. Chiedere qualcosa a chi si fida di te non ha bisogno del dado: la persona risponde secondo il suo legame, e ciò che ti dice è una notizia. Si tira soltanto quando c'è una pressione (§16): convincere chi non vuole, mentire a chi potrebbe accorgersene, far confessare chi ha paura.

Tre regole tengono in piedi i dialoghi.

- **Ogni battuta dichiara che cosa dà**: una notizia, una tappa di un filo, un cambio in una dimensione. Come ogni scelta, si esaurisce quando non dà più niente (§15.6).
- **Le domande sono chiuse dalla fiducia.** «Chiedo a Lucia chi ha portato via Matteo» c'è sempre; la risposta vera arriva solo se si fida di te almeno 2. Prima, ti dice meno, o ti dice che non lo sa.
- **Una bugia resta.** Se menti e ci riesci, la persona crede una cosa falsa, e l'autore può scrivere che cosa succede quando la scopre.

## 32. Il confronto

*Bressan nega di aver visto Matteo. Ha paura, e si chiude. Gli fai notare la riga scritta con un altro inchiostro: la penna gli si ferma a metà di una parola.*

Un **confronto** è un modo di stare con qualcuno: quello in cui l'altro ti si oppone adesso. Può essere uno scontro armato, ma quasi sempre è un interrogatorio, una trattativa, un inseguimento. Tiene le regole del 2.0, con le fasce.

**La scheda dell'avversario** ha cinque righe: la **natura** (*chi si chiude*, che difende una posizione; *chi avanza*, che ti viene addosso), la **copertura** da cui parte (al coperto, esposto, allo scoperto), i **punti deboli** (che cosa lo scopre, con quale capacità, di quanti gradi), il **pericolo** (un'arma, oppure una conseguenza sociale: chiama la guardia, ti denuncia), il **movente** (che cosa vuole, che cosa lo fa smettere, se mantiene la parola). Il movente non si lascia mai vuoto. Ciò che non vuole niente, come una tempesta, non è un avversario: è il mondo, e si evita.

**Lo scambio.** Un confronto avanza a scambi. In ogni scambio scegli: una prova contro un punto debole, una prova per fare altro (fuggire, nasconderti, prendere ciò per cui sei venuto), il ripiego, oppure parlare. Poi l'avversario reagisce secondo la sua natura: chi si chiude, se la tua prova non è riuscita, si ricopre di un grado; chi avanza si avvicina, e quando ti ha raggiunto ogni sua reazione è un attacco.

**Le fasce contro un punto debole:**

| Fascia | Che cosa succede |
|---|---|
| **In pieno** | lo scopri di un grado in più di quanto dice il punto debole |
| **Riesci** | lo scopri di quanto dice il punto debole |
| **Quasi** | scegli: lo scopri, ma tu sali di un grado di esposizione per il resto dello scambio; oppure lasci perdere, e lui non si ricopre |
| **Non riesci** | si ricopre, se si chiude; e scopri un suo punto debole che non conoscevi, se ne ha |

**La finestra.** Quando l'avversario è allo scoperto si apre la **finestra**: non tiri, e decidi tu come finisce, scegliendo fra le fini che la scena rende possibili. Ogni fine ha il suo prezzo scritto.

**Parlare.** Puoi provare a far desistere l'avversario, o a trovare un accordo, in qualunque scambio. È una prova da una volta sola: se non riesce, quella porta si chiude per tutto il confronto.

**Come finisce.** Uno dei due non può più, uno dei due non vuole più, uno dei due non c'è più. Nella vita vera quasi nessuno scontro finisce con qualcuno a terra: finisce perché uno dei due smette di volerlo.

In più, nel 3.0, **l'avversario è una persona**. Se ha un legame con te, il confronto lo cambia: un accordo lascia un debito, un'umiliazione lascia rancore, una grazia concessa può lasciare affetto. E le sue dimensioni cambiano il confronto: chi ha paura di te parte più scoperto, chi si fida di te può desistere prima.

## 33. I compagni

*Lucia viene con te alla Santa Rita. Sa nuotare, tu no; conosce il nostromo, tu no. Sulla passerella si ferma, e ti chiede se sei sicuro.*

Un **compagno** è una persona con un legame che viaggia con il personaggio. È un'opzione dell'ambientazione. Ha, oltre alle sue dimensioni:

- da due a quattro **capacità** con il loro livello;
- uno o due **tratti**;
- le sue **condizioni**: può ferirsi, stancarsi, spaventarsi.

Finché è con te, un compagno cambia ogni prova in cui **conosce la capacità**, cioè in cui ha almeno il livello Pratico. Il gioco ti offre la stessa prova in tre modi, e il quadro ti mostra i conti di ciascuno:

- **da solo**, come sempre;
- **con il suo aiuto**: +1 al tiro, se si fida di te almeno 2 o ti deve un favore. L'aiuto costa come ogni aiuto (§30.3): se ti doveva un favore, il debito scende di 1, altrimenti glielo devi tu;
- **al posto tuo**: la prova è sua. Contano il suo livello, i suoi tratti e le sue ferite al posto dei tuoi; il costo si calcola sulla stessa capacità, nello stesso luogo e nello stesso momento. Chi non agisce non cresce: la tacca della pratica non va a nessuno.

I tratti del compagno contano anche per ciò che il gruppo può fare, dove l'ambientazione lo dice: Lucia sa nuotare, e con lei l'acqua del porto si apre anche per chi non sa nuotare.

Il compagno paga con te. Se una prova in cui ti ha aiutato finisce in un rovescio, il suo rancore sale di 1; se l'ha fatta al posto tuo, sale lo stesso, e le ferite del rovescio sono sue. Le sue ferite guariscono e peggiorano come le tue, e un medico cura prima le tue, poi le sue. Il suo legame cambia con come lo tratti: se il rancore arriva a 3, se ne va. Nel librogame un compagno alla volta è già molto da tenere sulla scheda.

Le storie con più protagonisti, in cui chi gioca passa da uno all'altro, sono una delle domande aperte della prova dei generi (§52).

---
---

# PARTE VII — IL PERICOLO

## 34. Il logorio

Il **logorio** è ciò che sale da solo: la fatica, la fame, il freddo, i nervi. Ogni ambientazione ne sceglie da due a quattro. Ognuno ha tre stadi, detti a parole, e un rimedio suo:

| Stadio | Effetto |
|---|---|
| **1 — leggero** | nessuno |
| **2 — pesante** | è un'aggravante («il logorio ti pesa») per gli ambiti che quel logorio tocca |
| **3 — allo stremo** | resta un'aggravante, e in più −1 a tutte le prove. Finché non usi il rimedio, ogni volta che il tempo avanza fai una prova di resistenza, annunciata, con la probabilità e la via d'uscita scritte accanto |

La prova di resistenza ha le sue fasce: con *In pieno* o *Riesci* tieni duro; con *Quasi* tieni duro, ma ti fermi per un'ora; con *Non riesci* crolli, e succede ciò che il logorio dichiara (ti addormenti in piedi, ti tremano le mani e non riesci a pensare).

Il rimedio riporta il logorio al primo stadio, e costa: dormire costa ore, mangiare costa denaro, calmarsi richiede un posto sicuro. Ogni logorio ha un rimedio diverso, e nessun rimedio ne cura due. Un logorio senza rimedio sarebbe una condanna a tempo, e non è ammesso.

## 35. Gli stati d'animo

*Hai visto il coltello di Teodoro a un palmo dalla faccia. Adesso sei spaventato: nella stiva buia ti sembra di sentire respirare, e restare fermo e zitto ti costa uno sforzo che prima non ti costava.*

Uno **stato d'animo** è ciò che il personaggio prova adesso: *spaventato*, *furioso*, *umiliato*, *sicuro di sé*. Arriva con un evento, e passa. Agisce come un tratto (apre, chiude, sposta una soglia di un gradino in casi dichiarati), oppure come una penalità di −1 su un genere di prove. E dichiara sempre **come passa**: con il tempo, in un luogo sicuro, con un evento.

| Stato d'animo | Che cosa fa | Come passa |
|---|---|---|
| **Spaventato** | restare fermo e zitto, un gradino in più · per avvicinarti a ciò che ti ha spaventato serve prima una prova di *Resistere* | in un luogo sicuro, o quando dai un nome a ciò che ti spaventava |
| **Furioso** | mentire e persuadere, un gradino in più · apre vie che una persona calma non prende | dopo un'ora, o dopo aver sfogato la rabbia |
| **Umiliato** | −1 alle prove di voce davanti a chi ti ha umiliato | quando ti prendi una rivincita, o dopo una notte |
| **Sicuro di sé** | persuadere, un gradino in meno | al primo *Non riesci* |

Il personaggio ha al massimo due stati d'animo alla volta; uno nuovo dello stesso genere prende il posto del vecchio.

Il logorio e gli stati d'animo sono due cose diverse, e spesso arrivano insieme. I nervi si consumano un po' alla volta e chiedono un rimedio; lo spavento arriva in un istante e passa da solo. In un horror servono tutti e due: i nervi dicono quanto hai sopportato, lo spavento che cosa ti sta succedendo adesso.

## 36. Le ferite

Nel motore non esistono punti ferita. Una ferita è una cosa precisa, con un nome e un posto, e **dice che cosa ti impedisce**.

| Gravità | Che cosa impedisce | Come evolve |
|---|---|---|
| **Lieve** | −1 alle prove dell'ambito colpito (una mano tagliata: le prove di *mano*) | guarisce da sola dopo un giorno di riposo |
| **Grave** | non puoi più usare le capacità dell'ambito colpito: ti restano i ripieghi | curata, diventa lieve; senza cure, dopo un giorno diventa mortale |
| **Mortale** | puoi solo muoverti piano, parlare e cercare aiuto | curata, diventa grave; senza cure muori entro quattro ore |

La scena, o l'arma, dice dove colpisce. Curare è una capacità come le altre: Facile per una ferita lieve, Impegnativa per una grave, Ardua per una mortale, e la cura richiede ciò che serve (bende, un medico, un posto pulito).

Una ferita grave, guarita, può lasciare un **segno**: un tratto nuovo, che l'arma o la scena dichiarano. *Una cicatrice alla mano*: forzare e lavorare di precisione, un gradino in più. Il corpo ricorda (§40).

> **Una ferita non ti rende più debole in generale. Ti toglie una strada.**

## 37. La Traccia e gli imprevisti

### 37.1 La Traccia

La **Traccia** è ciò che il mondo ricorda di te in una zona: chi ti ha visto, chi ha fatto domande, chi ti cerca. Si segna da 0 a 3 tacche per zona.

- **Sale** di una tacca con gli esiti esposti o allo scoperto, come dice il §28.6. Mai più di una tacca per prova.
- **Pesa**: con 2 tacche o più, nella zona vale l'aggravante «qui ti hanno già visto».
- **Cala** di una tacca ogni tre ore in cui non ne lasci di nuova in quella zona. Il ritmo lo dichiara l'ambientazione.

La Traccia cala sempre, se smetti di alimentarla. Non può crescere fuori controllo: chi è nei guai può sempre scegliere di sparire per un po', e pagarlo in tempo mentre le scadenze avanzano.

### 37.2 Gli imprevisti

Ogni volta che una scelta fa passare il tempo, nella zona in cui ti trovi tiri due dadi. Se il risultato è pari o inferiore al numero della tabella, arriva un **imprevisto**:

| Traccia nella zona | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Imprevisto se i dadi fanno al massimo | 2 | 4 | 6 | 8 |
| Probabilità | 3% | 17% | 42% | 72% |

L'imprevisto si pesca dal repertorio della zona (§46): un doganiere che chiede i documenti, un conoscente che ti chiama per nome, un carico che cade. Gli imprevisti non aggiungono Traccia da soli; aggiungono complicazioni, e a volte ostacoli, con il loro ripiego. Non sai *che cosa* succederà, ma sai *quanto* stai rischiando: più ti hanno notato, più spesso il mondo ti viene addosso.

## 38. La violenza

In questo motore la violenza è realistica. Un colpo di coltello può uccidere, e un colpo di pistola quasi sempre lo fa. Per questo le storie scritte con ESPOSIZIONE si giocano soprattutto con l'esplorazione, la parola e l'astuzia, e la violenza è un rischio che si corre raramente, a occhi aperti.

Quattro regole rendono il pericolo onesto.

> **1. Nessuna morte senza avviso.** Una prova può ucciderti solo se il quadro, prima del tiro, dice «Se va male: la vita».

> **2. Un agguato non comincia con la morte.** Chi ti tende un agguato comincia in posizione migliore della tua, ma la prima decisione è sempre tua.

> **3. Andarsene si può sempre.** In ogni scontro c'è un ripiego: fuggire, arrendersi, consegnare ciò che vogliono. Non si tira, e costa: Traccia, l'obiettivo perso, una cosa, la libertà.

> **4. Le armi dichiarano che cosa fanno.** Ogni arma dice la ferita che infligge se ti colpisce quando sei esposto, e quella che infligge quando sei allo scoperto.

| Arma | Da esposto | Da allo scoperto |
|---|---|---|
| pugni, bastone | lieve | grave |
| coltello, bottiglia rotta | grave | mortale |
| spada, pistola | mortale | morte |

Quando ti attaccano, ti difendi con una prova: la capacità la scegli tu (nel porto *Battersi* per parare, *Muoversi* per scansarti), la soglia dipende da quanto è abile chi ti attacca, e il grado è quello della tua ultima azione nello scontro. Se sei al coperto, l'arma non ti raggiunge. Le fasce della difesa:

| Fascia | Che cosa succede |
|---|---|
| **In pieno** | eviti il colpo, e chi ti attacca resta sbilanciato: si scopre di un grado |
| **Riesci** | eviti il colpo |
| **Quasi** | il colpo ti prende di striscio. Scegli: la ferita dell'arma, un grado più lieve; oppure perdi qualcosa (l'arma, la posizione, ciò che hai in mano) |
| **Non riesci** | la ferita dell'arma, per il tuo grado |

Con un coltello, da esposto, il *Quasi* ti lascia scegliere fra una ferita lieve e perdere il coltello che stringevi. Da allo scoperto, fra una ferita grave e la stessa perdita.

### 38.1 Le protezioni

Una **protezione** è qualcosa che paga al posto tuo una conseguenza già decisa: una giacca imbottita che attutisce una coltellata, un protettore che ti tira fuori di prigione.

- **Declassa, non annulla.** Una ferita mortale diventa grave, un arresto diventa una multa.
- **Si consuma.** Ha tre stati, come ogni cosa: intatta, rovinata, rotta. Ogni volta che serve scende di uno.
- **Vale solo sulla conseguenza.** Non cambia mai il tiro, la soglia o l'esposizione. Senza questo limite, le protezioni diventerebbero punti ferita cuciti dentro una giacca.

---
---

# PARTE VIII — CRESCERE

## 39. Le capacità

La competenza cresce in tre modi:

| Fonte | Che cosa dà | Come |
|---|---|---|
| **Pratica** | fa salire le capacità che usi | ogni prova finita in *Riesci* o *In pieno* dà una tacca a quella capacità, al massimo una per scena |
| **Punti** | ti permette di scegliere chi diventare | la storia li dà negli snodi e alla fine dei fili; ogni punto è una tacca su una capacità a scelta |
| **Insegnamento** | apre l'ultimo livello | Maestro non si raggiunge da soli: serve qualcuno, o qualcosa, che insegni |

| Da … a … | Tacche | Condizione |
|---|---|---|
| Inesperto → Pratico | 3 | — |
| Pratico → Esperto | 5 | — |
| Esperto → Maestro | 5 | un maestro, una bottega, un libro |

Anche **studiare** fa crescere: due ore con un maestro o su un libro danno una tacca in ciò che quella fonte insegna. Lo studio costa tempo, e compete con tutto il resto.

I pagatori non si sovrappongono: **la storia paga in punti, il mondo paga in cose, le persone pagano in accesso.** Se esplorare desse punti, esplorare tutto diventerebbe sempre la scelta migliore.

Una storia lunga dovrebbe portare il personaggio, alla fine, più o meno qui: una capacità a Maestro, due a Esperto, tre a Pratico, le altre basse. Un personaggio bravo in tutto non sceglie più da che parte affrontare gli ostacoli. Per le storie brevi il personaggio può restare **fisso**, senza crescita.

## 40. I tratti che si guadagnano e si perdono

*Alla fine della notte sulla Santa Rita, la tua scheda ha due tratti in più e uno in meno. Hai una cicatrice alla mano. Al porto ti conoscono. E non soffri più il mare: ci hai passato una notte intera, legato a un albero maestro, e sei ancora vivo.*

Nessun punto si spende sui tratti. Si guadagnano e si perdono con la storia, quando l'autore lo scrive:

| Tratto | Da dove viene | Che cosa fa |
|---|---|---|
| *Una cicatrice alla mano* | una ferita grave alla mano, guarita | forzare e lavorare di precisione, un gradino in più · chi ha combattuto la riconosce, e ti rispetta di più |
| *Conosciuto al porto* | uno snodo, o la Traccia a 3 in tre zone diverse | vale «qui ti riconoscono» in ogni zona del porto · apre: chiedere un favore a chi ti conosce |
| *Non ha più paura del buio* | una scena in cui affronti il buio fino in fondo | toglie *Ha paura del buio* |
| *Ha ucciso un uomo* | aver ucciso qualcuno | minacciare chi lo sa, un gradino in meno · chiude: le vie di chi non ha mai fatto del male a nessuno · i nervi salgono di uno stadio ogni volta che qualcuno te lo ricorda |

Tre regole:

- **Ogni tratto guadagnato porta scritto da dove viene**: «Una cicatrice alla mano, dalla notte sulla Santa Rita». La scheda racconta la storia del personaggio.
- **Un tratto si perde solo per una ragione scritta**: un evento, uno snodo, un altro tratto che lo sostituisce.
- **Oltre sette tratti la scheda smette di essere leggibile.** Se una storia ne dà di più, l'autore sta raccontando troppo con i tratti, e troppo poco con la memoria della storia.

## 41. Le convinzioni che cambiano

Anche la vita interiore cresce. Alla fine della storia la scheda mostra quali convinzioni il personaggio ha lasciato andare, quali ha tenuto contro le prove, e quali gli sono nate strada facendo. Il meccanismo è quello del §8.5: una notizia che mette in dubbio, un posto tranquillo, una scelta senza dado.

## 42. Far vedere la crescita

Siccome la competenza fa risparmiare tentativi e non cambia l'esposizione, chi gioca rischia di non accorgersene. Il gioco deve mostrarglielo, confrontandolo con il suo passato:

```
Hai forzato la serratura.                             in pieno, al primo tentativo
La prima volta che ne hai forzata una così:           quasi, al quarto tentativo
```

Alla fine della storia, la scheda si mostra accanto a quella dell'inizio: le capacità salite, i tratti guadagnati e persi con la loro origine, le convinzioni lasciate andare, i legami cambiati. Nell'app è obbligatorio. Al tavolo lo fa il narratore. Nel librogame la scheda ha, accanto a ogni capacità, lo spazio per annotare i tentativi della prima volta, e un riquadro per i tratti guadagnati.

---
---

# PARTE IX — SCRIVERE UNA STORIA

## 43. La scheda dell'ambientazione

Adattare il motore a un mondo significa compilare questa scheda. È l'elenco completo: una storia che la riempie ha tutto ciò che serve per essere giocata.

| # | Voce | Che cosa contiene |
|---|---|---|
| 1 | **La frase dell'esposizione** | *In questo mondo, essere esposti significa…* |
| 2 | **Il criterio del Fondo** | *Ha un Fondo ciò che…* |
| 3 | **Gli ambiti** | da 3 a 5, con nome |
| 4 | **Le capacità** | da 8 a 14, con ambito, partenza, Fondo e la frase della partenza |
| 5 | **I tratti** | quelli possibili, ciascuno con i suoi effetti (apre, chiude, sposta, aggrava) |
| 6 | **Le proprietà** | da 6 a 12, ciascuna con il suo effetto su costo, riuscita e requisiti |
| 7 | **I luoghi** | con zona, proprietà, righe proprie, stati |
| 8 | **I momenti** | quante ore dura ciascuno, e le sue proprietà |
| 9 | **Le aggravanti** | da 3 a 5 tipi, ciascuno con quando vale |
| 10 | **Le preparazioni** | da 3 a 6 tipi, ciascuno con il suo costo e quanto dura |
| 11 | **Le cose** | gli attrezzi con il genere di azione che aiutano, le chiavi, le combinazioni, le cose fragili, quanto si porta |
| 12 | **Il catalogo delle difficoltà** | le cose del mondo, la loro soglia, ciò che la sposta, ciò che serve |
| 13 | **Il tempo** | l'unità (di solito l'ora), quanto costa fare con calma |
| 14 | **Il logorio** | da 2 a 4, con stadi, ritmo, ambiti, rimedio e crollo |
| 15 | **Gli stati d'animo** | ciascuno con che cosa fa e come passa |
| 16 | **Le ferite e le armi** | se si può morire, come si cura, che cosa fa ciascuna arma, quali segni lasciano |
| 17 | **La Traccia** | le zone, e ogni quante ore cala (il valore consigliato è tre) |
| 18 | **Le persone** | con le dimensioni che usano, le reazioni, il movente; gli avversari con le cinque righe; i compagni, se ci sono |
| 19 | **Le protezioni** | che cosa declassano |
| 20 | **Il repertorio** | le complicazioni, gli imprevisti e i prezzi di ogni zona |
| 21 | **La crescita** | chi insegna, chi dà punti, quali tratti si guadagnano, o se il personaggio è fisso |
| 22 | **La memoria della storia** | i fili, le scadenze, i fatti e le misure principali, le notizie, le convinzioni, le deduzioni |

Se un mondo ha bisogno di qualcosa che questa scheda non prevede, conviene fermarsi a chiedersi se si tratta di un sottosistema che mangerebbe gli altri (una barra della magia, per esempio, che rifarebbe i punti ferita), e in quel caso rifiutarlo; oppure di una lacuna del motore, e in quel caso aggiungerlo qui, per tutti.

**L'ordine conta.** Prima la frase dell'esposizione, perché dà il tono a tutto il resto; poi gli ambiti, le capacità e i tratti; poi le proprietà, e solo dopo i luoghi e i momenti, perché si descrivono con le proprietà. Per ultimo il catalogo, che cresce mentre si scrive.

La tabella delle proprietà resta il lavoro più delicato, perché ogni riga vale in tutto il mondo. Con le proprietà, però, il lavoro è molto più piccolo che nel 2.0 (§11.2), e si fa una volta sola: in cambio l'autore non deve più decidere il costo di nessuna azione, in nessuna scena.

## 44. Il catalogo delle difficoltà

Il catalogo elenca le cose del mondo con la loro soglia e, accanto, tutto ciò che la cambia. Una voce ha questa forma:

```
Una serratura di magazzino                               Impegnativa (8)
  un gradino in meno   sai com'è fatta                   notizia
  un gradino in più    al buio, senza una luce           proprietà
  attrezzi             un grimaldello (+1)
  serve                —

Una porta sprangata                                      Ardua (10)
  serve                forza: Robusto, oppure una leva, oppure qualcuno che spinga
```

L'autore che scrive una prova cerca la cosa nel catalogo; se non c'è, la aggiunge, e da quel momento vale per tutta la storia. Il catalogo fa tre lavori:

- **tiene coerenti autori diversi**: la serratura di un magazzino è Impegnativa in ogni capitolo;
- **impedisce alla difficoltà di crescere di nascosto**: se al decimo capitolo tutte le serrature fossero diventate Estreme, il catalogo lo mostrerebbe. La difficoltà non cresce insieme al personaggio: chi torna davanti alla porta che non riusciva ad aprire la trova uguale, ed è così che si accorge di essere cresciuto;
- **dà alla difficoltà una struttura in dati**: il motore legge dal catalogo la soglia, gli spostamenti, gli attrezzi e i requisiti, e compone da solo le righe del quadro.

## 45. Che cosa si scrive

### 45.1 Per una prova

Per ogni via con una prova l'autore scrive tre cose obbligatorie: dove porta il *Riesci*, la notizia del *Non riesci*, e il rovescio, se la prova può essere allo scoperto. Tutto il resto ha un predefinito: il dono, la metà, il prezzo, la complicazione (§28.6–28.7).

Quando serve, l'autore interviene a tre livelli:

- **nessuno**: valgono le regole. È il caso normale;
- **ritocco**: una riga. Un'aggravante di scena, uno spostamento di soglia, un dono scritto a mano, una metà diversa da quella del ripiego;
- **scrittura piena**: la fascia si riscrive tutta. Gli snodi sono sempre a scrittura piena.

### 45.2 Per una persona

Il nome, le dimensioni che usa con il loro valore iniziale, due o tre reazioni, il movente, e se tradisce. Se è un avversario, le cinque righe. Se è un compagno, le capacità e i tratti.

### 45.3 Per un luogo

La zona, le proprietà, le righe proprie che servono, gli stati, e le voci del repertorio.

### 45.4 Per una scelta

Il testo in prima persona, i requisiti, gli effetti, e se è da una volta sola o sempre disponibile. Il resto, compreso quando la scelta si esaurisce, lo ricava il motore.

## 46. Il repertorio e i testi

Il **repertorio** è l'insieme delle complicazioni, degli imprevisti e dei prezzi di ogni zona. Ogni voce dice:

- quando può uscire (in quale zona, in quale momento, con quali condizioni sulla memoria);
- che cosa colpisce (l'obiettivo, il costo, la Traccia, una notizia, un legame);
- quando colpisce: subito, oppure dopo un numero dichiarato di ore. Le complicazioni che arrivano dopo sono le più efficaci, perché arrivano quando non si può più tornare indietro.

Se il testo si compone a pezzi (il gesto, l'esito, la complicazione, il luogo), **ogni pezzo è una frase intera**. Mai buchi da riempire dentro una frase: è ciò che fa sembrare un testo generato da una macchina.

Il repertorio si dimensiona dalla parte di chi legge: si decide quante volte, al massimo, chi gioca potrà rileggere la stessa frase in una partita, e da lì si ricava quante varianti servono.

**L'intelligenza artificiale.** Un modello linguistico può aiutare a scrivere il repertorio, durante la produzione. L'autore rilegge, taglia e congela. Durante il gioco non si genera nessun testo, per tre ragioni: un testo generato può contraddire lo stato della storia, rende i salvataggi imprevedibili, e toglie all'autore l'ultima parola.

## 47. I controlli

Una storia è pronta quando passa questi controlli. Nell'app li fa un programma; sulla carta si fanno con una lista. Quelli segnati come *avviso* segnalano una scelta da ripensare, non un errore.

| # | Controllo |
|---|---|
| 1 | Ogni ostacolo ha almeno un ripiego, che non si tira |
| 2 | Nessuna prova da una volta sola è l'unica via di un ostacolo |
| 3 | Ogni scontro ha un modo di andarsene che non si tira |
| 4 | Nessuna prova può uccidere senza che il quadro lo dica |
| 5 | Nessun agguato uccide prima della prima decisione di chi gioca |
| 6 | Ogni ferita dice che cosa impedisce |
| 7 | Ogni logorio ha il suo rimedio, e nessun rimedio ne cura due |
| 8 | Ogni tratto è letto da almeno una scena, una voce del catalogo o una proprietà |
| 9 | Ogni via chiusa da un tratto del corpo dichiara un'alternativa: una cosa, una persona, il ripiego |
| 10 | Ogni prova ha la notizia del *Non riesci* |
| 11 | Ogni prova che può essere allo scoperto ha un rovescio |
| 12 | Almeno metà delle capacità ha partenza 0, al massimo due hanno partenza 2, e nessuna ha il Fondo più alto della partenza |
| 13 | Ogni luogo, in almeno un momento, ha un ambito a −1 |
| 14 | Tutti i valori di proprietà e righe proprie sono −1, 0 o +1 |
| 15 | Ogni soglia viene dal catalogo, e nessuna prova la sposta di più di un gradino per parte |
| 16 | Nessuna cosa ha due usi nella stessa prova |
| 17 | Nessuna notizia falsa sposta una soglia o compare nel quadro |
| 18 | Ogni notizia falsa si può smentire: con un'altra notizia, una scena o una verifica |
| 19 | Ogni convinzione dichiara che cosa la mette in dubbio |
| 20 | Ogni stato d'animo dice come passa |
| 21 | Ogni persona che può tradire lo dichiara nel movente |
| 22 | Ogni scelta che dà qualcosa si esaurisce, oppure è segnata come sempre disponibile |
| 23 | Ogni memoria scritta da una scena è letta da almeno un'altra |
| 24 | Ogni snodo ha testi scritti a mano |
| 25 | Ogni avversario ha le cinque righe, e almeno due punti deboli con capacità di ambiti diversi |
| 26 | Nessun ostacolo offre due vie che differiscono soltanto nel nome della capacità |
| 27 | Ogni confronto è raggiunto da una pressione: restare al coperto per sempre non deve essere gratis |
| 28 | Nessun *Non riesci* al coperto o esposto porta a un finale o a una ferita: solo il rovescio può chiudere la storia |
| 29 | *Avviso.* Ogni scelta è scritta in prima persona |
| 30 | *Avviso.* Ogni tratto iniziale apre e chiude, o rende più difficile, qualcosa |

## 48. Quattro formati

### 48.1 Il librogame

Chi legge ha una scheda con le sei parti del personaggio, le tacche di Traccia per zona, le scadenze, e la riga delle fasce (§28.8). Ha due dadi e una matita. Le notizie sono parole chiave, con accanto una casella per segnarle verificate o smentite; i legami sono righe con le caselle delle dimensioni.

Una prova, in un paragrafo, si presenta così:

> **112.** L'archivio è pieno di capitani che protestano per le tariffe. Il registro degli imbarchi è aperto sul banco, sotto il naso dell'archivista.
>
> ◆ *Prendo il registro di nascosto.* Sottrarre, Impegnativa (8); se hai una borsa, +1. Costo con archivio e alba: 0; aggiungi le tue aggravanti, togli le preparazioni. **In pieno**: vai al 57 e segna ARMADIO. **Riesci**: 57. **Quasi**: scegli fra il 57 salendo di un grado, il 19 (la metà) o tornare qui. **Non riesci**: 88. Se va male: la guardia (140).
> ◆ *Leggo il registro al contrario* (se hai VISTA ACUTA e SA LEGGERE): vai al 204.
> ◆ *Chiedo a Bressan di Matteo:* vai al 203.
> ◆ *Pago un facchino perché legga il registro al posto mio* (due monete, un'ora): vai al 19.

Il paragrafo stampa la somma di partenza del costo, cioè capacità e ambiente, già calcolata; se lo stesso paragrafo si raggiunge in momenti diversi, ne stampa una per momento. Stampa anche gli spostamenti di soglia che dipendono da parole chiave: «se hai GENOVA, la soglia è 8 invece di 10». Chi legge aggiunge soltanto ciò che dipende da lui. Gli effetti predefiniti delle fasce e dei gradi sono stampati sulla scheda; i paragrafi di esito dicono soltanto ciò che è proprio della scena. Per il *Quasi*, «salendo di un grado» vuol dire leggere il costo sulla riga di sopra della tabella della scheda.

La tabella degli imprevisti e il repertorio di ogni zona stanno in fondo al libro, con un numero per voce. In fondo stanno anche i tratti, le proprietà e gli stati d'animo con i loro effetti.

### 48.2 Il tavolo

Il **narratore** ha la scheda dell'ambientazione e conduce la storia; i giocatori decidono. Valgono le regole di tutto il documento, con cinque precisazioni.

- **Il narratore non tira mai contro i giocatori.** I dadi li tirano solo loro. Gli avversari reagiscono secondo la loro natura, senza dadi.
- **Il quadro si fa ad alta voce**, sezione per sezione. Il giocatore aggiunge le sue cose e le sue preparazioni, e decide se agire.
- **Il *Quasi* lo sceglie il giocatore**, mai il narratore.
- **Il narratore gioca il mondo e le persone**: gli imprevisti, le reazioni, le dimensioni dei legami, le scadenze. Non decide mai quanto costa o quanto è difficile un'azione: lo dicono le tabelle e il catalogo.
- **Con più giocatori** ognuno ha la sua esposizione, e un giocatore può aiutare un altro (+1), esponendosi con lui.

### 48.3 L'app testuale

Il programma fa tutti i conti. Deve:

1. mostrare il quadro, con le quattro sezioni e la posta, prima che chi gioca confermi l'azione;
2. mostrare le fasce con numeri e parole, non solo con colori;
3. dopo il tiro, mostrare i due timbri, la fascia e il grado, e nel *Quasi* le tre possibilità con il loro costo;
4. mostrare le scelte chiuse, con ciò che manca o con la convinzione che le chiude, e togliere le scelte esaurite;
5. mostrare le scadenze e la Traccia delle zone conosciute;
6. tenere un taccuino con le notizie e il loro stato, le convinzioni, e le persone con i legami detti a parole;
7. mostrare la crescita: i tentativi risparmiati, le fasce migliorate, la scheda finale accanto a quella iniziale;
8. salvare in modo che la stessa partita, con lo stesso seme dei dadi, si possa rigiocare identica;
9. non generare testo durante il gioco.

Una nota dalla prima partita alla Santa Rita: le schermate che coprono il diario, come quella finale, devono coprirlo del tutto. Un titolo che si legge sopra il testo di sotto confonde proprio nel momento in cui chi gioca vuole capire com'è andata.

### 48.4 Il gioco grafico

Il motore non disegna niente. Tiene la memoria della storia, sa quali scelte sono disponibili e con quale quadro, e risolve le prove. Il gioco grafico gli chiede queste cose e le mostra a modo suo.

| Nel motore | In un gioco grafico |
|---|---|
| luogo e proprietà | un'area della mappa; la luce, il suono, la gente che la riempiono |
| scena | ciò che hai davanti: una stanza con le sue persone e le sue cose |
| via | una cosa da usare, un punto della stanza, una persona, una battuta di dialogo |
| scelta chiusa | una cosa o una battuta visibile ma non utilizzabile, con il requisito scritto accanto |
| tratti | come si muove e che cosa può raggiungere il personaggio: la finestrella in cui passa, la porta che non riesce a spingere |
| quadro | un pannello che compare quando scegli un'azione, prima della conferma |
| fasce e gradi | due timbri, o due animazioni, dopo il tiro |
| ora e momento | un orologio che avanza quando agisci, non in tempo reale; la luce e le persone cambiano con il momento |
| Traccia | persone che ti riconoscono, guardie più attente, porte che si chiudono |
| legami | come le persone ti guardano, ti salutano, ti parlano |
| memoria della storia | ciò che vedi cambiare nel mondo: una nave che non c'è più, una guardia alla porta |

Per chi costruisce il gioco valgono due regole in più.

- **Esplorare liberamente è gratis, agire costa.** Il giocatore può muoversi in una stanza, guardare, avvicinarsi, senza che il tempo del motore avanzi.
- **Nessuna abilità di mani.** Il risultato di un'azione lo decidono il quadro e i dadi, mai la mira o i riflessi di chi gioca.

---
---

# PARTE X — TRE GENERI

Il porto è un'ambientazione d'intrigo, con un po' di violenza. Per sapere se il motore vale davvero per ogni genere, ecco tre scene da tre mondi lontani, ciascuna scelta per mettere sotto sforzo una parte diversa del 3.0. Le ambientazioni sono abbozzate, non compilate: servono a vedere il motore all'opera.

## 49. Un giallo: la villa sul lago

*Villa Ardenghi, sul lago, ottobre 1928. Il vecchio Ernesto Ardenghi è morto nel sonno, e domani si apre il testamento. Tu sei l'avvocato giovane dello studio che lo custodisce, invitato per la lettura. Hai il sospetto che nel sonno qualcuno l'abbia aiutato.*

**La frase dell'esposizione.** *Nella villa, essere esposti significa che qualcuno della casa potrà dire dov'eri.*

**Le proprietà.** La villa di notte ha il **silenzio** (mano +1, voce +1) e il **buio** (corpo −1; leggere, cercare: un gradino in più senza una luce). Di giorno ha la **servitù in giro**, una sorveglianza leggera (corpo +1). Lo studio del morto ha una riga propria: *chi fruga nello studio del morto non ha una buona ragione per farlo* (mente +1).

**Il taccuino, a mezzanotte.**

```
NOTIZIE
  Lo scrittoio dello studio ha un doppio fondo.         sentita dire (la governante)
  Il nipote Carlo era in giardino alle undici.          sentita dire (l'autista)
  Il giardiniere chiude il cancello alle dieci e mezza. verificata
  (la seconda e la terza non possono essere vere tutte e due)
CONVINZIONI
  Il dottor Morelli è un uomo onesto.
```

La governante, che si fida di te (fiducia 2) perché le hai riportato la borsetta dimenticata in treno, ti ha parlato del doppio fondo. Senza quella notizia la via non esisterebbe: è una via **rivelata**. Sali nello studio con una candela, dopo aver detto a tutti che andavi a dormire. Il quadro:

```
Apro il doppio fondo dello scrittoio                   Osservare · mente

PUOI?     sì · sei nello studio · hai una candela: puoi leggere

RIESCI?   10  Ardua: un nascondiglio fatto da un ebanista
          −2  sai dov'è il doppio fondo                              notizia
          +1  sei Pratico in Osservare
          ──  i dadi devono fare 7
              in pieno 8 · riesci 50 · quasi 25 · non riesci 17

COSTA?     0  guardare, di suo, non si nota
          +1  chi fruga nello studio del morto non ha una buona ragione
          −1  hai detto a tutti che andavi a dormire                 preparazione
          ──  0  AL COPERTO

DOPO?     riesci: ciò che c'è nel doppio fondo
          quasi: tutto, ma qualcuno sente lo scatto · oppure la metà: la lettera, non la busta
          non riesci: scopri qualcosa sullo scrittoio
```

Tiri 6: con il +1 fa 7, ne manca 1. *Quasi*. Scegli la metà: nel doppio fondo c'è una lettera del dottor Morelli al vecchio, che parla di «dosi da aumentare con prudenza». La busta con il timbro postale, che direbbe quando è stata spedita, resta incastrata in fondo. Non hai lasciato segni.

Adesso sul taccuino c'è una notizia che mette in dubbio la tua convinzione sul dottore. Il gioco ti offre **«Ci ripenso»**. Se lasci andare la convinzione, si apre «Chiedo al dottor Morelli di che dosi parlava», una via che prima vedevi chiusa: *credi che il dottor Morelli sia un uomo onesto*. E in biblioteca, luogo tranquillo, **«Metto insieme quello che so»**: la lettera, più il flacone di laudano che hai visto in bagno, danno la notizia «Ernesto prendeva il laudano da Morelli, a dosi crescenti».

La notizia dell'autista su Carlo in giardino è falsa, e il taccuino lo lascia intuire: è in contrasto con il cancello chiuso. Resta a te scoprire chi mente, e perché.

**Che cosa mette alla prova.** Le notizie false e in contrasto, la via rivelata, le deduzioni, una convinzione che si incrina, la metà del *Quasi* in un'indagine, dove mezza prova è spesso meglio di un segno lasciato. Non c'è un solo tiro contro una persona.

## 50. Un horror: il faro di Punta Nera

*Punta Nera, novembre 1911. Il guardiano del faro non risponde ai segnali da tre notti, e la barca della capitaneria ti ha lasciato sugli scogli con una lanterna, un fiasco d'olio e l'ordine di riaccendere la luce. Dalla torre, a tratti, arriva un rumore di passi che non sono i tuoi.*

**La frase dell'esposizione.** *Nel faro, essere esposti significa che la cosa nel faro sa dove sei.*

**Le proprietà.** Il **buio** (corpo −1; cercare, riconoscere: un gradino in più senza luce). Il **rumore del mare**, al piano terra (voce −1: le grida non arrivano lontano). L'**altezza**, sulla scala e in cima (per chi soffre le vertigini, un gradino in più). La scala di ferro ha una riga propria: *ogni passo sul ferro risuona per tutta la torre* (corpo +1).

**Il personaggio** ha, fra i tratti, *Ha paura del buio*: quando resta al buio senza una luce diventa **spaventato**. I nervi sono pesanti: hai già sentito la cosa muoversi.

**La cosa nel faro** ha un movente: vuole che la luce resti spenta. Per il motore è un avversario che avanza, con un punto debole che si scopre solo sapendolo: la luce. Smette quando la lanterna in cima è accesa. Senza movente sarebbe il mondo, e il mondo non si affronta: si evita.

**La porta della lanterna**, in cima, è gonfia di salsedine. Il catalogo dice: *Ardua (10). Serve forza: Robusto, oppure la leva che il guardiano teneva in cantina, oppure qualcuno che spinga con te.* Tu non sei robusto, e la leva non l'hai presa. La via si vede, chiusa, con le tre alternative.

Decidi di salire senza lanterna, perché la luce ti farebbe vedere dalla cosa. Il quadro:

```
Salgo in silenzio fino alla cima                        Muoversi · corpo

PUOI?     sì · la scala è libera

RIESCI?    8  Impegnativa: salire una scala di ferro senza far rumore
          +2  sei spaventato: stare zitto ti costa di più         stato d'animo
          +1  sei Pratico in Muoversi
          ──  i dadi devono fare 9
              in pieno 0 · riesci 28 · quasi 31 · non riesci 42

COSTA?     0  muoversi, di suo, non si nota
          +1  ogni passo sul ferro risuona per tutta la torre
          −1  il buio copre il corpo
          +1  i nervi ti pesano
          ──  1  ESPOSTO

DOPO?     riesci: arrivi in cima
          quasi: tutto, ma allo scoperto · oppure la metà: il pianerottolo della finestra
          non riesci: scopri qualcosa sulla scala
          se va male: la cosa ti sente, e scende
```

La soglia sale di un gradino perché sei spaventato: è il prezzo di aver lasciato la lanterna. Con la lanterna accesa non saresti spaventato, ma il buio non ti coprirebbe più: il costo salirebbe a 2, allo scoperto. Nessuna delle due scelte è giusta; ognuna ha il suo prezzo scritto.

**Che cosa mette alla prova.** Il logorio e lo stato d'animo insieme, la paura come tratto, un'azione in cui la stessa proprietà aiuta il costo e peggiora la riuscita, un avversario senza volto ma con un movente, la porta che chiede forza con le sue alternative, le cose fragili: la lanterna può rompersi con un *Non riesci*, e l'olio è una scorta che finisce.

## 51. Un racconto per ragazzi: il campo sul lago

*Campo estivo del Lago Scuro, luglio 1987. Hai undici anni. Stanotte qualcuno ha rubato la bandiera della vostra squadra, e tu sai che la torcia per andarla a cercare nel bosco è chiusa nella cucina del campo.*

**La frase dell'esposizione.** *Al campo, essere esposti significa che un animatore potrà dire di averti visto fuori dalla tenda.*

**Nessuna morte.** L'ambientazione lo dichiara nella voce delle ferite: si possono prendere soltanto ferite lievi, una sbucciatura, una caviglia storta. Le armi non ci sono. La posta più alta è essere rimandati a casa, e il quadro lo dice.

**I legami.** Giulia, della tua tenda, si fida di te (fiducia 2) e ti vuole bene (affetto 1). Bruno, l'animatore, si fida di te (fiducia 2): se ti scopre fuori di notte, la fiducia scende, e per il resto del campo non ti lascerà più andare da solo da nessuna parte.

**I tratti.** Sei *Minuto*: passi dalla finestrella della cucina, da cui un adulto non passerebbe. E *Ha paura del bosco di notte*.

Giulia accetta di tenerti aperta la finestrella. Il quadro:

```
Entro in cucina dalla finestrella                      Muoversi · corpo

PUOI?     sì · sei minuto: dalla finestrella ci passi                tratto

RIESCI?    6  Facile: passare da una finestrella
          +1  sei Pratico in Muoversi
          +1  Giulia ti tiene la finestra                           legame
          ──  i dadi devono fare 4
              in pieno 42 · riesci 50 · quasi 8 · non riesci 0

COSTA?     0  muoversi, di suo, non si nota
          −1  il buio copre il corpo
          +1  nella tenda di Bruno c'è ancora la luce accesa
          ──  0  AL COPERTO

DOPO?     riesci: sei in cucina
          in pieno: qualcosa in più
          se va male: niente di peggio che non riuscire
          Giulia ti ha aiutato: le dovrai un favore
```

Tiri 11: con il +2 fa 13, sette sopra la soglia. *In pieno*. Il dono è una persona: Giulia ti ha visto sgusciare dentro senza un rumore, e il suo affetto sale a 2. D'ora in poi, se combini un guaio, lei ti perdona una volta.

Più tardi, nel bosco, la paura del bosco ti costerà un gradino a ogni prova. Alla fine della storia, se hai trovato la bandiera, perdi il tratto *Ha paura del bosco di notte*: è la tua crescita, ed è scritta sulla scheda con la sua origine.

**Che cosa mette alla prova.** Una storia senza morte e senza violenza, in cui tutto il peso sta nei legami. Un tratto che apre invece di sommare. Un aiuto che ha un prezzo in favori. E una domanda che soltanto le persone possono chiudere: il quadro si capisce a undici anni? Per un pubblico così giovane il quadro potrebbe mostrare soltanto le parole, senza numeri. È un'opzione da provare.

## 52. Che cosa hanno mostrato

Le tre scene non sono tre storie giocate. Servono a vedere dove il motore regge, e dove chiede ancora qualcosa. È la tabella degli attriti che la prova dei generi della roadmap compilerà per davvero.

| Genere | Regge | Chiede ancora |
|---|---|---|
| **Giallo** | notizie false e in contrasto, vie rivelate, deduzioni, convinzioni | un modo per mostrare sulla carta le notizie in contrasto senza svelare quale cade |
| **Horror** | stato d'animo e logorio insieme, proprietà che aiutano e danneggiano, un avversario con un movente | una regola per la cosa senza movente che però insegue, come l'acqua che sale: oggi è una scadenza |
| **Ragazzi** | nessuna morte, legami al centro, tratti che crescono | un quadro con sole parole per i più giovani, da provare |

Restano aperte due domande che nessuna delle tre scene tocca. La fantascienza chiede **scale diverse** (una stanza, una città, un pianeta) e forse delle **fazioni**: una fazione potrebbe essere una persona collettiva, con le sue dimensioni e le sue reazioni. Il fantasy chiede se la **magia** entra come capacità, tratti e cose senza un sottosistema suo. Le storie con **più protagonisti** chiedono come si divide la memoria fra loro.

---
---

# PARTE XI — LIMITI E VERIFICA

## 53. Dove questo motore non funziona

Il motore presuppone quattro cose:

1. un personaggio che agisce e può fallire;
2. un'azione divisa in decisioni, con il tempo di leggere un quadro prima di agire;
3. conseguenze che restano;
4. una differenza che valga la pena fare fra *quanto è probabile riuscire* e *quanto costa provarci*.

Dove una di queste manca, il motore non si adatta: semplicemente non serve. Restano fuori i giochi d'azione in tempo reale, la gestione di risorse senza un personaggio, i giochi tattici a squadre su mappa, gli enigmi a soluzione unica.

La grafica non è un limite: un gioco con immagini, mappe ed esplorazione libera rientra pienamente, purché le azioni che contano si decidano scegliendo e non con i riflessi (§48.4). Resta dentro quasi tutta la narrativa interattiva che vale la pena progettare: avventure, indagini, drammi, viaggi, intrighi, storie di paura, storie per ragazzi, in cui un personaggio sceglie e il mondo se ne ricorda.

Il 3.0 ha anche un limite suo: è più grande del 2.0. Sei parti del personaggio, le proprietà, le persone con le loro dimensioni, quattro fasce. Una storia breve non ha bisogno di tutto. Un'ambientazione può fare a meno dei compagni, degli stati d'animo, delle deduzioni, delle convinzioni; non può fare a meno delle quattro domande.

## 54. Il piano di verifica

Un motore si verifica in tre modi, e nessuno sostituisce gli altri: i controlli sui dati, le simulazioni, le persone. Per ogni verifica si scrive prima che cosa deve succedere perché la si consideri superata. Deciderlo dopo aver visto i risultati non verifica niente. I criteri di questa sezione sono scritti oggi, prima di qualunque prova.

### 54.1 Prima del codice: il quadro sulla carta

Il 3.0 si può cominciare a provare prima di scrivere una riga di programma. Si stampano dieci quadri della Santa Rita, di situazioni diverse, e si danno a cinque persone che non conoscono il progetto, con una sola pagina di spiegazione. Per ogni quadro si chiede: *che cosa rischi? quanto è probabile che ti vada bene? che cosa cambieresti per rischiare di meno?*

- **Superata** se almeno quattro persone su cinque rispondono giusto alle prime due domande per almeno otto quadri su dieci, e se per la terza nominano una riga del quadro.
- **Da ripensare** se il tempo per leggere un quadro, misurato con l'orologio, resta sopra i trenta secondi anche al decimo quadro.

Nella stessa sessione si fa la **prova delle parole**: si chiede a ciascuno che cosa vuol dire, senza spiegazioni, *ripiego*, *quadro*, *esposto*, *Traccia*, *Quasi*. Una parola che meno di quattro persone su cinque capiscono nel senso giusto si cambia.

### 54.2 Le simulazioni

I giocatori automatici del 2.0 restano: il **prudente**, che resta sempre al coperto; il **temerario**, che non si prepara mai; lo **scrupoloso**, che si prepara sempre; l'**opportunista**, che aspetta il luogo e il momento giusti. Se ne aggiungono cinque:

- tre giocatori che nel *Quasi* scelgono sempre la stessa cosa: **sempre tutto**, **sempre la metà**, **sempre lascio perdere**;
- uno che nel *Quasi* sceglie **secondo la situazione**: prende tutto quando la scadenza incalza, lascia perdere quando la Traccia della zona è già alta, prende la metà negli altri casi;
- un giocatore **con un obiettivo**, che cerca la strada più breve verso un finale, per misurare se la storia si può vincere e quanto margine lascia la scadenza.

Criteri, per mille partite di ciascuno:

1. **Nessuna partita bloccata**, nessun errore, tutte le scene raggiungibili raggiunte da almeno una strategia.
2. **Nessuna strategia batte tutte le altre su tutto** (finali raggiunti, Traccia, ferite, ore spese). Se una lo fa, il motore ha una soluzione, e le scelte sono finte.
3. **Il *Quasi* è una scelta vera**: il giocatore che sceglie secondo la situazione raggiunge il finale migliore più spesso di ciascuno dei tre che scelgono sempre la stessa cosa. Se uno dei tre lo batte, una delle possibilità del *Quasi* vale sempre più delle altre, e va corretta.
4. **Esiste una situazione in cui conviene essere esposti**, invece che al coperto. Di solito quando una scadenza incalza.
5. **Le fasce osservate coincidono con le tabelle**, entro due punti su cento. Serve a verificare il codice, non il modello.
6. **Il pericolo resta**: il temerario subisce almeno un rovescio o una ferita in più di metà delle partite. Se non succede, il 3.0 ha reso il mondo troppo clemente, e si interviene sul catalogo (§27).

E un criterio sul lavoro di chi scrive: nella Santa Rita riscritta, la media dei testi obbligatori per prova non supera tre.

Il giocatore con un obiettivo esiste dal 25 settembre 2026, e al primo giro ha fatto il suo lavoro: ha trovato nella Santa Rita una strada che vinceva sempre, una catena di ripieghi (caricare casse, aspettare che Teodoro si addormenti, spezzare la catena con l'ascia) che finiva in un salto sempre al coperto, perché il buio della nave copriva anche l'allarme. La correzione è venuta dallo stato del mondo: quando suona l'allarme si accendono le lanterne, e il buio non copre più nessuno. Dopo la correzione il giocatore con un obiettivo vince 81 partite su 100, contro le 20 di chi sceglie a caso. Il criterio 2 è superato. Resta un dato da portare alle prove con le persone: chi gioca bene finisce in sei ore circa, e alla nave che salpa restano in media diciannove ore. La scadenza, per un giocatore attento, quasi non preme.

### 54.3 Le persone

Almeno **dieci persone** giocano la Santa Rita riscritta con il 3.0: cinque sul libro, cinque nell'app. L'app registra la partita, compresi i tempi di lettura dei quadri e le scelte nei *Quasi*. Alla fine si fanno sette domande, ciascuna con il suo criterio.

| # | Domanda | Superata se |
|---|---|---|
| 1 | Dopo una scena tesa: «Perché pensavi che sarebbe successo quello che è successo?» | almeno 7 su 10 citano una riga del quadro: il luogo, il momento, una preparazione, un attrezzo, un tratto |
| 2 | A fine partita: «Qual è stata la decisione più importante?» | almeno 7 su 10 nominano una decisione, non un tiro |
| 3 | «Ricordi un *Quasi*? Che cosa hai scelto, e perché?» | almeno 7 su 10 danno una ragione legata alla situazione: il tempo, la Traccia, ciò che volevano |
| 4 | Si leggono ad alta voce tre esiti della loro partita: «In che fascia è caduto il tiro?» | almeno 8 su 10 riconoscono tutte e tre le fasce: la prova che sono diverse per natura |
| 5 | «Chi ricordi fra le persone della storia, e che cosa pensa di te?» | almeno 6 su 10 descrivono un atteggiamento con la sua ragione |
| 6 | «Che cosa poteva o non poteva fare il tuo personaggio, per com'era fatto?» | almeno 6 su 10 citano un tratto e che cosa ha aperto o chiuso |
| 7 | «Hai mai cambiato idea su qualcosa, nella storia?» | almeno 5 su 10 raccontano un «Ci ripenso», o una notizia smentita |

C'è poi una misura che non chiede niente a nessuno: **il tempo di lettura del quadro**, registrato dall'app. Se dopo le prime cinque prove la mediana resta sopra i quindici secondi, il quadro è troppo lungo, e va ripensato come mostrarlo prima di aggiungere qualunque altra cosa. È il rischio più grande del 3.0, e la roadmap lo aveva già scritto per la ricevuta.

Nella prova dei generi, ogni storia nuova si fa giocare ad almeno tre persone, con le stesse domande.

### 54.4 Che cosa si fa dei risultati

Un criterio mancato non si corregge spostando il criterio. Si corregge il motore o la storia, e il documento dice che cosa è cambiato e perché, in una nota datata. Se un criterio si rivela sbagliato in sé (per esempio perché misura una cosa che non conta), lo si corregge scrivendo accanto perché, prima di guardare di nuovo i risultati.

## 55. Prossimi passi

1. **Approvare questo documento.** Fino ad allora il 2.0 resta il riferimento.
2. **Adeguare il motore e i dati.** Fatto il 25 settembre 2026, secondo l'appendice E, compresi i compagni e il giocatore con un obiettivo. Restano l'editor e le proposte del §7.3 e del §11.4 (le cose nei luoghi, i posti, lo stato del mondo), da approvare.
3. **Riscrivere la Santa Rita** nel 3.0. Fatto anche questo: le scelte in prima persona, i ripieghi, le proprietà dei luoghi, le persone con i loro legami, i tratti del personaggio, le notizie con il loro stato, una convinzione che si può lasciare andare.
4. **La prova del quadro sulla carta** (§54.1), che si può fare anche prima del punto 2.
5. **La prova con le persone** (§54.3), che diventa la Fase 1 della roadmap.
6. **La prova dei generi**, partendo dalle tre ambientazioni abbozzate nella Parte X.
7. **Aggiornare la roadmap**, che oggi mette il documento 3.0 alla fine del percorso: adesso ne è l'inizio.
8. Correggere questo documento con ciò che le prove insegnano, dichiarando ogni cambiamento.

---
---

# APPENDICE A — Tabelle da tenere sottomano

**Due dadi a sei facce.** Quante combinazioni su 36 fanno almeno un certo numero, e la percentuale.

| Almeno | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| su 36 | 36 | 35 | 33 | 30 | 26 | 21 | 15 | 10 | 6 | 3 | 1 |
| % | 100 | 97 | 92 | 83 | 72 | 58 | 42 | 28 | 17 | 8 | 3 |

Sotto il 2 vale 36; sopra il 12 vale 0.

**Le fasce, esatte.** Chiama *d* quanto devono fare i dadi: la soglia meno livello, attrezzi e aiuti, più le penalità. Allora, con la tabella qui sopra:

- **in pieno**: quante fanno almeno *d* + 4;
- **riesci**: quante fanno almeno *d*, meno quelle che fanno almeno *d* + 4;
- **quasi**: quante fanno almeno *d* − 2, meno quelle che fanno almeno *d*;
- **non riesci**: 36, meno quelle che fanno almeno *d* − 2.

| *d* | In pieno | Riesci | Quasi | Non riesci |
|---|---|---|---|---|
| 1 | 30 | 6 | 0 | 0 |
| 2 | 26 | 10 | 0 | 0 |
| 3 | 21 | 14 | 1 | 0 |
| 4 | 15 | 18 | 3 | 0 |
| 5 | 10 | 20 | 5 | 1 |
| 6 | 6 | 20 | 7 | 3 |
| 7 | 3 | 18 | 9 | 6 |
| 8 | 1 | 14 | 11 | 10 |
| 9 | 0 | 10 | 11 | 15 |
| 10 | 0 | 6 | 9 | 21 |
| 11 | 0 | 3 | 7 | 26 |
| 12 | 0 | 1 | 5 | 30 |
| 13 | 0 | 0 | 3 | 33 |
| 14 | 0 | 0 | 1 | 35 |

Valori su 36; ogni riga somma 36. Per avere la percentuale, dividi per 36 e moltiplica per 100. Un esempio da rifare: un Pratico davanti a un'Impegnativa ha *d* = 8 − 1 = 7. In pieno: almeno 11, cioè 3. Riesci: almeno 7 meno almeno 11, cioè 21 − 3 = 18. Quasi: almeno 5 meno almeno 7, cioè 30 − 21 = 9. Non riesci: 36 − almeno 5, cioè 36 − 30 = 6.

**Tentativi medi per riuscire**, contando *In pieno* e *Riesci* (36 diviso la loro somma):

| | Facile | Impegnativa | Ardua | Estrema |
|---|---|---|---|---|
| Inesperto | 1,4 | 2,4 | 6 | 36 |
| Pratico | 1,2 | 1,7 | 3,6 | 12 |
| Esperto | 1,1 | 1,4 | 2,4 | 6 |
| Maestro | 1,0 | 1,2 | 1,7 | 3,6 |

**Gli imprevisti**

| Traccia nella zona | 0 | 1 | 2 | 3 |
|---|---|---|---|---|
| Imprevisto se i dadi fanno al massimo | 2 | 4 | 6 | 8 |
| su 36 | 1 | 6 | 15 | 26 |

**Il quadro, punto per punto**

1. *Puoi?* Controlla i requisiti: tratti, cose, notizie, legami, posizione, condizioni.
2. *Riesci?* Prendi la soglia dal catalogo; spostala al massimo di un gradino in giù e uno in su; aggiungi livello, attrezzi e aiuti (al massimo +2), togli le penalità (al massimo −3); calcola *d* e leggi le fasce.
3. *Costa?* Scrivi la partenza; aggiungi l'ambiente per l'ambito (al massimo 2 in su o in giù); aggiungi 1 per ogni aggravante, togli 1 per ogni preparazione; tieni il grado fra il Fondo e 2.
4. *Dopo?* Scrivi che cosa ottieni in ogni fascia, le righe che non contano, e la posta.

**Dopo il tiro**

| | Al coperto | Esposto | Allo scoperto |
|---|---|---|---|
| **In pieno** | ottieni, e il dono | ottieni, il dono · +1 Traccia | ottieni, il dono · +1 Traccia, il prezzo |
| **Riesci** | ottieni | ottieni · +1 Traccia | ottieni · +1 Traccia, il prezzo |
| **Quasi** | scegli: tutto (+1 Traccia) · la metà · lasci perdere | scegli: tutto (+1 Traccia, il prezzo) · la metà (+1 Traccia) · lasci perdere (+1 Traccia) | scegli: tutto (+1 Traccia, il rovescio) · la metà (+1 Traccia, il prezzo) · lasci perdere (+1 Traccia) |
| **Non riesci** | la notizia | la notizia · +1 Traccia, una complicazione | la notizia · +1 Traccia, il rovescio |

---

# APPENDICE B — Il porto, ricompilato

Una città di porto in un Seicento senza nome. Il personaggio cerca il fratello Matteo, sparito da tre giorni. È l'ambientazione del 2.0, ricompilata con le voci del 3.0. Dove i numeri cambiano rispetto al 2.0, lo dice la nota in fondo.

**1. La frase dell'esposizione.** *Nel porto, essere esposti significa che qualcuno potrà dire di averti visto.* Al coperto: nessuno ti ha notato. Esposto: qualcuno ti ha notato e se ne ricorderà. Allo scoperto: sanno chi sei e che cosa hai fatto.

**2. Il criterio del Fondo.** *Ha un Fondo ciò che lascia un segno che resta: un corpo ferito, una porta forzata, una parola detta a qualcuno che se la ricorderà.*

**3. Gli ambiti.** Corpo, mano, mente, voce.

**4. Le capacità.** Undici; sette con partenza 0, due con partenza 2.

| Ambito | Capacità | Partenza | Fondo | La frase della partenza |
|---|---|---|---|---|
| Corpo | Muoversi | 0 | 0 | al porto tutti corrono, e nessuno ci fa caso |
| | Battersi | 2 | 1 | la violenza si vede e si ricorda |
| | Resistere | 0 | 0 | reggere la fatica non si nota |
| Mano | Forzare | 1 | 1 | una serratura forzata resta forzata |
| | Sottrarre | 0 | 0 | prendere, fatto bene, non lascia niente |
| | Curare | 0 | 0 | medicare una ferita non si nota |
| Mente | Osservare | 0 | 0 | guardare è ciò che fanno tutti |
| | Sapere | 0 | 0 | sapere una cosa non lascia segni |
| Voce | Persuadere | 1 | 1 | chi viene convinto sa di esserlo |
| | Mentire | 0 | 0 | una bugia ben detta non lascia traccia |
| | Minacciare | 2 | 2 | una minaccia esiste solo se l'altro sa da chi viene |

**5. I tratti.**

| Tratto | Effetti |
|---|---|
| *Robusto* | apre: le cose che chiedono forza · chiude: passare da aperture strette |
| *Minuto* | apre: passare da aperture strette · sposta: trattenere qualcuno o liberarsi da una presa, un gradino in più |
| *Vista acuta* | apre: leggere da lontano, se sai leggere · sposta: notare qualcosa da lontano, un gradino in meno |
| *Sa leggere* | apre: leggere registri, lettere, bolle di carico |
| *Sa nuotare* | apre: entrare in acqua e nuotare |
| *Soffre il mare* | chiude: arrampicarsi sulle sartie col mare mosso · sposta: le prove di corpo a bordo, con la nave in movimento, un gradino in più |
| *Soffre le vertigini* | sposta: le prove in altezza, un gradino in più |
| *Conosciuto al porto* (si guadagna) | aggrava: «qui ti riconoscono» nelle zone del porto · apre: chiedere un favore a chi ti conosce |
| *Una cicatrice alla mano* (si guadagna) | sposta: forzare e lavorare di precisione, un gradino in più |

Il personaggio della Santa Rita ha *Vista acuta*, *Sa leggere*, *Minuto*, *Soffre il mare*.

**6. Le proprietà.**

| Proprietà | Corpo | Mano | Mente | Voce | Riuscita e requisiti |
|---|---|---|---|---|---|
| **buio** | −1 | | | | chi porta una luce accesa non è coperto · cercare, riconoscere, lavorare di precisione: un gradino in più senza luce · leggere: serve una luce |
| **silenzio** | | +1 | | +1 | cogliere un discorso: un gradino in meno |
| **folla** | | −1 | | −1 | seguire qualcuno: un gradino in più |
| **sorveglianza** | +1 | +1 | | | — |
| **posto di lavoro** | | | +1 | | fra chi lavora, uno sconosciuto che si guarda intorno si nota |
| **acqua** | | | | | nuotare: serve *Sa nuotare*, o un compagno che sappia nuotare · di notte, un gradino in più |
| **altezza** | | | | | chi soffre le vertigini: un gradino in più · la posta di una caduta è una ferita |

**7. I luoghi.** Ogni luogo è una zona.

| Luogo | Proprietà | Righe proprie | Corpo | Mano | Mente | Voce |
|---|---|---|---|---|---|---|
| La banchina | acqua | mano −1, voce +1 | 0 | −1 | 0 | +1 |
| La taverna del Gallo | folla | corpo +1 · niente silenzio di notte | +1 | −1 | 0 | −1 |
| L'archivio | sorveglianza | mente −1 | +1 | +1 | −1 | 0 |
| I magazzini | buio, posto di lavoro | niente folla all'alba | −1 | 0 | +1 | 0 |
| La chiesa dei marinai | — | mano +1, mente −1, voce −1 | 0 | +1 | −1 | −1 |
| La Santa Rita | buio, posto di lavoro, acqua, altezza | voce +1 | −1 | 0 | +1 | +1 |

Le righe proprie, come compaiono nel quadro:

- la banchina: *tra i carichi le mani spariscono* (mano −1), *sulla banchina le voci arrivano lontano* (voce +1);
- il Gallo: *al Gallo chi alza le mani si fa notare* (corpo +1); di notte, al Gallo, il silenzio non c'è;
- l'archivio: *nell'archivio leggere è ciò che fanno tutti* (mente −1);
- i magazzini: all'alba restano vuoti, e la folla del mercato non arriva;
- la chiesa: *in chiesa le mani vicino alle offerte si vedono* (mano +1), *in chiesa chi sta in silenzio non disturba* (mente −1), *in chiesa si parla solo sussurrando* (voce −1);
- la Santa Rita: *a bordo ogni voce rimbomba nel legno* (voce +1). Il buio vale sottocoperta; sul ponte, di giorno, no.

Stati: dopo che il registro è sparito, l'archivio ha la sorveglianza anche di notte, e una guardia alla porta. Dopo che la Santa Rita ha preso il largo, la banchina perde la scelta di andare alla nave.

**8. I momenti.** Sei ore ciascuno.

| Momento | Proprietà | Righe proprie | Corpo | Mano | Mente | Voce |
|---|---|---|---|---|---|---|
| L'alba, col mercato del pesce | folla | — | 0 | −1 | 0 | −1 |
| Il giorno | — | — | 0 | 0 | 0 | 0 |
| La sera, con le taverne piene | — | mente +1, voce −1 | 0 | 0 | +1 | −1 |
| La notte | buio, silenzio | — | −1 | +1 | 0 | +1 |

Le righe proprie della sera: *di sera, fra gente che beve, chi resta sobrio a guardare si nota* (mente +1), *di sera tutti parlano e nessuno ascolta* (voce −1).

**9. Le aggravanti.**

| Aggravante | Quando vale |
|---|---|
| Qui ti hanno già visto | Traccia della zona a 2 o più |
| La stanchezza o i nervi ti pesano | un logorio al secondo stadio o oltre, per gli ambiti che tocca |
| Sono in tanti a guardare | più di un avversario, o una guardia presente |
| Porti addosso qualcosa che non dovresti | una cosa compromettente in vista |
| Qui ti riconoscono | il tratto *Conosciuto al porto* |

**10. Le preparazioni.**

| Preparazione | Costo | Durata |
|---|---|---|
| Hai osservato il posto | un'ora sul luogo | finché resti nel luogo |
| Hai un travestimento adatto | procurarlo; si perde con un rovescio | finché lo porti |
| Qualcuno ti copre | un favore da restituire | una prova |
| Hai creato un diversivo | una cosa o una moneta | una prova |

**11. Le cose.**

| Cosa | Uso | Note |
|---|---|---|
| grimaldello | attrezzo: Forzare +1 | |
| leva di ferro | attrezzo: Forzare +1 · dà la forza che serve alle cose pesanti | ingombrante |
| borsa da facchino | attrezzo: Sottrarre +1, per le cose grandi | |
| corda | attrezzo: Muoversi in altezza +1 | |
| lanterna | fa luce | fragile · con l'olio diventa una lanterna accesa |
| olio | scorta | ogni volta che accendi la lanterna ne consumi uno |
| casacca da facchino | preparazione: travestimento | |
| giacca imbottita | protezione: tagli e botte | |
| bolla di carico di Grimani | prova | compromettente |
| monete | scorta | |

**12. Il catalogo delle difficoltà** (estratto).

| Cosa | Soglia | Spostamenti e requisiti |
|---|---|---|
| la porta chiusa a chiave di una casa | Facile (6) | attrezzi: grimaldello |
| un lucchetto vecchio o da armadio | Facile (6) | un gradino in più al buio, senza luce |
| convincere un facchino o un oste | Facile (6) | un gradino in meno se si fida di te |
| una serratura di magazzino | Impegnativa (8) | attrezzi: grimaldello |
| prendere qualcosa sotto gli occhi di chi lo sorveglia | Impegnativa (8) | attrezzi: borsa da facchino |
| un archivista sospettoso | Impegnativa (8) | un gradino in meno se si fida di te; uno in più se ti porta rancore |
| la serratura nuova del magazzino sette | Ardua (10) | un gradino in meno se sai che è di Genova |
| sfondare una porta sprangata | Ardua (10) | serve forza: *Robusto*, una leva, o qualcuno che spinga con te |
| convincere un ufficiale della guardia | Ardua (10) | un gradino in meno se hai un testimone della capitaneria |
| difendersi da un marinaio col coltello | Impegnativa (8) | — |
| difendersi da un soldato | Ardua (10) | — |
| la serratura della dogana reale | Estrema (12) | — |

**13. Il tempo.** L'unità è l'ora. Il giorno ha ventiquattro ore, in quattro momenti. Fare le cose con calma costa tre ore.

**14. Il logorio.**

| Logorio | Stadi | Sale | Ambiti | Rimedio | Crollo |
|---|---|---|---|---|---|
| Fatica | leggera · pesante · allo stremo | ogni 12 ore senza dormire, e a ogni rovescio fisico | corpo, mano | dormire al sicuro: sei ore | ti addormenti in piedi: due ore perse |
| Nervi | saldi · tesi · a pezzi | a ogni ferita, e quando vedi la violenza da vicino | mente, voce | fermarsi un'ora in un posto sicuro | ti tremano le mani: un'ora persa |

**15. Gli stati d'animo.** Spaventato, furioso, umiliato, sicuro di sé, come nel §35.

**16. Le ferite e le armi.** Come nel §36 e nel §38. Si può morire. Le cure si trovano dal medico degli annegati, vicino alla chiesa. Un coltello che colpisce la mano lascia, guarito, *Una cicatrice alla mano*.

**17. La Traccia.** Cala di una tacca ogni tre ore senza nuova Traccia nella zona.

**18. Le persone.**

*Bressan, l'archivista.* Fiducia 0, paura 0, rancore 0. Reazioni: se sa che hai preso il registro, fiducia −2 e rancore +1; se gli garantisci che il suo nome non verrà fuori, fiducia +1. Da avversario: chi si chiude, al coperto. Punti deboli: la riga scritta con un altro inchiostro (*Osservare*, 1); la paura di perdere il posto (*Persuadere*, 1); il debito di suo figlio con l'usuraio, se lo sai (*Minacciare*, 2). Pericolo: chiama la guardia. Movente: tenersi il posto; smette se gli garantisci che non verrà coinvolto; mantiene la parola.

*Zeno, l'oste del Gallo.* Fiducia 2; ti deve un favore. Reazioni: se lo minacci, fiducia 0 e rancore 2.

*Lucia, alla chiesa dei marinai.* Affetto 1 (per Matteo, e quindi per te), fiducia 0. Reazioni: se le mostri il biglietto di Matteo, fiducia +2. Se si fida di te, può diventare una compagna: *Muoversi* Pratica, *Mentire* Esperta, *Sapere* Pratica; tratto *Sa nuotare*.

*Teodoro detto il Pesce.* Avversario: chi avanza, al coperto, gli basta uno scambio per esserti addosso. Punti deboli: quello che gli rovesci addosso (*Muoversi*, 1); il nome del suo capitano, che non vuole morti a bordo (*Sapere*, 2); colpirlo per primo (*Battersi*, 1). Pericolo: coltello. Movente: la taglia che Grimani ha messo su chi cerca Matteo; smette se gli offri di più o se il rumore attira la guardia; non mantiene la parola.

*Il capitano Nicolò Serra.* Fiducia 0. Movente: portare il carico a destinazione, senza morti a bordo. Una scelta per parlargli è chiusa dalla convinzione *Non fidarti di chi lavora per Grimani*.

**19. Le protezioni.** La giacca imbottita, che declassa una ferita da taglio o da botta.

**20. Il repertorio** (estratto, la banchina).

| Voce | Quando | Che cosa colpisce | Quando colpisce |
|---|---|---|---|
| Un doganiere chiede i documenti | di giorno | costo: un'ora | subito |
| Un carico si sgancia dalla gru | sempre | Traccia: +1 sulla banchina | subito |
| Un ragazzo ti riconosce e corre al Gallo | Traccia 1 o più | Traccia: +1 al Gallo | dopo due ore |
| Prezzo: un facchino ti ha visto, e vuole una moneta per stare zitto | come prezzo | costo: una moneta | subito |

**21. La crescita.** Arco lungo. Insegnano: un vecchio scassinatore alla taverna (*Forzare*), il medico degli annegati (*Curare*), il libro dei portolani in archivio (*Sapere*). Danno punti: la chiusura di ogni filo. Si guadagnano: *Conosciuto al porto*, *Una cicatrice alla mano*; si perde: *Soffre il mare*, dopo una notte in mare.

**22. La memoria della storia.** Filo *Dov'è Matteo* (4 tappe). Scadenza *La Santa Rita salpa* (8 caselle, una ogni tre ore, dall'alba del primo giorno). Fatti: HAI IL REGISTRO, SAI DEL FIGLIO, TAGLIA, LIBERO. Misura: Sospetti della guardia (0–3).

| Notizia | Verità | Smentita da |
|---|---|---|
| Matteo è stato imbarcato sulla *Santa Rita* | vera | — |
| Matteo è tenuto legato nella stiva | vera | — |
| Matteo è scappato con una donna | falsa | «Matteo è stato imbarcato», «Matteo è tenuto legato nella stiva» |
| Il capitano della *Santa Rita* si chiama Nicolò Serra | vera | — |
| Il capitano Serra non vuole morti a bordo | vera | — |
| La *Santa Rita* porta un carico di Grimani | vera | — |
| Le casse di Grimani pesano troppo per essere tessuti | vera | — |

Deduzione: *il carico è di Grimani* più *le casse pesano troppo* danno *nelle casse di Grimani ci sono moschetti*.

| Convinzione | Messa in dubbio da |
|---|---|
| Matteo non scapperebbe mai di casa | — (è vera: nessuna notizia vera la smentisce) |
| Non fidarti di chi lavora per Grimani | «Il capitano Serra non vuole morti a bordo» |

**Verifica.** Undici capacità, sette con partenza 0 e due con partenza 2; nessun Fondo sopra la partenza. Ogni luogo ha un −1 in almeno un momento: la banchina e il Gallo sempre alla mano, l'archivio e la chiesa alla mente, i magazzini e la nave al corpo. Tutti i valori sono −1, 0 o +1. Ogni logorio ha il suo rimedio. Ogni tratto del corpo che chiude una via ha un'alternativa. La notizia falsa ha chi la smentisce; la convinzione che può cadere ha chi la mette in dubbio.

**Che cosa cambia rispetto al 2.0.** Con le proprietà, un effetto vale una volta sola: all'alba il Gallo non ha due volte la folla (nel 2.0 mano e voce scendevano a −2), di notte i magazzini non hanno due volte il buio (nel 2.0 il corpo scendeva a −2), e di notte il Gallo non ha il silenzio (nel 2.0 mano e voce tornavano a 0). Il passo di un'ora e mezza diventa l'ora: le scadenze e il logorio sono stati ricalcolati per durare lo stesso tempo di prima.

---

# APPENDICE C — Glossario

Nella terza colonna: *nuovo* se il termine nasce nel 3.0, *cambiato* se cambia nome o significato rispetto al 2.0.

| Termine | Che cosa vuol dire | |
|---|---|---|
| **aggravante** | un fatto del mondo che alza l'esposizione di un grado | |
| **aiuto** | una persona che fa la cosa con te: +1 al tiro | nuovo |
| **ambito** | il genere di un'azione: corpo, mano, mente, voce, o quelli scelti dall'ambientazione | |
| **attrezzo** | una cosa che aiuta un genere di azione: +1 al tiro | nuovo |
| **avversario** | una persona che ti si oppone adesso; si descrive con cinque righe | |
| **capacità** | un genere di azione che il personaggio sa fare, con un livello da Inesperto a Maestro | |
| **catalogo delle difficoltà** | l'elenco delle cose del mondo, con la loro soglia, ciò che la sposta e ciò che serve | cambiato (era il catalogo delle soglie) |
| **compagno** | una persona che viaggia con il personaggio, con capacità, tratti e condizioni proprie | nuovo |
| **condizioni** | come sta il personaggio: logorio, ferite, stati d'animo | cambiato |
| **confronto** | uno dei modi di stare con una persona: quello in cui ti si oppone adesso | |
| **convinzione** | una frase che il personaggio crede su di sé o sugli altri; apre e chiude scelte | nuovo |
| **copertura** | il grado di esposizione di un avversario | |
| **cose** | ciò che il personaggio porta con sé; hanno usi, proprietà e tre stati | nuovo (erano gli oggetti) |
| **debito** | la dimensione di un legame che dice chi deve un favore a chi | nuovo |
| **deduzione** | una notizia che si ricava mettendone insieme altre | nuovo |
| **dimensione** | una delle cinque misure di un legame: fiducia, debito, paura, affetto, rancore | nuovo |
| **dono** | ciò che ottieni in più con *In pieno* | nuovo |
| **esposizione** | quanto ti costa un'azione, comunque vada il dado; ha tre gradi | |
| **fascia** | una delle quattro risposte del dado: *In pieno*, *Riesci*, *Quasi*, *Non riesci* | nuovo |
| **fatto** | una memoria della storia che vale sì o no | |
| **ferita** | un danno con un nome e un posto, che impedisce qualcosa; lieve, grave o mortale | |
| **filo** | una delle storie in corso, con le sue tappe | |
| **finestra** | l'istante in cui un avversario è allo scoperto e decidi tu come finisce | |
| **Fondo** | il grado sotto il quale un'azione non scende mai | |
| **gradino** | la distanza fra due soglie vicine: due punti sul tiro | nuovo |
| **grado** | uno dei tre livelli dell'esposizione: al coperto, esposto, allo scoperto | |
| **imprevisto** | un evento che arriva tanto più spesso quanta più Traccia hai nella zona | |
| **In pieno** | la fascia di chi supera la soglia di 4 o più: ottieni, e un dono | nuovo |
| **legame** | il rapporto del personaggio con una persona, fatto di dimensioni e ricordi | nuovo |
| **livello** | quanto sai fare una capacità: Inesperto, Pratico, Esperto, Maestro | |
| **logorio** | ciò che sale da solo e ha un rimedio; ha tre stadi | |
| **luogo** | dove si svolge una scena; ha una zona, proprietà e righe proprie | cambiato |
| **margine** | il tiro meno la soglia; dice la fascia | nuovo |
| **memoria della storia** | tutto ciò che il gioco ricorda | cambiato (erano le qualità della storia) |
| **metà** | ciò che ottieni scegliendola nel *Quasi*: di solito quello che dà il ripiego | nuovo |
| **misura** | una memoria della storia che vale un numero piccolo | |
| **momento** | una parte del giorno; porta le sue proprietà | cambiato |
| **narratore** | chi conduce la storia al tavolo; non tira mai i dadi | |
| **Non riesci** | la fascia di chi manca la soglia di 3 o più: non ottieni, e scopri qualcosa | nuovo |
| **notizia** | una cosa che il personaggio sa del mondo, o crede di sapere; vera, incompleta o falsa; sentita dire, verificata o smentita | cambiato (erano le conoscenze) |
| **ora** | l'unità di tempo della storia; un'ambientazione può usarne un'altra | cambiato (era il passo) |
| **partenza** | quanto una capacità espone di suo | |
| **penalità** | −1 al tiro per una ferita lieve, il logorio allo stremo, uno stato d'animo; al massimo −3 | |
| **posta** | che cosa succede nel caso peggiore; si scrive nel quadro | |
| **preparazione** | ciò che fai prima di agire per abbassare l'esposizione di un grado | |
| **prezzo** | ciò che perdi riuscendo allo scoperto | |
| **proprietà** | una caratteristica di un luogo o di un momento (buio, folla, silenzio…) che agisce su tutte e quattro le domande | nuovo |
| **protezione** | una cosa che declassa una conseguenza e si consuma | |
| **prova** | una scelta che si risolve con i dadi | |
| **quadro** | ciò che il gioco mostra prima di una prova: puoi, riesci, costa, dopo | cambiato (era la ricevuta) |
| **Quasi** | la fascia di chi manca la soglia di 1 o 2: scegli fra tutto, la metà e lasciar perdere | nuovo |
| **reazione** | che cosa cambia in una persona quando succede qualcosa | nuovo |
| **repertorio** | le complicazioni, gli imprevisti e i prezzi di ogni zona | |
| **Riesci** | la fascia di chi raggiunge la soglia, o la supera di meno di 4 | nuovo |
| **riga propria** | un valore di costo che vale soltanto per un luogo o un momento | nuovo |
| **ripiego** | la via che c'è sempre: costa, e non si tira | cambiato (era la via povera) |
| **rovescio** | l'esito peggiore: la situazione precipita, e sei in un'altra scena | cambiato: più raro, perché chi manca di poco passa al *Quasi* e sceglie se rischiarlo |
| **scadenza** | una cosa che accadrà comunque, con il conto alla rovescia | |
| **scelta esaurita** | una scelta che non può più darti niente, e sparisce | nuovo |
| **scena** | un'unità della storia; sulla carta, un paragrafo | |
| **scheda dell'ambientazione** | le ventidue voci che adattano il motore a un mondo | cambiato |
| **snodo** | una scelta che non si disfa, scritta a mano dall'autore | |
| **soglia** | il numero che il tiro deve raggiungere: 6, 8, 10 o 12 | |
| **stadio** | uno dei tre livelli di un logorio | |
| **stato d'animo** | ciò che il personaggio prova adesso; agisce come un tratto e passa | nuovo |
| **tacca** | l'unità della Traccia e della crescita | |
| **Traccia** | quanto ti hanno notato in una zona, da 0 a 3 | |
| **tratto** | una parola che dice com'è fatto il personaggio; apre, chiude, sposta, aggrava | nuovo |
| **via** | uno dei modi di affrontare un ostacolo | |
| **zona** | la parte del mondo in cui si conta la Traccia | |

Escono dal glossario: *casella* e i nomi delle sei caselle (successo pieno, successo sporco, successo a caro prezzo, fallimento pulito, rovescio minore), *conoscenza*, *passo*, *qualità*, *ricevuta*, *via povera*.

---

# APPENDICE D — Che cosa cambia rispetto al 2.0

| | Che cosa | Perché |
|---|---|---|
| **Resta** | il costo che si ricava da azione, luogo e momento, per ambito · il quadro prima di agire · il ripiego · al coperto il dado non può rovinarti · nessuna morte senza avviso · la violenza realistica · la Traccia che cala sempre · le scadenze · la memoria che apre e chiude le scene · nessun testo generato durante il gioco · i formati da una fonte sola · il Fondo, il tetto, le righe che non contano · il catalogo e la difficoltà che non cresce · il confronto con le due nature, la finestra e le tre fini · la crescita a tre fonti · due dadi a sei facce e quattro livelli | reggono, e nessuna prova le ha smentite |
| **Cambia nome** | via povera → ripiego · passo → ora · ricevuta → quadro · qualità della storia → memoria della storia · conoscenza → notizia · oggetti → cose · catalogo delle soglie → catalogo delle difficoltà | nell'italiano comune le vecchie parole dicevano un'altra cosa: «povera» non vuol dire «sicura ma costosa», un passo è anche un gesto, una ricevuta arriva dopo aver pagato, le qualità di una storia sono i suoi pregi, le conoscenze sono anche le persone che conosci |
| **Cambia sostanza** | il dado risponde con quattro fasce invece che con sì o no · l'esito si legge due volte, dal dado e dall'esposizione · la notizia del *Non riesci* vale a ogni grado · il personaggio ha sei parti · i tratti, dove il 2.0 aveva soltanto capacità e condizioni · le cose hanno usi, stati e combinazioni · gli attrezzi e gli aiuti danno +1 al tiro · la difficoltà si sposta di un gradino per ragioni dichiarate, al massimo uno per parte · i luoghi si descrivono con proprietà che valgono per tutte e quattro le domande · le notizie hanno uno stato visibile e si mettono insieme · le persone hanno legami a cinque dimensioni, ricordano e tradiscono · gli stati d'animo · i tratti che si guadagnano e si perdono · le scelte in prima persona, e quelle esaurite che spariscono · gli imprevisti si controllano una volta per scelta · quattro formati invece di tre | il 2.0 era sottile proprio dove un romanzo di ruolo deve essere profondo: il personaggio, le persone, il mondo che reagisce. E chi gioca non sentiva differenza fra mancare di poco e mancare di molto |
| **Esce** | le sei caselle come esiti a sé, con i loro nomi · il fallimento pulito come unica occasione di imparare qualcosa · il rovescio per chi manca la soglia di poco, che ora è una scelta | le sei caselle restano, come lettura del costo; ciò che esce sono i nomi che confondevano la riuscita con il costo |

---

# APPENDICE E — Che cosa cambiare nel motore e nei dati

Questo era l'elenco del lavoro per adeguare `strumento/motore/`. È stato fatto il 25 settembre 2026, compresi i compagni (§33) e il giocatore automatico con un obiettivo (§54.2), aggiunti lo stesso giorno. Restano da fare l'editor di ESPOSIZIONE Studio e le proposte del §7.3 e del §11.4. Il `README.md` del motore dice com'è fatto adesso.

**Il formato dei dati** (`src/tipi.ts`)

- *Tratto*: id, nome, effetti (apre, chiude, sposta con la situazione, aggrava), origine se guadagnato.
- *Proprietà*: valori per ambito, spostamenti di soglia per genere di prova, requisiti. *Luogo* con proprietà, righe proprie, proprietà sospese e stati condizionati. *Momento* con proprietà e ore.
- *Cosa*: usi (attrezzo con il genere di azione, chiave, preparazione, protezione, prova, scorta), proprietà (fragile, ingombrante, compromettente, fa luce), stato; *Combinazione*.
- *Voce del catalogo*: soglia, spostamenti (tratto, notizia, proprietà, legame, stato d'animo), attrezzi, requisiti con alternative.
- *Notizia*: stato (sentita dire, verificata, smentita), smentita da, in contrasto con, verificabile. *Deduzione*. *Convinzione*: frase, messa in dubbio da, effetti del lasciarla andare e del tenerla.
- *Persona*: dimensioni usate e valori iniziali, reazioni, ricordi, tradisce se, livello di conoscenza; *Compagno* con capacità, tratti, condizioni.
- *Stato d'animo*: effetti, come passa.
- *Prova*: riesci, notizia del *Non riesci* (obbligatoria), rovescio, e facoltativi dono, metà, prezzo; righe di ritocco con spostamenti di soglia.
- *Scelta*: «sempre disponibile»; gli effetti bastano al motore per capire quando è esaurita.
- *Tempo*: l'unità, le ore dei momenti, i ritmi di scadenze, logorio e Traccia in ore.

**Le regole**

- `src/ricevuta.ts` diventa il quadro, in quattro sezioni: requisiti, riuscita con gli spostamenti di soglia e il limite di un gradino per parte, costo come oggi con l'ambiente ricavato dalle proprietà (al massimo 2), dopo. Le righe che non contano anche nella riuscita.
- `src/motore.ts`: il margine e le quattro fasce; il dono con i suoi predefiniti; il *Quasi* come scelta successiva al tiro, con le tre possibilità e il loro costo; la notizia del *Non riesci* a ogni grado; il rovescio soltanto allo scoperto; la difesa e il confronto con le fasce; aiuti e compagni; le scelte esaurite; «Ci ripenso» e «Metto insieme quello che so»; i tradimenti.
- `src/stato.ts`: tratti, cose con stato, notizie con stato, convinzioni, persone con dimensioni e ricordi, stati d'animo; il tempo in ore; l'imprevisto una volta per scelta che consuma tempo.
- `src/controlli.ts`: i trenta controlli del §47. Sono nuovi quelli sui tratti, sulle cose, sulle notizie, sulle convinzioni, sugli stati d'animo, sulle persone, sulle scelte esaurite e sulla prima persona.
- `src/simulazione.ts`: i cinque giocatori nuovi del §54.2 e le misure dei criteri.
- `src/libro.ts`: il paragrafo con le quattro fasce e il *Quasi* in riga; la scheda con le sei parti, la riga delle fasce, le persone; in fondo al libro tratti, proprietà, stati d'animo.
- `test/`: i conti delle fasce contro la tabella dell'appendice A; il *Quasi*; le scelte esaurite; le notizie smentite; i tradimenti.

**L'app** (`web/`)

- il quadro in quattro sezioni, con la barra delle fasce e le parole;
- due timbri, la fascia e il grado; il pannello del *Quasi*;
- il taccuino con le notizie e il loro stato, le convinzioni, le persone;
- le scelte esaurite che spariscono;
- la scheda finale accanto a quella iniziale;
- la schermata finale coprente: oggi è semitrasparente, e sotto il titolo si legge il diario.

**I dati**

- `dati/porto.ambientazione.json`: ricompilato come nell'appendice B.
- `dati/santa-rita.storia.json`: tutte le scelte in prima persona («Vado a cercarlo» al posto di «Cominciare a cercare»); i ripieghi al posto delle vie povere; le notizie del *Non riesci* per ogni prova; le persone con i legami; i tratti del personaggio e la borsa da facchino; le convinzioni e le deduzioni; il tempo in ore; la scadenza ricalcolata.

**La documentazione**

- `strumento/motore/README.md`, `ROADMAP.md` e il glossario dell'editor si aggiornano con le parole nuove.
