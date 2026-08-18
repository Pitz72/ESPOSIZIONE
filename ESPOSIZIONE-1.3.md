# ESPOSIZIONE

### Motore narrativo a due assi — Specifica 1.3
#### Nucleo invariante e moduli a profili

*Un sistema di risoluzione per giochi di ruolo narrativi, indipendente dall'ambientazione.*

---

> **Il dado decide se riesci. Lo stato decide cosa ti costa.**

---

## Che cosa è cambiato dalla 1.2

**La 1.3 non aggiunge nessuna meccanica.** Chiude buchi, definisce parole che reggevano più peso di quanto dichiarassero, e rende verificabili promesse che la 1.2 faceva senza controllarle. Il nucleo resta di dodici regole e i moduli di nove: **chi ha implementato la 1.2 non deve riscrivere niente, deve dichiarare di più.**

> **«Solo se qualcosa è cambiato» adesso è definito.** La regola del ritento poggiava su una parola che il documento non definiva da nessuna parte, e quella parola sosteneva due promesse opposte: senza di essa il fallimento da Coperto autorizza il ritento gratuito; con la definizione sbagliata i quattro tentativi dell'Inesperto di N8 diventano ripetizione bruta. La definizione sta al §14, e usa una superficie che il motore ha già: **è cambiato ciò che cambia la ricevuta.**

> **Il confronto dichiara la sua via povera.** Le due uscite sempre disponibili del §23.8 sono prove sigillate, cioè si tirano, e nessuna riga diceva quale uscita di un confronto soddisfacesse V1. Un modulo poteva quindi contenere il muro che il §2.6 vieta (§23.7).

> **La pressione si controlla.** Lo stallo da Coperto lo rompe ciò che stava già scorrendo (§23.5), e nessun validatore verificava che quel qualcosa esistesse. Da cui **V15**.

**E tre correzioni al metodo, che tolgono forza apparente al documento e sono la ragione per cui questa revisione esiste.**

*La monotonia di N9.a non era una scoperta empirica: è aritmetica.* Si deriva dal tetto della scala senza tirare un dado, e la 1.2 la presentava come una misura. La regola ne esce più forte — vale per costruzione — e i tre numeri che la esibivano valgono per la finzione che li ha prodotti (§12.3).

*I7 non esporta più una soglia.* Il «riferimento misurato: 82,9%» veniva dallo stesso dataset che aveva prodotto la regola: dichiarare una soglia guardandolo è alla lettera ciò che il §30 vieta.

*Le due correzioni del nucleo della 1.2 poggiano su una finzione sola*, e non sono mai ripassate da una seconda. Il §38 lo impone a chi adotta il motore; la specifica non l'ha fatto per sé. **È debito aperto, ed è dichiarato al §30.3.**

*Le altre novità, in elenco:* V14, V15, V16 e I10 · il banco umano e le sue due domande (§30.2) · il recinto sulla conoscenza falsa (§13) · il numero degli avversari che alza il prezzo delle uscite invece di chiuderle (§23.2) · il budget di ripetizione dichiarato in riletture e non in varianti (§24.3) · l'appendice che deriva la disuguaglianza del freno, senza la quale I6 non era verificabile da nessuno tranne chi l'aveva scritta (**Appendice A**).

---

## Che cosa è cambiato dalla 1.1

**La 1.2 corregge due regole che erano sbagliate, e le ha corrette una misura fatta contro di esse.** Sono le uniche modifiche: l'architettura e tutto il resto restano quelli della 1.1.

> **N9.a era puntata sulla proprietà sbagliata.** Vincolava il rapporto `Fondo == base`, e la misura dice che la probabilità che la preparazione atterri è monotona nella **base** e non in quel rapporto: 76,5% a base *Coperto*, 48,5% a *Esposto*, 26,1% a *Allo scoperto*. **I verbi con `Fondo == base` atterrano meglio degli altri** — la vecchia regola colpiva cinque verbi che stavano benissimo e lasciava stare i due che stavano peggio. Riscritta al §12.3.

> **Il freno non era un freno.** Era formulato come tetto sul flusso in **entrata**; con il flusso in **uscita** a zero nessun valore del tetto stabilizza niente. E l'uscita era a zero davvero: nella prima applicazione del motore **la Traccia non aveva nessuno smaltimento**, in nessuna riga di dieci capitoli, e il sistema risultava **bistabile** — reggeva finché non capitava una brutta giornata, e da lì non tornava più. Da cui **N12**, che è nuova, e la riformulazione del freno come disuguaglianza (§27).

**E una precisazione che vale quanto le due correzioni:** la saturazione della scala **non si riduce** — la grezza va da −4 a +6, undici valori su una scala che ne ha tre, e nessuna correzione locale sposta la cosa di più di quattro punti. Non è un difetto da minimizzare: è il comportamento previsto di una scala limitata. **Il difetto vero è il pedaggio**, è molto più piccolo, e lo risolve N9.c (§12.1–12.2).

*Le tre misure vengono dall'applicazione del motore a un progetto reale, con criterio dichiarato prima e criteri falliti tenuti a verbale. È il modo in cui questa specifica si aggiorna: non per rilettura, ma perché qualcuno l'ha fatta girare contro dei dati.*

---

## Che cosa era cambiato dalla 1.0

La 1.0 presentava il motore su un livello solo. Ne discendeva un difetto di lettura: qualunque cosa non coperta in un pezzo periferico — la crescita in una finzione a episodi, la competenza acquisita studiando — si leggeva come una crepa nell'insieme, quando era la mancanza di un'opzione in un modulo.

**La 1.1 separa il nucleo dai moduli.**

> **Il nucleo non si adatta mai. I moduli si scelgono fra profili dichiarati.**

Un motore universale non è un motore che va bene per tutto senza toccarlo: è un motore in cui **ciò che non si tocca è piccolo e non negoziabile**, e tutto il resto si sceglie da un elenco chiuso. Adattarlo a un caso è previsto e **non richiede di inventare niente**.

**Ma va detto quanto costa, perché la 1.2 lo diceva male.** Le otto scelte di profilo sono mezza giornata di discussione. Le sedici voci sono un'altra scala di lavoro: le tabelle sono giudizio **interdipendente** — ogni casella deve restare coerente con tutte le altre — e il §2.3 lo dichiara già come *il costo reale di questo motore*. Chi si aspetta di finire in mezza giornata concluderà di aver sbagliato qualcosa, avendo ragione sui fatti e torto sull'aspettativa che gli era stata data.

E la disciplina che impedisce a questa architettura di degenerare in un vocabolario è una sola:

> **Un profilo nuovo si aggiunge alla specifica, non si inventa per un progetto.** Se un'ambientazione ha bisogno di qualcosa che nessun profilo copre, è una lacuna del motore e va portata qui.

**Le tre novità:** l'architettura a nucleo e moduli (Parti II e III) · i **profili di crescita** che mancavano, compresi quelli per finzioni a episodi e per la competenza da studio (§21) · **il perimetro onesto** (Parte VII), cioè dove il motore non arriva e perché.

---

## Nota di lettura

Questo documento descrive un motore, non un gioco. Non nomina nessun personaggio, nessun luogo, nessuna creatura. Una persona che non sappia niente delle storie per cui è stato costruito deve poterlo implementare leggendolo.

| | |
|---|---|
| **Parte I** | Le tesi. Perché il motore è fatto così, e cosa ha pagato per esserlo |
| **Parte II** | **Il nucleo.** Dodici regole che non si adattano mai — undici qui, e N12 al §27.1, dov'è nata |
| **Parte III** | **I moduli.** Otto, ciascuno con i suoi profili dichiarati |
| **Parte IV** | La firma di un'ambientazione: cosa scegliere e cosa compilare |
| **Parte V** | Validatori e invarianti |
| **Parte VI** | Tre istanziazioni di generi lontani, con i profili che hanno scelto |
| **Parte VII** | Il perimetro onesto, e le deviazioni per chi viene da una versione precedente |
| **Appendice A** | Il modello da cui si ricava la disuguaglianza del freno, e come si verifica I6 |

*Esiste anche una presentazione del concept, in italiano e in inglese, che copre le tesi e l'architettura in una decina di pagine e non serve a implementare niente. Chi deve scegliere se il motore gli interessa cominci da lì.*

Le note ⚠️ **DEVIAZIONE** segnalano dove questa specifica si discosta dalla prima stesura del motore: servono a chi deve riconciliare un progetto avviato, e si ignorano a lettura pulita.

---
---

# PARTE I — LE TESI

## 1. Il problema

Un gioco di ruolo narrativo deve risolvere una cosa che sembra semplice: **far sì che riuscire e fallire non siano le uniche due cose che possono succedere**, senza pagare un catalogo infinito di esiti scritti a mano.

Le soluzioni consuete falliscono in tre modi ricorrenti.

**La scala di gradi** è **ordinata per definizione**, e una forma ordinata suggerisce a chi scrive «meglio e peggio». Ottenere esiti che divergano davvero diventa una questione di disciplina degli autori, e su un progetto lungo la disciplina cede.

**Il danno** trasforma ogni ostacolo nella stessa domanda — *quanto gliene resta* — richiede che quasi tutto abbia una riserva, e crea un sottosistema privilegiato che cresce fino a mangiare gli altri.

**La difficoltà che scala** cancella la sola esperienza che la crescita produce: tornare dove si era falliti e passare.

Questo motore rifiuta tutti e tre, e paga per farlo.

## 2. Le sei tesi

### 2.1 Due assi indipendenti, non una scala

L'**Esito** è binario e lo decide il dado. L'**Esposizione** non la tira nessuno: è determinata da come ci sei arrivato. Il loro incrocio produce sei caselle **qualitativamente** diverse per costruzione.

*Compra:* sei caselle che differiscono per **ruolo** e non per grado — nessuna è la versione peggiorata di un'altra. *(Che poi divergano anche nel contenuto non lo garantisce la struttura: lo verifica V5, coppia per coppia. Vedi §13.)*
*Costa:* il giocatore ha un asse solo su cui lavorare, e quell'asse ha pochi valori. Tenerlo vivo è il problema di taratura centrale (§12).

### 2.2 L'asse che il giocatore governa è visibile prima di agire

L'Esposizione si mostra sempre **con le sue cause, riga per riga**, prima che l'azione sia confermata. Non come numero: come elenco di voci in lingua.

*Compra:* il giocatore non deve indovinare il modello mentale di chi ha progettato il gioco. Lo legge, e impara il sistema usandolo.
*Costa:* ogni modificatore deve poter essere detto a parole. **Se non si riesce a dirlo in una frase breve, non deve esistere.** Taglia via metà dei modificatori che verrebbero in mente.

### 2.3 La posizione si deriva, non si scrive

L'Esposizione di base non la scrive nessuno: si **compone** da tre fattori che una tabella dichiara una volta per ambientazione.

*Compra:* la coerenza fra autori diversi — storicamente la prima cosa che si perde — e un costo di scrittura per nodo pari a zero.
*Costa:* un costo di **giudizio** concentrato nella compilazione delle tabelle. Non è scrittura e non si parallelizza. È il costo reale di questo motore (§10.4).

### 2.4 Nessuna riserva, da nessuna parte

> **Non si chiede mai *quanto ne resta*. Si chiede *com'è ridotto*.**

Ciò che degrada è un'entità con un decorso, che **dichiara cosa impedisce**. Ciò che si oppone non si logora: **si scopre**.

*Compra:* nessun sottosistema privilegiato, e conseguenze che si raccontano invece di contarsi.
*Costa:* la sensazione di progresso dentro un confronto va prodotta in un altro modo (§22), e chi arriva da altri giochi la cerca dove non c'è.

### 2.5 La difficoltà non scala, mai

*Compra:* la progressione si sente tornando dove si era falliti — la migliore esperienza di crescita che un gioco possa offrire, e l'unica che non si può falsificare.
*Costa:* la crescita non si sente sul singolo tiro. Va resa percepibile altrove, ed è un requisito duro (§24.4).

### 2.6 Nessun ostacolo è un muro

> **Ogni ostacolo ha almeno una via senza prerequisiti: sempre disponibile, sempre costosa, mai bloccata. E quella via non si tira.**

*Compra:* il gioco non si può interrompere, e la difficoltà si esprime come prezzo invece che come sbarramento.
*Costa:* una via in più per ogni ostacolo, ed è la voce che gli autori tenteranno di saltare per prima. Va rifiutata in validazione, non raccomandata.

## 3. Cosa il motore non fa mai

Ogni assenza è una decisione.

- **Non tira mai al posto del giocatore.** Esiste **un solo tiratore**.
- **Non ha iniziativa**, e non ha un ordine di turno.
- **Non ha un orologio che scorre mentre il giocatore pensa.**
- **Non ha attributi.** La scheda è una lista di verbi, e nient'altro.
- **Non ha classi, archetipi o percorsi di avanzamento.**
- **Non ha una scheda parallela per gli avversari.**
- **Non genera testo a runtime:** lo compone da materiale congelato in produzione (§24.3).
- **Non ha punteggi morali, barre di reputazione, allineamenti.**

---
---

# PARTE II — IL NUCLEO

> **Dodici regole. Non si adattano, non si profilano, non si negoziano. Un progetto che ne tocca una non sta più usando questo motore — il che è legittimo, ma va detto.**

*Undici stanno qui. La dodicesima — N12, ogni stato che si accumula dichiara come si smaltisce — è nata misurando il freno, e sta al §27.1 dove la sua ragione è leggibile. È nucleo quanto le altre.*

## 4. N1 — Due assi che non si toccano

**Vincolo di coerenza, assoluto.**

> **L'Esposizione cambia *cosa succede*, mai *quanto è probabile*. Non modifica il tiro, non modifica la CD, non compare in nessuna formula di probabilità.**

Se l'Esposizione toccasse le percentuali, i due assi si richiuderebbero in una scala sola e l'intero impianto tornerebbe a essere una difficoltà travestita. **Ogni proposta che violi questa riga va respinta**, comprese quelle che sembrano innocue.

