<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="typst/assets/logo/esposizione-inlinea-negativo.svg">
    <img src="typst/assets/logo/esposizione-inlinea-positivo.svg" alt="ESPOSIZIONE: Narrative RPG Engine" width="620">
  </picture>
</div>

<br>

**Un modello per romanzi di ruolo, su carta e su schermo.**

> Ogni azione pone quattro domande: puoi farlo, ci riesci, quanto ti costa, che cosa cambia dopo.

ESPOSIZIONE serve a scrivere e giocare storie lunghe e ramificate, in cui un personaggio esplora, indaga, tratta e sceglie, e in cui il mondo, gli oggetti e le persone reagiscono a quello che fa. Il personaggio è fatto di capacità, tratti detti a parole, cose, notizie e convinzioni, legami con le persone, e condizioni. Prima di ogni azione che conta il gioco mostra il **quadro**: se puoi farla, quanto è probabile riuscirci, quanto ti costa, che cosa può cambiare. I dadi rispondono con quattro fasce: in pieno, riesci, quasi, non riesci; quando manca poco, chi gioca sceglie come va a finire. Il costo dipende da dove, quando e come agisci, e i dadi non lo toccano. La violenza è realistica: un colpo può uccidere, e per questo è l'ultima risorsa.

Lo stesso motore funziona in quattro formati, con gli stessi numeri: **librogame** in solitaria, **gioco da tavolo** con un narratore, **app testuale**, **gioco grafico**, dall'avventura illustrata al gioco di ruolo con una mappa da esplorare.

## Da dove cominciare

Tutto sta in un documento: [`ESPOSIZIONE-DESIGN-3.md`](ESPOSIZIONE-DESIGN-3.md), impaginato in [`pdf/ESPOSIZIONE-DESIGN-3.pdf`](pdf/ESPOSIZIONE-DESIGN-3.pdf).

| Se vuoi | Leggi |
|---|---|
| capire tutto il progetto in una pagina | [`PANORAMICA.md`](PANORAMICA.md): che cosa fa, che cosa farà, dove ci serve un parere |
| capire l'idea in dieci minuti | la Parte I, con la scena giocata del §2 |
| sapere com'è fatto il personaggio | la Parte II |
| sapere come si gioca | le Parti IV e V: le quattro domande e le quattro fasce |
| scrivere una storia | la Parte IX, gli esempi di tre generi nella Parte X, e l'appendice B, un'ambientazione compilata per intero |
| sapere dove va il progetto | [`ROADMAP.md`](ROADMAP.md): sei fasi, dalla prova con le persone a un sistema per ogni genere |
| sapere che cosa è provato | «Che cosa è provato e che cosa no», in apertura, e la Parte XI |
| giocare subito | il librogame di prova [`pdf/SANTA-RITA-librogame.pdf`](pdf/SANTA-RITA-librogame.pdf), l'app web [`strumento/motore/libro/santa-rita.html`](strumento/motore/libro/santa-rita.html) da aprire nel browser, oppure `node src/cli.ts gioca` in `strumento/motore/` |

## Che cosa c'è

```
ESPOSIZIONE-DESIGN-3.md  il documento di design 3.0: il personaggio, il mondo, le quattro domande,
                         le gradazioni, le persone, la scrittura, tre generi, la verifica
ROADMAP.md               le sei fasi per arrivare a un sistema compiuto, per ogni genere
pdf/                     il documento e il librogame di prova, impaginati
typst/                   la catena che produce i PDF, font compresi
strumento/motore/        ESPOSIZIONE Studio 3.0: il motore, i dati del porto, la storia di prova,
                         controlli, simulazione, generatore del librogame e app web
strumento/               il resto dello strumento, ancora di InteractiveWriter: editor da ricostruire
archivio/                il documento di design 2.0, la specifica 1.3 e tutto il lavoro che li ha preceduti
```

## Stato

**Documento di design 3.0, settembre 2026.** Allarga il 2.0 dove era sottile: il personaggio in sei parti, i luoghi descritti con proprietà che rispondono a tutte e quattro le domande, le persone con legami a più dimensioni, le notizie che si verificano e si smentiscono, le convinzioni, e le gradazioni fra successo e insuccesso. L'appendice D dice che cosa è rimasto, che cosa è cambiato e che cosa è uscito; il 2.0 è in `archivio/`.

**Che cosa è provato e che cosa no.** Il motore 3.0 esiste, passa i suoi 37 test (che controllano anche che i numeri del documento siano quelli che il motore produce) e i trenta controlli sui dati. Mille partite simulate per ciascuna delle nove strategie automatiche finiscono tutte, senza blocchi né errori. Il librogame di prova, *Il registro della Santa Rita*, esce dagli stessi dati della partita digitale. Una persona ha giocato per intero la versione 2.0 dell'app; nessuno ha ancora giocato il 3.0. Manca la cosa più importante: far giocare persone vere, con i criteri scritti nel §54 del documento.

Il repository contiene un'ambientazione soltanto, il porto dell'appendice B, e serve da esempio. Le ambientazioni dei progetti veri vivono nei loro repository.

## Rigenerare i PDF

Il librogame si rigenera prima dai dati, dalla cartella `strumento/motore/`, con `node src/cli.ts libro`. Poi si impagina insieme al documento di design 3.0. Il PDF del 2.0 sta in `archivio/pdf/` e non si ricostruisce più.

Servono [Typst](https://typst.app) 0.14 o successivo e Python 3. I font stanno in `typst/fonts/` e non vanno installati: la catena li passa a Typst con `--font-path`, così il PDF è identico su qualunque macchina. Dalla cartella `typst/`:

```powershell
.\build.ps1
```

I font usati sono TeX Gyre Pagella, TeX Gyre Heros e DejaVu Sans Mono, tutti liberi. I TeX Gyre vengono da [GUST](https://www.gust.org.pl/projects/e-foundry/tex-gyre) e stanno sotto GUST Font License; DejaVu sotto la licenza Bitstream Vera. Sono nel repository perché senza di essi Typst compila lo stesso, ripiega su un altro carattere e produce un documento diverso senza segnalare niente.

## Diritti

I testi e il codice di questo repository — il documento di design, l'archivio e lo strumento in `strumento/` — sono © 2026 Simone Pizzi — Runtime Multimedia, rilasciati sotto licenza [Creative Commons Attribuzione – Condividi allo stesso modo 4.0 Internazionale](LICENSE) (CC BY-SA 4.0). Per il codice la CC BY-SA è una scelta non convenzionale e deliberata: una licenza sola per l'intero progetto. Chiunque può usarli, adattarli e costruirci sopra, anche commercialmente, a due condizioni: l'attribuzione a **Simone Pizzi — Runtime Multimedia** accompagna sempre ciò che deriva da qui, e ciò che ne deriva resta aperto, sotto questa stessa licenza. Le meccaniche in sé non sono di nessuno; il testo che le espone ha un autore.

Restano fuori dalla licenza:

- il marchio e il logotipo **Runtime Multimedia** in `typst/assets/` — tutti i diritti riservati, nessuna licenza d'uso;
- il logotipo **ESPOSIZIONE** in `typst/assets/logo/` — identifica questo motore e questa sede, non le derivazioni; il nome si può citare, il segno no;
- i font in `typst/fonts/`, che appartengono ai rispettivi autori e sono ridistribuiti sotto le loro licenze (GUST Font License, Bitstream Vera).
