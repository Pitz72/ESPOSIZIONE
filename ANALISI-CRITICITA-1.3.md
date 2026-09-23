# Criticità della specifica 1.3 e del concept

*Analisi del 23 settembre 2026. Letti per intero: `ESPOSIZIONE-1.3.md`, `concept/ESPOSIZIONE-CONCEPT.md`, `ROADMAP.md` e la bozza non versionata `Esposizione_traduzione.md`. Confrontati sui punti in discussione: `concept/EXPOSURE-CONCEPT-EN.md`, `CONTROANALISI-1.2.md`, `ISTRUZIONI-riconciliazione.md`, `strumento/docs/author-experience.md`.*

Questo documento sta a verbale, come chiede la regola 4 della `ROADMAP.md`: la specifica non si tocca prima della Fase 4. Per ogni rilievo sono indicati il punto del testo, i conti con cui chiunque può verificarlo e una proposta. Nessuna proposta è stata applicata.

Il documento gemello, `LINGUA-DEL-MANUALE.md`, riguarda il modo di scrivere il manuale di concetto.

## I quattro gradi

- **Gravissima.** Rende falso ciò che un lettore vede per primo, oppure toglie la base a una promessa centrale.
- **Grave.** Due parti della specifica si contraddicono, o la specifica dichiara una cosa che il suo testo non mantiene. Va chiusa prima di finire nel manuale.
- **Media.** Confonde chi legge o chi implementa, ma il motore regge.
- **Lieve.** Conteggi, rimandi, tipografia.

## In sintesi

| # | Grado | Rilievo | Dove |
|---|---|---|---|
| 1 | gravissima | La ricevuta d'esempio segna come inerte la riga sbagliata | §12.3, concept §5 |
| 2 | gravissima | L'esempio delle inversioni non esce dalle tabelle pubblicate accanto | §32, concept §4 |
| 3 | gravissima | Nessuno ha giocato il motore, e la roadmap che doveva provarlo è scaduta senza dichiararlo | §30.3, §30.4, `ROADMAP.md` |
| 4 | grave | Le sedici voci non bastano a far girare il motore | §26.2 |
| 5 | grave | La difficoltà resta scritta a mano, via per via | §7, §14, §2.5 |
| 6 | grave | La definizione di «cambiato» poggia su un rimando sbagliato | §14, §19.3 |
| 7 | grave | La tabella principale del confronto descrive un avversario che V7 dichiara impossibile | §23.3, §23.6, §32 |
| 8 | grave | Le tre istanziazioni sono parziali, e i verdetti dicono di più | Parte VI |
| 9 | media | «Mai quanto è probabile»: lo slogan dice più della regola | §4, §27, I5 |
| 10 | media | Il 5% del d20 presentato come difesa dai muri | §17 |
| 11 | media | Gli intervalli dei valori non sono normativi | §12.1, N9.b |
| 12 | media | Numeri d'esempio non ricavati dalle tabelle | §18, §22.1, §23.9 |
| 13 | media | Turno sì o turno no | §3, §23.2 |
| 14 | media | «Il confronto non è un sistema separato» | §5, §23 |
| 15 | media | Il Fondo spiegato in due modi | §9, concept §4 |
| 16 | media | Parole con più significati | tutto il testo |
| 17 | media | Coperto ed Esposto non si accordano col genere | §6, §30.2 |
| 18 | lieve | Conteggi dei moduli | Nota di lettura, Parte III, README |
| 19 | lieve | Titoli e collocazioni | §22, §27.1 |
| 20 | lieve | La griglia del concept senza nomi | concept §3 |
| 21 | lieve | Tipografia e grassetto | concept, specifica |

---

## Gravissime

### 1. La ricevuta d'esempio segna come inerte la riga sbagliata

**Dove.** §12.3 (N9.c), righe 364–371. Lo stesso esempio compare nel concept italiano (§5), in quello inglese e nella bozza di traduzione. È l'unica ricevuta mostrata in tutti i documenti.

**I conti.** La formula del §10 somma tutte le righe e taglia il risultato solo alla fine:

```
grezza      = base + luogo + momento + aggravanti − attenuanti
Esposizione = la grezza, tenuta fra il Fondo del verbo e Allo scoperto (2)
```