*(L'unico punto in cui questa regola sembra contraddirsi è al §19.4, e non lo fa.)*

## 5. N2 — La griglia

|  | **Riesci** | **Non riesci** |
|---|---|---|
| **Coperto** | **Successo pieno** — ottieni, e non lasci traccia | **Fallimento pulito** — non passi di qui, ma hai imparato qualcosa: si apre un'altra via |
| **Esposto** | **Successo sporco** — ottieni, ma il mondo registra il tuo passaggio | **Rovescio minore** — la scena cambia natura sotto di te |
| **Allo scoperto** | **Successo a caro prezzo** — ottieni, e qualcosa si rompe per sempre | **Rovescio** — la situazione si trasforma: sei in un'altra scena, non nella stessa scena andata male |

Tre conseguenze deliberate:

1. **Da Coperto il dado non può rovinarti.** Il peggio che può capitare è non riuscire. È una promessa che il motore deve mantenere **in ogni sua parte**, compreso il confronto.
2. **I critici non sono facce del dado.** Successo pieno e Rovescio sono righe della griglia: la loro frequenza la decide il giocatore con il modo in cui agisce, non il caso con un 5%.
3. **Il confronto non è un sistema separato.** È una catena di prove ad alta Esposizione con lo stesso motore di tutto il resto.

## 6. N3 — I tre livelli dell'Esposizione

> **L'Esposizione è quanto la situazione può farti pagare.**

| Livello | Significato generico |
|---|---|
| **Coperto** | la situazione non ha presa su di te; il peggio che può capitarti è non riuscire |
| **Esposto** | la situazione può prenderti; riuscire lascia comunque qualcosa dietro |
| **Allo scoperto** | qualunque cosa accada, accade dove conta |

Non è una misura di pericolo fisico e non è una misura di visibilità: quelle sono **letture**, e ogni ambientazione dichiara la propria (§26.1). Il motore la definisce astrattamente e non altrimenti.

*Nota sul termine.* La parola è tenuta perché in italiano è già astratta: si dice esposizione debitoria, ci si espone prendendo posizione, si vende allo scoperto. Il vocabolario che sembrava saldato a una finzione di occultamento non lo è mai stato.

**Tre livelli, non quattro e non due.** Due non permettono la casella di mezzo, che è dove vive tutto il gioco; quattro rendono la ricevuta illeggibile e le tabelle intrattabili.

## 7. N4 — La firma di un verbo

> **Un verbo è: un nome · un ceppo · una base · un Fondo.**

**Il verbo è l'unità di competenza.** Non esiste una lista di abilità separata dai verbi: un secondo dizionario direbbe le stesse cose del primo e obbligherebbe gli autori a mapparne uno sull'altro a mano, con l'effetto che autori diversi lo farebbero in modo diverso.

Ogni via di ogni ostacolo dichiara **un verbo**, ed è l'unica cosa che l'autore è obbligato a scrivere. Il verbo determina tre cose insieme: **quale competenza si applica al tiro**, **l'Esposizione di base**, **il Fondo**.

⚠️ **DEVIAZIONE D1.** *L'elenco dei verbi non fa parte del nucleo.* Un lessico è il vocabolario di una finzione. Il nucleo fissa la firma; le voci sono dati (§20).

## 8. N5 — Il ceppo come indice

I ceppi sono **le categorie dell'azione**. Non hanno valore numerico e **non entrano in nessuna somma**: il tiro legge un numero solo, quello del verbo.

Il loro mestiere meccanico è un altro, ed è il cuore del motore: **il ceppo è l'indice delle tabelle di derivazione.** Un luogo e un momento non dichiarano quanto espongono in generale — lo dichiarano ceppo per ceppo.

**Un personaggio si legge come una frase**, non come una tabella: *corpo debole, mano ferma, mente affilata, voce che non convince nessuno*.

## 9. N6 — Il Fondo

> **Il Fondo è il livello sotto il quale nessuna preparazione può far scendere un'azione. È una proprietà del verbo, non della scena.**

Tre valori possibili, e due dicono la stessa cosa in modi diversi: *Coperto* significa **nessun fondo** — con la preparazione giusta si può fare pulito; *Esposto* significa **non si può mai fare pulito**; *Allo scoperto* significa che niente aiuta, mai.

Il Fondo è il dispositivo con cui **un principio di design smette di essere una raccomandazione e diventa aritmetica**. Se una finzione stabilisce che un certo gesto è sempre il più caro, non lo si scrive nelle linee guida: gli si dà Fondo *Allo scoperto*, e nessuno può disattenderlo per distrazione.

È anche **il modo in cui il gioco dice la verità sul pericolo**: leggere *Fondo: Esposto* significa sapere che nessuna preparazione salverà.

**Il criterio con cui si assegnano i Fondi è dati** (§26.2), ma la sua forma è nucleo: *ha un Fondo solo ciò che [lascia dietro di sé qualcosa che la finzione considera irreversibile]*.

## 10. N7 — La composizione

```
grezza      = base(verbo) + Luogo[ceppo] + Momento[ceppo] + aggravanti − attenuanti
Esposizione = grezza, limitata in [Fondo(verbo), Allo scoperto]
```

Con **Coperto = 0, Esposto = 1, Allo scoperto = 2**.

### 10.1 La firma delle tabelle

| Fattore | Dichiara |
|---|---|
| **Verbo** | la base e il Fondo |
| **Luogo** | quanto espone, **un valore per ceppo** |
| **Momento** | quanto espone, **un valore per ceppo**, con la firma identica a quella del Luogo |

Luogo e Momento hanno deliberatamente la stessa firma, perché così la composizione è **una regola sola** e non ha casi speciali.

### 10.2 Perché un valore per ceppo

È il punto in cui questo motore si distingue davvero.

**Le inversioni sono la parte interessante di tutte e tre le tabelle.** Una folla nasconde le mani e scopre la voce. Una rovina espone il corpo che fa rumore e ripara le mani che lavorano. La pioggia copre il ladro e scopre il camminatore.

Con un valore unico per fattore, la pioggia sarebbe genericamente *peggio*, e la scelta di quando muoversi perderebbe il suo contenuto. E soprattutto diventerebbe **inesprimibile** qualunque regola che contenga due segni opposti nello stesso momento — che sono le regole migliori che un'ambientazione possiede.

### 10.3 Aggravanti e attenuanti

**Aggravanti — il mondo spinge in su.** Poche e grosse, ciascuna alza di **un livello**. Non le scrive l'autore: si applicano da sole. Da tre a cinque famiglie, non di più: un catalogo lungo di aggravanti minute è **deliberatamente escluso**, perché la ricevuta deve restare leggibile in un colpo d'occhio.

**Attenuanti — il giocatore tira in giù.** Azioni deliberate e care, ciascuna abbassa di **un livello, mai sotto il Fondo**.

> **Sono queste, e non il bonus al tiro, la vera mitigazione del caso. Il giocatore non gioca contro il dado: gioca contro l'Esposizione.**

**Tre difese contro la degenerazione:** le attenuanti non sono permanenti (valgono per la scena o si consumano) · ogni attenuante costa tempo, e prepararsi consuma · la scala satura in alto, e non esiste un quarto livello.

### 10.4 Il costo, in chiaro

Un numero di caselle pari a `(luoghi + momenti) × ceppi`. Con quaranta luoghi, dodici momenti e quattro ceppi sono **208 caselle** invece di 52.

È costo di **giudizio** e non di scrittura — non tocca il volume dei testi, e si paga una volta per ambientazione e non una volta per nodo. Ma è **giudizio interdipendente**: ogni casella deve restare coerente con tutte le altre, e le inversioni sono precisamente ciò che deriva per primo quando la coerenza si allenta. **Va sorvegliato con uno strumento** (§29).

## 11. N8 — La competenza non abbassa l'Esposizione

> **La competenza non abbassa l'Esposizione di un tentativo. Riduce quanti tentativi servono.**

Chi è Esperto riesce al primo tentativo e rientra; chi è Inesperto ci prova quattro volte, e per quattro volte la situazione ha modo di girargli contro. **Stessa Esposizione per gesto, conto finale completamente diverso.**

E c'è una seconda strada: **il dado non decide l'Esposizione di adesso, decide quella di dopo.** Un successo sporco lascia Traccia, e la Traccia alza l'Esposizione delle prove successive.

> **Chi è bravo non è meno esposto. È esposto per meno tempo, e lascia dietro molto meno.**

## 12. N9 — La leva del giocatore deve restare viva

⚠️ **DEVIAZIONE D3 e D4.** *Questa regola nasce dall'aver contato una proprietà che nessuno aveva contato. **In 1.2 è stata riscritta**: la prima stesura contava la cosa sbagliata, e la correzione viene da una misura fatta contro di essa.*

### 12.1 La saturazione è intrinseca, e non si riduce

Con base ∈ {0,1,2}, luogo e momento ∈ {−1,0,+1}, e da zero a due aggravanti e attenuanti, la grezza va **da −4 a +6: undici valori distinti, su una scala che ne ha tre.** Il **73% dell'escursione aritmetica cade fuori dalla scala per costruzione**, prima che qualunque tabella sia stata compilata.

Ne discende una cosa che va detta invece di essere combattuta:

> **La saturazione non è un difetto da minimizzare. È il comportamento previsto di una scala limitata, ed è la difesa del §10.3 contro la spirale.**

*Misurato, e va letto con la sua avvertenza.* Su quattro configurazioni provate — tabelle vincolate · lessico corretto · entrambe · la variante che applica le attenuanti dopo il tetto invece che dentro la somma — la saturazione si è mossa **fra il 46% e il 63%, e nessun intervento l'ha spostata di più di quattro punti rispetto alla propria base di partenza.**

⚠️ **Le quattro configurazioni non condividono la stessa base, e i loro numeri non formano una serie.** La 1.2 li presentava come una progressione — *dal 62,7 al 56,2, dal 50,0 al 46,1, tutte e due insieme al 50,9* — e una progressione non erano: sono misure separate, e nessun lettore poteva ricostruire che cosa fosse stato variato. Una misura che non si può riprodurre non si può nemmeno contestare, e per il §30 non conta.

**La tesi comunque non ha bisogno di quei numeri, perché è aritmetica:** il rapporto fra l'ampiezza della composizione — undici valori — e l'ampiezza della scala — tre — è il fatto primo, e nessun intervento che lasci intatti quei due numeri lo tocca.

### 12.2 Il difetto vero non è la saturazione: è il pedaggio

Contare tutte le composizioni misura il criterio, non il motore: **metà dei casi «sotto il pavimento» sono situazioni in cui il giocatore è già al Fondo**, cioè è già pulito e non ha niente da comprare. Lì la leva è morta perché è giusto che lo sia.

La domanda che il motore pone davvero è un'altra: *fra le situazioni in cui il giocatore ha un motivo di prepararsi, la preparazione atterra?*

| Misura | Valore |
|---|---|
| atterra col primo gradino comprato | **57,6%** |
| atterra pagandone due — **il pedaggio** | **25,4%** |
| **la preparazione serve, in un modo o nell'altro** | **82,9%** |
| non serve comunque | 17,1% |

*Come tutte le grandezze di questa sezione, valgono per la finzione che le ha prodotte: dicono che il pedaggio esiste ed è piccolo, non quanto vale altrove.*

> **Il difetto è il pedaggio: il primo gradino non atterra e il secondo sì, quindi bisogna pagarne due per ottenerne uno. E la ricevuta oggi non lo dichiara.**

È un problema molto più piccolo di «la leva è morta», ed è interamente risolto da N9.c.

### 12.3 Da cui tre regole di nucleo

> **N9.a — Il lessico deve avere abbastanza verbi a base bassa.**
> Almeno metà dei verbi ha base *Coperto*, e non più di due hanno base *Allo scoperto*.

⚠️ **Questa regola sostituisce quella della 1.1**, che vincolava il rapporto `Fondo == base` e **colpiva la proprietà sbagliata**.

⚠️ **DEVIAZIONE D20 — e vale per costruzione, non per osservazione.** L'Esposizione è la grezza limitata in `[Fondo, Allo scoperto]`: un'attenuante atterra se e solo se, dopo il decremento, la grezza cade ancora dentro la scala. Alzare la base trasla verso l'alto l'intera distribuzione della grezza, quindi ne sposta massa oltre il tetto, quindi rende l'attenuante inerte più spesso. **L'ordinamento fra le tre basi è determinato dal tetto della scala, e nessuna tabella dei luoghi può invertirlo.** La 1.2 lo presentava come una scoperta empirica: era derivabile senza tirare un dado, e questa specifica stava misurando dove poteva calcolare.

La misura resta accanto, come conferma su un caso. **Si trasporta l'ordine, non le grandezze:** le percentuali qui sotto valgono per la finzione che le ha prodotte, e chi adotta il motore non le usi come riferimento.

| | situazioni con un motivo | atterra |
|---|---|---|
| base *Coperto* | 85 | **76,5%** |
| base *Esposto* | 97 | 48,5% |
| base *Allo scoperto* | 23 | **26,1%** |
| | | |
| `Fondo == base` | 136 | **63,2%** |
| `Fondo < base` | 69 | 46,4% |

**I verbi con `Fondo == base` atterrano meglio degli altri**, ed è un effetto di secondo ordine: in quel lessico `Fondo == base` è quasi sempre un verbo a base bassa, quindi la riga misura la base una seconda volta. La vecchia N9.a colpiva cinque verbi che stavano benissimo — quelli a base *Coperto* — e lasciava stare i due che stavano peggio, che sono quelli a base *Allo scoperto*. Un verbo a base massima è **permanentemente saturo in alto**: non ha quasi mai un motivo di prepararsi, e quando ce l'ha la preparazione atterra una volta su quattro.

*(Che un verbo a base massima sia una leva morta non è un difetto: è ciò che il Fondo fa quando dichiara che un gesto non si può mai fare pulito. Il vincolo serve solo a impedire che ce ne siano troppi.)*

> **N9.b — Per ogni ceppo, `Luogo + Momento` sta in [−2, +2]; e ogni luogo ha almeno un ceppo con valore negativo.**
> La seconda metà è la più importante: un luogo che espone tutto e non ripara niente non è un luogo difficile, è un luogo che non fa il suo mestiere. **Ogni posto deve essere buono per qualcosa.** *(Non riduce la saturazione — vedi §12.1 — e non è il suo mestiere.)*

> **N9.c — Una voce della ricevuta che non muove il totale si mostra, e si dichiara inerte.**
> È la regola che risolve il pedaggio, ed è la sola delle tre che tocca il difetto vero.

```
ALLO SCOPERTO
   Esposto      (base: forzare, di giorno, in uno spazio aperto)
   +1           sei ridotto male
   +1           questo posto ti conosce      — non conta, sei già allo scoperto
   −1           hai perlustrato prima
   Fondo: Esposto
```

Costa una riga d'interfaccia, **insegna il tetto invece di nasconderlo**, e riporta la ricevuta a dire la verità intera.

## 13. N10 — I quattro assi della conseguenza, e la divergenza

Ogni esito muove almeno uno di questi quattro.

| Asse | Cosa muove |
|---|---|
| **Obiettivo** | ottieni o non ottieni la cosa per cui eri lì |
| **Costo** | risorse, tempo, integrità, oggetti |
| **Traccia** | cosa resta nel mondo: stato persistente, come ti guardano |
| **Conoscenza** | cosa sai — e il gioco può darti conoscenza **falsa** |

Gli assi sono **ruoli, non contenuti**. In una finzione dove sapere è l'obiettivo, *Obiettivo* resta ciò per cui la scena esisteva e *Conoscenza* resta ciò che hai imparato per caso: non collassano.

**E la conoscenza falsa ha un recinto**, senza il quale incrina la tesi §2.2:

> **Recinto — vincolante: la conoscenza falsa non entra mai nella ricevuta.** Il gioco può darti un'idea sbagliata del mondo. Non può darti un conto sbagliato di quanto ti costerà: la ricevuta dice sempre la verità intera, N9.c compreso.

⚠️ **DEVIAZIONE D21.** *La conoscenza falsa compariva in una subordinata e non tornava più.* È l'asse su cui il motore ha più da dare — un giocatore può possedere conoscenza vera, incompleta, falsa o sospetta, e sono quattro stati narrativi diversi — ma è anche l'unico punto in cui il motore può mentire, e la tesi §2.2 promette che prima di agire si vede il vero. Il recinto separa le due cose: **si può sbagliare sul mondo, non sul prezzo.** Ciò che una finzione può far credere per sbaglio, e come si scopre di averlo creduto, sono dati e si compilano con le altre voci.

> **Regola di divergenza: due esiti dello stesso ostacolo non possono differire solo sul Costo. Almeno uno dei due deve muovere Traccia o Conoscenza.**

⚠️ **DEVIAZIONE D8.** *Si affermava che la regola fosse garantita dalla struttura del banco.* Non lo è: una distribuzione bilanciata non impedisce a una coppia specifica di violarla. **È un validatore, non una proprietà**, e si controlla coppia per coppia.

**E la Traccia alimenta l'Esposizione futura:**

```
Un successo sporco lascia Traccia
  → la Traccia alza l'Esposizione delle prove successive in quella zona
    → l'Esposizione più alta rende più probabili altri successi sporchi
      → il mondo si chiude progressivamente intorno a te
```

E al contrario: **giocare pulito mantiene il mondo aperto.** Non è una barra di reputazione e non è un contatore morale: è **pressione accumulata**.

**Cosa insegna il fallimento**, e senza questa riga la griglia mentirebbe:

> **Il fallimento insegna sulla cosa, non sul gesto.**

Scopri com'è fatta la porta; non diventi più bravo a forzarla. È **Conoscenza**, non competenza.

## 14. N11 — L'ostacolo a strati, e la via povera

Un ostacolo è **un nodo con più vie**. Ogni via ha il suo verbo, la sua difficoltà, la sua Esposizione, il suo prezzo. Il giocatore non affronta «un check»: sceglie **da dove** affrontare la cosa, e quella scelta pesa quanto il tiro.

> **Ogni ostacolo ha almeno una via senza prerequisiti: sempre disponibile, sempre costosa, mai bloccata. E non si tira.**

Una via povera che si può fallire sarebbe **un muro con un dado davanti**. Quello che varia non è la riuscita: è il **prezzo**. Un ostacolo privo di via povera è un **errore di dati**, non una scelta di design.

| Tipo di prova | Regola |
|---|---|
| **Aperta** | ritentabile, ma **solo se qualcosa è cambiato**. Mai per ripetizione bruta |
| **Sigillata** | una volta sola. Marchia la partita |

> **Una prova sigillata non può mai essere l'unica via di un ostacolo.**

**E «cambiato» ha una definizione**, perché su quella parola poggiano due promesse opposte:

> **È cambiato ciò che cambia la ricevuta.** Un ritento è ammesso se e solo se la ricevuta della nuova prova differisce dalla precedente in almeno una voce. Ricevuta identica significa ripetizione bruta, e si rifiuta.

⚠️ **DEVIAZIONE D22.** *La parola non era definita, e reggeva da sola l'anti-farming e l'economia della competenza.* Senza definizione, il fallimento pulito produce sempre Conoscenza, la Conoscenza è un cambiamento, e ritentare da Coperto è gratis — N2 garantisce che il dado non possa rovinarti, quindi la mossa ottimale diventa fallire al riparo finché non si passa. Con la definizione opposta — *la Conoscenza non conta* — i quattro tentativi dell'Inesperto di N8 sono ripetizione bruta per costruzione, e la competenza perde il fatto su cui è definita.

**La definizione le tiene tutte e due, e non aggiunge niente al motore**, perché è il contenitore a far cambiare la ricevuta da solo: ogni tentativo consuma una frazione di passo (§19.3), l'attesa costa (§19.1), la Traccia sale. Se davvero *niente* è cambiato, allora per il §15 non si doveva tirare nemmeno la prima volta. E la Conoscenza appresa fallendo non riapre la stessa via: **apre l'altra**, che è ciò che la griglia promette già al §5.

*Costo di implementazione, e va detto:* si conserva la ricevuta dell'ultimo tentativo per via, e la si confronta. È memoria per nodo, piccola e reale.

## 15. Le due regole di igiene che stanno nel nucleo

**Quando non si tira:**

> **Si tira solo se entrambi gli esiti producono una scena.**

Se il fallimento è «non succede niente, riprova», non è una prova: è un **costo**, e va applicato direttamente senza dado. Questa regola da sola elimina la maggior parte dei tiri inutili, e rende impossibile il tiro ripetuto per allenarsi.

**L'autorialità per eccezione:**

| Gradino | Cosa fa l'autore |
|---|---|
| **0 — nulla** | il nodo eredita tutto dal sistema. Copre la grande maggioranza dei contenuti |
| **1 — ritocco** | una riga: sposta la base di un livello, alza o abbassa il Fondo, aggiunge un'aggravante di scena, veta una complicazione |
| **2 — scrittura piena** | sovrascrive la casella: Esposizione, conseguenza, testo |

> **L'automazione governa il recuperabile. L'autore governa l'irreversibile.**

Un nodo irreversibile lasciato al gradino 0 è incompleto.

## 16. La pipeline

```
posizione → tiro → casella della griglia → conseguenza → mitigazione
```

Cinque stadi. I primi quattro sono nucleo; il quinto è un modulo che può essere assente (§25).

---
---

# PARTE III — I MODULI

> **Otto moduli. Ciascuno si sceglie fra profili dichiarati. Un profilo nuovo si aggiunge a questa specifica, non si inventa per un progetto.**

## 17. Modulo A — Il randomizzatore

Il nucleo richiede **un asse binario risolto da un elemento aleatorio contro una soglia nominale**. Come sia fatto quell'elemento è un profilo.

### A1 — d20 piatto *(predefinito)*

```
totale = 1d20 + valore del verbo + impedimento   ≥   CD
```

| Etichetta | CD |
|---|---|
| **Facile** | 8 |
| **Impegnativa** | 12 |
| **Ardua** | 16 |
| **Estrema** | 20 |

Il passo costante di 4 vale esattamente il **20%**: un gradino di difficoltà si sente sempre allo stesso modo, ovunque nel gioco. **Il 1 naturale fallisce sempre, il 20 naturale riesce sempre** — pavimento e soffitto, non critici.

**Cosa comporta, e va detto per intero.** Il valore di un verbo va da +0 a +8; la deviazione standard di 1d20 è **5,77**. La competenza massima vale quindi **1,39 sigma**: se un Inesperto e un Maestro tirassero sulla stessa prova, **l'Inesperto farebbe meglio nel 16,5% dei casi.**

È deliberato, e la ragione è la leggibilità. Ma comporta il requisito §24.4: **la competenza non protegge sul singolo tiro, riduce quanti tiri servono — e quell'effetto va reso visibile o non esiste per chi gioca.**

### A2 — d20 con pavimento di competenza

Identico ad A1, ma a partire da un livello dichiarato i risultati del dado sotto una soglia si leggono come la soglia.

*Compra:* il realismo della competenza. Un maestro smette di fallire in modo assurdo, che è ciò che la competenza vera produce — comprime la varianza, non sposta la media.
*Costa:* si perde la proprietà «ogni gradino vale il 20% ovunque», e la tabella delle probabilità va ricalcolata.
*Quando sceglierlo:* quando il realismo è un pilastro dichiarato e la leggibilità può cedere qualcosa.

### A3 — Dadi a campana (3d6, 2d10)

*Compra:* la competenza pesa molto di più vicino al centro della distribuzione; gli esiti estremi diventano rari, che è realistico.
*Costa:* i gradini di difficoltà smettono di valere la stessa cosa; il 5% che tiene aperta ogni porta sparisce, e con esso **il §2.6 va riverificato**; e la matematica non si spiega più a schermo in tre secondi.
*Quando sceglierlo:* per finzioni dove l'incompetenza deve essere davvero preclusiva. **Attenzione: è il profilo che rischia di reintrodurre i muri.**

### Il profilo predefinito, e perché

**A1.** Il linguaggio del d20 si spiega da solo, regge la trasparenza che la tesi §2.2 richiede, e mantiene il 5% che impedisce a qualunque prova di diventare un muro. A2 è la scelta giusta per un progetto che metta il realismo sopra la leggibilità.

## 18. Modulo B — La scala di competenza

### B1 — Cinque livelli *(predefinito)*

| Livello | Valore | Significato |
|---|---|---|
| **Inesperto** | +0 | non l'hai mai fatto davvero |
| **Incerto** | +2 | ci hai provato qualche volta |
| **Pratico** | +4 | sai farlo |
| **Esperto** | +6 | l'hai fatto molte volte |
| **Maestro** | +8 | ti è stato insegnato |

Le probabilità reali:

| | Facile | Impegnativa | Ardua | Estrema |
|---|---|---|---|---|
| **Inesperto** | 65% | 45% | 25% | 5% |
| **Incerto** | 75% | 55% | 35% | 15% |
| **Pratico** | 85% | 65% | 45% | 25% |
| **Esperto** | 95% | 75% | 55% | 35% |
| **Maestro** | 95% | **85%** | 65% | 45% |

Tre proprietà volute: il massimo della padronanza su una prova Impegnativa vale **85% e non di più** — nulla è mai certo; il salto a Maestro vale circa **10% ovunque**, quindi cercare chi insegna è una scelta razionale; un verbo Inesperto contro una prova Estrema resta al **5%**, cioè tentabile.

### B2 — Tre livelli (+0 / +3 / +6)

*Compra:* una scheda che si legge in tre secondi e una crescita a scatti percepibili.
*Costa:* meno spazio per la crescita, e la silhouette (§21.5) diventa più grossolana.
*Quando:* partite brevi, finzioni a episodi, giochi dove la competenza non è il tema.

### B3 — Binario (sai / non sai)

*Compra:* la massima chiarezza. La competenza non è una quantità, è una porta.
*Costa:* si perde tutto il modulo crescita, o quasi.
*Quando:* one-shot, giochi dove il personaggio è dato e non evolve.

## 19. Modulo C — Il contenitore

⚠️ **DEVIAZIONE D12.** *Il contenitore era un capitolo di motore.* Non lo è: è la parte meno portabile del sistema. Ma la sua **grammatica** si trasporta interamente, ed è quella che il nucleo prescrive.

**Il contenitore è l'unità di gioco: la struttura dentro cui il motore gira.**

> **Non esistono sistemi paralleli. Esistono ingredienti dell'Esposizione del contenitore.**

Nelle architetture consuete il tempo, il consumo, il logorio e gli incontri sono sistemi separati, ognuno col suo contatore, che convivono senza parlarsi e che il giocatore deve sorvegliare uno per uno. Qui **confluiscono in un solo indicatore visibile**.

### 19.1 La grammatica obbligatoria — vale per ogni profilo

1. **È una sequenza di passi dichiarati.** Il passo è l'unità; il tempo è la **conseguenza** del passo, non la sua misura. *(Il ritmo diventa progettato invece che statistico.)*
2. **Ha un profilo, sempre disponibile, a tre risoluzioni.** La conoscenza **non accende il profilo: ne cambia la nitidezza.**
3. **L'incertezza sta nella previsione, mai nel tiro.** Dentro un passo, l'Esposizione e la ricevuta sono esatte, sempre.
4. **Almeno due percorsi fra ogni coppia di punti collegati.** Regola autoriale, non possibilità.
5. **Ogni passo offre una leva.** Non esiste il turno in cui l'unica cosa da fare è «avanti».
6. **Ogni terreno ha due facce**, e i due valori non coincidono e talvolta si invertono: *quanto costa attraversarlo* e *che riparo offre a fermarsi*.
7. **L'attesa costa**, su due piani: consumo locale e scadenze dichiarate. *Se aspettare non costa niente, si aspetta sempre, e la preparazione muore.*

### 19.2 I profili

| Profilo | Il passo è | Il profilo a tre risoluzioni è |
|---|---|---|
| **C1 — Il percorso** | un tratto di strada | quante tappe, che terreni, quali ripari |
| **C2 — La stagione** | un'occasione (un'udienza, una cena, una caccia) | chi ci sarà, e cosa vi si deciderà |
| **C3 — Il caso** | una pista | dove porta, e se è già stata battuta |
| **C4 — L'incarico** | una fase del lavoro | cosa richiede, chi c'è dentro |

