# Roadmap di continuità — InteractiveWriter

> Documento di passaggio tra sessioni di lavoro. Dice **dove siamo**, **come si esegue**, **dove si va** e
> **qual è il prossimo passo concreto**. Chi riprende (umano o AI) parte da qui.

Ultimo aggiornamento: 2026-07-20 · Versione progetto: **0.5.0**
Repository: <https://github.com/Ecosystem-Runtime/InteractiveWriter> (privata)

---

## 1. La visione in tre righe

Un framework per scrivere **storie interattive con elementi ruolistici** (stile *Disco Elysium*): tutta la
logica, la complessità e le meccaniche narrative. Non produce il gioco multimediale, ma la **logica narrativa**
come pacchetto dati portabile, il motore che la esegue e l'editor che la scrive.

Filosofia non trattabile: **rigore sotto = semplicità sopra**. Il modello dati dichiarativo e validato è ciò
che permette di nascondere una complessità avanzatissima dietro un uso semplice per un autore **senza
competenze tecniche**. Vedi [`docs/author-experience.md`](docs/author-experience.md) — è la spec che governa
tutta l'interfaccia.

## 2. Architettura (5 strati)

1. **Formato `.iwstory`** — JSON versionato, presentation-agnostic ([`schema/`](schema/), [`DESIGN.md`](DESIGN.md)).
2. **Motore** — libreria TS pura e deterministica ([`core/src/engine.ts`](core/src/engine.ts)).
3. **Validatore** — analisi statica ([`core/src/validator.ts`](core/src/validator.ts)).
4. **Editor GUI** — Tauri + React, writer-first ([`editor/`](editor/)).
5. **Ponte LLM** — co-autore in fase di scrittura (da fare).

## 3. Dove siamo — cosa è fatto

| Versione | Cosa |
|---|---|
| 0.0.0 | Fondamenta: formato, schema JSON, esempio |
| 0.0.1 | Core: motore + validatore (13 test) |
| 0.0.2 | CLI `iw` (validate / play) (6 test) |
| 0.0.3 | Formato v0.3: esiti graduati, check skill/attributo, `onFirstEnter`, `tags`, `hints` |
| 0.0.4 | Formato checkless/statless (G11) + collaudo #02 (lemmons) |
| 0.1.0 | Editor MVP (Tauri+React, editing-first) |
| 0.2.0 | Editor writer-first: layer linguistico + doppia vista Autore/Tecnica |
| 0.3.0 | Fatti creati scrivendo + editor delle conseguenze "Cosa cambia" |
| 0.4.0 | Formato 0.4: crescita del personaggio, ingombro, personaggi pronti |
| 0.5.0 | **Editor: pannello Configurazione iniziale** + analisi di FAVELLA 1 |

- **Formato `.iwstory`**: `formatVersion` **0.4** (lo schema accetta ancora 0.3). Collaudato su due
  migrazioni reali. La 0.4 aggiunge ciò che serve al modello *Disco Elysium*: le prove non cambiano solo
  dove va la storia, cambiano **il personaggio** (`adjustSkill`/`adjustAttribute`); l'inventario ha una
  capacità che dipende da cosa si indossa (`ruleset.inventory` + `size`/`capacityBonus`, refs
  `@free`/`@carried`/`@capacity`);
  esistono **personaggi pronti** (`ruleset.presets`) e una **configurazione generale** (`setting`).
- **Collaudi**: [Corridor](docs/collaudo-01-corridor.md) (funzioni-condizione, skill check, risorse) e
  [lemmons](docs/collaudo-02-lemmons.md) (logica imperativa in HTML, stato piatto, zero dadi). Entrambi
  migrati senza forzature: la tesi (logica→dato dichiarativo) regge ai due estremi.
- **Test**: 49 verdi (29 core + 6 CLI + 14 editor).
- **Esempi**: `atrio-villa` (sintetico), `corridor-act1`, `lemmons-carli` — tutti validano contro lo schema.
- **Editor**: vista Autore (Scene per titolo, "Appare solo se…" a frase, "Cosa cambia", validazione gentile)
  + vista Tecnica (dato grezzo) sullo stesso file. Verificato dal vivo nel browser.
