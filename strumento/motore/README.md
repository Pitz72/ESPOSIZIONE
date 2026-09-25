# ESPOSIZIONE Studio — il motore 3.0

Il motore di [`ESPOSIZIONE-DESIGN-3.md`](../../ESPOSIZIONE-DESIGN-3.md). Scritto da capo il 23 settembre 2026 per il 2.0, adeguato al 3.0 il 25 settembre 2026. TypeScript puro, nessuna dipendenza, gira con Node 22.6 o successivo senza compilare niente.

Dagli stessi dati escono quattro cose:

- **la partita**, nel terminale oppure in qualunque interfaccia, testuale o grafica, che usi le due funzioni `vista` e `agisci`;
- **il librogame**, in Markdown, che la catena Typst del repository impagina in [`pdf/SANTA-RITA-librogame.pdf`](../../pdf/SANTA-RITA-librogame.pdf);
- **l'app web**, [`libro/santa-rita.html`](libro/santa-rita.html): un solo file HTML con dentro motore, dati e interfaccia, da aprire in qualunque browser. Ha un panorama del porto disegnato in tempo reale, con la luce che cambia col momento del giorno. Il quadro è un foglio della capitaneria con le quattro domande e la barra delle fasce, su cui rotolano i dadi e cadono due timbri: la fascia e il grado. Il *Quasi* compare fra le scelte, ciascuna con il suo costo. La scheda mostra tratti, persone, convinzioni e il taccuino con lo stato di ogni notizia. Il pannello «Sotto il cofano» mostra i dati grezzi che il motore restituisce: l'app li disegna e basta;
- **le verifiche**: i trenta controlli del §47 e i giocatori automatici del §54.2.

## Comandi

Dalla cartella `strumento/motore/`:

```powershell
node src/cli.ts gioca            # gioca nel terminale (scrivi "scheda" per vedere la scheda, "esci" per uscire)
node src/cli.ts gioca --seme 11  # la stessa partita, con gli stessi dadi
node src/cli.ts controlla        # i controlli del §47 sui dati
node src/cli.ts libro            # rigenera libro/santa-rita.md
node src/cli.ts simula           # 500 partite per ciascuna delle nove strategie automatiche
node web/costruisci.mjs          # rigenera la versione elettronica, libro/santa-rita.html
node --test                      # i test
```

Poi, dalla cartella `typst/` del repository, `.\build.ps1` impagina il documento di design e il librogame.

## Com'è fatto

| File | Che cosa fa |
|---|---|
| `src/tipi.ts` | il formato dei dati: l'ambientazione (la scheda del §43) e la storia |
| `src/dadi.ts` | due dadi a sei facce, con un generatore riproducibile, e le quattro fasce |
| `src/quadro.ts` | le sezioni del quadro: la riuscita, con il gradino al massimo per parte, e il costo, con le righe che non contano (§18, §21) |
| `src/stato.ts` | lo stato della partita: la memoria della storia, le notizie e le loro smentite, le persone e le loro reazioni, le proprietà dei luoghi, il tempo in ore, le ferite, gli stati d'animo, la Traccia, gli imprevisti |
| `src/motore.ts` | `vista` (che cosa mostrare) e `agisci` (che cosa succede): il quadro, le fasce, il *Quasi*, il dono, il rovescio, il confronto, le scelte esaurite, «Ci ripenso», «Metto insieme quello che so», gli aiuti |
| `src/controlli.ts` | i controlli del §47, più quelli strutturali |
| `src/simulazione.ts` | i giocatori automatici, comprese le strategie per il *Quasi* |
| `src/libro.ts` | il generatore del librogame |
| `src/cli.ts` | la riga di comando |
| `web/` | l'app web: l'interfaccia (`gioco.ts`), il panorama del porto (`panorama.ts`), il suono generato nel browser (`suono.ts`), la pagina (`pagina.html`) e lo script che impacchetta tutto con il motore in un solo file. Il panorama e i colori sono il tema di questa ambientazione: un'altra storia ne avrebbe un altro. Per impacchettare usa esbuild, già presente fra gli strumenti di sviluppo dell'editor; la pagina che ne esce non ha dipendenze |
| `dati/` | l'ambientazione del porto (appendice B del documento) e la storia di prova |

## Per chi costruisce un'interfaccia

Il motore non disegna e non scrive niente. Si usa così:

```ts
import { prepara, nuovaPartita, vista, agisci } from "./src/index.ts";

const gioco = prepara(ambientazione, storia);
let partita = nuovaPartita(gioco, seme);
const v = vista(gioco, partita);          // scena, stato, scelte, ognuna con il suo quadro
const { partita: dopo, eventi } = agisci(gioco, partita, v.scelte[0].id);
```

`vista` restituisce il testo della scena, lo stato del personaggio e le scelte, comprese quelle chiuse con ciò che manca e il motivo (`chiusaDa`: un requisito, una convinzione, la forza, una ferita, la difficoltà). Ogni prova porta il suo `quadro`, con le quattro sezioni: `puoi`, `riesci` (righe, soglia, fasce in percentuale e in trentaseiesimi), `costo` (righe e grado), `dopo`. Quando una prova finisce nel *Quasi*, la vista successiva ha `sospeso` e offre soltanto le possibilità del *Quasi*, ciascuna con il suo `costa`. `agisci` restituisce una partita nuova (quella vecchia non cambia) e la lista degli eventi: tiri, esiti con la fascia e il grado, notizie, persone, tratti, Traccia, ferite, imprevisti. Un gioco grafico può mostrare gli eventi come animazioni e il quadro come un pannello (§48.4). Ogni scena può portare un campo `presentazione` con indicazioni libere per la grafica, che il motore ignora.

## La storia di prova

*Il registro della Santa Rita*: cinquantotto scene nel porto dell'appendice B. Il fratello di chi gioca è sparito, e la nave su cui lo tengono prigioniero salpa prima dell'alba. Il personaggio ha quattro tratti (*Vista acuta*, *Sa leggere*, *Minuto*, *Soffre il mare*), due convinzioni, e conosce già l'oste Zeno. Nella storia ci sono vie che si aprono solo per chi è fatto in un certo modo, notizie false che si smentiscono, una convinzione che si può lasciare andare e che apre la strada al capitano Serra, una deduzione, una lanterna da accendere, persone che ricordano, un confronto a parole con un archivista (*chi si chiude*) e uno col coltello con un sicario (*chi avanza*). Si può morire, ma solo dopo averlo letto nella posta.

Il personaggio non sa nuotare: le tre scene che richiedono di nuotare esistono, ma per lui restano chiuse, con il ripiego accanto.

## Le simulazioni, il 25 settembre 2026

Mille partite per strategia. Nessuna partita bloccata, nessun errore. Le fasce osservate coincidono con le tabelle. Le strategie contano: la scrupolosa vince il 49% delle volte, l'opportunista il 41%, la casuale il 21%, la prudente il 10%. Nel *Quasi*, scegliere secondo la situazione vince quanto scegliere sempre «tutto» (21%), e più di scegliere sempre la metà (17%) o sempre lasciar perdere (16%): il criterio 3 del §54.2 non è ancora superato. È la prima cosa da guardare.

## Che cosa manca

- I compagni (§33) e le storie con più protagonisti non sono ancora nel motore.
- L'editor grafico di `strumento/editor/` usa ancora il vecchio motore di InteractiveWriter, in `strumento/core/`. Va ricostruito su questo.
- Il giocatore automatico «con un obiettivo» del §54.2 non c'è ancora.
- Nessuna persona ha ancora giocato il librogame, né l'app del 3.0.