**Tutti e quattro soddisfano le sette proprietà.** È il risultato che rende il modulo credibile: la grammatica non è stata scritta per il percorso e poi adattata — regge una stagione di corte e un'indagine senza eccezioni.

### 19.3 La frazione del passo

> **Un passo si divide in un numero dichiarato di frazioni. Uno scambio di confronto, un'azione di riposo, un'attesa deliberata consumano una frazione.**

⚠️ **DEVIAZIONE D7.** *La frazione non esisteva.* Senza di essa, un confronto che si stabilizza non ha nulla con cui essere rotto dall'esterno, perché nel modello il tempo non scorre mai dentro un passo. **Preserva alla lettera «niente si muove finché il giocatore non decide»** — non si muove *mentre* pensa, si muove *quando* decide — e restituisce all'attesa il suo costo.

### 19.4 L'arrivo

> **Non è il percorso che premia: è il percorso che decide in che stato ti presenti.**

**Non si dà nessuna ricompensa per essere arrivati**: darla trasformerebbe il tragitto in un compito da spuntare.

## 20. Modulo D — Il lessico

Il nucleo fissa la firma di un verbo (§7); il lessico è dati. Ma un lessico valido soddisfa cinque vincoli.

1. **Da otto a sedici verbi.** Sotto gli otto le vie di un ostacolo si somigliano; sopra i sedici il giocatore non ricorda la propria scheda.
2. **Da tre a cinque ceppi, dichiarati dall'ambientazione, con almeno due verbi ciascuno.**
3. **Almeno un verbo con Fondo *Allo scoperto*** — l'azione che nessuna preparazione può rendere pulita. Ogni finzione ne ha una; nominarla è metà del suo tono.
4. **Almeno metà dei verbi ha base *Coperto*, e non più di due hanno base *Allo scoperto*** (N9.a). È lì che vive la leva del giocatore: un verbo a base massima è permanentemente saturo, e la preparazione ci atterra una volta su quattro.
5. **Nessun verbo copre un dominio che un altro copre già.** Se due verbi si scelgono con la stessa domanda, uno è di troppo.

⚠️ **DEVIAZIONE D2.** *I ceppi erano quattro e fissi.* Quattro è la partizione dell'**azione incarnata**, e ci sono finzioni in cui una di quelle categorie è strutturalmente magra.

