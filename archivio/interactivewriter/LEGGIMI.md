# InteractiveWriter

*In archivio dal 31 ottobre 2026.*

InteractiveWriter è lo strumento da cui è nato ESPOSIZIONE Studio. Serviva a scrivere storie interattive con elementi da gioco di ruolo, sul modello di *Disco Elysium*. La storia stava in un file di dati (il formato `.iwstory`), un motore la faceva giocare e un validatore ne controllava la coerenza. Un editor grafico permetteva di scriverla senza toccare i dati a mano.

È arrivato in questo repository il 19 agosto 2026, con tutta la sua storia, dalla vecchia sede `Ecosystem-Runtime/InteractiveWriter`. L'ultima versione è la 0.5.1. Il 31 ottobre 2026 il suo codice è uscito dal ramo principale: il motore 3.0, in [`strumento/motore/`](../../strumento/motore/README.md), lo ha sostituito, e InteractiveWriter non seguiva più le regole del documento di design. L'editor nuovo, costruito sul motore 3.0, è la Fase 4 della roadmap.

## Che cosa c'è in questa cartella

I testi e i dati, che si leggono senza installare niente:

| File | Che cos'è |
|---|---|
| `README.md` | la presentazione dello strumento, com'era a fine ottobre 2026 |
| `DESIGN.md` | il documento di design di InteractiveWriter: la diagnosi, l'architettura a cinque strati, il modello dei dati |
| `ROADMAP.md` | il suo piano di lavoro, sessione per sessione |
| `CHANGELOG.md` e `CHANGELOG/` | il registro delle versioni, dalla 0.0.0 alla 0.5.1 |
| `docs/` | la specifica dell'esperienza d'autore, l'analisi di FAVELLA 1 e i due collaudi su progetti veri (*Corridor* e *Lemmons*) |
| `examples/` | tre storie nel formato `.iwstory`: *Atrio della villa*, il primo atto di *Corridor*, *Lemmons* |
| `schema/` | lo schema JSON del formato `.iwstory` |

I collegamenti dentro questi file puntano ancora alle cartelle del codice (`core/`, `cli/`, `editor/`), che qui non ci sono più.

## Dove sta il codice

Il codice è intero nel segnalibro **`interactivewriter`** del repository, messo sull'ultimo commit che lo conteneva:

- su GitHub si sfoglia da <https://github.com/Pitz72/ESPOSIZIONE/tree/interactivewriter/strumento>;
- in locale si riporta indietro con `git checkout interactivewriter -- strumento/core strumento/cli strumento/editor`.

C'erano tre parti:

- `core/`: il motore e il validatore, in TypeScript, senza dipendenze;
- `cli/`: il comando `iw`, per validare una storia e giocarla nel terminale;
- `editor/`: l'editor grafico, fatto con Tauri e React.

Per far ripartire l'editor serve `npm install` nella sua cartella.
