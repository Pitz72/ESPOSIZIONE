# ROADMAP-STRUMENTO — da InteractiveWriter allo strumento di ESPOSIZIONE

**Stabilita il 19 agosto 2026.** Questo documento governa la seconda traccia del repository: la trasformazione di InteractiveWriter — importato oggi in `strumento/` con tutta la sua storia — nello strumento fisico di ESPOSIZIONE. Otto fasi, ciascuna con criteri di uscita dichiarati qui, adesso, prima di cominciare, perché anche questa roadmap è soggetta alla regola che governa tutto il resto: *un criterio dichiarato dopo aver visto il risultato non ha validato niente* (§30.1). I criteri falliti non si cancellano: si scrive accanto la riformulazione, datata.

## La visione, in un paragrafo

Lo strumento è alla specifica ciò che un motore di gioco è a un game design: la macchina che la fa girare. L'autore ci scrive dentro nodi, scelte, dialoghi e prove — nella propria lingua, con la meccanica resa in parole e percentuali, senza mai toccare un file di dati a mano. Lo strumento valida, esegue, misura. E alla fine produce un **pacchetto di consegna**: la logica narrativa completa, deterministica e verificata, che passa a chi costruisce l'interfaccia, la grafica, le cinematiche, l'audio — tutto il multimedia e la parte ludica. La logica di qua, la presentazione di là: è la stessa separazione che la specifica difende tra motore e ambientazione, ripetuta un piano più in alto.

## La tesi tecnica della trasformazione

La valutazione di integrabilità (19 agosto 2026) ha stabilito tre fatti che questa roadmap assume come premesse:

1. **I due progetti operano a strati diversi e complementari.** InteractiveWriter implementa la struttura della storia — grafo di nodi, stato, condizioni, effetti, thread, inventario, editor, validazione dal vivo. ESPOSIZIONE specifica la risoluzione dell'azione e il suo costo. La sovrapposizione conflittuale è confinata al sottosistema delle prove.
2. **L'asse della probabilità è quasi isomorfo.** Il profilo A1 (`1d20 + verbo + impedimento ≥ CD`) si mappa quasi alla lettera sul `ruleset.check` esistente. Ciò che manca è interamente il **secondo asse**: nel formato attuale le fasce di esito derivano tutte dal tiro, mentre la griglia 2×3 esige che l'esito sia funzione di *(riuscita) × (Esposizione)*.
3. **Il sottosistema delle prove si sostituisce, non si adatta.** Ogni via di mezzo — per esempio l'Esposizione infilata nei `modifiers` del tiro — viola I5, cioè rompe il motore nel modo che la specifica definisce come il più grave. Il trapianto è netto o non è.

## Il rapporto con ROADMAP.md, che comanda

La roadmap della specifica resta sovrana e questa le è subordinata in un punto preciso: **le Fasi 1–3 della specifica si eseguono dentro la traccia dello strumento** (qui: S1–S3), e **il trapianto del motore (S4) non comincia prima che il verbale della seconda finzione esista**. L'ordine è quello e non si inverte: costruire il runtime completo prima della misura del §30.4 significherebbe investire nel nucleo proprio mentre il nucleo è sotto esame.

**Deviazione dichiarata rispetto a ROADMAP.md:** la Fase 1 prevedeva `strumenti/valida.py` in Python. Il validatore si scrive invece in TypeScript, dentro `strumento/core/`, perché lì esiste già un'architettura di validazione collaudata (19 regole, findings con doppia resa tecnica/amichevole, 60 test verdi) e perché un solo linguaggio su tutta la catena elimina una classe intera di derive. I criteri di uscita della Fase 1 restano invariati alla lettera. La deviazione è annotata anche in ROADMAP.md, con addendum datato.

## Le regole di marcia

1. **Nessuna fase comincia prima che i criteri di uscita della precedente siano verbalizzati** — soddisfatti o falliti, ma a verbale.
2. **Ogni blocco di lavoro chiude con commit, push e verifica di sincronia.** Sempre.
3. **Un commit per decisione.** Le decisioni aperte (D-S1…D-S6) si chiudono una alla volta, ciascuna col proprio commit che spiega il perché.
4. **I5 per costruzione, non per disciplina.** Nel codice, il valore di Esposizione e i modificatori del tiro sono tipi distinti e non sommabili. Un test dedicato tenta la violazione e deve fallire. Questo vincolo entra dalla prima riga di S2 e non esce mai.
5. **Il motore IW esistente non si tocca fino a S4.** Le fasi S1–S3 aggiungono moduli accanto, non dentro.