**Vincolo che ne discende:** se in una finzione un ceppo è magro — poche vie in poche scene — **va dichiarato**, perché altrimenti la silhouette di fine partita (§21.5) smette di essere una scelta del giocatore e diventa una proprietà del mondo che nessuno gli ha detto.

**Nota di compilazione, non limite:** un dominio d'azione non deve necessariamente coprire tutti i ceppi. Una disciplina — magia, arte, mestiere — può occuparne tre su quattro. **È legittimo, e va dichiarato** invece di essere scoperto dal giocatore come una mancanza.

## 21. Modulo E — La crescita

> **È il modulo che nella 1.0 aveva l'aria di un buco. Non era un buco: erano profili mancanti.**

### 21.1 Le tre fonti — la grammatica comune

Quando un profilo prevede la crescita, essa passa da tre fonti e non da altre:

| Fonte | Mestiere |
|---|---|
| **Uso** | **l'altezza.** Fare le cose rende competenti. Accumula da solo, sul verbo che si usa, **sui soli successi** |
| **Punti** | **l'ampiezza.** Indirizzare: coprire una lacuna, tenere vivo un verbo che non si usa mai. È il canale con cui il giocatore dice *chi voglio essere* invece di subire *chi sono diventato* |
| **Insegnamento** | **lo sblocco.** L'ultimo gradino non si conquista: si riceve |

E i pagatori sono tre, e non si sovrappongono mai:

> **La storia paga in persona. Il mondo paga in cose. Le persone pagano in accesso.**

Se il mondo pagasse in punti, esplorare sempre tornerebbe a essere la mossa ottimale. **Il livello del personaggio è quanti punti ha ricevuto**: non esiste un contatore di esperienza, non esiste una barra. Il livello è **un resoconto**.

### 21.2 I profili

| Profilo | Come cresce | Quando sceglierlo |
|---|---|---|
| **E1 — Arco lungo** *(predefinito)* | uso + punti + insegnamento, con curva progressiva | una partita continua di decine di ore |
| **E2 — A soglie narrative** | nessun accumulo: la competenza sale nei momenti che l'autore ha scritto | quando la crescita deve essere un fatto di trama e non un conto |
| **E3 — Fissa** | il personaggio non cresce | one-shot, finzioni a episodi, protagonisti già formati |
| **E4 — Per studio** | l'insegnamento a rate: il tempo dedicato produce competenza senza passare dal fare | finzioni dove la biblioteca, la bottega o il maestro sono metà del genere |

### 21.3 E1 — Arco lungo

**Salire costa di più a ogni gradino**, e non è una scelta estetica: senza correzione, il verbo alto accumula quasi il doppio a parità di tentativi, e il forte diventerebbe più forte mentre quello scoperto resta dov'è.

⚠️ **DEVIAZIONE D9.** *Si affermava che la correzione rendesse «piatto il costo in tentativi lungo tutta la scala».* Non può esserlo su tutte le difficoltà insieme:

| Difficoltà | Inesperto → Esperto | Curva richiesta |
|---|---|---|
| Facile | 65% → 95% | ×1,46 |
| Impegnativa | 45% → 75% | ×1,67 |
| Ardua | 25% → 55% | ×2,20 |
| Estrema | 5% → 35% | ×7,00 |

> **La proprietà vale rispetto a un mix di difficoltà dichiarato, e quel mix è un parametro dell'ambientazione.**

### 21.4 E3 e E4 — i due profili che mancavano

**E3 — Fissa.** In una finzione a episodi — un caso per sessione, un incarico per sessione — un arco lungo non ha dove stare: su un episodio non cresce niente, su venti cresce troppo. **Il profilo fisso è una scelta legittima e non una rinuncia**: cancella il modulo E per intero, e con esso la silhouette. Il personaggio è definito una volta, e il gioco sta tutto nelle situazioni.

*Variante ammessa:* crescita **fra** gli episodi e non dentro, con punti versati dalla chiusura di un episodio. È E1 con l'episodio al posto del nodo di trama.

**E4 — Per studio.** Il motore fa accumulare l'uso **sui soli successi**, quindi la competenza acquisita leggendo, osservando o esercitandosi al chiuso non ha casa. Per una finzione con una disciplina è metà del genere.

> **Lo studio è insegnamento a rate.** Passa dalla sola fonte che non richiede il fare, e ne eredita il vincolo: *l'ultimo gradino si riceve, non si conquista* — qui il maestro è un libro, una bottega, un ordine, e le rate sono tempo dichiarato dentro il contenitore.

*Ne discende una proprietà che vale la pena avere:* lo studio **costa passi**, quindi compete con tutto il resto. In una finzione dove la conoscenza è potere, la decisione *resto a leggere o esco* diventa la decisione centrale del gioco, e non serve nessun sistema per produrla.

### 21.5 La silhouette — vale per E1 ed E4

Non è una regola: è un **bersaglio dichiarato**, cioè un vincolo per chi tara e non un divieto per chi gioca.

**A fine partita: un verbo a Maestro, due a Esperto, tre a Pratico, il resto basso.**

La ragione è strutturale. L'ostacolo a strati esiste perché il giocatore debba scegliere *da dove*, e quella scelta ha senso solo se alcune vie gli sono precluse o care. **Un personaggio competente in tutto non sceglie più da dove: il nodo a più vie diventa un menù.**

> **I verbi rimasti bassi non sono una mancanza: sono i motivi per cui alla quarantesima ora la scelta della via pesa ancora quanto pesava alla prima.**

E un guadagno che non si è pagato: con metà dei verbi scoperti, **una seconda partita è un'altra persona** senza che serva progettare nulla.

## 22. Modulo F — Il logorio, i danni e il confronto

### 22.1 Logorio e danni — la grammatica comune

> **Il logorio è un livello. Il danno è un'entità.**

| | **Logorio** | **Danni** |
|---|---|---|
| Cosa sono | ciò che sale da solo | ciò che capita, e ha una causa |
| Forma | un **livello** a gradi detti a parole | **entità distinte**, se ne può avere più d'una |
| Rimedio | una routine | una cura |
| Effetto | entra nell'Esposizione | entra nel tiro, e dichiara **cosa impedisce** |

**Il criterio che fissa quanti livelli di logorio esistono: una traccia per ogni rimedio distinto.** Nessun indicatore senza una leva che lo muova.

**I gradi si dicono a parole.** Una ricevuta che dicesse «+0,37 perché il logorio è a 63» non direbbe niente a nessuno.

**Al grado estremo il logorio cambia natura** e diventa Impedimento sul tiro. *L'ultimo gradino non è un po' peggio del penultimo: è un'altra cosa*, e questo lo rende temuto invece che semplicemente costoso.

**E la traversata vale nei due sensi:** un danno singolo va sul tiro, ma **i danni al grado estremo vanno sull'Esposizione** — perché a quel punto non è più il danno, è il corpo.

> **Finché sei danneggiato, il mondo non ti trova più facilmente. Quando sei ridotto male, sì.**

**L'Impedimento** vale −2, non è mai globale, e ha un tetto:

> **Ogni danno dichiara cosa impedisce, e il −2 vale sui soli verbi che quel danno tocca. Il cumulo su un singolo verbo non può superare −6.**

⚠️ **DEVIAZIONE D6.** *Il tetto non era dichiarato.* La ragione del valore: −6 azzera un Esperto senza portarlo sotto zero. **L'Impedimento massimo può annullare la competenza, non invertirla.** Senza il tetto, il danno diventa una riserva mascherata — cioè la cosa che il §2.4 esclude.

> **Un danno non ti rende peggiore. Ti toglie una via.**

### 22.2 Dove vive il logorio — i profili

| Profilo | Il logorio sta | Esempio di livelli |
|---|---|---|
| **F1 — Nel corpo** | in chi gioca | fame · sete · stanchezza |
| **F2 — Nella posizione** | in ciò che chi gioca occupa | credito · sfinimento · pazienza di chi ti protegge |
| **F3 — Nell'oggetto del gioco** | nella cosa su cui si lavora | il caso che si raffredda · la pressione dall'alto · la credibilità |

**F3 non era previsto e il motore lo regge**, il che è un buon segno sulla sua astrazione: il logorio non deve stare in un corpo per funzionare, deve solo salire da solo e avere un rimedio distinto.

### 22.3 Restare senza, e dove vive la fine

> **Il contenitore non si fallisce: si paga.**

Al grado estremo, ogni passo il gioco chiede una **prova di resistenza**: annunciata, con la probabilità in chiaro, e **con la via d'uscita dichiarata accanto**. Non è un contatore che scade in silenzio: è una decisione che si continua a prendere a occhi aperti.

> **Non si finisce perché la prova è diventata impossibile. Si finisce perché il prezzo del fallimento è salito fino in fondo.**

## 23. Modulo G — Il confronto

**Può essere assente.** Una finzione senza opposizioni che reagiscono non lo istanzia, e il motore funziona lo stesso. Dove c'è, non è un motore in più: è il comportamento del nucleo quando l'ostacolo ha una volontà.

### 23.1 Il principio

> **Un confronto non è togliere qualcosa a qualcuno. È creare il momento in cui l'azione decisiva costa poco.**

Non è una riformulazione poetica: è aritmetica del Fondo. Se l'azione decisiva della finzione ha Fondo *Allo scoperto*, farla di continuo è la strategia peggiore disponibile — **e non perché qualcuno l'abbia vietata.**

### 23.2 Lo scambio

> **Uno scambio è una tua decisione risolta, più quello che l'altro fa dopo.**

Comincia sempre da te. Se non decidi niente, non succede niente. **L'alternanza è un turno, e va chiamata col suo nome:** quello che questo motore non ha non è il turno, è **l'orologio**.

**E la reazione è una sola, quanti che siano.** Il numero degli avversari non moltiplica le azioni: **è la tua Esposizione.** Tre addosso non vuol dire tre attacchi, vuol dire che non esiste un posto in cui tu sia coperto.

⚠️ **Nota di taratura onesta.** Nella prima applicazione questa regola ha prodotto una differenza misurata fra un avversario e quattro pari al **4%** in logorio medio: l'aggravante del numero satura presto. La differenziazione reale vive **nella mortalità, non nell'attrito**. Chi adotta il motore lo sappia: *quanti sono* non è una scala, è un interruttore che si accende una volta.

**Da cui la regola di compilazione, nuova in 1.3:**

> **Il numero alza il prezzo delle uscite, non ne toglie nessuna.** Andarsene contro quattro resta sempre possibile e non si tira (§23.7); costa più Traccia, l'obiettivo lasciato dietro, una posizione persa. La differenziazione vive **nel conto dell'uscita**, non nella sua disponibilità.

⚠️ **DEVIAZIONE D23.** *La correzione che viene in mente per prima è far chiudere delle vie al numero,* e va rifiutata: quattro avversari che chiudono vie prima o poi ne chiudono l'ultima, e quello è il muro che il §2.6 vieta. **Il numero è un prezzo, mai una porta.** Nell'attrito non può differenziare — l'Esposizione satura e non esiste un quarto livello — e continuare a cercarvelo significa combattere l'aritmetica del §12.1.

### 23.3 Non si logora, si scopre

> **Non esiste la domanda *quanto gli manca*. Esiste la domanda *quanto è coperto*.**

L'Esposizione è **reciproca**. E i due mestieri sono diversi:

> **La tua Esposizione decide cosa ti costa. La sua decide se l'azione decisiva vale qualcosa.**

| Se l'altro è | e la tua prova riesce |
|---|---|
| **Coperto** | scende a *Esposto*: lo costringi a muoversi, a reagire, a uscire da dove stava |
| **Esposto** | scende ad *Allo scoperto*, **e la finestra è aperta** |
| **Allo scoperto** | è già aperto: quello che fai adesso lo **spende** |

**Nessuna azione è sprecata, e nemmeno il fallimento, purché tu sia coperto:** un fallimento pulito dentro un confronto consegna **una leva**. Non hai imparato a fare meglio: hai capito da dove si apre. È la risposta alla domanda *cosa faccio da coperto*, ed è ciò che rende il tempo al riparo un investimento invece che un'attesa.

### 23.4 La promessa regge anche qui

> **Da Coperto il dado non può rovinarti.**

È la promessa che il confronto rompe per prima in quasi tutti i sistemi. Qui non si rompe: **finché sei coperto, chi ti sta davanti non ha nessuna leva su di te.** Non per gentilezza — perché non ti raggiunge.

**E *coperto* va letto largo**, o il confronto funziona solo contro avversari che ragionano:

> **Coperto vuol dire che non ti può arrivare addosso. Come mai non ci arrivi, lo dichiara la scena.**

Un muro, un'altezza, un passaggio dove possono venire uno per volta, una regola sociale che protegge, un testimone la cui presenza impedisce. *Nascosto* è il caso più comune, non la definizione.

**Quando ti raggiunge**, il gioco chiede a **te** una prova di resistenza — annunciata, con la probabilità in chiaro, con la via d'uscita accanto. **Il dado resta sempre nella mano del giocatore.**

### 23.5 Le due nature

> **Chi ti sta davanti non ha due mosse. Ne ha una, e quale sia lo dice la sua natura.**

| | Cosa fa quando tocca a lei | Cosa non fa mai |
|---|---|---|
| **Chi si chiude** | si ricopre, se è scoperta. Ti viene addosso solo se sei alla sua portata | non avanza allo scoperto senza un motivo |
| **Chi avanza** | avanza. Se non ti raggiunge si avvicina, **e avvicinarsi la scopre di un gradino da sola** | non si ricopre mai |

> **Chi si chiude lo devi aprire tu, e per aprirlo devi esporti. Chi avanza si apre da solo — e ti si apre addosso.**

Non è una meccanica in più: è **come si legge la prima voce della firma**. Chi si chiude dichiara quanto è difficile scoprirlo, chi avanza dichiara quanto ci mette ad arrivarti. Stessa domanda, letta nei due sensi.

**Senza questa distinzione il sistema si blocca:** se chi ti sta davanti potesse sempre ricoprirsi, risalirebbe esattamente il gradino che gli hai tolto, e nessun confronto si aprirebbe mai.

**Contro chi si chiude, restare coperti è uno stallo dichiarato**, e va bene così: nessuna regola lo rompe, perché una regola del genere sarebbe un orologio. Lo rompe **quello che stava già scorrendo** — il logorio, le scadenze, la Traccia — attraverso la frazione di passo (§19.3), oppure lo rompi tu.

> **Il confronto non ha fretta. Il contenitore sì.**

⚠️ **DEVIAZIONE D28.** *Questo è un assunto sull'ambientazione, e nessun validatore lo controllava.* Un'ambientazione può soddisfare tutti i controlli sui dati e tutte le invarianti e contenere lo stesso un confronto in una stanza dove non scade niente, il logorio non sale e la Traccia non conta: lì restare coperti è la strategia dominante, e il motore non ha nulla per accorgersene. Da cui **V15**, e il numero che lo accompagna nella voce 8 della firma.