- **Fatti creati scrivendo**: l'autore scrive *«ora ha la chiave»* fra le conseguenze e il fatto nasce da
  solo (riconoscitore in `editor/src/lib/factLang.ts`); i riferimenti già esistenti vengono riconosciuti per
  nome, senza doppioni. Nessuna dichiarazione preliminare, nessun id a schermo.
- **Configurazione iniziale**: tab *Impostazioni* con La storia · Il personaggio · Oggetti trasportabili ·
  La scheda (`editor/src/components/SetupPanel.tsx`). La scheda del personaggio, prima in sola lettura, è
  modificabile.

## 4. Come si esegue

Serve **Node ≥ 22.6** (type-stripping nativo, i test girano senza build). Per l'editor Tauri serve **Rust**.

```bash
# Test (49 verdi)
cd core && node --test
cd ../cli && node --test
cd ../editor && node --test        # riconoscitore delle conseguenze (14)

# Validare / giocare una storia da terminale
node cli/src/iw.ts validate examples/lemmons-carli.iwstory.json
node cli/src/iw.ts play examples/corridor-act1.iwstory.json --seed 1 --choices wake_up,who_are_you,escape_force

# Editor: frontend nel browser (verificabile senza Tauri)
cd editor && npm install && npm run dev      # http://localhost:1420
cd editor && npm run tauri:dev               # app desktop nativa (richiede Rust)
```

## 5. Mappa dei file chiave

