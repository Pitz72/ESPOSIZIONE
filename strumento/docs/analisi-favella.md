# Analisi di FAVELLA 1 — cosa vale la pena rubare

Data: 2026-07-20 · Fonte: `C:\Users\Utente\Documents\GitHub\FAVELLA1`

> **Nota del 19 agosto 2026.** Questo documento è stato scritto quando lo strumento si chiamava
> InteractiveWriter, viveva in un'altra sede e non conosceva la specifica: guarda quindi al solo modello
> del mondo. Resta valido — i suoi nove punti sono in gran parte già in roadmap — ed è affiancato da
> [`../../ANALISI-FAVELLA.md`](../../ANALISI-FAVELLA.md), che copre il lato della specifica, il processo
> di rilascio e le parti tecniche che qui non erano state viste (fra tutte: la casualità dentro
> l'istantanea dell'annullamento).

FAVELLA 1 è un compilatore + motore per **avventure testuali scritte in italiano naturale** (`.fav`),
nello spirito di Inform 7. La direzione è lontana dalla nostra — noi non abbiamo un parser di comandi né
una grammatica italiana da far tornare — ma **sotto il parser c'è un modello del mondo dichiarativo
maturo**, con 312 test e sei storie complete a validarlo. Questo documento registra cosa è utile, cosa no,
e perché.

## Dimensioni

| Parte | Consistenza |
|---|---|
| Motore Python | 14 file, ~14.700 righe (`strutture.py` 1159 = il modello dati; `compilatore.py` 4590 = grammatica) |
| Editor `studio/` | Electron + React + TS + Monaco, 32 file, ~8.580 righe |
| Test | 312 (unittest puro, nessun framework) |
| Storie | 6 demo complete, fra cui una GDR |

---

## Da prendere

### 1. Proprietà come aggettivi + registro di coppie opposte
`strutture.py:761`, `:241-255`

Lo stato di un oggetto non è un campo tipato: è un **insieme di aggettivi liberi** (`aperto`, `acceso`,
`rotto`). La coerenza viene da un **registro di coppie opposte** — `aperta↔chiusa`, `accesa↔spenta` —
precaricato ma **estendibile dall'autore** (`Vestita e svestita sono opposte.`). Assegnare una proprietà
**rimuove automaticamente l'opposta**.

Un solo meccanismo copre tutti gli stati degli oggetti, presenti e futuri, senza una riga di codice per
ognuno. È il miglior rapporto potenza/complessità del progetto, e per noi è la forma naturale in cui
modellare lo stato degli oggetti quando arriverà il pannello Oggetti.

### 2. Sentinelle a due modalità: a livello vs fronte di salita
`strutture.py:518-543`

Il loro *demone* ha due forme: **`ogni turno se X`** (effetto continuo, scatta a ogni turno in cui la
condizione è vera) e **`quando X diventa vera`** (una volta sola, sul passaggio falso→vero). È la
distinzione fra effetto continuo e trigger one-shot che ogni sistema narrativo reinventa male. Il flag
`era_vera` viene inizializzato a fine compilazione, così una condizione già vera all'avvio non produce un
falso fronte.

Noi non abbiamo nulla del genere: `onEnter`/`onFirstEnter` sono legati al nodo, non allo stato del mondo.

### 3. Un solo passaggio ordinato per turno
`gioco.py:227-250`

Le sentinelle sono valutate **una volta sola per turno, in ordine di dichiarazione**. Le cascate sono
deterministiche e i cicli infiniti impossibili *per costruzione*, non per patch. Se adottiamo il punto 2,
adottiamo anche questa regola.

### 4. Salvataggio come elenco di scelte, non come stato
`favella_server.py:240-284`

Il save non serializza il mondo: salva la sorgente e **la lista dei comandi**, e al caricamento rigioca.
Possibile solo perché il motore è deterministico — e il nostro lo è (RNG seedato, `mulberry32`). Regala
gratis **replay e walkthrough**, che è esattamente ciò che serve al playtest incorporato. La nostra CLI ha
già `--choices`: è lo stesso concetto, va solo promosso a formato di salvataggio.

### 5. Diff per turno nel debugger
`studio/.../DebugPanel.tsx:15-62`

Uno snapshot per turno, e il pannello mostra il **differenziale** fra due snapshot come lista tipizzata:
`📍 spostamento`, `＋/－ inventario`, `◆ variabile: vecchio → nuovo`, `⚙ proprietà`. Cento righe, valore
enorme per chi scrive. Da fare in lingua d'autore nel nostro playtest.

