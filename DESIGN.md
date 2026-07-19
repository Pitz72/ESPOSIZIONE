# InteractiveWriter — Documento di Design

> Un framework per scrivere **storie interattive con elementi ruolistici** (stile *Disco Elysium*):
> tutta la logica, la complessità e le meccaniche della parte narrativa, con una GUI facile da
> imparare e potente da usare. **Non** produce il "gioco" multimediale: produce la *logica narrativa*
> come pacchetto dati portabile, più il motore che la esegue e l'editor che la scrive.

Versione documento: 0.1 · Data: 2026-07-19

---

## 1. La diagnosi (perché le storie non scalano)

Analizzando i quattro progetti esistenti sono emerse tre strategie diverse per lo stesso problema:

| Progetto | Come modella la logica | Conseguenza |
|---|---|---|
| **Corridor2193** | `condition: (state) => boolean` — funzioni TS dentro le scene | Potente, ma **non serializzabile**, non editabile da GUI, sfugge alla validazione |
| **lemmons-porting** | `NarrativeVariables`: **~160 flag** scritti a mano | *Il muro fatto codice*: ogni ramo aggiunge campi a mano, la coerenza globale collassa |
| **TUBO_N403** | `DialogueRequirement { type, key, value, operator }` — dati tipizzati | **Dichiarativo, serializzabile, validabile**: la direzione giusta |
| **Respiro** | Ink (DSL esterno via inkjs) | Potente ma è un linguaggio a parte, ostile a una GUI |

**Diagnosi.** Le storie non smettono di scalare perché l'LLM (o l'autore) esaurisce la capacità,
ma perché **lo stato vive nel posto sbagliato**: dentro funzioni o dentro un tipo cresciuto a mano.
Ogni ramo in più aumenta il carico cognitivo in modo super-lineare. Oltre un certo numero di nodi,
nessuno regge più la coerenza dell'insieme.

**Tesi.** Esternalizzare *tutta* la logica e lo stato in un **modello dati dichiarativo, serializzabile
e validabile**, e costruirci sopra uno schema, un motore, un validatore e una GUI. Così l'autore — umano
o LLM — non deve mai tenere in testa il grafo intero: scrive contenuto **locale** dentro slot tipizzati,
con un contratto che il validatore verifica all'istante.

---

## 2. Principî di progetto

1. **Dati, non codice.** Nessuna logica narrativa è espressa come funzione. Condizioni ed effetti sono
   dati strutturati → serializzabili, diffabili, editabili da GUI, analizzabili staticamente.
2. **Ruleset configurabile.** Attributi, skill, risorse e formula dei check sono dichiarati *dentro la
   storia*, non cablati nel framework. Un solo framework serve giochi con sistemi di regole diversi.
3. **Presentation-agnostic.** Il formato descrive *cosa* succede, mai *come* appare. Niente CSS, sprite,
   audio, shader. La resa multimediale è responsabilità dello shell che incorpora il motore.
4. **Determinismo verificabile.** Il motore è puro; l'RNG è seedabile. La stessa storia + stato + scelte
   + seed producono sempre lo stesso risultato → playtest riproducibili e test automatici.
5. **Validare è la feature.** Il validatore è ciò che permette di scalare: cattura l'incoerenza che umano
   o LLM introducono al nodo 200.
6. **Locale per l'autore.** Ogni unità di scrittura (nodo, scelta, voce) è comprensibile e modificabile
   in isolamento, con riferimenti simbolici risolti dal sistema.

---

## 3. Architettura in 5 strati

```
┌─────────────────────────────────────────────────────────────┐
│  5. Ponte LLM (skill/plugin)  — co-autore in fase di scrittura│
├─────────────────────────────────────────────────────────────┤
│  4. Editor GUI (Tauri + React) — canvas a grafo + ispettori   │
├─────────────────────────────────────────────────────────────┤
│  3. Validatore  — analisi statica del pacchetto               │
├─────────────────────────────────────────────────────────────┤
│  2. Motore  — runtime puro e deterministico (libreria TS)     │
├─────────────────────────────────────────────────────────────┤
│  1. Formato .iwstory  — JSON versionato, presentation-agnostic│
└─────────────────────────────────────────────────────────────┘
```