Nella ricevuta la prima riga vale già Esposto (1). Seguono +1, +1 e −1. La somma fa 2, cioè Allo scoperto, e il titolo è giusto. Per sapere quale riga non conta basta toglierle una alla volta:

| Tolgo | Somma | Grado | La riga contava? |
|---|---|---|---|
| +1 «sei ridotto male» | 1 | Esposto | sì |
| +1 «questo posto ti conosce» | 1 | Esposto | sì, ma la ricevuta dice di no |
| −1 «hai perlustrato prima» | 3, tagliata a 2 | Allo scoperto | no |

La riga che non conta è la perlustrazione, cioè la preparazione del giocatore. Lo conferma la definizione del §12.3 (D20): un'attenuante funziona solo se la grezza, prima e dopo il decremento, sta dentro la scala, e qui prima valeva 3. È anche esattamente il caso del pedaggio: una seconda perlustrazione porterebbe la somma a 1 e il grado scenderebbe.

C'è una sola lettura in cui «questo posto ti conosce» non conta: applicare il tetto riga per riga, nell'ordine di stampa. Con quella lettura però la somma finale scende a 1 e il titolo dovrebbe dire Esposto. Nessuna lettura rende l'esempio coerente.

**Perché pesa.** Secondo la specifica, N9.c è «la sola delle tre che tocca il difetto vero», e il recinto del §13 promette che «la ricevuta dice sempre la verità intera, N9.c compreso». L'esempio fa il contrario. Dice al giocatore che la sua preparazione ha funzionato e gli nasconde che non è servita. Chi implementa copiando l'esempio costruirà la regola sbagliata.

C'è poi un vuoto a monte: la specifica non dice come si stabilisce che una riga «non muove il totale». Il metodo più semplice (togliere una riga e guardare se il grado cambia) funziona sull'esempio, ma quando due o tre aggravanti superano il tetto le segna inerti tutte, anche se toglierle insieme cambierebbe il grado.

**Proposta.**
1. Scrivere una definizione di «riga inerte» che soddisfi due requisiti: segnala sempre la preparazione che non abbassa il grado, e resta univoca quando più righe superano il tetto.
2. Correggere l'esempio perché mostri il pedaggio, che è la ragione per cui N9.c esiste:

```
ALLO SCOPERTO
   Esposto      (base: forzare, di giorno, in uno spazio aperto)
   +1           sei ridotto male
   +1           questo posto ti conosce
   −1           hai perlustrato prima      — non basta: ne servirebbe un'altra
   Fondo: Esposto
```

### 2. L'esempio delle inversioni non esce dalle tabelle

**Dove.** §32, righe 1228–1245 (tabelle dei luoghi e dei momenti, e commento). Lo stesso esempio compare al §10.2 in forma generica e nel concept (§4), che lo presenta come «un esempio compilato». Poi nel concept inglese e nella bozza.

**Il testo dice** che insinuare in cappella all'alba risulta Coperto, che la stessa insinuazione in sala delle udienze durante un ricevimento risulta Esposto, e che sottrarre una lettera è più facile durante il ricevimento che all'alba, «perché la folla copre le mani e il silenzio le scopre».

**Le tabelle dicono altro.**

- Insinuare ha base Coperto ma **Fondo Esposto**. Per definizione non può mai risultare Coperto, in nessun luogo e in nessun momento.
- Cappella più alba, colonna Voce: −1 + 1 = 0. Sala delle udienze più ricevimento, colonna Voce: +1 − 1 = 0. Le due situazioni danno la stessa somma, e l'inversione non c'è.
- Colonna Mano: il ricevimento vale −1 e l'alba vale −1. Sottrarre costa uguale nei due momenti.
- Le tabelle danno Voce −1 al ricevimento (la folla copre la voce) e Mano −1 all'alba (il silenzio copre le mani). La prosa dice il contrario in tutti e due i casi.

**Perché pesa.** Secondo il §39, questa è l'invenzione che giustifica l'esistenza del motore, e questo è il suo unico esempio con dei numeri. Un lettore che rifà i conti conclude che il motore non fa quello che promette. La bozza di traduzione ha aggiunto un secondo errore sopra il primo: attribuisce alla festa Mano −1 e Voce +1, e alla cappella all'alba Mano +1 e Voce −1, valori che non stanno in nessuna tabella.

