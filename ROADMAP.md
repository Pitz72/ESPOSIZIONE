# Roadmap: da prototipo a sistema compiuto

*24 settembre 2026, aggiornata il 25 settembre con il documento di design 3.0. Sostituisce la roadmap della versione 1.3, che sta in `archivio/`.*

## Dove vogliamo arrivare

ESPOSIZIONE deve diventare un sistema compiuto per scrivere e giocare **qualunque storia in cui un protagonista sceglie e il mondo se ne ricorda**: un giallo, un horror, un fantasy, una storia d'amore, una fantascienza, un racconto per ragazzi, un dramma storico. Deve funzionare su carta, al tavolo e sullo schermo, in un gioco fatto di solo testo come in un gioco grafico.

«Compiuto» qui vuol dire cinque cose, e la roadmap finisce quando sono vere tutte:

1. **Provato da persone.** Almeno trenta persone hanno giocato storie scritte con il motore, e le due domande del §24 del documento di design danno risposte che si possono contare.
2. **Provato su generi diversi.** Almeno sei generi lontani fra loro hanno una storia giocabile, e ogni cosa che mancava è stata aggiunta al motore per tutti, non inventata dentro la singola storia.
3. **Scrivibile da chi non programma.** Un autore scrive e verifica una storia con ESPOSIZIONE Studio senza mai aprire un file di dati.
4. **Pubblicabile in ogni formato.** Da una storia escono, senza lavoro in più: il librogame da stampare, la versione elettronica, l'app web, il kit per il tavolo, i dati per un motore grafico.
5. **Spiegato.** Esistono il manuale per chi gioca, quello per chi scrive e il documento di design aggiornato, tutti nella lingua di `archivio/LINGUA-DEL-MANUALE.md`.

## Dove siamo

Fatto fra il 23 e il 25 settembre 2026:

- il **documento di design 2.0**, oggi in `archivio/`, e poi il **documento di design 3.0**, `ESPOSIZIONE-DESIGN-3.md`: il personaggio in sei parti, le proprietà dei luoghi, le persone, le notizie e le convinzioni, le quattro fasce del tiro;
- il **motore 3.0** in `strumento/motore/`: dati, regole, i 30 controlli, la simulazione con nove strategie, i test;
- **un'ambientazione** (il porto) e **una storia di prova**, *Il registro della Santa Rita*, di 52 scene;
- **tre formati dalla stessa fonte**: il librogame in PDF, la partita nel terminale e l'app web.

Manca tutto ciò che si impara soltanto facendo giocare persone vere, e manca la prova dei generi.

## Le regole di marcia

- **Ogni fase dichiara prima i criteri di uscita.** Se un criterio si rivela sbagliato, lo si corregge scrivendo accanto perché.
- **Una lacuna trovata in una storia si ripara nel motore**, con una voce della scheda o un'opzione, e diventa disponibile a tutte le storie. Se non si può fare così, forse è una cosa che il motore non deve fare, e lo si scrive.
- **Ogni aggiunta passa dai test e dai controlli**, e il documento di design si aggiorna nello stesso momento del codice.
- **Le date sono andature, non scadenze.** Se una fase sfora, lo si scrive.

---

## Fase 1 — La prova con le persone *(ottobre 2026)*

La Santa Rita si fa giocare, su carta e nell'app.

- I criteri sono già scritti, nel §54 del documento di design 3.0: la prova del quadro sulla carta, sette domande alle persone, il tempo di lettura del quadro.
- Almeno **dieci persone**: cinque sul libro, cinque sull'app. Si registrano le partite (l'app può esportare il registro della partita) e si fanno le due domande.
- Si raccolgono i punti in cui le persone si perdono: regole non capite, quadri ignorati, scelte che nessuno fa.

**Uscita:** un verbale con le risposte, le correzioni fatte al motore e alla storia, e la decisione motivata su che cosa tenere delle regole che nessuno ha usato.

## Fase 2 — Il motore stabile, 3.1 *(ottobre–novembre 2026)*