Gli strati 1–3 sono il **core** riutilizzabile (una libreria npm). Lo strato 4 è l'app desktop. Lo
strato 5 è opzionale e vive come skill/plugin di Claude Code.

### 3.1 Formato `.iwstory` (strato 1)

Un file JSON versionato. Sezioni principali:

- **`meta`** — id, titolo, versione, locale, autori, `formatVersion`.
- **`ruleset`** — il sistema RPG configurabile: attributi, skill, risorse, formula dei check.
- **`stateSchema`** — dichiarazione tipizzata di tutte le variabili narrative (sostituisce i 160 flag
  di lemmons). Ogni variabile ha tipo e default; l'editor genera da qui i menù di condizioni/effetti.
- **`items`** — catalogo oggetti (id, nome, descrizione, tag).
- **`threads`** — strutture di alto livello: quest e *thought* (Thought Cabinet stile DE).
- **`nodes`** — i passaggi narrativi (contenuto + scelte). Dizionario `id → nodo`.
- **`entry`** — id del nodo iniziale.

Dettaglio completo nella §4 e nello schema `schema/iwstory.schema.json`.

### 3.2 Motore (strato 2)

Libreria TypeScript pura. Contratto centrale:

```ts
interface RuntimeState {
  currentNodeId: string;
  vars: Record<string, boolean | number | string>;   // istanza di stateSchema
  resources: Record<string, number>;                  // istanza di ruleset.resources
  inventory: Record<string, number>;                  // itemId → quantità
  threads: Record<string, string>;                    // threadId → stage corrente
  attributes: Record<string, number>;                 // scelti dal giocatore alla creazione
  skills: Record<string, number>;
  seed: number;                                        // RNG riproducibile
  history: string[];                                   // nodi visitati
}

interface ResolvedNode {
  node: NodeId;
  content: ResolvedContentBlock[];   // solo i blocchi/voci le cui condizioni sono soddisfatte
  choices: ResolvedChoice[];         // ciascuna con available | locked | hidden + motivo
}

// API pura, nessun I/O
function resolveNode(story, state): ResolvedNode;
function evaluate(condition, state): boolean;
function applyEffects(effects, state): RuntimeState;
function rollCheck(check, state): {
  tier: 'critFailure'|'failure'|'partial'|'success'|'critSuccess';
  total: number; target: number; dice: number[]; natural: number;
  resolution: { goto: string; effects?: Effect[]; text?: string };  // dopo il degrado
};
function choose(story, state, choiceId): { state: RuntimeState, resolved: ResolvedNode };
function newGame(story, characterBuild): RuntimeState;
```

Il motore è ciò che **tutti** gli shell (Corridor, Respiro, TUBO…) incorporano invece di riscrivere ogni
volta un proprio `narrativeEngine.ts`.

### 3.3 Validatore (strato 3)

Analisi statica sul pacchetto. Regole (severità *error* / *warning*):

- **E01 goto pendente** — una scelta/check punta a un `nodeId` inesistente.
- **E02 variabile non dichiarata** — una condizione/effetto usa una var assente da `stateSchema`.
- **E03 riferimento invalido** — `@skill:`, `@item:`, `@resource:`, `@thread:` verso un id inesistente.
- **E04 tipo incompatibile** — es. confronto `>` su una var booleana, o `set` di stringa su var numerica.
- **E05 enum fuori dominio** — `set`/confronto con un valore non nell'enum dichiarato.
- **E06 nodo entry mancante** — `entry` non punta a un nodo esistente.
- **E07 formula di check mancante** — la storia usa dei check ma manca `ruleset.check`.
- **W01 nodo irraggiungibile** — nessun cammino dall'`entry` raggiunge il nodo.
- **W02 softlock** — nodo senza alcuna scelta la cui condizione sia soddisfacibile (dead end non voluto).
- **W03 check impossibile** — difficoltà tale che nessun tiro può riuscire (o fallire) mai.
- **W04 flag orfano** — variabile dichiarata ma mai letta, o scritta ma mai letta.
- **W05 thread mai completato** — thread avviabile ma privo di transizione allo stage finale.
- **W06 scelta sempre nascosta** — condizione insoddisfacibile a runtime.

