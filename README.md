<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="typst/assets/logo/esposizione-inlinea-negativo.svg">
    <img src="typst/assets/logo/esposizione-inlinea-positivo.svg" alt="ESPOSIZIONE: Narrative RPG Engine" width="620">
  </picture>
</div>

<br>

**Motore narrativo a due assi.** Un sistema di risoluzione per giochi di ruolo narrativi, indipendente dall'ambientazione.

> Il dado decide se riesci. Lo stato decide cosa ti costa.

Questo repository è la sede di riferimento del motore, su due tracce: **la specifica** — il testo normativo, i documenti di presentazione in italiano e in inglese, la catena che produce i PDF — e **ESPOSIZIONE Studio** — il software che la fa girare: formato dati, motore deterministico, validatore ed editor per l'autore. **Non contiene nessuna ambientazione**: il motore non nomina un personaggio, un luogo o una creatura, e questa separazione è una proprietà da difendere, non una circostanza.

Le istanziazioni concrete — la compilazione delle sedici voci per una finzione specifica, i profili scelti, il lessico dei verbi — vivono nei repository dei progetti che usano il motore, mai qui.

---

## Da dove cominciare

| Se sei | Leggi |
|---|---|
| qualcuno che deve capire se il motore gli interessa | `pdf/ESPOSIZIONE-CONCEPT.pdf` |
| an English reader | `pdf/EXPOSURE-CONCEPT-EN.pdf`, glossary included |
| chi deve implementarlo | `pdf/ESPOSIZIONE-1.3-impaginata.pdf`, con indice |
| chi arriva dalla 1.2 | la sezione *Che cosa è cambiato dalla 1.2*, in testa alla specifica |
| chi arriva da più lontano | `ISTRUZIONI-riconciliazione.md`, e il §37 |

## Che cosa c'è

```
ESPOSIZIONE-1.3.md              la specifica: 39 paragrafi e un'appendice, sorgente di tutto il resto
CONTROANALISI-1.2.md            il verbale che ha deciso la 1.3, con i rilievi respinti e le loro smentite
ISTRUZIONI-riconciliazione.md   documento storico: come si portò un progetto dalla 1.1 alla 1.2
ROADMAP.md                      la traccia della specifica: da specifica chiusa a motore misurato
ROADMAP-STRUMENTO.md            la traccia dello strumento: da InteractiveWriter allo strumento di ESPOSIZIONE
concept/                        i due documenti di presentazione, sorgente Markdown
pdf/                            i tre documenti impaginati
typst/                          la catena che produce i PDF, font compresi
strumento/                      ESPOSIZIONE Studio: formato dati, motore, validatore, CLI ed editor
```

## Lo strumento

<div align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="typst/assets/logo/esposizione-studio-inlinea-negativo.svg">
    <img src="typst/assets/logo/esposizione-studio-inlinea-positivo.svg" alt="ESPOSIZIONE Studio" width="520">
  </picture>
</div>

<br>

La specifica dice *che cosa* è il motore; **ESPOSIZIONE Studio** è ciò che lo *fa girare* — e il nome dice il resto: è il posto dove dentro ESPOSIZIONE si lavora. Nasce da InteractiveWriter, un progetto precedente alla specifica — formato dati JSON con schema, motore TypeScript puro e deterministico, validatore statico, CLI di gioco riproducibile, editor grafico che parla la lingua dell'autore — importato qui il 19 agosto 2026 con tutta la sua storia, perché le due cose costruite separatamente si sono rivelate le due metà dello stesso disegno: la struttura della storia da una parte, la risoluzione a due assi dall'altra.

La trasformazione — dal sistema di prove provvisorio alla griglia 2×3, dalla configurazione generica alla firma delle sedici voci, fino al **pacchetto di consegna** che porta la logica narrativa verificata a chi costruisce interfaccia, grafica e audio — è governata da `ROADMAP-STRUMENTO.md`, con fasi, cancelli e criteri di uscita dichiarati prima del lavoro. Il punto fermo che regge tutto: il trapianto del motore non comincia prima che la misura del §30.4 sia a verbale.

## L'architettura, in tre righe

> Il nucleo non si adatta mai. I moduli si scelgono fra profili dichiarati.
> Un profilo nuovo si aggiunge alla specifica, non si inventa per un progetto.

**Dodici regole di nucleo**, che non si adattano e non si negoziano. **Nove moduli**, di cui otto con profili dichiarati e un predefinito motivato; il nono è il lessico, che si compila. Adattare il motore a una finzione significa **otto scelte di profilo e sedici voci da compilare**, e niente altro: se una finzione ne pretende una diciassettesima, o è un sottosistema privilegiato e va rifiutata, oppure è una lacuna del motore e va portata qui.

