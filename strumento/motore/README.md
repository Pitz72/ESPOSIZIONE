# ESPOSIZIONE Studio — il motore 2.0

Il motore di [`ESPOSIZIONE-DESIGN.md`](../../ESPOSIZIONE-DESIGN.md), scritto da capo il 23 settembre 2026. TypeScript puro, nessuna dipendenza, gira con Node 22.6 o successivo senza compilare niente.

Dagli stessi dati escono tre cose:

- **la partita**, nel terminale oppure in qualunque interfaccia, testuale o grafica, che usi le due funzioni `vista` e `agisci`;
- **il librogame**, in Markdown, che la catena Typst del repository impagina in [`pdf/SANTA-RITA-librogame.pdf`](../../pdf/SANTA-RITA-librogame.pdf);
- **l'app web**, [`libro/santa-rita.html`](libro/santa-rita.html): un solo file HTML con dentro motore, dati e interfaccia, da aprire in qualunque browser. Ha un panorama del porto disegnato in tempo reale, con la luce che cambia col momento del giorno; la ricevuta è un foglio della capitaneria su cui rotolano i dadi e cade il timbro dell'esito; lo schermo reagisce a ferite, fallimenti e imprevisti; il diario cresce come un romanzo. Il pannello «Sotto il cofano» mostra i dati grezzi che il motore restituisce: l'app li disegna e basta;
- **le verifiche**: i controlli del §20 e i giocatori automatici del §24.

## Comandi

Dalla cartella `strumento/motore/`:

```powershell
node src/cli.ts gioca            # gioca nel terminale (scrivi "scheda" per vedere la scheda, "esci" per uscire)
node src/cli.ts gioca --seme 11  # la stessa partita, con gli stessi dadi
node src/cli.ts controlla        # i controlli del §20 sui dati
node src/cli.ts libro            # rigenera libro/santa-rita.md
node src/cli.ts simula           # 500 partite per ciascuna strategia automatica
node web/costruisci.mjs          # rigenera la versione elettronica, libro/santa-rita.html
node --test                      # i test
```

Poi, dalla cartella `typst/` del repository, `.\build.ps1` impagina il documento di design e il librogame.

## Com'è fatto

| File | Che cosa fa |
|---|---|
| `src/tipi.ts` | il formato dei dati: l'ambientazione (la scheda del §19) e la storia |
| `src/dadi.ts` | due dadi a sei facce, con un generatore riproducibile |
| `src/ricevuta.ts` | la ricevuta e le righe che non contano (§10) |
| `src/stato.ts` | lo stato della partita, le qualità, il tempo, le ferite, la Traccia, gli imprevisti |
| `src/motore.ts` | `vista` (che cosa mostrare) e `agisci` (che cosa succede): le sei caselle e il confronto |
| `src/controlli.ts` | i controlli del §20, più quelli strutturali |
| `src/simulazione.ts` | i giocatori automatici |
| `src/libro.ts` | il generatore del librogame |
| `src/cli.ts` | la riga di comando |
| `web/` | l'app web: l'interfaccia (`gioco.ts`), il panorama del porto (`panorama.ts`), il suono generato nel browser (`suono.ts`), la pagina (`pagina.html`) e lo script che impacchetta tutto con il motore in un solo file. Il panorama e i colori sono il tema di questa ambientazione: un'altra storia ne avrebbe un altro. Per impacchettare usa esbuild, già presente fra gli strumenti di sviluppo dell'editor; la pagina che ne esce non ha dipendenze |
| `dati/` | l'ambientazione del porto (appendice B) e la storia di prova |

## Per chi costruisce un'interfaccia

Il motore non disegna e non scrive niente. Si usa così:

```ts
import { prepara, nuovaPartita, vista, agisci } from "./src/index.ts";

const gioco = prepara(ambientazione, storia);
let partita = nuovaPartita(gioco, seme);
const v = vista(gioco, partita);          // scena, stato, scelte con le loro ricevute
const { partita: dopo, eventi } = agisci(gioco, partita, v.scelte[0].id);
```

`vista` restituisce il testo della scena, lo stato del personaggio e le scelte, comprese quelle chiuse con il loro requisito, ognuna con la sua ricevuta. `agisci` restituisce una partita nuova (quella vecchia non cambia) e la lista degli eventi: tiri, esiti, Traccia, ferite, imprevisti. Un gioco grafico può mostrare gli eventi come animazioni e la ricevuta come un pannello: le regole restano le stesse (§22.4). Ogni scena può portare un campo `presentazione` con indicazioni libere per la grafica, che il motore ignora.

## La storia di prova

*Il registro della Santa Rita*: cinquantadue scene nel porto dell'appendice B. Il fratello di chi gioca è sparito, e la nave su cui lo tengono prigioniero salpa prima dell'alba. Nella storia ci sono luoghi che cambiano col momento del giorno, preparazioni, una scadenza, un confronto a parole con un archivista (*chi si chiude*) e uno col coltello con un sicario (*chi avanza*). Si può morire, ma solo dopo averlo letto nella posta.

## Che cosa manca

- L'editor grafico di `strumento/editor/` usa ancora il vecchio motore di InteractiveWriter, in `strumento/core/`. Va ricostruito su questo.
- I giocatori automatici scelgono a caso fra le vie che preferiscono. Dicono che il motore regge (nessuna partita bloccata, nessun errore, tutte le scene raggiunte), non se la storia è equilibrata.
- Nessuna persona ha ancora giocato il librogame.