Tutto ciò che serve perché il motore si possa dare ad altri.

- **Lo schema dei dati** in JSON Schema, con messaggi d'errore scritti per l'autore e non per il programmatore.
- **Un giocatore automatico con un obiettivo**, oltre a quelli casuali: misura se una storia si può vincere, quanto tempo lascia la scadenza, se una strategia batte tutte le altre (§24).
- **I salvataggi con una versione**, perché una partita salvata sopravviva a una storia corretta.
- **I testi separati dalle regole**, per poter tradurre una storia senza toccarne la logica.
- **La documentazione dell'interfaccia del motore** (`vista`, `agisci`, gli eventi con i loro dati) per chi costruisce giochi grafici.
- **La modalità racconto**: un'impostazione di chi gioca che toglie la morte e raddoppia il tempo delle scadenze, per chi vuole la storia senza la tensione. Si dichiara all'inizio, e le regole della storia non cambiano.

**Uscita:** 3.1 con test verdi, schema pubblicato, e una storia scritta da una persona che non ha partecipato allo sviluppo, usando soltanto la documentazione.

## Fase 3 — La prova dei generi *(novembre 2026 – gennaio 2027)*

La fase più importante: stabilisce se il motore vale davvero «per ogni tipo di narrativa». Si scrivono **sei storie brevi**, da venti a trenta scene, ciascuna con un'ambientazione compilata per intero. Ognuna è scelta per mettere sotto sforzo un punto diverso del motore.

| Genere | Che cosa mette alla prova | Domande aperte da chiudere |
|---|---|---|
| **Giallo classico** | la conoscenza falsa e incompleta, il ragionamento | serve una **lavagna degli indizi**, cioè conoscenze che si combinano per dedurne altre? |
| **Horror** | il logorio come paura, la tensione senza combattimento | la **paura** è un logorio o un'altra cosa? come si scappa da ciò che non ha volontà? |
| **Fantasy con magia** | una disciplina distribuita sulle capacità, il costo della magia | la magia entra davvero senza un sottosistema? che cosa succede ai **poteri** che non sono capacità? |
| **Dramma sociale o storia d'amore** | nessuna violenza, Traccia come pettegolezzo, relazioni | servono **relazioni a più dimensioni** (fiducia, affetto, rancore) invece di una sola misura? |
| **Fantascienza** | tecnologia, fazioni, luoghi lontani fra loro | come si viaggia su **scale diverse** (una stanza, una città, un pianeta)? servono **fazioni** con memoria propria? |
| **Racconto per ragazzi** | nessuna morte, lettura facile | la **modalità racconto** basta? il quadro si capisce a dieci anni? |

Il documento 3.0 ha già dato una prima risposta a tre di queste domande: la paura è insieme un logorio (i nervi) e uno stato d'animo (spaventato); le relazioni hanno cinque dimensioni; gli indizi si mettono insieme con le deduzioni. Nella Parte X del documento ci sono tre ambientazioni abbozzate (un giallo, un horror, un racconto per ragazzi) da cui partire. La prova dei generi mette alla prova queste risposte, non le dà per buone.

Per ogni storia si tiene una **tabella degli attriti**, compilata mentre si scrive e non dopo: che cosa si voleva fare, che cosa il motore non permetteva, come lo si è risolto.

Alla fine si decide, per ogni attrito, se diventa una **voce nuova della scheda** (disponibile a tutti), un'**opzione** (una scelta dell'ambientazione, come il personaggio fisso), oppure un **limite dichiarato** (§23). Le candidate più probabili, già visibili oggi, sono:

- **i compagni**: altri personaggi che viaggiano con il protagonista, con capacità e condizioni proprie;
- **i dialoghi**: conversazioni a più battute, in cui ogni risposta è una via e l'interlocutore ha la sua copertura;
- **il tempo lungo**: storie che durano settimane o anni, con unità di tempo di scala diversa;
- **le risorse**: denaro e scorte, che oggi sono solo oggetti contati;
- **i protagonisti multipli** e le storie a più punti di vista.