### 23.6 La firma di un avversario

Quattro voci. Nessun punto vita, nessun attacco, nessuna difesa.

| Voce | Dichiara |
|---|---|
| **Cosa lo copre** | quanto è difficile scoprirlo. Per chi avanza si legge al contrario: **quanto ci mette ad arrivarti** |
| **Cosa lo scopre** | quali leve funzionano, e **quanto lo muovono** |
| **Cosa costa avvicinarlo** | la sua minaccia, come Esposizione e come CD della prova di resistenza — **mai come danno** |
| **Cosa vuole, e cosa lo fa smettere** | il movente, e con esso le sue uscite — **e se tiene la parola data** |

⚠️ **Vincolo di compilazione, e non è taratura fine.** Chi si chiude risale un gradino a scambio. **Una leva che ne scopre uno solo rende quell'avversario impossibile, non difficile.** Chi compila non sta decidendo quanto è duro: sta decidendo **se è affrontabile.**

**La quarta voce non si lascia mai vuota**, e va riempita anche per chi non ascolta:

> **Tutto ciò che ha una volontà vuole qualcosa. Ma non tutto ciò che vuole qualcosa ti ascolta.**

| | Lo si ferma con |
|---|---|
| **Chi ti ascolta** | le parole, lo scambio, la minaccia |
| **Chi non ti ascolta** | il **costo**: il rumore, il fuoco, una preda più facile, uno dei suoi che si fa male |
| **Ciò che non vuole niente** | niente. Non si ferma: **si evita** |

Nell'ultima riga non c'è nessun avversario: c'è il freddo, la carestia, il tempo. **Ciò che non ha porte non è un avversario: è il mondo.**

### 23.7 Come finisce

> **Uno dei due non può più. Uno dei due non vuole più. Uno dei due non c'è più.**

| Famiglia | Se tocca a lui | Se tocca a te |
|---|---|---|
| **Non può** | fermato, disarmato, rovinato | la casella in fondo alla griglia — **e ci si arriva solo per accumulo** |
| **Non vuole** | desiste, si accontenta, accetta uno scambio | molli, paghi, accetti le sue condizioni |
| **Non c'è** | si ritira dove non lo segui | te ne vai, con quello che ti costa |

**Si legge identica nei due sensi.** Le tre facce in cui vinci sono le stesse in cui perdi, con le stesse parole.

> **Ogni uscita nuova deve dichiarare in quale famiglia sta.** Se non ci sta, o non è un'uscita, o la griglia è sbagliata.

**E una delle tre è la via povera del confronto**, perché N11 vale anche qui e nessuna riga lo diceva:

> **Andarsene è sempre disponibile, non si tira, e costa.** È la via senza prerequisiti che il §14 impone a ogni ostacolo: quello che varia non è la riuscita, è il **prezzo** — Traccia, obiettivo mancato, posizione persa, e tanto più caro quanti sono (§23.2). **Un confronto in cui andarsene richiede un tiro è un errore di dati**, non una scena tesa.

⚠️ **DEVIAZIONE D24.** *Il Modulo G non dichiarava quale uscita soddisfacesse V1.* Le due sempre disponibili del §23.8 — farlo desistere, trovare un accordo — sono **prove sigillate**, cioè si tirano e si perdono; *prendere quello per cui eri lì* e *andartene* si «tentano», e la finestra le rende gratis solo quando è aperta; e quando l'avversario ti raggiunge il §23.4 chiede una prova di resistenza. Un confronto poteva quindi soddisfare I2 — una via d'uscita **disponibile** esiste — e violare V1, che ne chiede una **non tirata**. Era il muro del §2.6, nel modulo dove la promessa è più difficile da mantenere e più facile da rompere senza accorgersene.

### 23.8 La finestra, e la colonna di mezzo

> **La finestra non ti dà un'azione. Ti dà un momento in cui decidi tu.**

Il momento di massimo potere è **il momento della decisione**, non quello dell'esecuzione. Almeno quattro possibilità: **chiuderlo · togliergli il mezzo · prendere quello per cui eri lì · andartene mentre non può seguirti.** Le ultime due si possono tentare sempre; la finestra non le rende possibili, **le rende gratis**.

**E due uscite non passano dalla finestra affatto** — *farlo desistere* e *trovare un accordo* — disponibili in qualunque momento, anche da coperti, anche mentre si sta perdendo. **Se falliscono, quella porta si chiude in questo confronto**: sono prove sigillate. Se si potesse ritentare, parlare sarebbe la mossa gratis che si prova sempre per prima.

**Un accordo si può tradire, ma mai per sfortuna:** chi tradisce era già dichiarato tale nella sua firma. Non è un tiro nascosto: è un'informazione che stava lì.

> **La colonna di mezzo è la più larga, ed è una decisione di produzione.** Nella realtà quasi nessun confronto finisce con qualcuno tolto di mezzo: finisce perché uno dei due ha smesso di volerlo. **La maggior parte del testo di un confronto non descrive ferite: descrive gente che si ferma.**

### 23.9 La durata, e a cosa serve crescere

> **Un confronto non dura quanti colpi regge. Dura quanto è difficile aprirlo.**

E i **danni sono il vero orologio**.

> **Un fallimento allo scoperto produce un danno. Produce la fine solo quando il danno non ha più dove andare.**
>
> **Chi finisce ha sempre avuto almeno uno scambio in cui poteva andarsene.**

E la risposta alla domanda che nasce dal §2.5:

> **Non cresci per vincere i confronti. Cresci per uscirne con meno addosso.**

Un principiante apre la finestra al quarto tentativo, e ci arriva con tre danni. Uno bravo la apre al primo. **Stessa opposizione, stessa CD, stessa scena, conto completamente diverso.** E più verbi alti significa **più leve**.

> **Il confronto non diventa mai una buona soluzione. Diventa una soluzione che si sopravvive.**

### 23.10 Nessun confronto comincia pari

> **Comincia con le posizioni che vi siete guadagnati prima che cominciasse. Chi vede per primo comincia coperto.**

Non serve una regola nuova: è **un'attenuante**, con il suo nome nella ricevuta, e vale nei due sensi.

> ⚠️ **Vincolo duro: un agguato non apre mai con la fine.** Apre con una **posizione**. Male quanto la scena vuole, ma con una decisione ancora in mano. Un gioco che chiude prima che il giocatore abbia deciso qualcosa ha messo un muro.

## 24. Modulo H — Il testo, e la trasparenza

### 24.1 I profili

| Profilo | Come si produce il testo | Quando |
|---|---|---|
| **H1 — Composito da banchi** *(predefinito)* | quattro segmenti indipendenti pescati da banchi filtrati dal contesto | quando il volume è il problema, cioè quasi sempre |
| **H2 — Scritto a mano** | ogni esito ha il suo testo | contenuti brevi, one-shot, nodi irreversibili |
| **H3 — Misto** | banchi per il ricorrente, mano per l'irreversibile | il caso reale della maggior parte dei progetti |

### 24.2 H1 — Il testo composito

| Segmento | Da dove viene |
|---|---|
| **Gesto** | dal Verbo |
| **Esito** | dalla casella della griglia |
| **Strascico** | dalla complicazione estratta |
| **Ancora** | dal contesto: luogo, momento, stato |

> **Regola di scrittura, ferrea: ogni segmento è una frase intera e autosufficiente, giustapposta alle altre. Mai un buco da riempire dentro una frase.**

È la regola che evita il sapore di testo generato: **le giunture grammaticali non esistono perché non ci sono giunture.**

**Il banco delle complicazioni** non è un ripiego per risparmiare lavoro: **è il vero contenuto del gioco.** Ogni complicazione dichiara **quando può uscire**, **su quale asse morde**, e **quando morde** — subito o differito di un numero dichiarato di passi. L'ultima è la categoria che manca a quasi tutti i sistemi: **complicazioni che non mordono adesso**, e che arrivano quando non si può più tornare indietro.

### 24.3 Il dimensionamento — leggerlo bene

⚠️ **DEVIAZIONE D15.** Quattro slot con otto varianti producono oltre quattromila combinazioni. **Quella cifra misura la combinatoria, non la varietà percepita.** Le varianti sono filtrate dal contesto, e ciò che il giocatore percepisce è la ripetizione **dentro uno slot, in un contesto**.

| Varianti valide in contesto | Prove per partita | Volte che rilegge la stessa frase |
|---|---|---|
| 8 | 300 | 38 |
| 5 | 300 | 60 |
| 3 | 300 | **100** |

> **Il vincolo che morde è il numero di varianti per contesto, non la dimensione del banco.**

La regola d'igiene — *non riproporre l'ultima uscita nello stesso contesto* — impedisce l'adiacenza, non la ripetizione.

**E il numero che si dichiara è l'altro**, perché è quello che il giocatore sente:

> **Si dichiara quante volte al massimo il giocatore può rileggere la stessa frase in una partita. Le varianti per contesto si derivano da lì**, con la lunghezza attesa della partita — non il contrario.

⚠️ **DEVIAZIONE D25.** *V12 chiedeva un numero di varianti, che è la stessa cifra letta dal lato sbagliato.* Un banco dimensionato in varianti dichiara un lavoro; un banco dimensionato in riletture dichiara **un'esperienza**, ed è la sola forma in cui il vincolo si può discutere con chi scrive. Vale come I7 e I8: la soglia è obbligatoria, il suo valore è dell'ambientazione. *(E chi la dichiara si ricordi che il costo di scrittura del gioco vive qui, non nelle tabelle: la derivazione azzera il costo della posizione **per nodo**, non il costo del testo.)*

**E l'LLM sta in produzione, mai a runtime.** Popola i banchi in fase di scrittura; l'autore rivede, taglia e **congela**. La generazione a runtime è esclusa per tre ragioni che non riguardano la qualità della prosa: può contraddire lo stato del mondo, rende il salvataggio non deterministico, e toglie all'autore il controllo finale.

### 24.4 Le due superfici di trasparenza, e il requisito che nasce dal dado

| | Dice | Quando |
|---|---|---|
| **La ricevuta dell'Esposizione** | *perché costerà quello che costerà*, riga per riga | **prima** di agire |
| **Il resoconto della conseguenza** | *cos'è appena successo, e chi l'ha pagato* | **dopo**, e ospita la mitigazione (§25) |

**Due regole vincolanti sulla prima.** La prima: ogni voce deve poter essere detta in una frase breve, senza abbreviazioni e senza icone. **Se non si riesce a dirla a parole, quel modificatore non deve esistere.** E ogni voce inerte si dichiara (N9.c).

La seconda la 1.2 la mostrava per esempio e non la enunciava:

> **Ogni voce nomina una causa della finzione. Il numero è l'annotazione, non la voce.**
> *«Questo posto ti conosce»*, non *«+1 zona»*.

⚠️ **DEVIAZIONE D26.** *È la riga che separa un sistema **trasparente** da un sistema **visibile**.* Un sistema trasparente si impara giocando e restituisce al giocatore le cause del mondo; un sistema visibile mostra le proprie cuciture, e il giocatore smette di chiedersi *cosa farebbe il personaggio* per chiedersi *come scendo di un gradino*. La differenza non sta in quanto si mostra — questo motore mostra tutto — ma **in che lingua**.

> ⚠️ **Requisito duro (D14): l'interfaccia deve rendere leggibile quanti tentativi sono stati spesi, e quanti se ne spendevano prima.**

Poiché la competenza si manifesta come **tentativi risparmiati** e non come tiri migliori (§11), quell'effetto va reso visibile o non esiste per chi gioca — e il giocatore concluderà che il gioco è casuale, avendo torto sui fatti e ragione sull'esperienza.

⚠️ **DEVIAZIONE D27 — e dice *prima di che cosa*, che la 1.2 non diceva.** Il confronto è con **il proprio passato sullo stesso verbo**: non una media simulata, non un altro personaggio, non un'altra partita.

```
Hai forzato la porta.                          1 tentativo
La prima volta che ne hai forzata una così:    4 tentativi
```

È l'unico controfattuale che il gioco possiede senza uscire dalla partita, e costa tenere, per verbo, il conto dei tentativi delle prime volte. **Se questa superficie manca, il modulo E è invisibile e la tesi §2.5 non è verificabile da chi gioca** — che è l'unico posto in cui doveva esserlo.

**E il ritmo:**

> **Niente si muove finché il giocatore non decide.**

Il banco del confronto **si indicizza sulle transizioni, non sugli stati**: *«esce dalla copertura e per un attimo è tutto lì»* è una battuta di una storia; *«è allo scoperto»* è un'etichetta.

## 25. Modulo I — La mitigazione post-esito

**Può essere assente.** Dove c'è, è il quinto stadio della pipeline: tutto ciò che **paga al posto tuo una conseguenza già decisa** — un indumento che ferma un colpo, un patrono che assorbe uno scandalo, un avvocato che converte un'accusa in una multa.

| | |
|---|---|
| **Non annulla, declassa** | la conseguenza grave esce lieve; la lieve non esce |
| **Si consuma** | decorso **a senso unico**: intatto, intaccato, inservibile |

> **Recinto — vincolante: ciò che ripara paga solo sul danno. Mai sul tiro, mai sull'Esposizione, mai sull'esito.**

⚠️ **DEVIAZIONE D10.** *Questo livello era stato scoperto in un capitolo di applicazione.* Senza il recinto diventa la porta di servizio da cui rientrano le riserve: due punti vita cuciti dentro una giacca.

---
---

# PARTE IV — LA FIRMA DI UN'AMBIENTAZIONE

## 26. Cosa si sceglie, e cosa si compila

### 26.1 Le otto scelte di profilo

| Modulo | Profili | Predefinito |
|---|---|---|
| **A — Randomizzatore** | d20 piatto · d20 con pavimento · dadi a campana | A1 |
| **B — Scala di competenza** | cinque livelli · tre · binaria | B1 |
| **C — Contenitore** | percorso · stagione · caso · incarico | — |
| **E — Crescita** | arco lungo · soglie narrative · fissa · per studio | E1 |
| **F — Logorio** | nel corpo · nella posizione · nell'oggetto del gioco | — |
| **G — Confronto** | presente · assente | presente |
| **H — Testo** | composito · a mano · misto | H1 |
| **I — Mitigazione** | presente · assente | assente |

*(Il modulo D — il lessico — non si sceglie: si compila, sotto i cinque vincoli del §20.)*

### 26.2 Le sedici voci da compilare