## Le decisioni aperte

| # | Decisione | Stato | Raccomandazione |
|---|---|---|---|
| D-S1 | **Il nome dello strumento.** "InteractiveWriter" è provvisorio; il nome definitivo è una scelta d'identità che spetta all'autore | aperta — va chiusa entro S6 (pubblicazione del pacchetto) | — |
| D-S2 | **La licenza del codice.** I testi sono CC BY-SA 4.0, che per il codice è inadatta. Finché la decisione non è presa, il codice in `strumento/` resta © tutti i diritti riservati | aperta — va chiusa entro la fine di S0 | MPL-2.0: copyleft a livello di file (le modifiche allo strumento restano aperte) ma incorporabile in shell proprietari, che è esattamente il flusso previsto verso gli sviluppatori. Alternativa permissiva: MIT |
| D-S3 | **L'estensione del formato.** `.iwstory` porta il nome provvisorio | aperta — si chiude insieme a D-S1 | l'estensione segue il nome definitivo; fino ad allora non si cambia |
| D-S4 | **La lingua delle chiavi JSON.** Il formato attuale ha chiavi inglesi; il lessico normativo della specifica è italiano, con il glossario EN dei binding dichiarato vincolante nel concept inglese | aperta — va chiusa all'inizio di S1, perché lo schema della firma la incorpora | chiavi italiane nello schema della firma (il validatore parla la lingua della specifica che verifica); il glossario EN resta la tavola di conversione per un eventuale export |
| D-S5 | **La sorte del sistema di prove classico.** Il formato attuale sa fare storie senza statistiche e storie con il check a cinque fasce | aperta — si chiude all'inizio di S4 | nel formato nuovo, `firma` e `ruleset` classico in alternativa esclusiva (una storia dichiara l'uno o l'altra); il classico si mantiene per le storie semplici e si valuta la deprecazione solo dopo S6 |
| D-S6 | **I check passivi.** Il motore IW confronta statistica e soglia senza tirare; la specifica dice "non tira mai al posto del giocatore" — un check passivo, a rigore, non tira affatto | aperta — si decide in S7, davanti alla specifica | portarla in S7 come proposta formale: o entra come profilo, o si rifiuta a verbale |

---

## Fase S0 — L'insediamento *(in corso, 19 agosto 2026)*

Lo strumento entra in casa e la casa si adegua.

- [x] Import di InteractiveWriter in `strumento/` via `git subtree`, con i nove commit di storia — perché la repo d'origine è destinata alla cancellazione e la sua storia è informazione irrecuperabile.
- [x] README del repository aggiornato alla doppia traccia; questa roadmap scritta e collegata; addendum datato in ROADMAP.md.
- [ ] **D-S2 chiusa**: licenza del codice decisa e depositata (`strumento/LICENSE`), sezione Diritti del README aggiornata.
- [ ] Verifica che l'innesto è vivo: i test di `core/` e `cli/` girano verdi nella nuova sede (zero dipendenze, basta Node ≥ 22.6). L'editor richiede `npm install`; si verifica che parta in anteprima.
- [ ] **Solo dopo i punti precedenti**, e per mano dell'autore: cancellazione della vecchia repo `Ecosystem-Runtime/InteractiveWriter` e della cartella locale. Prima di cancellare vale la pena scaricare l'archivio ZIP della repo da GitHub, come cintura oltre alle bretelle.

**Uscita:** repository sincronizzato, test verdi in sede nuova, licenza del codice decisa, origine cancellata o consapevolmente rimandata.

**Cosa non si fa:** nessuna modifica al codice. S0 è trasloco, non ristrutturazione.

## Fase S1 — La firma diventa dati *(= Fase 1 della specifica)*

Le otto scelte di profilo e le sedici voci del §26 escono dalla prosa ed entrano in uno schema, nello stesso stile — e con la stessa severità — dello schema esistente: Draft 2020-12, `additionalProperties: false` ovunque, identificatori vincolati, enum per ogni scelta chiusa.

**Lavori:**

