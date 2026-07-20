# Roadmap di continuità — InteractiveWriter

> Documento di passaggio tra sessioni di lavoro. Dice **dove siamo**, **come si esegue**, **dove si va** e
> **qual è il prossimo passo concreto**. Chi riprende (umano o AI) parte da qui.

Ultimo aggiornamento: 2026-07-20 · Versione progetto: **0.4.0**
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
| 0.4.0 | **Formato 0.4: crescita del personaggio, ingombro, personaggi pronti** |

- **Formato `.iwstory`**: `formatVersion` **0.4** (lo schema accetta ancora 0.3). Collaudato su due
  migrazioni reali. La 0.4 aggiunge ciò che serve al modello *Disco Elysium*: le prove non cambiano solo
  dove va la storia, cambiano **chi sei** (`adjustSkill`/`adjustAttribute`); l'inventario ha una capacità
  che dipende da cosa indossi (`ruleset.inventory` + `size`/`capacityBonus`, refs `@free/@carried/@capacity`);
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
4. ⬜ Editor: pannello **Configurazione iniziale** — setting, personaggi pronti, inventario di partenza,
   capacità *(← prossimo)*.
5. ⬜ Editor: pannello **Oggetti** (che toglie l'ultimo ripiego: l'oggetto non dichiarato modellato come
   fatto «ha X»).
6. ⬜ Costruttore di condizioni composte a frase ("e anche / oppure / tranne quando").
7. ⬜ Wizard **Prova di abilità** con difficoltà a parole e **% dal vivo** (la matematica è già in
   `editor/src/lib/authorLang.ts` → `successChance`), con esiti che toccano anche il personaggio.
8. ⬜ **Playtest incorporato** (riuso motore) con pannello di stato in lingua naturale.
9. ⬜ Livelli 1–3 (Racconto / Con conseguenze / Ruolistico) + template d'avvio.
10. ⬜ Canvas a grafo (vista secondaria) + dialog nativi Tauri (comandi Rust).

Più avanti (non-editor): **ponte LLM** (skill che genera nodi schema-validi nel vicinato, in ciclo col
validatore), importer da Corridor/TUBO/Respiro.

## 7. Prossimo passo concreto (raccomandato)

**Pannello "Configurazione iniziale"** nell'editor: il lavoro che l'autore fa *prima* di scrivere le scene.
Il formato è pronto (0.4), l'interfaccia no — oggi si entra dritti nelle scene e `setting`, `presets` e
`inventory` non sono visibili da nessuna parte.

Da fare, tutto in lingua d'autore:

- **La storia**: mondo, tono, protagonista, appunti (`story.setting`).
- **Chi sei**: elenco dei **personaggi pronti** con statistiche a cursori, indicatore del predefinito ed
  equipaggiamento iniziale; *«crea un personaggio»* al volo.
- **Cosa puoi portare**: `baseCapacity` con etichetta a parole ("due tasche") e anteprima di quanto occupa
  l'equipaggiamento scelto (la matematica è già nel core: `capacityOf`/`carriedOf`).
- La **Scheda del personaggio** (oggi `RulesetPanel`, sola lettura) diventa modificabile qui dentro.

Primo file: nuovo `editor/src/components/SetupPanel.tsx` + una voce nella barra dei tab di
`editor/src/components/Sidebar.tsx`. Subito dopo: il pannello **Oggetti**.

## 8. Convenzioni di lavoro

- Ogni tappa apre un file `CHANGELOG/CHANGELOG_vX.Y.Z.md` + riga indice in [`CHANGELOG.md`](CHANGELOG.md).
- `formatVersion` del formato è versionato separatamente dalla versione del progetto.
- Ogni modifica al formato deve mantenere validi i 3 esempi (rivalidare con lo schema).
- Zero dipendenze runtime nel core e nella CLI; l'editor usa solo pacchetti già in cache (React/Vite/Tauri).