Corridor ha già gli embrioni `validateScenes.ts` e `storyMetrics.ts`: il validatore li generalizza.

> **Nota sull'esperienza dell'autore.** Tutta l'interfaccia (strato 4) è governata da
> [`docs/author-experience.md`](docs/author-experience.md): lingua da autore, complessità progressiva a tre
> livelli, stati creati scrivendo, prove in linguaggio naturale, doppia vista autore/tecnica. Principio:
> *rigore sotto = semplicità sopra.*

### 3.4 Editor GUI (strato 4) — Tauri + React

- **Canvas a grafo**: nodi come carte, archi = `goto`/`check`. Pan/zoom, minimappa, raggruppamento per tag/atto.
- **Ispettore a form**: selezionato un nodo, si editano contenuto, voci e scelte con campi tipizzati.
- **Condizioni/effetti via GUI**: poiché `ruleset` e `stateSchema` sono *dati dichiarati*, i menù a tendina
  di variabili/operatori/valori sono generati automaticamente. Niente codice per il ~90% del lavoro.
- **Pannello validazione live**: le regole §3.3 girano a ogni modifica; click su un errore → salta al punto.
- **Modalità playtest**: incorpora il Motore; si gioca la storia nell'editor, con un *inspector* dello stato
  (var, risorse, inventario, thread) e un pulsante "perché questa scelta è bloccata?".