- `schema/firma.schema.json` — le otto scelte come enum (`randomizzatore: A1|A2|A3`, `scala: B1|B2|B3`, `contenitore: percorso|stagione|caso|incarico`, `crescita: E1|E2|E3|E4`, `logorio: corpo|posizione|oggetto`, `confronto: presente|assente`, `testo: H1|H2|H3`, `mitigazione: presente|assente`) e le sedici voci come oggetti tipizzati. Le forme sono già dettate dalla specifica; lo schema le trascrive senza inventare:
  - lettura dell'Esposizione e criterio del Fondo: una frase ciascuna;
  - ceppi: da 3 a 5 identificatori;
  - lessico: 8–16 verbi, ciascuno `{nome, ceppo, base ∈ {0,1,2}, fondo}`;
  - aggravanti: 3–5 famiglie;
  - tabella dei luoghi e tabella dei momenti: **stessa firma** (un valore per ceppo per riga), perché l'identità delle due forme è deliberata nella specifica e lo schema la eredita;
  - freno e smaltimento: **due numeri, non uno**;
  - più contenitore, logorio, catalogo dei danni, avversari, ciò che ripara, banco delle complicazioni, mix di difficoltà, chi versa i punti — ciascuno nella forma che il §26 dichiara.
- `istanze/` — le tre istanziazioni della Parte VI trascritte come dati: `intrigo-di-corte`, `fantasy-disciplina`, `indagine-contemporanea`. L'intrigo di corte (12 verbi, 5 luoghi × 4 ceppi, 4 momenti × 4 ceppi, logorii, danni, un avversario completo) è la fixture di riferimento di tutte le fasi successive.
- `strumento/core/src/firma/` — nuovo modulo accanto al motore, non dentro: `tipi.ts` (specchio TypeScript dello schema) e `valida.ts`, con l'architettura findings già in uso (codici, severità, doppia resa tecnica/amichevole). I sedici vincoli V1–V16 si classificano per natura, perché non tutti sono statici:

| Vincoli | Natura | Dove si verificano |
|---|---|---|
| V1–V13, V15, V16 (conteggi, domini, coerenze della firma — es. V9: almeno metà dei verbi a base Coperto, non più di due Allo scoperto; V10: `Luogo+Momento ∈ [−2,+2]` per ceppo e ogni luogo con almeno un ceppo negativo; V11: niente stato fantasma) | statica | `valida.ts`, in questa fase |
| V14 (nessun ritento con ricevuta identica) | di runtime | il motore, in S4 |
| I1–I10 (invarianti) | di simulazione | il banco, in S2 |

**Uscita** *(invariata rispetto alla Fase 1 di ROADMAP.md)*: il validatore accetta le tre istanze e rifiuta ciascuna di una lista dichiarata di istanze malformate — una per ogni controllo statico, col codice giusto e il messaggio in lingua d'autore. Ogni ambiguità della prosa scoperta trascrivendo va a verbale in `VERBALE-fase1.md`: è il primo prodotto di valore della fase.

**Cosa non si fa:** non si tocca `engine.ts`, non si tocca il formato `.iwstory`, non si scrive una riga di risoluzione.

## Fase S2 — Il nucleo eseguibile e il banco di prova *(= Fase 2 della specifica)*

Qui nasce il primo codice che *è* ESPOSIZIONE — come modulo puro, accanto al motore esistente, senza grafo e senza storia: solo la matematica del nucleo, eseguibile e misurabile.

**Lavori:**

- `strumento/core/src/esposizione/nucleo.ts` — funzioni pure:
  - `esposizione(verbo, luogo, momento, aggravanti, attenuanti)` → grezza limitata in `[Fondo(verbo), 2]`;
  - `casella(riuscita, esposizione)` → una delle sei celle della griglia 2×3;
  - la Traccia come stato esplicito che un successo sporco deposita e che rientra nel calcolo successivo;
  - la **ricevuta** come struttura dati: righe tipizzate `{voce, valore, origine}`, pronte per la resa in lingua — la ricevuta è un valore di ritorno del nucleo, non un abbellimento dell'interfaccia.
  - **I5 per costruzione**: il tipo del valore di Esposizione non ammette aritmetica con i tipi del tiro. Un test dedicato tenta la somma e deve fallire alla compilazione.
- `strumento/core/src/esposizione/freno.ts` — l'Appendice A eseguibile: la ricorrenza del freno, i tre regimi (convergente, bistabile, divergente), e la **mappa dei parametri** che la specifica invoca due volte (§10.4 e A.6): dato `(freno, smaltimento)`, lo strumento disegna la regione di stabilità invece di lasciarla a una disuguaglianza.
- `strumento/cli` — nuovo comando `banco`: prende un'istanza della Fase S1, fa girare **più politiche in concorrenza** (l'elenco dichiarato della specifica: Conservatrice, Temeraria, Preparatrice, Opportunista, Narrativa, Minimizzatrice, Diretta — elenco aperto), seme fisso, log completo riga per riga, e verifica automatica delle invarianti I1–I10 su ogni run.