L'invenzione che giustifica l'esistenza del motore è una sola: **la posizione non si dichiara, si deriva** — da `verbo × luogo × momento`, con un valore per ceppo, **a costo di scrittura nullo per nodo**. Le inversioni, che sono la parte interessante di ogni ambientazione, escono come effetto collaterale. Il costo di giudizio resta, si paga una volta per ambientazione, ed è il costo reale del motore.

## Come si aggiorna la specifica

> Un criterio dichiarato dopo aver visto il risultato non ha validato niente.

La specifica si aggiorna quando qualcuno la fa girare contro dei dati, mai per rilettura. Chi la mette alla prova scrive il criterio **prima**, con seme fisso, e non cancella i criteri falliti: aggiunge accanto quello riformulato e spiega perché. E usa più giocatori automatici in concorrenza, perché uno solo non misura il motore, misura il giocatore.

La 1.2 esiste per questo: due regole della 1.1 sono state misurate e sono risultate sbagliate. La 1.3 esiste perché quelle misure sono state riesaminate — una era derivabile e non andava misurata, un'altra esportava una soglia ricavata dal proprio stesso risultato — e perché tre parole non definite reggevano più peso di quanto dichiarassero.

**Il debito aperto è dichiarato nella specifica (§30.4):** le due correzioni al nucleo poggiano su una finzione sola e non sono mai ripassate da una seconda, che è invece ciò che il §38 impone a chi adotta il motore. Il percorso che chiude questo debito è fissato in `ROADMAP.md`, con criteri di uscita dichiarati prima di cominciare.

## Rigenerare i PDF

Serve [Typst](https://typst.app) 0.14 o successivo e Python 3. **I font stanno in `typst/fonts/` e non vanno installati**: la catena li passa a Typst con `--font-path`, così il PDF è identico su qualunque macchina. Dalla cartella `typst/`:

```powershell
.\build.ps1
```

Ricostruisce i tre PDF in `pdf/` a partire dai sorgenti Markdown. La conversione applica una politica tipografica dichiarata — il grassetto sparisce dentro le tabelle e dentro i riquadri-regola, e nel corpo un grassetto lungo diventa corsivo — che **non tocca i file sorgente**.

I font usati sono TeX Gyre Pagella, TeX Gyre Heros e DejaVu Sans Mono, tutti liberi e tutti depositati in `typst/fonts/`. I TeX Gyre vengono da [GUST](https://www.gust.org.pl/projects/e-foundry/tex-gyre) e stanno sotto GUST Font License; DejaVu sotto la licenza Bitstream Vera. Entrambe permettono la ridistribuzione, e la ragione per cui i font sono nel repository è che senza di essi Typst **compila lo stesso**, ripiega su un altro carattere e produce un documento diverso senza segnalare niente.

## Stato

Specifica **1.3**, agosto 2026. Le Parti I–VII sono chiuse, e l'Appendice A pubblica il modello del freno. La Parte VI contiene tre istanziazioni compilate su generi lontani — intrigo di corte, fantasy con una disciplina, indagine contemporanea — che servono da prova dell'agnosticismo e non sono giochi.

## Diritti

I testi e il codice di questo repository — la specifica, i documenti di presentazione, la controanalisi, le istruzioni e lo strumento in `strumento/` — sono © 2026 Simone Pizzi — Runtime Multimedia, rilasciati sotto licenza [Creative Commons Attribuzione – Condividi allo stesso modo 4.0 Internazionale](LICENSE) (CC BY-SA 4.0). Per il codice la CC BY-SA è una scelta non convenzionale e deliberata: una licenza sola per l'intero progetto, testo e strumento insieme (decisione D-S2 di `ROADMAP-STRUMENTO.md`). Chiunque può usarli, adattarli e costruirci sopra, anche commercialmente, a due condizioni che non si negoziano: l'attribuzione a **Simone Pizzi — Runtime Multimedia** accompagna sempre ciò che deriva da qui, e ciò che estende la specifica resta aperto, sotto questa stessa licenza. Le meccaniche in sé non sono di nessuno; il testo che le espone ha un autore, e la licenza garantisce che il nome non si stacchi dal testo.

Restano fuori dalla licenza:

- il marchio e il logotipo **Runtime Multimedia** in `typst/assets/` — tutti i diritti riservati, nessuna licenza d'uso;
- il logotipo **ESPOSIZIONE** in `typst/assets/logo/` — identifica questo motore e questa sede, non le derivazioni; il nome si può citare, il segno no;
- i font in `typst/fonts/`, che appartengono ai rispettivi autori e sono ridistribuiti sotto le loro licenze (GUST Font License, Bitstream Vera).
