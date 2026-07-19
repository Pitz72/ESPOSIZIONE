# Esperienza dell'Autore (AX) — documento di design

> La spec che governa tutta l'interfaccia di InteractiveWriter da qui in avanti.
> Obiettivo: un autore **senza competenze di programmazione** deve poter scrivere una storia interattiva
> ruolistica avanzata (prove di abilità, conseguenze, stati, finali multipli) facendo un lavoro eccellente,
> **senza mai esserne terrorizzato** e senza mai vedere codice, id o gergo — a meno che non lo voglia.

Versione: 1.0 · Data: 2026-07-20 · Stato: **spec attiva** (governa la Fase 3 e oltre)

---

## 1. Il problema e la scommessa

Chi scrive una storia ruolistica è, nello stesso momento, **due persone**:
- un **romanziere** — pensa a scene, personaggi, scelte, atmosfera, ritmo;
- un **game designer** — pensa a stati, condizioni, probabilità, conseguenze, bilanciamento.

Gli strumenti esistenti scelgono a chi dare torto: Twine è semplice ma ingestibile su larga scala; Ink è
potente ma è un linguaggio; i flag a mano sono l'inferno (vedi `lemmons`, 160 flag). **Noi rifiutiamo il
compromesso.**

## 2. Principio guida: rigore sotto, semplicità sopra

Il modello dati dichiarativo e validato che sta sotto (formato `.iwstory`, motore, validatore) **non è un
ostacolo alla semplicità: ne è la condizione.** Proprio perché tutto è dato tipizzato e non codice,
l'interfaccia può:

1. **parlare la lingua dell'autore** (rinominare non basta: cambia il modello mentale);
2. **creare gli stati mentre l'autore scrive**, non prima;
3. **calcolare e mostrare le probabilità** di una prova (il motore è deterministico → simulabile);
4. **prevenire gli errori per costruzione** invece di segnalarli;
5. **far giocare** la storia per capirla.