**Uscita:** sei storie giocabili, sei tabelle degli attriti, il documento di design 2.2 con le aggiunte decise, e per ciascuna storia almeno tre persone che l'hanno giocata.

## Fase 4 — Lo strumento per chi scrive *(gennaio – marzo 2027)*

ESPOSIZIONE Studio ricostruito sul motore 3.x, pensato per chi scrive e non per chi programma.

- **La mappa delle scene**, con i rami e i punti di incontro, e le qualità che li collegano.
- **L'editor delle tabelle** di luoghi e momenti, con l'anteprima delle inversioni: scegli un'azione e vedi dove conviene farla.
- **L'anteprima del quadro** per ogni prova, mentre la si scrive.
- **I controlli sempre accesi**, con il messaggio accanto al punto sbagliato.
- **Il bottone «gioca da qui»** e il bottone «simula mille partite».
- **I modelli di partenza**: le sei ambientazioni della Fase 3, pronte da copiare.

**Uscita:** un autore che non ha mai visto il progetto scrive una storia di venti scene in un fine settimana, senza aprire un file JSON.

## Fase 5 — I formati *(marzo – maggio 2027)*

Dalla stessa storia, con un comando:

- **l'app web**, con un tema per ogni ambientazione: colori, caratteri, panorama, suoni. L'app della Santa Rita è il primo esempio, e il suo codice diventa un modello riusabile;
- **il librogame** in PDF, con impaginazione per la stampa e per la lettura a schermo;
- **l'EPUB**, con i paragrafi collegati fra loro, per i lettori di e-book;
- **il kit per il tavolo**: lo schermo del narratore, le schede, le tabelle;
- **l'esportazione per motori grafici**: i dati e un motore in TypeScript da usare in giochi web (Phaser, PixiJS), più un porting o un adattatore per Godot e per Ren'Py, i due motori più usati nella narrativa indipendente.

**Uscita:** una storia della Fase 3 esce in tutti i formati senza correzioni a mano, e almeno un prototipo grafico (anche piccolo, anche una sola stanza) usa il motore così com'è.

## Fase 6 — Il manuale e la pubblicazione *(maggio – giugno 2027)*

- **Il manuale per chi gioca**, breve: come si legge un quadro, come si tira, che cosa rischi.
- **Il manuale per chi scrive**: dalla frase dell'esposizione alla storia finita, con gli esempi dei sei generi.
- **La revisione del documento di design**, con ciò che le prove hanno insegnato e ripulita da ciò che hanno smentito.
- **Il sito**, con le storie giocabili nel browser.
- **La porta per gli altri**: come si propone una modifica al motore, e dove finiscono le proposte rifiutate, con la ragione.

**Uscita:** ESPOSIZIONE pubblicato, con sei storie giocabili, lo strumento, i manuali e la licenza CC BY-SA.

---

## Che cosa non cambierà

Sono le idee che reggono tutto. Se una prova le smentisse, non si correggerebbe un dettaglio: si ripenserebbe il motore.

- Il dado decide se riesci, e il costo lo decidi tu.
- Il costo si ricava da che cosa fai, dove e quando, e si vede prima di agire.
- Davanti a ogni ostacolo c'è una via che non si tira.
- Al coperto il dado non può rovinarti, e nessuno muore senza essere stato avvisato.
- Il motore non genera testo durante il gioco.

## I rischi

- **Il motore diventa troppo grande.** Ogni genere chiede qualcosa, e dieci aggiunte fanno un sistema che nessuno impara. Per questo ogni aggiunta deve servire ad almeno due generi, o restare un'opzione.
- **Le tabelle diventano troppo costose da scrivere.** È il prezzo vero del motore. Lo strumento della Fase 4 deve renderlo leggero; se non ci riesce, servono tabelle predefinite per i luoghi comuni (una taverna, una strada di notte).
- **Le persone non leggono il quadro.** Se la Fase 1 mostra che il quadro viene ignorato, la promessa centrale cade, e va ripensato come mostrarlo prima di aggiungere qualunque altra cosa.