**Uscita** *(invariata rispetto alla Fase 2 di ROADMAP.md, più una)*: (a) il modello del freno riproduce **esattamente** i numeri dell'esempio A.5 (`f(0)=0,15`, `g=3`, `s=4`); (b) due esecuzioni con lo stesso seme producono log identici byte per byte; (c) le politiche si confrontano sulla dominanza, come impone I10; (d) il test di violazione di I5 fallisce come deve.

**Cosa non si fa:** il banco non usa il grafo dei nodi — gira su sequenze sintetiche di prove. Il motore IW resta intatto. Nessuna interfaccia.

## Fase S3 — La seconda finzione *(= Fase 3 della specifica)* — il cancello

La fase più importante, e il motivo per cui S4 non è ancora cominciata. In due tempi che non si scambiano, come da ROADMAP.md:

1. **I criteri, prima.** Una finzione lontana dalla prima applicazione e dalle tre della Parte VI; la sua firma compilata con gli strumenti di S1; `CRITERI-seconda-finzione.md` scritto e **committato prima di qualunque esecuzione**, con soglie numeriche su ciò che deve accadere perché le due correzioni al nucleo della 1.2 (N9.a riscritta, N12) risultino confermate.
2. **I run, e il verbale.** Il banco di S2, più politiche in concorrenza, seme fisso. L'esito in `VERBALE-seconda-finzione.md`, criteri falliti compresi.

**Uscita:** il verbale esiste e risponde. Entrambi gli esiti chiudono la fase; se il nucleo si riapre, la 1.4 nasce prima del trapianto e S4 assorbe le regole corrette, non quelle smentite. **Gate dichiarato: nessun lavoro di S4 comincia prima di questo verbale.** Dopo il verbale, la Fase 4 della specifica (addendum al §30.4, eventuale 1.4, PDF ricostruiti) si esegue come da ROADMAP.md.

## Fase S4 — Il trapianto: il formato e il motore diventano ESPOSIZIONE

Il fork progettato. Il sottosistema delle prove a cinque fasce esce; la risoluzione a due assi entra. Tutto il resto — grafo, stato, condizioni, effetti, thread, inventario — resta, perché è la metà che ESPOSIZIONE deliberatamente non specifica.

**Lavori sul formato** (nuovo `formatVersion`, schema aggiornato):

- `Story.firma` accanto a `Story.ruleset`, in alternativa esclusiva (D-S5): una storia dichiara l'una o l'altro, mai entrambi.
- La scena acquisisce `luogo` e `momento`: due chiavi nelle tabelle della firma. È qui che si incassa l'invenzione centrale della specifica — *la posizione non si dichiara, si deriva* — a costo di scrittura nullo per nodo.
- La scelta acquisisce la `prova`: `{verbo, cd, aggravanti?, attenuanti?}`, tutte dichiarative, tutte leggibili nella ricevuta.
- Gli esiti si indicizzano sulle **sei caselle** (`successoPieno`, `successoSporco`, `successoACaroPrezzo`, `fallimentoPulito`, `rovescioMinore`, `rovescio`), ciascuna con `{goto, effects?, text?}`. La semantica automatica delle caselle è del motore, non dell'autore: un successo sporco deposita la Traccia anche se l'autore non scrive niente.
- `RuntimeState` si estende: la Traccia, i contatori dei tentativi **per verbo** (D14/D27: il controfattuale è il proprio passato sullo stesso verbo), la memoria della ricevuta per nodo (per far rispettare V14: nessun ritento con ricevuta identica), il logorio secondo il profilo F della firma.

**Lavori sul motore:**

- Il modulo di S2 si innesta nel ciclo `resolveNode`/`choose`; l'impedimento resta nei modificatori del tiro con il cumulo per verbo non oltre −6 (D6); la ricevuta diventa parte di `ResolvedChoice` — mostrata **prima**, riga per riga — e il resoconto parte di `ChooseResult` — reso **dopo** (il contratto del §24.4).
- Il compositore H1: quattro segmenti — Gesto, Esito, Strascico, Ancora — ognuno frase intera e autosufficiente, giustapposta. Mai un buco da riempire dentro una frase.
- I debiti noti del motore IW si saldano qui, perché il trapianto li attraversa comunque: il canale di ritorno per l'oggetto scartato a inventario pieno (`dropped`); la guardia sul check senza formula; i campi morti del formato vecchio (`critSuccess`/`critFailure` nella formula) che nel formato nuovo semplicemente non esistono.
- Il validatore si fonde: le regole E/W esistenti, le V statiche di S1, più V14 spostata a runtime, più le due regole che il progetto IW si era dichiarato mancanti (W02 softlock, W06 scelta sempre nascosta).