**Un dettaglio che conta.** Nel lessico di corte nessun verbo di Voce ha Fondo Coperto: Persuadere, Insinuare, Impegnarsi e Rifiutare hanno tutti Fondo Esposto. In quella finzione un'azione di Voce non è mai pulita, quindi un'inversione sulla Voce può andare solo da Esposto ad Allo scoperto.

**Proposta.** Decidere quale delle due versioni è quella voluta e allineare l'altra. Se vale la prosa, i momenti diventano: ricevimento con Voce +1 (resta Mano −1); alba con Mano +1 e Voce −1. I conti allora danno:

| Azione | Sala delle udienze, ricevimento | Cappella, alba |
|---|---|---|
| Insinuare (base 0, Fondo 1) | 0 + 1 + 1 = 2, Allo scoperto | 0 − 1 − 1 = −2, riportato al Fondo: Esposto |
| Sottrarre (base 0, Fondo 0) | 0 + 1 − 1 = 0, Coperto | 0 + 0 + 1 = 1, Esposto |

Il testo dell'esempio va corretto di conseguenza: in cappella all'alba Insinuare risulta Esposto, non Coperto.

### 3. Nessuno ha giocato il motore, e la roadmap è scaduta in silenzio

**Dove.** §30.3 («le tre istanziazioni della Parte VI sono state riempite e non giocate»), §30.4 (il debito aperto), `ROADMAP.md`, la storia del repository.

**I fatti.**

- Tutte le misure della specifica vengono da una sola applicazione del motore, giocata da giocatori automatici. Nessuna persona ha giocato una partita con le regole della 1.3.
- Le promesse che la specifica chiama centrali sono esperienze: le sei caselle si sentono diverse, la crescita si vede come tentativi risparmiati, la ricevuta insegna il sistema. La specifica stessa scrive che nessun automa può misurarle.
- La `ROADMAP.md` collocava le Fasi 1–4 fra il 19 agosto e il 22 settembre 2026. L'ultimo commit risale al 19 agosto. Non esistono lo schema della firma, il validatore, il banco di prova, la seconda finzione né i verbali. La roadmap prevede che una fase in ritardo «sfora dichiarandolo», e il ritardo non è dichiarato.
- Il solo software del repository, ESPOSIZIONE Studio, gira ancora col sistema di prove precedente, con attributi ed esiti graduati (`strumento/docs/author-experience.md`, §3). La specifica rifiuta entrambe le cose.

**Perché pesa per il manuale.** Chi legge un manuale di concetto pensa di leggere la descrizione di una cosa che funziona. Oggi non esiste una partita da mostrare né un prototipo da provare, e i numeri disponibili valgono per una finzione sola. La bozza di traduzione ci è già scivolata: parla di «milioni di scenari simulati» e scrive che il confronto trasportato su tre generi «dimostra che il livello di astrazione del motore è solido e funzionante». Nelle fonti non c'è nessuna delle due affermazioni.

**Proposta.**
1. Aggiungere alla `ROADMAP.md` un addendum datato che dichiari il ritardo e fissi le nuove date.
2. Aprire il manuale con un riquadro «Che cosa è provato e che cosa no».
3. Tenere fuori dal manuale le schermate dell'editor finché non esegue la griglia a sei caselle.

---

## Gravi

### 4. Le sedici voci non bastano

**Dove.** §26.2: «Nient'altro. Se una finzione ha bisogno di una diciassettesima voce, delle due l'una». Il README e il concept (§8) ripetono lo stesso vincolo.

**Che cosa manca.** La specifica chiede dati che nessuna delle sedici voci contiene.

| Dato richiesto | Chi lo chiede | Voce che lo contiene |
|---|---|---|
| l'elenco delle attenuanti, cioè delle preparazioni | §10.3, §23.10 | nessuna: la voce 5 elenca solo le aggravanti |
| la frequenza dell'imprevisto da Coperto, `f(0)` | Appendice A, I6 | nessuna |
| il guadagno `g` | Appendice A, I6 | nessuna: la voce 14 dichiara due numeri, la disuguaglianza ne usa quattro |
| la difficoltà di ogni via | §14 | nessuna (rilievo 5) |
| la forma rafforzata della regola di divergenza | §34 | nessuna; il §35 la rimanda al §13, che non la contiene |
| che cosa il giocatore può credere per sbaglio, e come lo scopre | §13 («si compilano con le altre voci») | nessuna |
| dove si mette in fila un'opposizione multipla | V8 | nessuna |