- [`DESIGN.md`](DESIGN.md) — design generale, formato, roadmap tecnica.
- [`docs/author-experience.md`](docs/author-experience.md) — **spec dell'esperienza d'autore (governa l'UI)**.
- [`docs/analisi-favella.md`](docs/analisi-favella.md) — cosa prendere (e cosa no) dal progetto FAVELLA 1.
- [`schema/iwstory.schema.json`](schema/iwstory.schema.json) — JSON Schema del formato.
- [`core/src/`](core/src/) — `types`, `rng`, `dice`, `engine`, `validator`, `index` (+ test).
- [`cli/src/`](cli/src/) — comando `iw`.
- [`editor/src/`](editor/src/) — `App`, `view` (doppia vista), `lib/authorLang` (traduttore lingua d'autore),
  `lib/factLang` (**dalla frase d'autore all'effetto + fatto proposto**, con test), `lib/summarize`,
  `components/*` (fra cui `EffectsEditor`, l'editor di "Cosa cambia").
- [`CHANGELOG.md`](CHANGELOG.md) — un file per versione in `CHANGELOG/`.

## 6. Dove si va — roadmap AX (ordine writer-first)

Dalla spec §9, ricostruzione dell'editor nella lingua dell'autore:

Ordine **riordinato con l'autore il 2026-07-20** (confronto sui quattro punti: oggetti non automatizzati,
configurazione iniziale mancante, ramificazione sulle caratteristiche, modello *Disco Elysium* in cui la
prova cambia anche il personaggio):

1. ✅ Layer linguistico + doppia vista Autore/Tecnica *(0.2.0)*.
2. ✅ **Fatti creati scrivendo** + editor delle conseguenze "Cosa cambia" *(0.3.0)*.
3. ✅ **Formato 0.4**: crescita del personaggio, ingombro, personaggi pronti, `setting` *(0.4.0)*.
4. ✅ Editor: pannello **Configurazione iniziale** — la storia, personaggi pronti, ingombro, scheda
   modificabile *(0.5.0)*.
5. ⬜ Editor: pannello **Oggetti** *(← prossimo)* — database della singola storia modificabile mentre si scrive, che
   toglie l'ultimo ripiego (l'oggetto non dichiarato modellato come fatto «ha X»). Con **archetipi**
   (`extends`) e un **catalogo di modelli** fornito con l'editor e *copiato* dentro la storia: il motore
   non conosce nessun oggetto predefinito, o smetterebbe di essere configurabile.
6. ⬜ **Playtest incorporato** (riuso motore) con stato in lingua naturale e **diff per turno**
   (*«📍 sei andato in…», «⚙ Forza 2 → 3», «＋ lampada»*) — vedi [`docs/analisi-favella.md`](docs/analisi-favella.md) §5.
   Salvataggio della prova come **elenco di scelte**, non come stato (§4): il motore è deterministico,
   quindi regala replay e walkthrough.
7. ⬜ Costruttore di condizioni composte a frase ("e anche / oppure / tranne quando").
8. ⬜ Wizard **Prova di abilità** con difficoltà a parole e **% dal vivo** (la matematica è già in
   `editor/src/lib/authorLang.ts` → `successChance`), con esiti che toccano anche il personaggio.
9. ⬜ **Sentinelle** "ogni volta che X" / "quando X diventa vera" (analisi FAVELLA §2–3): effetti legati
   allo *stato del mondo*, non al nodo. Una sola valutazione per passo, in ordine di dichiarazione.
10. ⬜ Livelli 1–3 (Racconto / Con conseguenze / Ruolistico) + template d'avvio.
11. ⬜ **Analisi di vincibilità** (FAVELLA §6): risalita a ritroso dai finali per dire *«questo finale non
    è raggiungibile, manca chi produce X»*. Solo a formato assestato, e dichiarata come euristica.
12. ⬜ Canvas a grafo (vista secondaria) + dialog nativi Tauri (comandi Rust).

Più avanti (non-editor): **ponte LLM** (skill che genera nodi schema-validi nel vicinato, in ciclo col
validatore), importer da Corridor/TUBO/Respiro.

## 7. Prossimo passo concreto (raccomandato)

**Pannello "Oggetti"**. Oggi gli oggetti si possono solo *usare* (equipaggiamento dei personaggi pronti,
condizioni, conseguenze) ma non si possono **creare** dall'editor: `story.items` si scrive solo a mano nel
JSON. È anche l'ultimo ripiego rimasto — se l'autore scrive *«ottieni la lanterna»* e la lanterna non
esiste, `factLang` ripiega sul fatto «ha lanterna» invece di creare l'oggetto.

Da fare:

- **Database della storia**, modificabile mentre si scrive: nome, descrizione, quanto ingombra (`size`),
  quanti posti aggiunge (`capacityBonus`), etichette.
- **Stato degli oggetti** con il modello preso da FAVELLA (vedi [`docs/analisi-favella.md`](docs/analisi-favella.md) §1):
  proprietà come aggettivi + **registro di coppie opposte** (`aperto↔chiuso`, `acceso↔spento`, estendibile
  dall'autore); assegnare una proprietà toglie l'opposta. Richiede un'aggiunta al formato.
- **Archetipi** (`extends`): «questo è un contenitore», «questo è un'arma» — così cento oggetti simili non
  sono cento copie. È il limite che FAVELLA ha diagnosticato e non ha risolto; noi non abbiamo il loro
  vincolo di grammatica.
- **Catalogo di modelli** fornito con l'editor (~100 oggetti di partenza) che vengono **copiati** dentro la
  storia. Il motore non deve conoscere nessun oggetto predefinito, o smette di essere configurabile.
- `factLang`: *«ottieni la lanterna»* propone di **creare l'oggetto**, non il fatto «ha lanterna».

Sarà la **0.6.0**. Subito dopo: il **playtest incorporato** con diff per turno.

## 8. Convenzioni di lavoro

- Ogni tappa apre un file `CHANGELOG/CHANGELOG_vX.Y.Z.md` + riga indice in [`CHANGELOG.md`](CHANGELOG.md).
- **L'interfaccia parla del protagonista in terza persona** («Il personaggio», «Oggetti trasportabili»),
  mai in seconda: la storia potrebbe essere scritta in prima, seconda o terza persona e l'editor non deve
  deciderlo. Il "tu" è ammesso solo quando l'interfaccia parla *all'autore*. Vedi
  [`docs/author-experience.md`](docs/author-experience.md) §4 e §8.
- `formatVersion` del formato è versionato separatamente dalla versione del progetto.
- Ogni modifica al formato deve mantenere validi i 3 esempi (rivalidare con lo schema).
- Zero dipendenze runtime nel core e nella CLI; l'editor usa solo pacchetti già in cache (React/Vite/Tauri).
