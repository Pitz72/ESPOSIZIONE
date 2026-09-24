<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="typst/assets/logo/esposizione-inlinea-negativo.svg">
    <img src="typst/assets/logo/esposizione-inlinea-positivo.svg" alt="ESPOSIZIONE: Narrative RPG Engine" width="620">
  </picture>
</div>

<br>

**Un motore per romanzi di ruolo ramificati, su carta e su schermo.**

> Il dado decide se riesci. Tu decidi quanto rischi.

ESPOSIZIONE serve a scrivere e giocare storie lunghe e ramificate, in cui un protagonista esplora, indaga, tratta e sceglie. I dadi decidono se un'azione riesce; il costo di quell'azione dipende da dove, quando e come la fai, e il gioco te lo mostra prima che tu tiri. La storia ricorda ogni cosa attraverso le qualità, che aprono e chiudono le scene. La violenza è realistica: un colpo può uccidere, e per questo è l'ultima risorsa.

Lo stesso motore funziona in tre formati, con gli stessi numeri: **librogame** in solitaria, **gioco da tavolo** con un narratore, **gioco digitale**. Il digitale non vuol dire solo testo: il motore decide che cosa succede, e un gioco grafico, dall'avventura illustrata al gioco di ruolo con una mappa da esplorare, lo può mostrare con le immagini.

## Da dove cominciare

Tutto sta in un documento: [`ESPOSIZIONE-DESIGN.md`](ESPOSIZIONE-DESIGN.md), impaginato in [`pdf/ESPOSIZIONE-DESIGN.pdf`](pdf/ESPOSIZIONE-DESIGN.pdf).

| Se vuoi | Leggi |
|---|---|
| capire l'idea in dieci minuti | la Parte I, con la scena giocata del §2 |
| sapere come si gioca | le Parti III e IV |
| scrivere una storia | la Parte VI e l'appendice B, un'ambientazione compilata per intero |
| sapere dove va il progetto | [`ROADMAP.md`](ROADMAP.md): sei fasi, dalla prova con le persone a un sistema per ogni genere |
| sapere che cosa è provato | «Come leggere questo documento» e la Parte VII |
| giocare subito | il librogame di prova [`pdf/SANTA-RITA-librogame.pdf`](pdf/SANTA-RITA-librogame.pdf), l'app web [`strumento/motore/libro/santa-rita.html`](strumento/motore/libro/santa-rita.html) da aprire nel browser, oppure `node src/cli.ts gioca` in `strumento/motore/` |

## Che cosa c'è

```
ESPOSIZIONE-DESIGN.md   il documento di design 2.0: regole, scrittura, formati, esempio completo
ROADMAP.md              le sei fasi per arrivare a un sistema compiuto, per ogni genere
pdf/                    il documento e il librogame di prova, impaginati
typst/                  la catena che produce i PDF, font compresi
strumento/motore/       ESPOSIZIONE Studio 2.0: il motore, i dati del porto, la storia di prova,
                        controlli, simulazione e generatore del librogame
strumento/              il resto dello strumento, ancora di InteractiveWriter: editor da ricostruire
archivio/               la specifica 1.3 e tutto il lavoro che l'ha preceduta
```

## Stato

**Documento di design 2.0, settembre 2026.** Riscrive da capo la specifica 1.3, che sta in `archivio/`, tenendone le idee migliori. L'appendice D del documento dice che cosa è rimasto e che cosa è cambiato.

**Che cosa è provato e che cosa no.** Nessuna persona ha ancora giocato una partita con queste regole. Il motore 2.0 esiste e ha i suoi test, che controllano anche che i numeri del documento siano quelli che il motore produce. Il librogame di prova, *Il registro della Santa Rita*, esce dagli stessi dati della partita digitale. Mille partite simulate per ciascuna strategia automatica finiscono tutte, senza blocchi né errori, e raggiungono tutte le scene. Manca la cosa più importante: far giocare il librogame a persone vere. I prossimi passi sono al §25 del documento.

Il repository contiene un'ambientazione soltanto, il porto dell'appendice B, e serve da esempio. Le ambientazioni dei progetti veri vivono nei loro repository.

## Rigenerare i PDF

Il librogame si rigenera prima dai dati, dalla cartella `strumento/motore/`, con `node src/cli.ts libro`. Poi si impagina insieme al documento.

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
