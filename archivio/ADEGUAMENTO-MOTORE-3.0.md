# Adeguare il motore al design 3.0

*Era l'appendice E di `ESPOSIZIONE-DESIGN-3.md` fino al 29 ottobre 2026. Il lavoro è stato fatto il 25 e il 27 settembre 2026; qui resta come registro.*

Questo era l'elenco del lavoro per adeguare `strumento/motore/`. È stato fatto il 25 settembre 2026, compresi i compagni (§33) e il giocatore automatico con un obiettivo (§54.2), aggiunti lo stesso giorno. Il 27 settembre si sono aggiunte le proposte del §7.3 e del §11.4, con i controlli dal 31 al 36 del §47. Resta da fare l'editor di ESPOSIZIONE Studio. Il `README.md` del motore dice com'è fatto adesso.

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