**Corollario operativo:** la lingua da autore è **architettura, non vernice**. Ogni feature nuova nasce
writer-first. La vista tecnica resta disponibile ma nascosta (per l'utente esperto, il debug, il ponte LLM).

## 3. I tre livelli (complessità progressiva)

L'autore non affronta mai tutta la complessità insieme. Sceglie (o gli viene proposto) un livello; l'editor
mostra **solo** ciò che serve a quel livello. Si può salire in qualsiasi momento; salire non rompe nulla.

| Livello | L'autore pensa a… | Cosa vede | Cosa resta nascosto |
|---|---|---|---|
| **1 · Racconto** | Scene, bivi, prosa, finali | Scene e scelte che "portano a…" | Fatti, condizioni, scheda, prove |
| **2 · Con conseguenze** | + memoria e scelte che contano | + "Cose che la storia ricorda", "Appare solo se…", "Cosa cambia" | Scheda del personaggio, prove |
| **3 · Ruolistico** | + abilità e rischio | + Scheda del personaggio, Prove di abilità con % ed esiti graduati | (niente — è il livello pieno) |

Il livello è una proprietà della storia (non del formato: sotto è sempre lo stesso `.iwstory`). Determina
solo **quali pannelli e quali verbi** l'editor espone.

## 4. Il vocabolario dell'autore (canonico)

Termini ufficiali dell'UI. Il lato tecnico (colonna destra) non appare mai nell'interfaccia dell'autore.

| Termine autore | Significato | Sotto (tecnico) |
|---|---|---|
| **Scena** | Un momento della storia: testo + scelte | `node` |
| **Scelta** | Ciò che il lettore può fare | `choice` |
| **Porta a…** | Dove continua la storia | `goto` |
| **Cose che la storia ricorda** | Fatti e valori memorizzati | `stateSchema` |
| — **un fatto** (sì/no) | Es. "ha la chiave" | var `boolean` |
| — **un contatore** | Es. "fiducia di Carli" | var `number` |
| — **uno stato** | Es. approccio: cauto / diretto | var `enum` |
| **Scheda del personaggio** | Abilità e indicatori | `ruleset` |
| — **Abilità / Caratteristica** | Es. Forza, Empatia | `attribute` / `skill` |
| — **Indicatore** | Es. Salute, Stress, Morale | `resource` |
| **Prova di abilità** | Un'azione col rischio di fallire | `check` |
| **Difficoltà** (a parole) | Banale…Arduo | `difficulty` (numero) |
| **Appare solo se…** | Quando una scelta/blocco è visibile | `requires` |
| **Cosa cambia** | Conseguenze di una scelta | `effects` |
| **Filo narrativo** | Un'indagine, una missione, un pensiero | `thread` |
| **Solo la prima volta** | Effetti non ripetuti al rientro | `onFirstEnter` |

Regole di scrittura UI (dallo stile della casa): sentence case ovunque, niente punto sui pulsanti/etichette,
niente "!", verbi all'inizio ("Crea scena", non "Creazione scena"), niente id in vista.

## 5. Pattern d'interazione fondamentali

### 5.1 Fatti creati scrivendo *(la leva più importante)*
L'autore **non dichiara mai gli stati in anticipo.** Mentre scrive una conseguenza o una condizione,
digitando in linguaggio naturale, l'editor riconosce e propone la creazione del fatto:

> Cosa cambia: `ora ha la chiave` → *l'editor propone:* **Crea il fatto "ha la chiave" (sì/no)?** ✓

Da quel momento "ha la chiave" è disponibile ovunque (condizioni, altre conseguenze) da un elenco. La
"pagina bianca" del *"prima devi dichiarare le variabili"* — il terrore n.1 — **sparisce**: gli stati si
accumulano come sottoprodotto della scrittura. L'editor dello schema esiste ancora, ma come *vista di
riordino* opzionale, non come porta d'ingresso obbligatoria.

### 5.2 Scene inline, mai un id
L'autore crea scene **mentre definisce le scelte**: in "Porta a…" può scegliere una scena esistente oppure
**+ Crea nuova scena** dando un titolo ("L'atrio della villa"). L'id è generato e gestito dal sistema,
invisibile. Rinominare il titolo non rompe i collegamenti (i riferimenti sono all'id interno).

### 5.3 Prove di abilità in lingua naturale
Il wizard non chiede formule. Chiede (vedi mockup di riferimento):
1. **Cosa prova a fare il personaggio?** (testo libero)
2. **Con quale abilità?** (elenco delle abilità della storia; *+ crea abilità* al volo)
3. **Quanto è difficile?** a parole — **Banale · Facile · Medio · Difficile · Arduo**
4. **Cosa succede** — a corsie: **Se riesce / Se riesce a metà (opzionale) / Se fallisce** → ciascuna porta
   a una scena e/o applica conseguenze.

**Difficoltà definita in probabilità.** I preset non sono numeri magici: sono **obiettivi di riuscita per un
personaggio tipico**, che l'editor traduce nel numero di difficoltà giusto per il ruleset in uso
(qualunque dado/abilità). Riferimento:

| Preset | Riesce circa | (con 2d6 + abilità media 3) difficoltà ≈ |
|---|---|---|
| Banale | ~95% | 5 |
| Facile | ~80% | 7 |
| Medio | ~65% | 9 |
| Difficile | ~45% | 11 |
| Arduo | ~25% | 13 |

Accanto alla scelta, sempre visibile: **"Per un personaggio medio, riesce ≈ N%"**, calcolato dal motore
(deterministico → si simula/enumera la distribuzione dei dadi). Questo **demistifica la matematica**: l'autore
regola il rischio guardando una percentuale, non un numero astratto.

Gli **esiti graduati** (critico/pieno/parziale/fallimento/critico negativo) sono presentati come corsie
opzionali: chi vuole solo riesce/fallisce ne compila due; chi vuole sfumature ne aggiunge. Il "successo
parziale" è spiegato in una riga ("riesce, ma con un costo"), non come fascia numerica.

### 5.4 Condizioni: "Appare solo se…" a frase
Il costruttore compone una **frase**, non un'espressione:

> **Appare solo se** — [ ha la chiave ] [ è vero ] · **e anche** [ fiducia di Carli ] [ almeno ] [ 3 ]

I menù elencano i **fatti** creati (con i loro nomi naturali) e gli **indicatori/abilità**; l'operatore è a
parole ("è vero/falso", "almeno", "meno di", "è uguale a"); il valore si adatta al tipo (interruttore sì/no,
numero, elenco per gli stati). "E anche"/"Oppure"/"Tranne quando" costruiscono le condizioni composite
(`all`/`any`/`not`) senza che l'autore sappia cosa siano. Nessun `@resource:` grezzo, nessuna parentesi.

### 5.5 Conseguenze: "Cosa cambia"
Elenco di frasi: "**imposta** ha la chiave a sì", "**aumenta** fiducia di Carli di 1", "**togli** grimaldello",
"**Salute** −10". Aggiunta guidata dagli stati esistenti + creazione al volo (§5.1).

### 5.6 Validazione gentile *(nudge, non muro)*
Il validatore resta il guardiano della coerenza, ma parla come un editor amichevole. Niente codici, niente
rosso aggressivo salvo che sia davvero un blocco. Traduzione:

| Regola tecnica | Messaggio all'autore |
|---|---|
| E01 goto pendente | "Questa scelta non porta da nessuna parte. Vuoi collegarla a una scena?" |
| W01 nodo irraggiungibile | "A questa scena non arriva nessun percorso. È una scena orfana?" |
| W02 softlock / vicolo cieco | "Da qui non si può proseguire. Manca un finale o una via d'uscita?" |
| W03 prova impossibile | "Questa prova riesce sempre (o non riesce mai): forse la difficoltà va rivista." |
| W04 fatto mai usato | "Ti segni 'ha la chiave' ma non lo controlli mai. Serve davvero?" |
| E02 fatto non dichiarato | *non può accadere:* i fatti si creano scrivendo |

Dove possibile si **previene** invece di segnalare: una nuova scelta propone di default *+ Crea nuova scena*
di destinazione, così un vicolo cieco non nasce per distrazione.

### 5.7 Playtest come strumento di comprensione
Un pulsante **Prova** gioca la storia come farà il lettore, con accanto un pannello di stato in lingua
naturale ("Salute: 3 · Ha la chiave: sì · Fiducia di Carli: 2"). È così che un autore non tecnico **capisce
la propria logica**: giocandola. Il playtest riusa il motore (`newGame/resolveNode/choose`) e mostra, sulle
prove, il tiro e l'esito graduato in chiaro.

## 6. La doppia vista

Ogni pannello ha un interruttore discreto **Vista autore / Vista tecnica**. Di default: autore. La vista
tecnica mostra il dato grezzo (`requires`, `effects`, `2d6 + Forza ≥ 9`, gli id) per chi vuole, per il debug
e per il ponte LLM. **Non è una modalità separata: è lo stesso dato, spiegato in due lingue.** L'autore medio
non la aprirà mai.

## 7. Onboarding: template e primo avvio

- Nessuna pagina bianca. Il primo avvio propone **template** che pre-configurano una scheda sensata:
  "Librogame classico" (livello 1), "Indagine con conseguenze" (livello 2), "Avventura ruolistica" (livello 3,
  con Abilità e Indicatori già pronti).
- Il template porta con sé 2–3 scene d'esempio commentate, così l'autore vede *come si fa* invece di partire
  dal vuoto.
- Un pannello "Prossimo passo" suggerisce sempre un'azione concreta ("Aggiungi la prima scelta a questa scena").

## 8. Regole di UX non negoziabili

1. **Mai gergo** nell'interfaccia dell'autore (vedi §4). Mai un id, mai `goto`, mai `@…`, mai "boolean".
2. **Mai la pagina bianca**: template all'avvio, stati creati scrivendo, destinazioni create inline.
3. **Mai un muro rosso**: la validazione è un consiglio, si previene più che segnalare (§5.6).
4. **Le probabilità sempre visibili** dove c'è del rischio (§5.3).
5. **Complessità a scomparsa**: nulla del livello superiore è visibile finché non serve (§3).
6. **Numeri sempre in parole** dove possibile (difficoltà, e più avanti tempo/turni).
7. **La prosa è al centro**, il grafo è una *vista*, non la superficie primaria di scrittura.
8. **Reversibilità**: annulla/ripeti ovunque; nessuna azione distruttiva senza rete.

## 9. Impatto sul resto della Fase 3

Riordino della roadmap dell'editor alla luce di questa spec (ogni voce è writer-first):

1. **Layer linguistico**: rinominare l'intera UI nel vocabolario §4 + interruttore Vista autore/tecnica.
2. **Fatti creati scrivendo** (§5.1) + **conseguenze "Cosa cambia"** (§5.5).
3. **Costruttore di condizioni "Appare solo se…"** a frase (§5.4), incluse composte.
4. **Wizard Prova di abilità** con difficoltà a parole e **% dal vivo** (§5.3).
5. **Playtest incorporato** con pannello di stato in chiaro (§5.7).
6. **Livelli 1–3** e **template** d'avvio (§3, §7).
7. **Canvas a grafo** come vista secondaria; **dialog nativi Tauri**.

## 10. Cosa NON facciamo (anti-goal)

- Non trasformiamo l'autore in un programmatore "gentile": niente mini-linguaggio da imparare, niente
  espressioni da digitare.
- Non nascondiamo la potenza: il livello 3 ha tutto Disco-Elysium (esiti graduati, voci, fili narrativi).
  La semplicità è nell'*accesso*, non nell'amputazione.
- Non inventiamo una seconda fonte di verità: la vista autore e quella tecnica sono lo **stesso** `.iwstory`.
