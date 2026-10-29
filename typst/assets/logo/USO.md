# Il logotipo di ESPOSIZIONE

**ESPOSIZIONE: Narrative RPG Engine.** Il logotipo è la parola in minuscolo, con due dadi a sei facce al posto dei puntini delle due i. Il primo dado mostra 3 ed è terracotta, il secondo mostra 4 ed è dello stesso inchiostro delle lettere. Insieme fanno sette, il tiro più probabile con due dadi, che sono i dadi del gioco. La parola resta italiana in ogni lingua, e il descrittore resta in inglese.

È stato scelto il 29 ottobre 2026 fra quattro proposte, che restano in [`proposte/`](proposte/LEGGIMI.md). Le lettere sono **TeX Gyre Pagella**, il carattere del documento, convertite in tracciati: i file non dipendono da nessun font installato. I puntini dei dadi sono fori nel disegno, non sovrapposizioni, quindi ogni file si stampa a un colore solo.

## Le forme

| Forma | File | Quando si usa |
|---|---|---|
| **In linea** | `esposizione-inlinea-*` | La forma principale: README, siti, documenti, firme. Il descrittore sta sotto, allineato a destra. Non va usata sotto i 60 mm (280 pixel) di larghezza, perché il descrittore non si legge più. |
| **Centrata** | `esposizione-centrata-*` | Il descrittore sta al centro. Per le copertine, i frontespizi e le schermate di titolo dei giochi. |
| **Piccola** | `esposizione-piccola-*` | Sotto i 60 mm. Senza descrittore, con le lettere un po' più aperte e i dadi pieni, senza puntini: piccoli come sono, i puntini diventerebbero una macchia. Regge fino a 18 mm (70 pixel). |
| **Icona** | `esposizione-icona-*` | Una i in neretto con il dado del tre per puntino, in un quadrato con gli angoli arrotondati. Per l'icona del sito, dell'app e del gioco. Regge fino a 16 pixel. |
| **Studio** | `esposizione-studio-inlinea-*` | Lo strumento per chi scrive, ESPOSIZIONE Studio: la parola **studio** prende il posto del descrittore. L'icona è la stessa del motore. |
| **Animato** | `esposizione-animato.svg` | Il logo che si muove, su fondo scuro. Vedi sotto. |

## I colori

| Variante | Lettere e secondo dado | Primo dado | Fondo previsto |
|---|---|---|---|
| `-positivo` | inchiostro `#17150f` | terracotta `#7d2b1a` | carta e fondi chiari |
| `-negativo` | carta `#f4f1e8` | terracotta chiara `#c4573c` | fondi scuri |
| `-runtime` | carta `#f4f1e8` | arancio `#FE5200` | il teal `#005057` di Runtime Multimedia |
| `-unatinta` | inchiostro `#17150f` | inchiostro `#17150f` | la stampa a un colore: oro a caldo, secco, incisione, timbro |

Le forme non hanno fondo: si appoggiano su quello della pagina. L'icona invece ha il suo quadrato, del colore del fondo previsto, e non ha la variante a un colore.

## Sulla copertina di cuoio

Per il libro delle regole il file da dare allo stampatore è la forma **centrata `-unatinta`**: una lastra sola, per l'oro a caldo. La terracotta sul cuoio non c'è, ed è giusto così: in oro i due dadi sono uguali, e il sette resta nelle facce.

- Sul cuoio il logotipo **non va sotto i 100 mm di larghezza**. A quella misura i puntini dei dadi sono larghi poco più di mezzo millimetro, il minimo perché l'oro non li riempia. Sotto i 100 mm si usa la forma piccola, con i dadi pieni.
- Se si vuole un secondo effetto, il descrittore si può imprimere a secco invece che in oro. Servono allora due lastre: si separano a mano dal file a un colore.
- `prova-cuoio.jpg` è una prova generata, non una foto: pelle e oro sono simulati. Serve a vedere le proporzioni, non i colori della stampa vera.

## Il logo animato

`esposizione-animato.svg` si apre in qualunque browser e si muove da solo, una volta, poi resta fermo:

1. da 0 a 0,7 secondi compare la parola, con le due i senza puntino;
2. a 0,35 secondi cade il dado del tre, rimbalza due volte e si ferma sulla prima i a 1,5 secondi;
3. a 0,6 secondi cade il dado del quattro, e si ferma sulla seconda i a 1,75 secondi;
4. da 1,9 a 2,7 secondi compare il descrittore.

Chi ha chiesto al sistema di ridurre i movimenti vede il logo già fermo. Per un motore di gioco le parti si prendono dal file: si chiamano `parola`, `dado-tre`, `dado-quattro` e `descrittore`, e ognuna è già al suo posto finale.

## Le regole

1. **Il dado del tre è l'unico colore.** Tutto il resto è dell'inchiostro delle lettere. Nella variante a un colore anche il dado del tre lo è.
2. **I dadi non si toccano.** Non si spostano, non si raddrizzano, non cambiano faccia: tre e quattro, in quest'ordine.
3. **Il descrittore sta con la parola** nelle forme in linea e centrata. Lo lasciano soltanto la forma piccola e l'icona, dove non si leggerebbe.
4. **Non si ricompone con un font.** Si usano i file: le lettere sono state disegnate una per una dai tracciati di Pagella, e i dadi non esistono in nessun carattere.
5. **Intorno resta vuoto** almeno quanto è alta la lettera o. Il margine dentro i file è più stretto, un decimo del corpo, quindi lo spazio va lasciato fuori.
6. **Le forme si cambiano rigenerandole**, mai a mano: `python genera.py` le riscrive tutte (serve fonttools); `python genera.py --cuoio` rifà anche la prova sul cuoio (servono anche PyMuPDF, numpy e Pillow).

## Il logotipo di agosto

Il logotipo di prima, con il dado a venti facce, è in [`archivio/`](archivio/USO.md), con la sua tavola e il suo generatore. Non si usa più. ESPOSIZIONE si gioca con due dadi a sei facce, e quel dado raccontava un altro gioco.