**Perché pesa.** «Otto scelte e sedici voci, e niente altro» è la disciplina che regge tutta l'architettura. Le attenuanti sono la leva principale del giocatore («il giocatore non gioca contro il dado: gioca contro l'Esposizione»), eppure non esiste una voce in cui dichiararle. Senza `f(0)` e `g`, la condizione di stabilità I6 non si può verificare partendo dalla firma.

**Proposta.** Per la regola stessa del §26.2 queste sono lacune del motore, e vanno portate nella specifica: una voce per le attenuanti; la voce 14 portata a quattro numeri, oppure una voce nuova per l'imprevisto; una collocazione per gli altri tre dati. La Fase 1 della roadmap, che trascrive la firma come dati, le avrebbe incontrate tutte: questa tabella può essere la prima pagina di `VERBALE-fase1.md`.

### 5. La difficoltà resta scritta a mano

**Dove.** §7: il verbo «è l'unica cosa che l'autore è obbligato a scrivere». §14: «Ogni via ha il suo verbo, la sua difficoltà, la sua Esposizione, il suo prezzo». §2.5: «La difficoltà non scala, mai».

**Che cosa non torna.** La derivazione toglie all'autore il giudizio sull'esposizione. Il giudizio sulla difficoltà (Facile, Impegnativa, Ardua, Estrema) resta suo, via per via, e la specifica non dice da dove venga. Le frasi del §7 e del §14 si contraddicono: o l'autore scrive la difficoltà, o qualcosa la ricava.

**Perché pesa.** L'argomento principale a favore del motore è che i giudizi scritti a mano, nodo per nodo, perdono coerenza quando gli autori sono molti (il concept parla di «trentamila micro-giudizi incoerenti»). Lo stesso argomento vale per la difficoltà, e il motore lo lascia scoperto. Inoltre nessun controllo impedisce di assegnare difficoltà sempre più alte man mano che la storia avanza, cioè di rimettere a mano la difficoltà che scala. La voce 15 dichiara la distribuzione delle difficoltà, ma non dove cadono lungo la storia.

**Proposta.** Scegliere una strada e scriverla. Prima strada: la difficoltà la sceglie l'autore, e un controllo confronta le difficoltà della prima parte della storia con quelle dell'ultima. Seconda strada: anche la difficoltà si ricava, per esempio dal tipo di ostacolo. In tutti e due i casi il manuale deve dire che la derivazione riguarda il costo, e che la probabilità di riuscire dipende da scelte dell'autore.

### 6. «Cambiato» poggia su un rimando sbagliato

**Dove.** §14, deviazione D22 (riga 436); §19.3; V14.

**Che cosa non torna.** La 1.3 stabilisce che un ritento è ammesso solo se la ricevuta è cambiata. Per mostrare che questa regola lascia vivi i quattro tentativi dell'Inesperto (N8), il testo sostiene che la ricevuta cambia da sola, perché «ogni tentativo consuma una frazione di passo (§19.3)». Il §19.3 dice un'altra cosa: consumano una frazione «uno scambio di confronto, un'azione di riposo, un'attesa deliberata». Il tentativo normale non compare. E anche se consumasse una frazione, la ricevuta non ha una riga per il tempo: le sue righe sono base, luogo, momento, aggravanti, attenuanti e Fondo.

Dopo un fallimento da Coperto il divieto di ritentare è voluto, perché la griglia promette che «si apre un'altra via». Dopo un fallimento da Esposto tutto dipende da che cosa significa, in righe di ricevuta, «la scena cambia natura», e la specifica non lo dice.

**Perché pesa.** Due implementazioni oneste possono divergere. Nella prima, dopo un fallimento la ricevuta resta identica e il ritento è vietato: la competenza non si manifesta più come «meno tentativi», che è l'unica forma in cui esiste in questo motore. Nella seconda, l'implementazione aggiunge una riga «secondo tentativo»: la ricevuta cambia sempre e il divieto di ripetere diventa vuoto.