| # | Voce | Forma |
|---|---|---|
| **1** | **La lettura dell'Esposizione** | una frase: *in questa finzione, essere esposti significa…* |
| **2** | **Il criterio del Fondo** | una frase: *ha un Fondo solo ciò che…* |
| **3** | **I ceppi** | 3–5, con nome, e la dichiarazione di quale sia eventualmente magro |
| **4** | **Il lessico** | 8–16 verbi con ceppo, base e Fondo, sotto i cinque vincoli del §20 |
| **5** | **Le aggravanti** | 3–5 famiglie, ciascuna dicibile in due parole |
| **6** | **La tabella dei luoghi** | un valore per ceppo, dentro i limiti di N9.b |
| **7** | **La tabella dei momenti** | stessa firma |
| **8** | **Il contenitore** | il passo, quante frazioni ha, le sette proprietà del §19.1, ed **entro quante frazioni una pressione raggiunge un nodo di confronto** *(V15)* |
| **9** | **Il logorio** | quali livelli, con quanti gradi a parole, e **un rimedio distinto per ciascuno** |
| **10** | **Il catalogo dei danni** | ciascuno col suo decorso e **cosa impedisce** |
| **11** | **Gli avversari** | le quattro voci del §23.6 e la natura *(se G è presente)* |
| **12** | **Ciò che ripara** | il catalogo della mitigazione *(se I è presente)* |
| **13** | **Il banco delle complicazioni** | dimensionato in **riletture massime per contesto per partita**, da cui si derivano le varianti *(se H1 o H3)* |
| **14** | **Il freno e lo smaltimento** | **due numeri, non uno** — il livello oltre il quale l'Esposizione non alimenta più la frequenza, e ogni quanti passi un accumulo cala di un gradino. Nessuno dei due significa niente senza l'altro (§27) |
| **15** | **Il mix di difficoltà** | la distribuzione attesa delle CD, che tara la curva *(se E1 o E4)* |
| **16** | **Chi versa i punti** | quali nodi, con che taglia *(se E1 o E4)* |

**Nient'altro.** Se una finzione ha bisogno di una diciassettesima voce, delle due l'una: o è un sottosistema privilegiato e va rifiutata, oppure è **una lacuna del motore e va portata in questa specifica come profilo nuovo.**

## 27. L'imprevisto, e il freno

> **L'imprevisto non è una probabilità che rulla per conto suo: la sua frequenza è funzione dell'Esposizione corrente.**

Il caso smette di essere arbitrario e diventa il conto delle proprie scelte: non si può prevedere **cosa** accadrà, ma si sa esattamente **quanto** si sta rischiando. Ne discende che **non serve un sistema di eventi separato**: l'imprevisto è un output dell'Esposizione, non un modulo con le sue probabilità e i suoi cooldown.

**Ma è un anello di retroazione positivo**, e va frenato. ⚠️ **In 1.2 la forma del freno è cambiata**, ed è la correzione più importante di questa revisione.

### 27.1 N12 — Ogni stato che si accumula dichiara come si smaltisce

> **Un accumulatore senza uscita non ha un freno: ha un assorbimento.**

L'Esposizione **non può divergere**: satura per costruzione. Quello che può crescere senza fermarsi è la **Traccia**, che è un serbatoio — entra col rubinetto dell'imprevisto, esce con lo smaltimento. E se lo smaltimento è zero, il serbatoio è monotono crescente qualunque cosa si faccia in entrata.

> **N12 — vale per la Traccia e per qualunque altro stato che si accumuli: ogni accumulatore dichiara il proprio tasso di smaltimento, e quel tasso non può essere zero.**

*(La 1.1 imponeva già «un rimedio distinto per ciascuno» al logorio, ma la Traccia non è logorio: è un asse della conseguenza, e passava dalla fessura fra i due moduli.)*

### 27.2 Il freno è una disuguaglianza, non un tetto

La 1.1 diceva: *«deve esistere una soglia oltre la quale l'Esposizione non alimenta più la frequenza»*. **Un tetto agisce sul flusso in entrata. Con il flusso in uscita a zero, nessun valore del tetto stabilizza niente** — il membro di sinistra si può ridurre quanto si vuole ma resta positivo.

> **La stabilità è un rapporto fra entrata e uscita:**
>
> ```
> f(Coperto) × [ 1 + (guadagno − 1) × freno / 2 ]   <   1 / smaltimento
> ```
>
> dove *guadagno* è il rapporto fra la frequenza dell'imprevisto allo scoperto e quella da coperto, *freno* è il livello oltre il quale l'Esposizione smette di alimentare la frequenza, e *smaltimento* è ogni quanti passi si perde un gradino di accumulo.

**E le stabilità sono due, non una.** Sostituendo `Coperto` con l'Esposizione di partenza si ottiene la stabilità **locale** — regge finché si parte da pulito; nella forma qui sopra si ottiene quella **globale** — regge da qualunque stato. Fra le due c'è un regime che va conosciuto:

> ⚠️ **Il sistema è bistabile: regge finché non capita una brutta giornata, e da lì non torna più.** È alla lettera il muro che il §2.6 vieta, e non è un rischio di taratura: è una regione dello spazio dei parametri in cui si può stare senza saperlo.

⚠️ **DEVIAZIONE D13, e D18 nuova in 1.2.** *Il freno era registrato come requisito e rinviato alla taratura.* Non è taratura: è una questione di stabilità con risposta binaria, e si risponde prima di scrivere una riga di ambientazione. **La voce 14 della firma non è un numero: sono due** — il freno e lo smaltimento — e vanno dichiarati insieme, perché nessuno dei due significa qualcosa senza l'altro.

*Il modello da cui questa disuguaglianza si ricava — il processo, le quattro assunzioni e la derivazione del fattore `/2` — sta nell'**Appendice A**. Senza di esso I6 non era verificabile da nessuno tranne chi aveva scritto la formula, e un'invariante che chiede di indovinare il modello non è un'invariante: è un atto di fiducia.*

**E perché questo non contraddice N1:**

> **L'Esposizione non cambia il dado. Cambia quante volte il mondo ti viene addosso.**

La probabilità di **riuscire** non dipende mai da quanto si è esposti. La probabilità che una prova ti venga **chiesta**, sì.

*Precisazione onesta:* l'Esposizione fa **due mestieri** — la gravità per tiro e la frequenza dei tiri — e solo il primo è locale. Su una partita intera, più Esposizione significa più esiti cattivi, che è ciò che il giocatore percepisce. È corretto, è voluto, ed è la ragione per cui il freno è un requisito e non un'opzione.

---
---

# PARTE V — VALIDATORI E INVARIANTI

> **Tre categorie, e vanno tenute distinte perché la conseguenza di una violazione è diversa in ciascuna.**

| | Se non vale | Come si verifica |
|---|---|---|
| **Vincolo** *(V)* | l'ambientazione non è valida | contando i dati |
| **Invariante** *(I)* | il motore è rotto | simulando |
| **Bersaglio** | l'ambientazione può essere sbilanciata, e non è automaticamente sbagliata | tarando |

*La silhouette del §21.5 è un bersaglio, ed è la ragione per cui non compare in nessuna delle due tabelle qui sotto. La distinzione era implicita nella 1.2; dichiararla costa un capoverso e impedisce di trattare un bersaglio come una regola, che è il modo più comune di irrigidire un sistema per sbaglio.*

## 28. I controlli sui dati

| # | Controllo |
|---|---|
| **V1** | Ogni ostacolo ha almeno una via senza prerequisiti, e quella via non è tirata |
| **V2** | Nessuna prova sigillata è l'unica via di un ostacolo |
| **V3** | Ogni danno dichiara cosa impedisce |
| **V4** | Nessun nodo irreversibile è lasciato al gradino 0 di autorialità |
| **V5** | Per ogni ostacolo, nessuna coppia di esiti differisce solo sul Costo |
| **V6** | Ogni avversario ha tutte e quattro le voci riempite, movente compreso |
| **V7** | Nessuna leva su un avversario che si chiude scopre un solo gradino |
| **V8** | Ogni luogo dove può capitare un'opposizione multipla dichiara dove metterla in fila |
| **V9** | Nel lessico, almeno metà dei verbi ha base *Coperto*, e non più di due hanno base *Allo scoperto* *(N9.a)* |
| **V10** | Per ogni ceppo, `Luogo + Momento` sta in [−2,+2]; ogni luogo ha almeno un ceppo negativo *(N9.b)* |
| **V11** | Ogni stato scritto è letto da almeno un nodo successivo — **niente stato fantasma** |
| **V12** | Ogni slot di banco resta, in ogni contesto raggiungibile, sotto il numero dichiarato di **riletture per partita**; le varianti si derivano da lì *(§24.3)* |
| **V13** | Ogni logorio ha un rimedio distinto, e nessun rimedio ne muove due |
| **V14** | Nessun ritento è ammesso con ricevuta identica alla precedente — *è cambiato ciò che cambia la ricevuta* *(§14)* |
| **V15** | Ogni nodo che può ospitare un confronto è raggiunto da almeno una **pressione attiva** entro un numero dichiarato di frazioni. Pressione attiva è un logorio che sale, una scadenza che scorre, o una Traccia che alza l'Esposizione di quel nodo *(§23.5)* |
| **V16** | Nessun ostacolo offre due vie i cui verbi siano intercambiabili senza cambiare nient'altro: se sostituire l'uno con l'altro lascia identici Esposizione, prezzo e conseguenza, una delle due vie è decorativa |

## 29. Le invarianti di sistema

Proprietà che devono valere **su ogni partita, zero eccezioni**. Si verificano simulando.

⚠️ **Su I7, e vale come avvertimento su tutte.** La 1.2 offriva accanto a I7 un «riferimento misurato: 82,9%». Quel numero veniva dallo stesso dataset che aveva prodotto la regola che I7 controlla, e dichiarare una soglia guardandolo è, parola per parola, ciò che il §30.1 vieta. **Una soglia si sceglie prima di misurare, o non è una soglia: è un resoconto.**

| # | Invariante |
|---|---|
| **I1** | Da *Coperto*, nessun esito produce un danno |
| **I2** | Non esiste uno scambio senza via d'uscita disponibile |
| **I3** | Nessuna partita raggiunge la casella terminale prima della prima decisione del giocatore |
| **I4** | Fuori da un agguato, non si raggiunge la casella terminale al primo scambio |
| **I5** | L'Esposizione non compare in nessuna formula che produca una probabilità |
| **I6** | Il loop del §27 converge, per tutti gli intervalli di parametri dichiarati |
| **I7** | Fra le situazioni in cui il giocatore ha **un motivo di prepararsi**, la preparazione atterra in almeno l'X% dei casi, con X dichiarato **prima di misurare** *(§30.1)* |
| **I8** | Il **pedaggio** — il primo gradino comprato non atterra e il secondo sì — resta sotto Y%, con Y dichiarato, **oppure è interamente coperto da N9.c** |
| **I9** | Ogni stato che si accumula ha uno smaltimento dichiarato e diverso da zero *(N12)* |
| **I10** | Fra le politiche di gioco dichiarate, **nessuna domina tutte le altre su tutte le metriche dichiarate insieme** *(§30.2)* |

## 30. Il metodo

### 30.1 La regola che governa tutte le altre

> **Un criterio dichiarato dopo aver visto il risultato non ha validato niente.**

Chi mette alla prova questo motore scriva il criterio **prima**, con seme fisso, e **non cancelli i criteri falliti**: si aggiunge quello riformulato accanto, e si spiega. Un criterio fallito e riscritto in silenzio è la cosa che distingue una verifica da una cerimonia.

E si usino **più giocatori automatici in concorrenza**, mai uno solo: *un solo giocatore automatico non misura il motore, misura il giocatore.*

### 30.2 Che cosa si guarda quando i giocatori automatici hanno finito

La 1.2 prescriveva la concorrenza fra politiche senza dire che cosa se ne ricava. Se ne ricava **la dominanza**, ed è la domanda che decide se il nodo a più vie è una scelta o un menù.

> **I10 — nessuna politica domina tutte le altre su tutte le metriche dichiarate insieme.** Se una politica è la migliore su obiettivo, Traccia, danni e passi spesi contemporaneamente, il motore ha una soluzione, e tutta la §14 è decorazione.

Le politiche vanno dichiarate prima e tenute diverse per **criterio**, non per parametro. Un elenco di partenza, non chiuso:

| Politica | Massimizza |
|---|---|
| **Conservatrice** | resta Coperta a ogni costo |
| **Temeraria** | agisce subito, non compra mai attenuanti |
| **Preparatrice** | compra sempre tutto ciò che abbassa |
| **Opportunista** | aspetta la combinazione di luogo e momento migliore |
| **Narrativa** | pesa Traccia e Conoscenza quanto il Costo |
| **Minimizzatrice** | riduce i danni cumulati, e accetta di non arrivare |
| **Diretta** | solo l'obiettivo, qualunque cosa costi |

E la domanda singola che vale più dell'intera batteria, perché se la risposta è no l'asse del giocatore ha un verso solo:

> **Esiste una situazione in cui *Esposto* è strategicamente migliore di *Coperto*?**

### 30.3 Il banco umano, e perché i giocatori automatici non bastano

> **Un motore stabile non è un motore che funziona. Sono due proprietà diverse, e la seconda non discende dalla prima.**

Tutto ciò che questa specifica ha misurato viene da giocatori automatici, e le tre istanziazioni della Parte VI sono state riempite e non giocate. Ma **le promesse centrali del motore sono esperienziali** e nessun automa le può misurare: che le sei caselle si sentano diverse (§2.1), che la crescita si veda come tentativi risparmiati (§24.4), che la ricevuta insegni il sistema mentre lo si usa (§2.2).

Il banco umano si tiene con la disciplina del §30.1 — criterio scritto prima, criteri falliti a verbale — e le due domande che lo compongono sono queste:

> **Dopo una scena:** *«Perché pensavi che sarebbe successo quello che è successo?»*
> Passa chi risponde nominando la propria posizione. Non passa chi risponde *«non lo so, ho tirato»*.
>
> **A fine partita:** *«Qual è stata la decisione più importante?»*
> Passa una decisione. Non passa un numero uscito sul dado.

Sono classificabili, si dichiarano prima, e misurano esattamente ciò che D14 dichiara a rischio: *il giocatore concluderà che il gioco è casuale, avendo torto sui fatti e ragione sull'esperienza.*

### 30.4 Il debito aperto di questa specifica

Il §38 impone a chi adotta il motore di **compilare una seconda finzione di prova e tenerla come test di regressione dell'agnosticismo**, e di farci ripassare ogni modifica futura al nucleo.

> ⚠️ **Le due modifiche al nucleo della 1.2 — la riscrittura di N9.a e la nascita di N12 — vengono dalla stessa e unica applicazione del motore, e non sono ripassate da nessuna seconda finzione.** Le tre istanziazioni della Parte VI non contano: sono compilazioni e non misure, e sono state riempite dopo.

Non è la situazione anomala di questo progetto: è la situazione normale di un motore con una sola applicazione. Ma va scritto qui, perché **la specifica non può esigere da chi la adotta più di quanto abbia fatto per sé** senza smettere di essere un documento e diventare un manifesto. È debito, ed è aperto.

---
---

# PARTE VI — TRE ISTANZIAZIONI

## 31. Come leggerle

