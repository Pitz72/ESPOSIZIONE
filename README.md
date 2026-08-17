# ESPOSIZIONE

**Motore narrativo a due assi.** Un sistema di risoluzione per giochi di ruolo narrativi, indipendente dall'ambientazione.

> Il dado decide se riesci. Lo stato decide cosa ti costa.

Questo repository è la sede di riferimento del motore. Contiene la specifica, i documenti di presentazione in italiano e in inglese, e la catena che produce i PDF. **Non contiene nessuna ambientazione**: il motore non nomina un personaggio, un luogo o una creatura, e questa separazione è una proprietà da difendere, non una circostanza.

Le istanziazioni concrete — la compilazione delle sedici voci per una finzione specifica, i profili scelti, il lessico dei verbi — vivono nei repository dei progetti che usano il motore, mai qui.

---

## Da dove cominciare

| Se sei | Leggi |
|---|---|
| qualcuno che deve capire se il motore gli interessa | `pdf/ESPOSIZIONE-CONCEPT.pdf` — 10 pagine |
| an English reader | `pdf/EXPOSURE-CONCEPT-EN.pdf` — 11 pages, glossary included |
| chi deve implementarlo | `pdf/ESPOSIZIONE-1.2-impaginata.pdf` — 48 pagine, con indice |
| chi arriva da una versione precedente | `ISTRUZIONI-riconciliazione.md` |

## Che cosa c'è

```
ESPOSIZIONE-1.2.md              la specifica: 39 paragrafi, sorgente di tutto il resto
ISTRUZIONI-riconciliazione.md   come si porta un progetto avviato dalla 1.1 alla 1.2
concept/                        i due documenti di presentazione, sorgente Markdown
pdf/                            i tre documenti impaginati
typst/                          la catena che produce i PDF
```

## L'architettura, in tre righe

> Il nucleo non si adatta mai. I moduli si scelgono fra profili dichiarati.
> Un profilo nuovo si aggiunge alla specifica, non si inventa per un progetto.

**Dodici regole di nucleo**, che non si adattano e non si negoziano. **Otto moduli** con profili dichiarati e un predefinito motivato. Adattare il motore a una finzione significa **otto scelte di profilo e sedici voci da compilare**, e niente altro: se una finzione ne pretende una diciassettesima, o è un sottosistema privilegiato e va rifiutata, oppure è una lacuna del motore e va portata qui.

L'invenzione che giustifica l'esistenza del motore è una sola: **la posizione non si dichiara, si deriva** — da `verbo × luogo × momento`, con un valore per ceppo, a costo di scrittura nullo. Le inversioni, che sono la parte interessante di ogni ambientazione, escono come effetto collaterale.

## Come si aggiorna la specifica

> Un criterio dichiarato dopo aver visto il risultato non ha validato niente.

La specifica si aggiorna quando qualcuno la fa girare contro dei dati, mai per rilettura. Chi la mette alla prova scrive il criterio **prima**, con seme fisso, e non cancella i criteri falliti: aggiunge accanto quello riformulato e spiega perché. E usa più giocatori automatici in concorrenza, perché uno solo non misura il motore, misura il giocatore.

La 1.2 esiste per questo: due regole della 1.1 sono state misurate e sono risultate sbagliate. Ogni modifica futura al nucleo ripassa da una seconda finzione di prova, tenuta come test di regressione dell'agnosticismo.

## Rigenerare i PDF

Serve [Typst](https://typst.app) 0.15 o successivo e Python 3. Dalla cartella `typst/`:

```powershell
.\build.ps1
```

Ricostruisce i tre PDF in `pdf/` a partire dai sorgenti Markdown. La conversione applica una politica tipografica dichiarata — il grassetto sparisce dentro le tabelle e dentro i riquadri-regola, e nel corpo un grassetto lungo diventa corsivo — che **non tocca i file sorgente**.

I font usati sono TeX Gyre Pagella, TeX Gyre Heros e DejaVu Sans Mono, tutti liberi. Su Windows si installano con la distribuzione TeX Live, oppure si scaricano da [GUST](https://www.gust.org.pl/projects/e-foundry/tex-gyre).

## Stato

Specifica **1.2**, agosto 2026. Le Parti I–VII sono chiuse. La Parte VI contiene tre istanziazioni compilate su generi lontani — intrigo di corte, fantasy con una disciplina, indagine contemporanea — che servono da prova dell'agnosticismo e non sono giochi.

## Diritti

© 2026 Simone Pizzi — Runtime Multimedia. Tutti i diritti riservati.
Il marchio Runtime Multimedia in `typst/assets/` non è coperto da nessuna licenza d'uso.