- **Gestione file**: apre/salva `.iwstory` dal filesystem (vantaggio dell'app desktop Tauri).

### 3.5 Ponte LLM (strato 5)

Assistente in **fase di scrittura** (non a runtime). Opera su tre input:
1. lo **schema** del formato → l'output è sempre JSON valido;
2. il **sotto-grafo locale** (il vicinato dei nodi in modifica) → contesto minimo, non l'intero grafo;
3. il **feedback del validatore** → ciclo genera→valida→correggi.

È qui la risposta al "non si va oltre un tot di durata": il grafo vive in **dati esternalizzati e validati**,
l'LLM scrive *localmente* contro un contratto. La skill **hyper-fable** (già presente) diventa lo strato di
*metodologia narrativa* che guida il ponte: visione, architettura dei nodi, design delle scelte, coerenza.

---

## 4. Il modello dati in dettaglio

### 4.1 Espressioni (condizioni)

Una **condizione** è un albero di soli dati. Foglia o gruppo.

**Foglia** — confronto singolo:
```json
{ "lhs": "fiducia", "op": ">=", "rhs": 3 }
```
- `lhs` è un **riferimento**: nome nudo = variabile di `stateSchema`; oppure `@skill:id`, `@attr:id`,
  `@resource:id`, `@item:id` (quantità posseduta), `@thread:id` (indice stage corrente).
- `op` ∈ `== != > < >= <=`.
- `rhs` è un letterale (`number` | `string` | `boolean`) **oppure** `{ "var": "altraVar" }` per confronto
  variabile-contro-variabile.

**Gruppi** — composizione booleana:
```json
{ "all": [ <cond>, <cond> ] }   // AND
{ "any": [ <cond>, <cond> ] }   // OR
{ "not": <cond> }               // NOT
```

Questo è editabile da GUI (ogni foglia = una riga), serializzabile e validabile: ~95% della potenza di
Disco Elysium senza reintrodurre le funzioni.

### 4.2 Effetti

Lista di mutazioni tipizzate applicate quando una scelta è presa (o all'`onEnter` di un nodo):
```json
[
  { "kind": "set",            "var": "haChiave", "value": true },
  { "kind": "add",            "var": "fiducia",  "value": 1 },
  { "kind": "addItem",        "item": "chiave_zerbino", "qty": 1 },
  { "kind": "removeItem",     "item": "grimaldello",    "qty": 1 },
  { "kind": "adjustResource", "resource": "morale",     "value": -1 },
  { "kind": "startThread",    "thread": "indagine_villa" },
  { "kind": "advanceThread",  "thread": "indagine_villa", "to": "indizio_chiave" },
  { "kind": "completeThread", "thread": "indagine_villa" },
  { "kind": "unlockThought",  "thread": "sospetto_su_elia" }
]
```

### 4.3 Check (prova di abilità) — esiti graduati

Un check può essere **passivo** (si risolve da solo, mostra/nasconde contenuto) o **attivo** (scelto dal
giocatore, l'esito ramifica). *White* = ritentabile; *red* = una volta sola.

I check attivi non sono binari: producono uno **spettro di fasce di esito**, ordinate dal peggio al meglio:

```
critFailure  <  failure  <  partial  <  success  <  critSuccess
```

Ogni check instrada ogni fascia dove vuole, con narrazione ed effetti propri. Questo permette di scrivere
*alternative* (successo parziale con un costo, fallimento che apre un'altra strada) e non solo il crollo.

```json
{
  "skill": "forza",
  "difficulty": 11,
  "mode": "active",
  "retryable": true,
  "modifiers": [
    { "when": { "lhs": "notatoOdore", "op": "==", "rhs": true }, "value": 1, "label": "Sai dov'è lo spiffero" }
  ],
  "outcomes": {
    "critSuccess": { "goto": "retro_aperto", "text": "La porta salta via dai cardini." },
    "success":     { "goto": "retro_aperto" },
    "partial":     { "goto": "retro_aperto", "effects": [ { "kind": "adjustResource", "resource": "morale", "value": -1 } ], "text": "Cede, ma con fracasso: ora sanno che sei qui." },
    "failure":     { "goto": "retro_resiste" },
    "critFailure": { "goto": "retro_resiste", "effects": [ { "kind": "adjustResource", "resource": "morale", "value": -1 } ], "text": "Il grimaldello ti sfugge di mano." }
  }
}
```

**Regola di degrado.** Un check non è obbligato a specificare tutte e cinque le fasce: quelle mancanti
**degradano alla più vicina inferiore** (verso `failure`). Così specificando solo `success` e `failure` si
ottiene il comportamento binario classico (`partial`→`failure`, `critSuccess`→`success`, `critFailure`→`failure`).
Per comodità esiste anche la **forma breve** `onSuccess`/`onFailure`, che il motore espande in
`outcomes.success`/`outcomes.failure`.

La **formula** (dadi, cosa somma, soglie) vive nel `ruleset` (§4.4), non nel check → configurabile per progetto.

**Bersaglio del check (skill o attributo).** Un check punta a `skill: <id>` **oppure** `attribute: <id>`. Il
layer skill è opzionale: i giochi che tirano su statistiche dirette (senza attributo dietro) usano
`attribute`, e `ruleset.skills` può mancare. Con target-attributo il valore dell'attributo è sempre sommato;
con target-skill si sommano skill e/o attributo genitore secondo `ruleset.check.adds`.

### 4.4 Ruleset (configurabile per progetto)

```json
{
  "attributes": [
    { "id": "intelletto", "name": "Intelletto", "default": 2, "min": 1, "max": 6 }
  ],
  "skills": [
    { "id": "logica", "name": "Logica", "attribute": "intelletto", "canSpeak": true }
  ],
  "resources": [
    { "id": "salute", "name": "Salute", "default": 4, "min": 0, "max": 4, "onDepleted": "morte_generica" }
  ],
  "check": {
    "dice": "2d6",
    "adds": ["skill", "modifiers"],
    "compare": ">=",
    "critSuccess": 12,
    "critFailure": 2
  },
  "outcomeModel": {
    "partial": true,
    "partialBand": 2,
    "crits": "natural"
  },
  "characterCreation": { "attributePoints": 6, "skillPoints": 0 }
}
```
`canSpeak: true` marca le skill che possono **interloquire** come voci interiori (il monologo interno di DE).

**`outcomeModel`** definisce come il totale del tiro diventa una fascia (§4.3), *una volta per tutta la storia*:
- `margine = totale − difficoltà`.
- `margine < 0` → `failure`; se `partial:true` e `0 ≤ margine < partialBand` → `partial`; altrimenti `success`.
- `crits`: `natural` = dadi al minimo/massimo assoluto (es. 2 o 12 su 2d6) forzano `critFailure`/`critSuccess`;
  `margin` = usa `critMargin`; `off` = nessun critico.

### 4.5 stateSchema (sostituisce i 160 flag di lemmons)

```json
{
  "haChiave":  { "type": "boolean", "default": false, "label": "Ha la chiave dello zerbino" },
  "fiducia":   { "type": "number",  "default": 0, "min": 0, "max": 5, "label": "Fiducia di Carli" },
  "approccio": { "type": "enum", "values": ["neutrale","diretto","empatico"], "default": "neutrale" }
}
```
Dichiarare lo stato dà tre cose gratis: UI generata, validazione dei tipi, refactoring sicuro (rinominare
una var aggiorna tutti i riferimenti).

### 4.6 Nodo

```json
{
  "id": "atrio",
  "title": "Ingresso della villa",
  "tags": ["atto1", "villa"],
  "onEnter": [ { "kind": "startThread", "thread": "indagine_villa" } ],
  "content": [
    { "speaker": "Narratore", "text": "La porta cede. L'atrio odora di polvere e di sale." },
    {
      "speaker": "@skill:empatia",
      "text": "Qualcuno ha pianto qui, di recente.",
      "requires": { "check": { "skill": "empatia", "difficulty": 10, "mode": "passive" } }
    }
  ],
  "choices": [
    {
      "id": "forza_porta",
      "text": "Forza la porta sul retro.",
      "requires": { "lhs": "@item:grimaldello", "op": ">=", "rhs": 1 },
      "whenLocked": "hide",
      "check": {
        "skill": "forza", "difficulty": 11, "mode": "active", "retryable": true,
        "onSuccess": "retro_aperto", "onFailure": "retro_resiste"
      }
    },
    {
      "id": "sali_scale",
      "text": "Sali le scale.",
      "effects": [ { "kind": "set", "var": "haChiave", "value": false } ],
      "goto": "piano_superiore"
    }
  ]
}
```

- **Voce** = blocco `content` con `speaker: "@skill:*"` e un `requires` (spesso un check passivo).
- **`whenLocked`** ∈ `hide | show` — se mostrare la scelta in grigio con motivazione, o nasconderla.
- Una scelta ha `check` **oppure** `goto` (il check porta la sua destinazione in `onSuccess`/`onFailure`).
- **`onFirstEnter`** (accanto a `onEnter`) — effetti applicati **solo alla prima visita** del nodo: evita
  che i cicli/hub impilino gli effetti al rientro. Il motore lo calcola da `history`.
- **`tags`** su una scelta — categoria/affinità libera (combat, stealth, tech…). Solo metadato, riportato in
  output per lo shell.
- **`hints`** su un blocco `content` — oggetto libero di hint di presentazione (glitch, typingSpeed…):
  ignorato dal motore, preservato nel round-trip. Il formato resta presentation-agnostic sulla *logica*.

### 4.7 Threads (quest + Thought Cabinet)

```json
{
  "indagine_villa": {
    "name": "Cosa è successo alla villa",
    "type": "quest",
    "stages": ["avviata", "indizio_chiave", "risolta"]
  },
  "sospetto_su_elia": {
    "name": "Elia nasconde qualcosa",
    "type": "thought",
    "stages": ["intuizione", "interiorizzato"],
    "onComplete": [ { "kind": "add", "var": "fiducia", "value": -1 } ]
  }
}
```

---

## 5. Ciclo di runtime (come gira una scelta)

```
1. resolveNode(story, state)
   → valuta requires di ogni content block  → tiene solo i visibili (incl. voci con check passivi)
   → valuta requires di ogni choice         → available | locked(motivo) | hidden
2. Il giocatore sceglie choiceId
3. choose(story, state, choiceId):
   a. se la scelta ha un check attivo → rollCheck() → fascia di esito (con degrado) → risoluzione:
      text di fascia + effects di fascia + goto di fascia
   b. applica gli effects della scelta (applyEffects)
   c. imposta currentNodeId = goto risolto
   d. applica onEnter del nuovo nodo
   e. controlla risorse esaurite (onDepleted) → eventuale nodo forzato
   f. push in history
   → { state', resolveNode(story, state') }
```

Tutto puro. Il seed nello stato rende ogni `rollCheck` riproducibile.

---

## 6. Interoperabilità con i progetti esistenti

Il formato è pensato per essere **adottato incrementalmente**:

- **Corridor2193** → il suo `Scene`/`Choice`/`skillCheck` mappa quasi 1:1 sul formato; le `condition`-funzione
  vanno convertite in condizioni-dati (operazione che il validatore poi protegge).
- **lemmons-porting** → i 160 flag di `NarrativeVariables` diventano `stateSchema`; le 39 scene diventano nodi.
- **TUBO_N403** → già dichiarativo: `DialogueRequirement`→condizione foglia, `DialogueEffect`→effetto,
  `DialogueTree`→`nodes`. Migrazione quasi meccanica.
- **Respiro** → un importer Ink→.iwstory è possibile ma è lavoro a parte (Ink ha costrutti che vanno mappati).

Ogni shell continua a fare la resa multimediale che vuole; cambia solo che smette di reimplementare il motore.

---

## 7. Roadmap proposta

**Fase 0 — Fondamenta (questo documento).** Formato + schema JSON + storia d'esempio validabile. ✅

**Fase 1 — Core (libreria `@interactivewriter/core`).**
- Tipi TS generati/allineati allo schema.
- Motore: `newGame`, `resolveNode`, `evaluate`, `applyEffects`, `rollCheck`, `choose`.
- Validatore: regole E01–E06, W01–W06.
- Test: la storia d'esempio giocata end-to-end con seed fisso.

**Fase 2 — CLI headless.**
- `iw validate storia.iwstory` — report validazione.
- `iw play storia.iwstory` — playthrough testuale in terminale (utile prima della GUI).

**Fase 3 — Editor (Tauri + React).**
- Canvas a grafo + ispettori generati da `stateSchema`/`ruleset`.
- Validazione live + playtest incorporato.

**Fase 4 — Ponte LLM (skill).**
- Skill che genera nodi/rami schema-validi nel vicinato selezionato, in ciclo con il validatore.
- Integrazione con `hyper-fable` come metodologia narrativa.

**Fase 5 — Importer.**
- Migrazione assistita da Corridor / lemmons / TUBO.

---

## 8. Domande aperte (da decidere in Fase 1)

1. **Character creation**: sistema a punti (come da `ruleset.characterCreation`) o build fisse per storia?
2. **Salvataggi**: lo `RuntimeState` è già il salvataggio; serve versionamento migrazione tra versioni della storia?
3. **Localizzazione**: i testi restano inline nel nodo o si estraggono in tabelle per-locale?
4. **Macro/riuso**: servono "nodi template" o snippet di condizioni riusabili, o si rimanda?
5. **Tempo/turni**: qualche storia vuole un orologio o contatore di round globale nel motore?

Nessuna di queste blocca la Fase 1: sono estensioni compatibili del formato.