Tre finzioni di generi lontani, compilate contro la firma del §26. Non sono state scritte né giocate: sono state **riempite**. Ognuna dichiara per prima cosa **quali profili sceglie**, che è il modo in cui si adatta il motore a un caso.

## 32. Intrigo di corte

**Profili scelti:** A1 · B1 · **C2 (la stagione)** · **E1 (arco lungo)** · **F2 (logorio nella posizione)** · G presente · H1 · **I presente** (il patrono che assorbe).

> **Lettura dell'Esposizione: quanto un atto è attribuibile a te.**
> Coperto = nessuno può risalire a te. Esposto = qualcuno può, e qualcuno lo farà. Allo scoperto = l'hai fatto davanti a tutti, e non lo puoi rinnegare.

> **Criterio del Fondo: ha un Fondo ciò che, per funzionare, ha bisogno che qualcuno sappia che sei stato tu.**

Un favore chiesto richiede che qualcuno sappia di averlo concesso. Un'accusa non esiste finché non è pubblica. Una gentilezza che nessuno vede non compra niente.

**Ceppi:** quattro. **CORPO è magro e va dichiarato** (§20): esiste — il duello, la caccia, la veglia, il veleno — ma poche scene lo offrono come via.

| Ceppo | Verbo | Base | Fondo | Perché |
|---|---|---|---|---|
| **CORPO** | Reggere | Coperto | Coperto | stare in piedi tutta la notte non si vede |
| | Battersi | Allo scoperto | **Allo scoperto** | *l'azione che non si può mai fare pulita.* Un duello è pubblico per definizione |
| **MANO** | Sottrarre | Coperto | Coperto | una lettera che manca è una lettera che nessuno cerca subito |
| | Contraffare | Coperto | **Esposto** | esiste un oggetto falso, e un oggetto è un testimone |
| | Somministrare | Esposto | **Esposto** | un corpo che cambia è visibile a chiunque lo guardi |
| **MENTE** | Osservare | Coperto | Coperto | guardare a corte è quello che fanno tutti |
| | Ricordare | Coperto | Coperto | sapere una genealogia non costa niente |
| | Prevedere | Coperto | Coperto | anticipare una mossa non lascia niente |
| **VOCE** | Persuadere | Esposto | **Esposto** | non si convince nessuno senza che sappia di essere stato convinto |
| | Insinuare | Coperto | **Esposto** | una voce cammina, e prima o poi qualcuno risale |
| | Impegnarsi | Allo scoperto | **Esposto** | dare la parola è un atto pubblico; in privato, con la persona giusta, scende di un livello |
| | Rifiutare | Esposto | **Esposto** | un rifiuto ha sempre un destinatario che se lo ricorda |

**Verifica dei vincoli (N9.a in forma 1.2):** dodici verbi ✓ · due per ceppo ✓ · un Fondo *Allo scoperto* ✓ · **sette verbi a base *Coperto*** su dodici, cioè più della metà ✓ · **due a base *Allo scoperto*** — Battersi e Impegnarsi, che è il tetto ✓ · nessuna sovrapposizione ✓.

**Aggravanti:** *il credito che manca* · *la stagione* · *la voce che gira* (Traccia) · *l'obbligo scoperto*.

**Luoghi** — con la verifica N9.b, ogni riga ha almeno un ceppo negativo:

| | CORPO | MANO | MENTE | VOCE |
|---|---|---|---|---|
| La sala delle udienze | +1 | +1 | −1 | +1 |
| Il corridoio di servizio | 0 | −1 | 0 | +1 |
| La cappella | 0 | 0 | −1 | −1 |
| La caccia | +1 | 0 | 0 | −1 |
| La stanza di qualcun altro | +1 | −1 | +1 | +1 |

**Momenti:**

| | CORPO | MANO | MENTE | VOCE |
|---|---|---|---|---|
| Ricevimento affollato | +1 | −1 | 0 | −1 |
| Il giorno dopo un lutto | 0 | 0 | −1 | +1 |
| Mentre il sovrano è assente | −1 | −1 | 0 | +1 |
| All'alba, prima che si alzino | −1 | −1 | +1 | +1 |

**Le inversioni che ne escono, e nessuno le ha scritte a mano:** insinuare in cappella all'alba è **Coperto**; la stessa insinuazione in sala udienze durante un ricevimento è **Esposto**. Ma **sottrarre** una lettera è più facile durante il ricevimento che all'alba, perché la folla copre le mani e il silenzio le scopre. È *la pioggia copre il ladro e scopre il camminatore*, in un mondo senza pioggia e senza ladri.

**Il contenitore (C2).** Il passo è **l'occasione**: un'udienza, una cena, una caccia, una veglia. Il calendario dichiarato in anticipo è il profilo; le tre risoluzioni sono *si sa che ci sarà* / *si sa chi ci sarà* / *si sa cosa vi si deciderà*. Il passo ha **tre frazioni**: la conversazione, l'assenza, l'attesa in anticamera.

**Il logorio (F2)** — tre livelli, tre rimedi distinti:

| Logorio | Gradi | Rimedio |
|---|---|---|
| **Credito** | fornito · corto · in rosso | spendere qualcosa di proprio, o riscuotere un obbligo |
| **Sfinimento** | riposato · consumato · esausto | ritirarsi in campagna — e costa occasioni |
| **Pazienza del patrono** | intera · logora · finita | ottenergli qualcosa |

**I danni — le macchie:**

| Macchia | Impedisce | Decorso |
|---|---|---|
| Una parola data e non mantenuta | Persuadere, Impegnarsi | non guarisce, si copre con un'altra |
| Un debito che si è saputo | Impegnarsi, Rifiutare | guarisce pagando, e lascia un obbligo |
| Un lutto sospetto | Reggere, Persuadere | guarisce col tempo, e lascia una diffidenza |

**Un confronto:** l'udienza in cui un rivale ti accusa. È **chi si chiude** — ha una versione, e ogni tua prova riuscita gliela scopre di un gradino. *Cosa lo copre:* la sua versione e chi la sostiene. *Cosa lo scopre:* una data che non torna (Ricordare) · un testimone inatteso (Prevedere) · una lettera che non doveva esistere (Sottrarre). *Cosa vuole:* il tuo posto; smette se ottiene qualcosa che lo vale di più. **Tradisce: dichiarato in firma.** Le tre famiglie: screditato in pubblico · accetta uno scambio · si ritira dall'udienza e la cosa resta aperta.

> **Verdetto: la firma si riempie per intero. Il motore regge una finzione senza violenza fisica e senza sopravvivenza.**

## 33. Fantasy con una disciplina

**Profili scelti:** A1 · B1 · **C1 (il percorso)** · **E4 (crescita per studio)** · **F1 (logorio nel corpo)** · G presente · H1 · I presente.

> **Lettura dell'Esposizione: quanto di te resta attaccato alla cosa che hai toccato.**
> Coperto = niente ti collega. Esposto = qualcosa se ne ricorda. Allo scoperto = ti riconoscerà.

> **Criterio del Fondo: ha un Fondo ciò che chiede qualcosa in prestito. E ciò che presta si ricorda.**

**La disciplina non è un verbo, e non è un ceppo. È distribuita.**

Un verbo *Lanciare Incantesimi* farebbe due danni insieme: creerebbe l'abilità che ha regole sue, e concentrerebbe in un verbo solo ciò che la finzione vuole rendere pervasivo. La soluzione che il motore impone è migliore di quella che verrebbe in mente:

| Ceppo | Verbo della disciplina | Cosa fa | Fondo |
|---|---|---|---|
| **MANO** | **Tracciare** | la mano che disegna il segno, incide, lega il nodo | Esposto — il segno resta, e un segno è un testimone |
| **MENTE** | **Leggere** | capire cosa una cosa vuole, e cosa le si può chiedere | Coperto — guardare non chiede niente in prestito |
| **VOCE** | **Chiamare** | dire a qualcosa di venire, o di smettere | **Allo scoperto** — non si chiama niente in silenzio, mai |
| **CORPO** | *(nessuno)* | **dichiarato: la disciplina copre tre ceppi su quattro** | — |

**E il costo della disciplina non è un pool: è Esposizione e danni.** Ne discende, senza una regola dedicata, tutto ciò che di solito richiede un sottosistema: la magia è sempre disponibile e sempre la più cara; non si esaurisce, si paga; non ha un contatore, ha conseguenze. **Un praticante logoro non ha «meno mana»: ha danni che dichiarano cosa impediscono** — *«le mani non tengono il tratto»* chiude *Tracciare* e lascia intatto *Chiamare*.

**Il logorio** aggiunge un terzo livello a fame e stanchezza: **il debito** — ciò che si è preso in prestito e non si è restituito. Sale con l'uso della disciplina, si abbassa **restituendo**, e **non è un pool travestito** perché non limita nulla: alza l'Esposizione, e al grado estremo diventa Impedimento.

**La crescita (E4)** è la ragione per cui questa finzione sceglie il profilo per studio: la competenza da libro e da bottega passa dall'insegnamento a rate, e **costa passi**, quindi compete con il viaggio. *Resto a leggere o esco* diventa la decisione centrale, senza nessun sistema che la produca.

**Un avversario** che sceglie la natura opposta: **chi avanza.** Non contratta, non si copre, non valuta. *Cosa lo copre:* quanto ci mette ad arrivarti. *Cosa lo scopre:* avvicinarsi lo scopre da solo. *Cosa vuole:* mangiare. *Cosa lo fa smettere:* il **costo** — il fuoco, il rumore, uno dei suoi che si fa male. **Non ci si entra parlando, e la colonna di mezzo resta comunque aperta.**

> **Verdetto: la disciplina entra senza un sottosistema, e il profilo E4 la regge. È il risultato più forte dei tre.**

## 34. Indagine contemporanea

**Profili scelti:** A1 · **B2 (tre livelli)** · **C3 (il caso)** · **E3 (crescita fissa)** · **F3 (logorio nell'oggetto del gioco)** · G presente · H3 · **I presente** (l'avvocato).

> **Lettura dell'Esposizione: quanto chi stai guardando sa di essere guardato.**
> Coperto = nessuno sa che qualcuno guarda. Esposto = sanno che qualcuno guarda. Allo scoperto = sanno che sei tu.

> **Criterio del Fondo: ha un Fondo ciò che chiede a qualcuno di sapere che gliel'hai chiesto.**

**Il contenitore (C3).** Il passo è **una pista**. Le tre risoluzioni: *si sa che esiste* / *si sa dove porta* / *ci sei già passato*. Almeno due strade per arrivare a ogni fatto.

**Il logorio (F3) non è nel corpo dell'investigatore: è nel caso.** È il profilo che il motore non aveva previsto e che regge:

| Logorio | Gradi | Rimedio |
|---|---|---|
| **Il freddo** | caldo · tiepido · freddo | tornarci sopra, e costa piste |
| **La pressione** | nessuna · sopra di te · addosso | consegnare un risultato |
| **La credibilità** | intera · incrinata · finita | avere ragione su qualcosa di verificabile |

**La crescita (E3): fissa.** Un caso dura una sessione; un arco lungo non ha dove stare. Il personaggio è definito una volta, e il gioco sta tutto nelle situazioni. *(Variante: punti versati dalla chiusura di un episodio, cioè E1 con l'episodio al posto del nodo di trama.)*

**Dove il motore si tende, e come si risolve.** In questa finzione **quasi ogni esito muove Conoscenza**, e la regola di divergenza (§13) è soddisfatta troppo facilmente. È il caso per cui esiste **la forma rafforzata**: qui vale *almeno uno dei due esiti deve muovere **Traccia***. Gli assi invece **non collassano**, perché sono ruoli e non contenuti: l'*Obiettivo* è entrare nell'appartamento, la *Conoscenza* è che il vicino mente sull'ora.

**Un confronto: l'interrogatorio.** È il risultato che convince di più, perché **non richiede nemmeno una riga di adattamento.**

| Voce del §23.6 | Nell'interrogatorio |
|---|---|
| **Cosa lo copre** | la sua versione, e quanto è provata |
| **Cosa lo scopre** | una contraddizione (Prevedere) · un dettaglio che non poteva sapere (Osservare) · un documento (Ottenere) |
| **Cosa costa avvicinarlo** | reggere quando ti rovescia addosso quello che sa di te |
| **Cosa vuole, e cosa lo fa smettere** | uscire di lì. Smette se ottiene qualcosa che lo vale — **e se chiede un avvocato, non c'è più** |

Le tre famiglie, alla lettera: **non può** (confessa) · **non vuole** (patteggia) · **non c'è** (chiede l'avvocato, o esce). La **finestra** è il momento in cui la versione si crepa, e dura **fino alla sua prossima mossa**. E la **colonna di mezzo — l'accordo — è la più larga**, esattamente come nella realtà.

> **Verdetto: la firma si riempie. E il confronto si trasporta senza modifiche, cosa che non era affatto scontata.**

## 35. Cosa hanno insegnato le tre prove

**Quello che si è trasportato meglio del previsto:**

- **Il confronto, per intero.** L'interrogatorio di polizia e l'udienza di corte sono lo stesso sistema del combattimento, senza una riga di adattamento. Le tre famiglie, la finestra, le due nature e la colonna di mezzo funzionano identiche. È il risultato che più di ogni altro dice che il motore è astratto davvero.
- **La firma per ceppo**, che produce inversioni interessanti in tutte e tre le finzioni senza che nessuno le abbia scritte a mano.
- **La grammatica del contenitore.** Le sette proprietà si riempiono per una stagione, un caso e un percorso, senza eccezioni.
- **Il logorio fuori dal corpo** (F3): non era previsto, e il motore lo regge — il che è un buon segno sulla sua astrazione.

**Quello che le prove hanno corretto nel motore:**

- **I ceppi non sono quattro per necessità** → §20, l'intervallo 3–5.
- **Un dominio d'azione non copre necessariamente tutti i ceppi** → §20, nota di compilazione. Non è un limite: è una cosa da dichiarare.
- **La crescita ad arco lungo non è l'unico modello** → §21, i profili E3 ed E4.
- **La regola di divergenza ha bisogno di una forma rafforzata** dove la Conoscenza è abbondante → §13.

> **Un motore universale non è un motore che va bene per tutto senza toccarlo. È un motore in cui ciò che non si tocca è piccolo, e tutto il resto si sceglie da un elenco.**

---
---

# PARTE VII — IL PERIMETRO, E LE DEVIAZIONI

## 36. Dove questo motore non arriva

Va scritto, perché **un motore che non sa dire dove finisce non è universale: è soltanto vago.**

Il nucleo assume quattro cose. Dove una di queste non vale, il motore non si adatta: **non si applica**, e conviene saperlo prima.