**Uscita:** (a) l'intrigo di corte, trascritto come storia giocabile, gira end-to-end da CLI con log deterministico; (b) un collaudo scriptato raggiunge tutte e sei le caselle; (c) la ricevuta è stampata prima di ogni prova e il resoconto dopo, e `play` mostra i tentativi spesi contro lo storico dello stesso verbo (D14); (d) due run a seme uguale, log identici byte per byte — la proprietà non si perde nel trapianto.

**Cosa non si fa:** l'editor non si tocca. S4 è CLI-first: prima il motore giusto, poi la sua interfaccia.

## Fase S5 — L'editor parla la lingua della firma

La semplicità per l'autore — la ragione d'essere dello strumento — si costruisce qui, sopra un motore già verificato.

**Lavori:**

- Il pannello di configurazione diventa **l'editor della firma**: le otto scelte come scelte, le sedici voci come moduli — il lessico dei verbi con ceppo, base e Fondo; le tabelle `(luoghi+momenti)×ceppi` con la validazione V10 dal vivo, cella per cella; il freno con la mappa dei regimi di S2 resa visiva, così la regione bistabile si vede invece di calcolarsi.
- L'ispettore di nodo mostra la **ricevuta in anteprima**: la riga di probabilità (già esistente: percentuale enumerata dal vivo) più la riga di Esposizione derivata da verbo × luogo × momento. L'autore vede quello che il giocatore vedrà.
- Il traduttore di fatti si estende: aggravanti e attenuanti scritte come frasi, come già oggi «ora ha la chiave» diventa un effetto tipizzato.
- Il **playtest incorporato** (era il punto 6 della roadmap IW): si gioca la storia dentro l'editor, con il diff dello stato per turno.
- L'autosalvataggio e l'avviso di modifiche non salvate (il debito §6-bis della roadmap IW si salda qui, dove l'editor si riapre comunque).

**Uscita:** un autore ricostruisce da editor, senza mai aprire un file JSON, l'istanza dell'intrigo di corte — firma completa e almeno una scena con prova — e il risultato valida identico alla fixture di S1. Una firma malformata non si salva senza avviso.

## Fase S6 — Il pacchetto di consegna

La visione compiuta: ciò che esce dallo strumento e arriva agli sviluppatori del multimedia.

**Lavori:**

- `CONTRATTO-SHELL.md` — il documento normativo per chi costruisce la presentazione: che cosa lo shell **deve** rendere (la ricevuta prima dell'azione, il resoconto dopo, i contatori dei tentativi leggibili — D14), che cosa **può** ignorare (gli hint di presentazione, i tag), che cosa **non può** fare (toccare lo stato fuori dalle API, ritirare i dadi, nascondere la ricevuta).
- Il pacchetto: storia validata + firma + salvataggio come elenco di scelte (il formato più piccolo e più verificabile: seme e sequenza) + il core embeddabile pubblicato come pacchetto a zero dipendenze, sotto il nome definitivo — **D-S1 e D-S3 si chiudono entro questa fase**.
- Uno **shell dimostrativo minimo** (web, senza pretese estetiche) che è il riferimento vivente del contratto: mostra come si consuma il pacchetto, non come si fa un bel gioco.

**Uscita:** uno shell scritto da mani terze — o da una sessione separata che vede *solo* il pacchetto e il contratto, non questo repository — rende l'intrigo di corte correttamente: ricevute, resoconti, sei caselle, contatori. Se il contratto non basta a farlo da soli, il contratto è incompleto e si riscrive.

## Fase S7 — Il rientro: ciò che lo strumento insegna alla specifica

Il flusso inverso, dovuto e regolato: le idee di InteractiveWriter che meritano di diventare specifica passano dal protocollo — *un profilo nuovo si aggiunge alla specifica, non si inventa per un progetto* — e quelle che non lo meritano si rifiutano a verbale, con la clausola della diciassettesima voce.

Candidati dichiarati, ciascuno con esito da verbalizzare:

| Candidato | Da dove viene | Questione |
|---|---|---|
| Thread con stadi (`startThread`/`advanceThread`/`completeThread`) | formato IW | arricchisce il contenitore C o è presentazione? |
| Red check — la prova che si consuma | motore IW | come si riconcilia con le "prime volte" del §24.4? |
| Inventario a ingombro (capacità, contenitori indossati) | formato 0.4 | modulo candidato o sottosistema privilegiato da rifiutare? |
| Check passivi (D-S6) | motore IW | "non tira mai al posto del giocatore": un confronto senza dado è ammesso o no? |
| Hint di presentazione e tag | formato IW | entrano nel contratto shell della specifica (§24.4)? |
| Salvataggio come elenco di scelte | analisi FAVELLA, CLI IW | candidato a diventare la forma normativa del salvataggio deterministico |

**Uscita:** nessun candidato resta né dentro né fuori — ogni riga della tabella ha un esito scritto: profilo nella specifica (eventuale 1.4/1.5, col suo changelog) oppure rifiuto motivato a verbale.

---

## La tavola delle corrispondenze

La mappa che S4 esegue, fissata ora perché il trapianto non si improvvisi:

| ESPOSIZIONE | Strumento (oggi) | Strumento (dopo S4) |
|---|---|---|
| Firma: 8 profili + 16 voci (§26) | `ruleset` | `firma` (schema di S1) |
| Verbo: nome · ceppo · base · Fondo | `Skill {id, name, attribute}` | verbo completo nel lessico della firma |
| Tiro A1: `1d20 + verbo + impedimento ≥ CD` | `ruleset.check` (quasi identico) | invariato nella sostanza, rinominato |
| Impedimento (−2, cumulo max −6 per verbo) | `modifiers` condizionali | `modifiers` con cumulo sorvegliato (D6) |
| Esposizione = base + Luogo[ceppo] + Momento[ceppo] ± , limitata in [Fondo, 2] | **assente** | `nucleo.ts` (S2) innestato (S4) |
| Griglia 2×3 | 5 fasce derivate dal solo tiro | 6 caselle da (riuscita × Esposizione) |
| Traccia | assente | stato di runtime, deposito automatico |
| Ricevuta / resoconto (§24.4) | % solo in editor | struttura del nucleo, resa prima/dopo |
| Freno · smaltimento (App. A) | assente | `freno.ts` + mappa dei regimi |
| Composizione H1 (4 segmenti giustapposti) | `ContentBlock` | compositore sopra i `ContentBlock` |
| Contenitore C | nodi + thread | invariato, con esito del rientro S7 |
| — (non specificato dalla specifica) | grafo, condizioni, effetti, inventario, editor, validazione live | invariato: è la dote di InteractiveWriter |

## Il registro dei rischi

| # | Rischio | Presidio |
|---|---|---|
| R1 | **La violazione silenziosa di I5**: l'Esposizione che scivola nei modificatori del tiro — la tentazione strutturale del codice esistente | tipi non sommabili dalla prima riga di S2; test di violazione che deve fallire; regola di marcia n. 4 |
| R2 | **Il doppio modello di esiti** (cinque fasce classiche e sei caselle) che convive in D-S5 e confonde gli autori | alternativa esclusiva nel formato; l'editor mostra solo il modello della storia aperta |
| R3 | **Il formato chiuso**: `additionalProperties: false` significa che ogni estensione passa dallo schema, sempre | è una proprietà, non un difetto — ma impone che ogni campo nuovo abbia una fase e un commit, mai un'aggiunta di passaggio |
| R4 | **Saltare il cancello di S3** perché il trapianto è più attraente della misura | il gate è dichiarato due volte (qui e in ROADMAP.md); disattenderlo richiede riscrivere entrambe, a verbale |
| R5 | **La licenza indecisa** che arriva fino a S6 e blocca la pubblicazione del pacchetto | D-S2 ha scadenza in S0, non in S6 |
| R6 | **La storia illimitata**: `history` cresce senza limiti ed è anche formato di salvataggio | si salda in S4 col salvataggio come elenco di scelte; fino ad allora è un debito noto, non un lavoro |

## Che cosa questa roadmap non promette

Non promette un gioco: lo strumento produce logica narrativa, e il multimedia resta dall'altra parte del contratto di consegna. Non promette generazione di testo a runtime: mai, per le tre ragioni che la specifica dichiara (§24.3), e nessuna fase la introduce. Non promette date: le fasi hanno un ordine e dei cancelli, non un calendario — perché il calendario vero lo detta la Fase 3 della specifica, e quella non si comprime.