**Proposta.** Scrivere che cosa cambia la ricevuta dopo ogni tipo di fallimento. Per esempio: ogni tentativo consuma una frazione, e la frazione può spostare il momento; oppure il Rovescio minore lascia sempre una riga nuova (una Traccia, un'aggravante di scena). Poi correggere il rimando.

### 7. Il confronto descrive un avversario impossibile

**Dove.** §23.3 (tabella), §23.6 (vincolo di compilazione), V7, §32 (l'udienza di corte), concept §7.

**Che cosa non torna.** La tabella del §23.3 spiega il confronto così: ogni tua prova riuscita scopre l'altro di un gradino, da Coperto a Esposto e da Esposto ad Allo scoperto, e lì si apre la finestra. Il §23.6 però stabilisce che chi si chiude «risale un gradino a scambio», e che «una leva che ne scopre uno solo rende quell'avversario impossibile». V7 lo trasforma in controllo. Contro chi si chiude, la progressione della tabella non arriva mai alla finestra: tu lo scopri di uno, lui si ricopre di uno.

L'esempio di corte cade in pieno: il rivale dell'udienza «è chi si chiude», e «ogni tua prova riuscita gliela scopre di un gradino». Quell'avversario non passa V7, eppure il §32 conclude che «la firma si riempie per intero». Le sue leve, inoltre, non dichiarano di quanto lo muovono, come il §23.6 richiede. Il concept ripete la stessa frase («Ogni tua prova riuscita lo scopre di un gradino»).

Manca anche l'ordine preciso dello scambio. Il §34 dice che la finestra dura «fino alla sua prossima mossa»; il §23.2 dice che la reazione dell'avversario arriva nello stesso scambio della tua prova. Non è scritto se la decisione nella finestra arriva prima di quella reazione.

**Proposta.** Riscrivere la tabella del §23.3 con una colonna per ciascuna delle due nature. Dare alle leve dell'esempio di corte un valore di due gradini, oppure cambiare la natura del rivale. Scrivere lo scambio come sequenza numerata: tua prova, eventuale finestra, sua reazione.

### 8. Le istanziazioni sono parziali, e i verdetti dicono di più

**Dove.** Parte VI; README («servono da prova dell'agnosticismo»); concept §9 («la firma è stata riempita per tre finzioni»).

**I fatti.**

- **Corte**, la più completa. Mancano le voci 13 (banco), 14 (freno e smaltimento), 15 (mix di difficoltà) e 16 (chi versa i punti). La 12 è solo nominata («il patrono che assorbe»). La 8 non ha il numero richiesto da V15. Il confronto non passa V7 (rilievo 7) e l'esempio delle inversioni non torna (rilievo 2).
- **Corte, lessico.** N9.a chiede che almeno metà dei verbi abbia base Coperto, e il lessico ne dichiara sette su dodici. Due di questi, Contraffare e Insinuare, hanno Fondo Esposto e quindi non possono mai risultare Coperti. Senza di loro i verbi che possono davvero risultare Coperti sono cinque su dodici, e il vincolo non passa. Il caso «Fondo più alto della base» non è previsto dalla specifica: il §12.3 misura solo `Fondo == base` e `Fondo < base`.
- **Fantasy.** Tre verbi della disciplina, nessun lessico completo, nessuna tabella di luoghi o momenti, nessuna aggravante.
- **Indagine.** Nessun lessico e nessuna tabella. L'interrogatorio usa Prevedere e Osservare, che sono verbi della corte, e Ottenere, che non compare in nessun lessico.

**Perché pesa.** Il verdetto «la firma si riempie per intero» e la frase del README sulla prova dell'agnosticismo promettono più di quello che le compilazioni mostrano. Il manuale non può ripeterli.

**Proposta.** Chiamarle abbozzi finché non sono complete, e completarle durante la Fase 1, dove la trascrizione come dati lo imporrà comunque. Decidere se `Fondo > base` è ammesso e, in caso affermativo, come conta per N9.a.

---

## Medie

### 9. «Mai quanto è probabile»: lo slogan dice più della regola

N1 dice che l'Esposizione «cambia cosa succede, mai quanto è probabile», e I5 che non compare «in nessuna formula che produca una probabilità». L'Appendice A però usa proprio una formula in cui l'Esposizione determina la frequenza dell'imprevisto, e il §27 lo ammette: «su una partita intera, più Esposizione significa più esiti cattivi». La regola vera è più stretta: l'Esposizione non cambia la probabilità di riuscire una prova. Il rimando di N1 («l'unico punto in cui questa regola sembra contraddirsi è al §19.4») porta al paragrafo sull'arrivo, mentre quello giusto è il §27. Nel manuale lo slogan va scritto nella forma stretta, altrimenti il primo lettore attento trova la contraddizione da solo.

### 10. Il 5% del d20 presentato come difesa dai muri

Il §17 preferisce il d20 perché «mantiene il 5% che impedisce a qualunque prova di diventare un muro», e dei dadi a campana scrive che, perdendo quel 5%, obbligano a riverificare il §2.6. Ma il §14 affida la difesa dai muri alla via povera, che non si tira, e aggiunge che «una via povera che si può fallire sarebbe un muro con un dado davanti». Con la logica del §14, una prova al 5% è proprio un muro con un dado davanti. Il d20 ha buone ragioni per essere il predefinito, a cominciare dalla leggibilità; questa ragione va tolta.

### 11. Gli intervalli dei valori non sono normativi

Che luoghi e momenti valgano −1, 0 o +1, e che le aggravanti attive siano al massimo due, è scritto solo come ipotesi di calcolo al §12.1. Se è una regola, la prima metà di N9.b (per ogni ceppo `Luogo + Momento` fra −2 e +2) è sempre vera, e quella parte di V10 non può fallire. Se non è una regola, i numeri del §12.1 (grezza da −4 a +6, undici valori) non hanno fondamento, anche perché le famiglie di aggravanti possono essere cinque. Il «73% dell'escursione aritmetica» fuori scala conta i valori distinti, non le situazioni: sulle 243 combinazioni di `ISTRUZIONI-riconciliazione.md` (R2) cade fuori scala il 42%. Un lettore leggerà il 73% come una frequenza.

### 12. Numeri d'esempio non ricavati dalle tabelle

- «Il salto a Maestro vale circa 10% ovunque» (§18). Sulla prova Facile vale zero: 95% in tutti e due i casi.
- «−6 azzera un Esperto senza portarlo sotto zero. L'Impedimento massimo può annullare la competenza, non invertirla» (§22.1). Vale per l'Esperto (+6). Sullo stesso verbo l'Inesperto va sotto zero al primo danno, l'Incerto al secondo, il Pratico al terzo.
- «Un principiante apre la finestra al quarto tentativo, e ci arriva con tre danni. Uno bravo la apre al primo» (§23.9, ripreso dal concept). Con la tabella B1, su una prova Impegnativa l'Inesperto riesce il 45% delle volte (in media 2,2 tentativi per un successo) e l'Esperto il 75% (1,3). Quattro tentativi sono quelli dell'Inesperto su una prova Ardua (25%), dove il Maestro ne usa in media 1,5. I tre danni presuppongono fallimenti da esposto, perché da Coperto un fallimento non ne produce (I1).

Nel manuale ogni numero va ricalcolato dalle tabelle che il manuale stesso mostra.

### 13. Turno sì o turno no

Il §3 dice che il motore «non ha iniziativa, e non ha un ordine di turno». Il §23.2 dice che «l'alternanza è un turno, e va chiamata col suo nome: quello che questo motore non ha non è il turno, è l'orologio». Il concept riprende la prima frase. Il manuale deve sceglierne una: niente iniziativa e niente orologio; nel confronto si alterna, prima tu e poi l'altro.

### 14. «Il confronto non è un sistema separato»

Lo affermano N2 e il concept. Il modulo G però ha regole sue: due nature, quattro voci, tre famiglie di uscita, la finestra, due uscite sigillate, la prova di resistenza, lo stallo, V6–V8 e V15. Con il resto del motore condivide la griglia e la scala dell'Esposizione. Il manuale sarà più credibile se dice che cosa è comune e che cosa appartiene solo al confronto.

### 15. Il Fondo spiegato in due modi

Il §9 scrive che leggere «Fondo: Esposto» significa sapere che nessuna preparazione salverà. Il concept attribuisce la stessa frase a «Fondo: Allo scoperto». Le due letture sono diverse: con Fondo Esposto la preparazione può ancora portarti da Allo scoperto a Esposto. Sempre al §9, la frase «tre valori possibili, e due dicono la stessa cosa in modi diversi» non dice quali due.

### 16. Parole con più significati

Nella specifica la stessa parola indica cose diverse.

- **Firma**: di un verbo (§7), delle tabelle (§10.1), di un'ambientazione (Parte IV), di un avversario (§23.6).
- **Profilo**: un'opzione di modulo (A1, B2 e così via) e, al §19.1, ciò che si può sapere in anticipo su un passo («un profilo a tre risoluzioni»).
- **Traccia**: l'asse della conseguenza; l'indicatore del logorio («una traccia per ogni rimedio distinto», §22.1); nel README, le due linee di lavoro del progetto.
- **Leva**: ciò che il giocatore usa per abbassare l'Esposizione (§12) e ciò che scopre un avversario (§23.6).
- **Gradino**: livello di Esposizione, livello di competenza, unità di Traccia, grado di intervento dell'autore (§15).
- **Casella**: le sei della griglia e le 208 delle tabelle (§10.4).

Nella specifica è un fastidio, nel manuale diventa un ostacolo. Le soluzioni proposte stanno nel glossario di `LINGUA-DEL-MANUALE.md`.

### 17. Coperto ed Esposto non si accordano col genere

«Coperto» ed «Esposto» sono participi: riferiti a una protagonista diventano «coperta» ed «esposta». La specifica stessa li accorda senza accorgersene («resta Coperta», §30.2). Un'interfaccia che scrive «Sei Coperto» a un personaggio femminile sbaglia, mentre «Allo scoperto» è invariabile. Proposta per il manuale e per l'interfaccia: «al coperto, esposto/esposta, allo scoperto». Così due gradi su tre non cambiano mai.

---

## Lievi

### 18. Conteggi dei moduli

La Parte III si apre con «Otto moduli», e la Nota di lettura ripete «Otto», ma i moduli descritti sono nove (dalla A alla I). Il §37 corregge il conto soltanto in nota. Il README scrive «nove moduli, di cui otto con profili dichiarati e un predefinito motivato», mentre i moduli C e F non hanno un predefinito (§26.1).

### 19. Titoli e collocazioni

Il §22 si intitola «Il logorio, i danni e il confronto», ma il confronto sta al §23. N12, che è una regola di nucleo, si trova nella Parte IV (§27.1): chi legge soltanto la Parte II conta undici regole.

### 20. La griglia del concept senza nomi

La tabella del concept (§3) non dà i nomi delle sei caselle, e il paragrafo successivo parla di «Successo pieno e Rovescio» come se il lettore li conoscesse già. Li chiama anche «righe della griglia», mentre sono caselle.

### 21. Tipografia e grassetto

Il concept alterna l'apostrofo tipografico e quello dritto (riga 13 «l’insieme», riga 15 «un'appendice»). La specifica contiene 845 coppie di grassetto su circa 19.000 parole, una ogni 23 parole: a quella densità il grassetto smette di segnalare qualcosa.

---

## Che cosa regge

Nessuno di questi rilievi tocca l'idea di fondo.

- La separazione fra riuscire e pagare è chiara, e la griglia assegna a ogni casella un ruolo diverso.
- Il valore per ceppo è un'idea vera: con tabelle coerenti produce situazioni in cui la stessa azione conviene in un posto e non in un altro.
- Il metodo (criteri scritti prima, criteri falliti tenuti a verbale) e la dichiarazione del proprio debito sono rari in un documento di design.
- L'Appendice A trasforma la stabilità in una condizione che si può controllare, e la scoperta della regione bistabile ha valore anche fuori da questo motore.
- La via povera, il divieto delle riserve e la ricevuta danno a chi scrive vincoli concreti.

## Ordine consigliato

1. **Subito, a costo quasi nullo:** correggere sulla carta gli esempi 1 e 2, perché il manuale li userà per primi. La correzione della specifica aspetta la Fase 4; il manuale può già usare la versione giusta, con una nota.
2. **Addendum alla roadmap** (rilievo 3): dichiarare il ritardo e le nuove date.
3. **Fase 1:** i rilievi 4, 5, 6, 8, 11 e 16 emergono tutti trascrivendo la firma come dati. Conviene aprire `VERBALE-fase1.md` partendo da qui.
4. **Prima di scrivere il capitolo sul confronto:** rilievo 7.
5. **Mentre si scrive il manuale:** rilievi 9, 10 e 12–21.