1. **Esiste un protagonista che agisce, e può fallire.** Un gioco senza un soggetto che compie atti incerti non ha niente da risolvere.
2. **L'azione è discreta.** Ci sono momenti in cui si decide e si risolve. Un gioco in tempo reale, o continuo, non ha dove mettere la ricevuta — e senza ricevuta la tesi §2.2 cade, cioè cade il motore.
3. **Le conseguenze persistono.** Il motore poggia sulla Traccia e su uno stato del mondo per zona. Un gioco che si azzera a ogni scena perde metà dei quattro assi.
4. **Vale la pena distinguere *quanto è probabile* da *quanto costa*.** È l'assunzione più profonda. In un gioco dove il fallimento ha un solo prezzo possibile, i due assi collassano e resta un sistema più complicato del necessario.

**Ne discende, in chiaro, cosa sta fuori:** i giochi in tempo reale · i giochi di pura gestione di risorse senza un soggetto · i tattici a squadra, dove servirebbero iniziativa e posizionamento e questo motore li rifiuta entrambi · i puzzle a soluzione unica, dove non esiste una via povera che non sia la soluzione · i giochi in cui la finzione riguarda un sistema e non una persona.

**Ne discende anche cosa sta dentro, ed è largo:** qualunque gioco di ruolo narrativo con un protagonista, azione a turni o a scene, e conseguenze che restano. Che è, per inciso, quasi tutta la narrativa interattiva che valga la pena progettare.

## 37. Le deviazioni dalla prima stesura

Per chi tiene un progetto avviato su una versione precedente.

**Dalla prima stesura del motore:**

| # | Deviazione | Dove |
|---|---|---|
| **D1** | L'elenco dei verbi esce dal nucleo | §7, §20 |
| **D2** | I ceppi diventano 3–5, dichiarati dall'ambientazione | §20 |
| **D3** | Vincolo sulla distribuzione delle basi del lessico | N9.a |
| **D4** | Vincolo sulle tabelle: [−2,+2] per ceppo, e ogni luogo con almeno un ceppo negativo | N9.b |
| **D5** | La ricevuta dichiara le voci inerti | N9.c |
| **D6** | Tetto dell'Impedimento: −6, con la sua ragione | §22.1 |
| **D7** | Il passo si divide in frazioni; uno scambio ne consuma una | §19.3 |
| **D8** | La regola di divergenza è un validatore, non una garanzia | §13 |
| **D9** | La curva dell'uso è relativa a un mix di difficoltà dichiarato | §21.3 |
| **D10** | La mitigazione post-esito è il quinto stadio, dichiarato | §25 |
| **D11** | L'Esposizione è un asse astratto; lettura e criterio del Fondo sono dati | §6, §9 |
| **D12** | Contenitore e confronto sono moduli, non nucleo | §19, §23 |
| **D13** | Il freno e lo smaltimento sono due numeri obbligatori | §27 |
| **D14** | Requisito d'interfaccia: i tentativi risparmiati vanno resi visibili | §24.4 |
| **D15** | Il dimensionamento dei banchi si fa per contesto | §24.3 |

**Nuove in 1.1:**

| # | Deviazione | Dove |
|---|---|---|
| **D16** | Architettura a nucleo e moduli, con profili dichiarati | Parti II e III |
| **D17** | Profili di crescita E3 ed E4 | §21.4 |

**Nuove in 1.2:**

| # | Deviazione | Dove |
|---|---|---|
| **D18** | **N12 — ogni stato che si accumula dichiara come si smaltisce**, e il freno è una disuguaglianza fra entrata e uscita, non un tetto sull'entrata | §27.1, §27.2 |
| **D19** | N9.a vincola la **distribuzione delle basi** e non il rapporto `Fondo == base`; I7 misura le situazioni con un motivo di prepararsi; I8 e I9 nuove | §12.3, §29 |

**Nuove in 1.3.** Nessuna aggiunge una meccanica: **definiscono, dichiarano o rendono verificabile.**

| # | Deviazione | Dove |
|---|---|---|
| **D20** | N9.a vale **per costruzione** e non per osservazione: la monotonia nella base discende dal tetto della scala. Le percentuali che la 1.2 esibiva valgono per la finzione che le ha prodotte | §12.3 |
| **D21** | **Recinto sulla conoscenza falsa:** non entra mai nella ricevuta | §13 |
| **D22** | **«Cambiato» è definito:** è cambiato ciò che cambia la ricevuta. Da cui V14 | §14 |
| **D23** | Il numero degli avversari alza il **prezzo** delle uscite; non ne chiude nessuna | §23.2 |
| **D24** | **L'uscita è la via povera di ogni confronto:** sempre disponibile, non tirata | §23.7 |
| **D25** | Il banco si dimensiona in **riletture per partita**, e le varianti si derivano da lì. V12 riscritta | §24.3 |
| **D26** | **La ricevuta nomina cause**, e il numero è l'annotazione | §24.4 |
| **D27** | Il controfattuale di D14 è **il proprio passato sullo stesso verbo** | §24.4 |
| **D28** | La pressione che rompe lo stallo da Coperto si **valida**, e ha un numero nella firma. Da cui V15 | §23.5, §26.2 |
| **D29** | Le politiche in concorrenza si misurano sulla **dominanza** (I10); il banco umano e le sue due domande; il debito aperto della specifica dichiarato | §30 |
| **D30** | Il modello da cui si ricava la disuguaglianza del freno è pubblicato, e **I6 diventa verificabile** da chi non l'ha scritta | Appendice A |

*Non sono numerate le correzioni di dizione e di conteggio: il nucleo è di dodici regole e non di undici, i moduli sono nove e otto sono le scelte di profilo, il §16 rimanda alla mitigazione al §25, il costo di scrittura nullo è **per nodo**, la §2.1 non promette più una divergenza che il §13 nega, e l'adattamento non si fa in mezza giornata.*

## 38. Come si riconcilia un progetto avviato

1. **Verificare D3 e D4 sui propri dati.** Sono i due che possono spegnere l'asse del giocatore, e si misurano contando.
2. **Adottare D1, D2, D11, D12, D16.** Sono documentali: spostano righe, non cambiano regole. Sbloccano tutto il resto.
3. **Chiudere D6 e D7.** Sono buchi, non correzioni.
4. **Correggere D8 e D9.** Sono affermazioni da riformulare.
5. **Dichiarare D10 e D13.**
6. **Scegliere esplicitamente i profili degli otto moduli** (§26.1), anche dove la scelta coincide col predefinito. Una scelta implicita è una scelta che nessuno potrà rimettere in discussione.
7. **Misurare D5, D14, D15** contro la propria interfaccia e i propri banchi.
8. **Compilare una seconda finzione di prova** e tenerla come **test di regressione dell'agnosticismo**. Ogni modifica futura al nucleo ci ripassa.

---

## 39. Colofone

**ESPOSIZIONE — Motore narrativo a due assi. Specifica 1.3.**

Le scuole di riferimento, dichiarate perché il debito è reale e riconoscerlo rafforza la posizione: **Powered by the Apocalypse** (il fallimento come evento), **Forged in the Dark** (la posizione come stato dichiarato, e la conseguenza come matrice), **Genesys** (riuscita e complicazione su assi indipendenti), **Disco Elysium** (la distinzione fra prove ritentabili e prove che marchiano).

Il motore usa il **linguaggio** del d20 perché si spiega da solo a schermo in tre secondi. **Non usa il motore di D&D**: nessuna classe, nessun attributo, nessun bonus di competenza a scaglioni, nessuna difficoltà che scala col livello.

Ciò che questo motore aggiunge a quelle scuole, e che ne giustifica l'esistenza, è una cosa sola:

> **La posizione non si dichiara: si deriva, da tabelle con una firma per ceppo, a costo di scrittura nullo per nodo — e le inversioni, che sono la parte interessante di ogni ambientazione, escono come effetto collaterale.**

*«Per nodo» non è una cautela: è la misura esatta di ciò che la derivazione compra.* Il costo di **giudizio** resta, si paga una volta per ambientazione ed è il costo reale del motore (§10.4); il costo di **scrittura** resta intero e vive nei banchi, che sono il vero contenuto del gioco (§24.2). Ciò che va a zero è una cosa sola, ed è quella che negli altri sistemi si paga a ogni nodo per sempre.

Tutto il resto è disciplina.

---
---

# APPENDICE A — IL MODELLO DEL FRENO

### A.1 Perché esiste questa appendice

I6 chiede che il loop del §27 converga **per tutti gli intervalli di parametri dichiarati**. La 1.2 dava la disuguaglianza e non il processo da cui si ricava: chi implementava doveva ricostruire il modello per controllare l'invariante, e non aveva modo di sapere se lo stava ricostruendo bene.

> **Un'invariante che richiede di indovinare il modello non è un'invariante: è un atto di fiducia.**

Qui il modello è dichiarato per intero, con le sue assunzioni e i suoi limiti. Non è più forte di quello che c'era: è **contestabile**, che è ciò che il §30.1 chiede a qualunque misura.

### A.2 Il processo, in quattro assunzioni

Tutte e quattro sono dichiarate, e tutte e quattro sono falsificabili.

> **A1 — Il passo è l'unità di tempo.** Ogni frequenza e ogni tasso si misurano per passo del contenitore (§19.1). Le frazioni non entrano nel modello: entrano nella scala di chi le dichiara.

> **A2 — La frequenza dell'imprevisto è affine nell'Esposizione.**
>
> ```
> f(E) = f(0) × [ 1 + (g − 1) × E / 2 ]        E ∈ {0, 1, 2}
> ```
>
> dove `f(0)` è la frequenza da *Coperto* e `g = f(2) / f(0)` è il **guadagno**. Sono due punti dichiarati — quanto capita al riparo, quanto capita allo scoperto — e una retta fra loro.
>
> **Il fattore `/2` non è una costante di taratura: è l'ampiezza della scala.** *Allo scoperto* vale 2, quindi `E/2` sta in [0,1] e normalizza. Con quattro livelli sarebbe `/3`.

> **A3 — Un imprevisto deposita in media un gradino di Traccia.** È una normalizzazione, non un limite: se nella finzione un imprevisto ne deposita in media `k`, si sostituisce `f` con `k·f` ovunque e tutto il resto regge.

> **A4 — Lo smaltimento è un tasso costante.** Un gradino ogni `s` passi, cioè `1/s` gradini per passo. **N12 impone `s` finito**, ed è esattamente ciò che nella prima applicazione del motore mancava.

Sotto A1–A4 la Traccia è un processo di nascita e morte sui gradini: arrivi a tasso `f(E)`, partenze a tasso `1/s`.

### A.3 La derivazione

La Traccia non diverge se e solo se, **nello stato peggiore che può raggiungere**, l'entrata è minore dell'uscita.

Qual è lo stato peggiore? Senza freno l'Esposizione sale fino ad *Allo scoperto* e l'entrata tende a `f(0)·g`. Il freno è il livello `b` oltre il quale l'Esposizione **smette di alimentare la frequenza**, cioè `E_eff = min(E, b)`. L'entrata sostenuta nel caso peggiore è quindi `f(b)`, e la condizione è:

```
f(0) × [ 1 + (g − 1) × b / 2 ]   <   1 / s
```

che è la disuguaglianza del §27.2, con `b` = freno e `s` = smaltimento.

**Da cui si legge, in chiaro, perché il tetto da solo non basta.** Il membro di sinistra si può ridurre quanto si vuole abbassando `b`, ma resta positivo: con `s → ∞` il membro di destra va a zero, e nessun valore di `b` salva niente. **Il freno non è un freno finché lo smaltimento non è finito**, ed è la ragione per cui la voce 14 della firma sono due numeri e non uno.

### A.4 Le due stabilità, e la regione bistabile

Sostituendo a `b` l'Esposizione di partenza `E₀` si ottiene la condizione **locale**:

```
f(0) × [ 1 + (g − 1) × E₀ / 2 ]   <   1 / s
```

Poiché `E₀ ≤ b`, la locale è sempre la più debole. Tre regimi, e il secondo è quello da conoscere:

| Condizione | Regime |
|---|---|
| valgono entrambe | **converge** da qualunque stato |
| vale solo la locale | ⚠️ **bistabile** |
| non vale nessuna | **diverge** |

> **Bistabile significa: regge finché si parte puliti e non capita niente di brutto, e da lì non torna più.** Non è un rischio di taratura da sorvegliare in corsa: è **una regione dello spazio dei parametri**, e ci si può stare senza saperlo per tutta la produzione. È alla lettera il muro che il §2.6 vieta, costruito senza che nessuno lo abbia scritto.

### A.5 Un esempio, con i numeri

Frequenza da coperto `f(0) = 0,15` · guadagno `g = 3` · smaltimento `s = 4` passi per gradino. L'uscita vale `1/4 = 0,25`.

| Freno | Entrata al caso peggiore | Contro 0,25 | Esito |
|---|---|---|---|
| nessuno *(b = 2)* | 0,15 × [1 + 2×1] = **0,45** | 0,45 > 0,25 | diverge |
| **b = 1** | 0,15 × [1 + 2×0,5] = **0,30** | 0,30 > 0,25 | diverge |
| b = 1, con `s = 3` | 0,30 | 0,30 < 0,333 | **converge** |

E la riga che conta davvero. Con `b = 1` e `s = 4`, la condizione **locale** da pulito vale — `0,15 < 0,25` — mentre la globale non vale: `0,30 > 0,25`.

> **Quella configurazione è bistabile, e una taratura fatta guardando le partite normali la dichiarerebbe sana.** Regge per decine di ore, finché una giornata storta non porta l'Esposizione stabilmente sopra *Coperto*; da lì la Traccia sale e non scende più. È il caso che ha prodotto N12, ed è il motivo per cui questa appendice non è documentazione ma parte della verifica.

### A.6 Che cosa questa appendice **non** dimostra

Va detto, perché una condizione presentata per più di quello che è tornerebbe a essere un atto di fiducia.

- **È una condizione sui tassi medi.** Dice se il processo è stabile, non **quanto dura il transitorio**: una configurazione che converge può metterci più di una partita a farlo, e per il giocatore la differenza non esiste.
- **Assume la forma affine di A2.** Se in una finzione la frequenza salta invece di crescere per gradini — perché l'imprevisto è legato a una soglia e non a un livello — la retta va sostituita con i due valori veri, e la disuguaglianza si riscrive con quelli.
- **Non copre le complicazioni differite.** Il §24.2 ammette complicazioni che mordono dopo un numero dichiarato di passi: sono arrivi correlati e concentrati, che il tasso medio descrive in media e non nel picco. Dove ce ne sono molte, la condizione resta necessaria e **la verifica si fa simulando sulle tabelle vere**.

> **Regola operativa per I6:** si enumerano gli intervalli di parametri dichiarati e si controlla la condizione **globale** su ognuno. Dove vale solo la locale, la configurazione **si rifiuta**: non è un avvertimento, è un difetto. Dove ci sono complicazioni differite, si simula.

*E vale la pena costruire lo strumento invece della sola tabella: la bistabilità è una regione, e una mappa dei parametri la mostra dove una disuguaglianza la nasconde.*