### 6. Analisi statica di vincibilità
`collaudo.py` (610 righe)

Indicizza **ogni conseguenza del mondo** come "produttore" di un fatto, poi **risale a ritroso** dalla
condizione di vittoria: *per vincere serve X → X è prodotto da questa regola → che richiede Y → …*, con
guardia anti-ciclo e tetto di profondità. Marca ogni nodo come `vero all'avvio` / `bloccante` (nessun
produttore: ostruzione) / `ciclico` / `troncato`.

È il nostro validatore portato al livello successivo, e si applica identico a un formato JSON. **Ma solo
dopo che il formato è stabile.** Due avvertenze loro, da tenere:
- il modulo dichiara nel proprio report di essere un'euristica e non una prova (`LIMITE_ONESTO`);
- il **playtester dinamico** (BFS sullo spazio degli stati) è stato tentato e **accantonato** perché
  produceva falsi "non vincibile".

### 7. Il linter a quattro controlli
`compilatore.py:2008-2130`

Stanze irraggiungibili · **oggetti orfani** (mai collocati e mai introdotti da una conseguenza: *il
giocatore non potrà mai trovarlo*) · regole morte (oscurate da una precedente) · variabili inutilizzate.
Il primo e il quarto li abbiamo già (W01, W04). Gli altri due sono da aggiungere quando avremo oggetti e
condizioni composte.

### 8. Conferma indipendente sull'ingombro
`strutture.py:1030-1044`

Il loro `capacita_base` + somma dei `bonus_capacita` degli oggetti portati è **identico** a ciò che
abbiamo appena introdotto nella 0.4 (`baseCapacity` + `capacityBonus`). Due progetti che arrivano allo
stesso modello per strade diverse: è la conferma che è quello giusto.

### 9. Effetti che non stampano
`strutture.py:390-444`

Le conseguenze non scrivono a schermo: accodano annunci in una coda che il loop svuota. Separazione
effetto/presentazione — la stessa disciplina che ci siamo dati con "presentation-agnostic". Nel resto del
progetto invece si stampa direttamente con `print()`, e il server è costretto a catturare lo stdout: la
loro eccezione indica la strada, la regola no.

---

## Da non prendere

- **Il parser di linguaggio naturale italiano** (`compilatore.py`, 4590 righe di grammatica Lark,
  concordanza, articoli, anafora). Fuori scopo: il 40% del progetto.
- **Il mondo come singleton mutabile con `deepcopy` su `__dict__`**. Funziona in Python, è un antipattern
  in TS. Prendiamo l'idea (stato-mondo vs stato-sessione, snapshot immutabili), non l'implementazione.
- **L'editor come codice**: è cucito su un round-trip testo↔visuale che noi non abbiamo (la nostra fonte
  di verità è già JSON). Utile solo come **checklist di UX**: quali pannelli servono davvero (gioca,
  mappa, stato, debug, oggetti, stanze, regole, stati, dialoghi).
- **L'assenza di archetipi/template per gli oggetti.** Loro lo dichiarano come limite noto («dieci goblin
  = dieci copie») e hanno **scelto** di non risolverlo per non complicare la grammatica italiana.
  **Noi quel vincolo non ce l'abbiamo**: un formato JSON può avere `extends` senza costo di grammatica, e
  per una storia ruolistica (nemici, PNG, oggetti equipaggiabili) serve. È un requisito nostro, non un
  limite da ereditare.

---

## Conseguenze sulla roadmap

1. **Pannello Oggetti** (già in coda): stato degli oggetti modellato con **proprietà + coppie opposte**
   (§1); **archetipi `extends`** per non ripetere cento volte lo stesso oggetto; catalogo di modelli
   fornito con l'editor e **copiato** dentro la storia, mai conosciuto dal motore.
2. **Playtest incorporato**, promosso in coda: **diff per turno** (§5) e **salvataggio come elenco di
   scelte** (§4), che si appoggia al determinismo che già abbiamo.
3. **Sentinelle "quando / ogni volta che"** (§2, §3): voce nuova della roadmap, dopo il wizard delle prove.
4. **Analisi di vincibilità** (§6): in fondo, dopo che il formato si è assestato — e dichiarata come
   euristica, non come prova.
