# ESPOSIZIONE in una pagina

*Per chi conosce i giochi di ruolo e vuole darci un parere. 25 settembre 2026.*

ESPOSIZIONE è un motore per scrivere e giocare **romanzi di ruolo**: storie lunghe e ramificate, in cui un personaggio esplora, indaga, tratta e sceglie, e il mondo, gli oggetti e le persone reagiscono. Il ritmo è quello della lettura e della scelta, non del combattimento. Il riferimento di gusto è *Disco Elysium*; i debiti dichiarati sono verso *Powered by the Apocalypse*, *Blades in the Dark*, *Genesys*, *Burning Wheel*, *Fallen London* e *Fabled Lands*. Il documento completo è [`ESPOSIZIONE-DESIGN-3.md`](ESPOSIZIONE-DESIGN-3.md).

## Che cosa fa oggi

### Una prova, quattro domande

- Prima di ogni azione che conta il gioco mostra il **quadro**, che risponde a quattro domande: **puoi farlo?** (tratti, cose, notizie, posizione), **ci riesci?** (dadi, capacità, attrezzi, aiuti), **quanto ti costa?** (l'esposizione), **che cosa cambia dopo?**
- **Il tiro:** due dadi a sei facce, più il livello della capacità (+0 Inesperto … +3 Maestro), più attrezzi e aiuti (al massimo +2), meno le penalità (al massimo −3), contro una soglia di 6, 8, 10 o 12.
- **La soglia** viene da un catalogo delle difficoltà, uguale in tutta la storia, e si sposta di un gradino (due punti) per ragioni dichiarate: una notizia, un tratto, il buio, un legame, uno stato d'animo. Al massimo un gradino in giù e uno in su.
- **Quattro fasce, secondo il margine:** *In pieno* (+4 o più: ottieni e in più un dono), *Riesci*, *Quasi* (manca 1 o 2), *Non riesci* (manca 3 o più: non ottieni, ma scopri sempre qualcosa sull'ostacolo).
- **Il Quasi è una scelta di chi gioca:** prendere tutto, esponendosi di un grado in più; accontentarsi della metà; oppure lasciar perdere.
- **Il costo è separato dalla riuscita.** L'esposizione ha tre gradi (al coperto, esposto, allo scoperto) e si ricava da una somma: la capacità, le proprietà del luogo e del momento per quell'ambito, le aggravanti, meno le preparazioni. I dadi non la toccano mai. Al coperto il peggio è non riuscire; esposto lasci Traccia; allo scoperto paghi un prezzo, o arriva il **rovescio**.
- **Il ripiego:** davanti a ogni ostacolo c'è almeno una via che non si tira. Costa (tempo, denaro, un favore, una parte dell'obiettivo), ma c'è sempre.
- **Nessuna morte senza avviso:** una prova può uccidere solo se il quadro l'ha scritto prima.

### Il personaggio, in sei parti

- **Capacità** con quattro livelli, l'unica parte con numeri.
- **Tratti** detti a parole (*Minuto*, *Vista acuta*, *Soffre il mare*): aprono o chiudono vie e spostano la difficoltà in casi dichiarati. Si guadagnano e si perdono con la storia (una cicatrice, «conosciuto al porto»).
- **Cose**, con usi (attrezzo, chiave, preparazione, protezione, prova), stati (intatta, rovinata, rotta) e combinazioni (lanterna più olio).
- **Notizie e convinzioni.** Le notizie possono essere vere o false; il taccuino le segna come sentite dire, verificate o smentite; si possono mettere insieme per dedurne altre. Le convinzioni sono la vita interiore: frasi che il personaggio crede, che chiudono scelte («è contro ciò che credi») e che si possono lasciar andare ripensandoci, quando una notizia le mette in dubbio.
- **Legami** con le persone, su cinque dimensioni: fiducia, debito, paura, affetto, rancore.
- **Condizioni:** ferite che tolgono una strada (non punti ferita), logorio che sale col tempo e ha un rimedio, stati d'animo che passano.

### Il mondo e le persone

- I luoghi si descrivono con **proprietà** (buio, silenzio, folla, sorveglianza, acqua, altezza) che rispondono a tutte e quattro le domande: il buio ti nasconde, ma senza luce non leggi e le mani lavorano peggio.
- Lo stesso luogo è buono per un'azione e cattivo per un'altra, e cambia col momento del giorno: di notte entrare è facile e rubare è pericoloso, all'alba il contrario.
- I luoghi hanno **stati**: dopo il furto c'è una guardia alla porta, quando la nave è in allarme si accendono le lanterne.
- Le **persone** ricordano ciò che hai fatto, reagiscono, ti aiutano (+1, al prezzo di un favore), possono tradire se le loro dimensioni lo dicono (mai con un tiro nascosto). Si conoscono a tre livelli, e più le conosci più il gioco ti dice di loro.
- **I compagni** viaggiano con te: in ogni prova in cui conoscono la capacità puoi farti aiutare o lasciarla fare a loro, con il loro livello e i loro tratti. Se va male ci vanno di mezzo loro; con rancore 3 se ne vanno.
- **Il confronto** (un interrogatorio, una trattativa, uno scontro) non ha punti vita: l'avversario ha una copertura che scopri colpendo i suoi punti deboli, e quando è allo scoperto si apre la finestra, in cui decidi tu come finisce, senza tirare.
- **Il tempo** si conta in ore; le **scadenze** avanzano comunque; la **Traccia** (quanto ti hanno notato in una zona) sale con le azioni esposte, cala se sparisci, e fa arrivare imprevisti.

### Scrivere, giocare, verificare

- **Quattro formati dalla stessa fonte:** il librogame da stampare, il tavolo con un narratore, l'app testuale nel browser, e un'interfaccia pensata per giochi grafici.
- **Un motore in TypeScript** senza dipendenze, con due funzioni (`vista` e `agisci`); nessun testo generato durante il gioco.
- **Trenta controlli automatici** sui dati: ogni ostacolo ha un ripiego, nessuna prova uccide senza avviso, nessuna notizia falsa sposta una difficoltà, e così via.
- **Giocatori automatici** con dieci strategie, fra cui uno che gioca per vincere e che ha già trovato, e fatto correggere, una strada che vinceva sempre.
- **Una storia di prova:** *Il registro della Santa Rita*, 59 scene in un porto del Seicento, giocabile nel librogame PDF, nel terminale e nell'app.

## Che cosa farà

- **Le cose nei luoghi** (proposta da approvare): da vedere, riconoscere e prendere se hai la forza; si portano in un numero di posti limitato, che borse e zaini allargano; ciò che lasci resta dove l'hai lasciato.
- **Lo stato del mondo** (proposta da approvare): porte forzate, lanterne accese, un porto in allarme, stati che durano e si propagano, l'ambiente che logora (freddo, acqua gelida), il meteo.
- **Meno lavoro per chi scrive:** una mappa dei luoghi con gli spostamenti calcolati, le routine delle persone (chi sta dove, e quando), dialoghi per argomenti generati dalle notizie che hai.
- **Lo strumento per autori**, ESPOSIZIONE Studio: mappa delle scene, quadro in anteprima, «gioca da qui», «simula mille partite».
- **La prova dei generi:** sei storie brevi (giallo, horror, fantasy, dramma sociale, fantascienza, racconto per ragazzi) per scoprire che cosa manca; tre sono già abbozzate nel documento.
- **Altri formati:** EPUB, kit per il tavolo, esportazione per Godot e Ren'Py.
- **Le ramificazioni** si lavoreranno sui test narrativi veri.

## Dove ci serve un parere

- **Il Quasi:** nelle simulazioni scegliere con giudizio vince quanto prendere sempre tutto. Come lo renderesti una scelta vera?
- **Il quadro:** quattro sezioni prima di ogni prova sono tante. Si leggono al tavolo? Che cosa taglieresti?
- **Il costo separato dalla riuscita:** regge, o la separazione si sente artificiale in gioco?
- **La scadenza:** chi gioca bene finisce con molto margine. Meglio stringere il tempo o rendere più costosi i ripieghi?
- **Il confronto senza punti vita:** funziona per uno scontro armato, o solo per un interrogatorio?
- **Che cosa manca** per il genere che conosci meglio.

## Che cosa è provato

Il motore esiste, ha i suoi test e le sue simulazioni. Una persona ha giocato per intero la versione precedente. Le prime prove con altre persone stanno per cominciare.
