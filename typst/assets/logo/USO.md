# Il logotipo di ESPOSIZIONE — tavola d'uso

**ESPOSIZIONE: Narrative RPG Engine.** Il marchio resta italiano in ogni lingua; il descrittore lo accompagna sempre. Un'identità sola in cinque declinazioni: stessa parola, stesso dado, stesso descrittore.

Il logotipo è composto in **TeX Gyre Pagella** (il carattere della specifica) con i glifi convertiti in tracciati: i file non dipendono da nessun font installato. Il descrittore è in **TeX Gyre Heros**, giustificato alla larghezza esatta della parola. L'emblema è un **d20 di filo** visto di faccia — diciotto spigoli, la faccia frontale disegnata — con **il punto del dado** come unico colore.

## Le cinque forme

| Forma | File | Mestiere |
|---|---|---|
| **In linea** | `esposizione-inlinea-*` | **la forma primaria**: testate, siti, documenti, firme |
| **Emblema** | `esposizione-emblema-*` | verticale: frontespizi, colophon, schermate di titolo |
| **Copertina** | `esposizione-copertina-*` | fra le righe del tetto e del pavimento: le copertine dei PDF |
| **Espressiva** | `esposizione-espressiva-*` | il dado al posto della prima O. Con parsimonia: manifesti, aperture — mai nel corpo di un documento |
| **Icona** | `esposizione-icona-*` | il dado da solo: favicon, icona app, timbro. Regge fino a 16 px |

## Le tre varianti di colore

| Suffisso | Inchiostro | Punto | Fondo previsto |
|---|---|---|---|
| `-positivo` | `#17150f` | terracotta `#7d2b1a` | carta e fondi chiari |
| `-negativo` | `#f4f1e8` | terracotta chiara `#c4573c` | fondi scuri |
| `-runtime` | `#f4f1e8` | arancio `#FE5200` | il teal `#005057` di Runtime Multimedia |

## Le regole

1. **Il punto del dado è l'unico colore.** Tutto il resto è inchiostro, in ogni variante.
2. **Il descrittore non si separa** dalle forme che lo contengono, e non si ricompone con font di sistema: è parte del disegno.
3. **Non si ricolora, non si inclina, non si ridisegna il dado.** Le varianti di colore sono le tre qui sopra.
4. Le forme si modificano **rigenerandole**: `python genera.py` (richiede `fonttools`) riscrive le cinque sorgenti con i colori come variabili CSS; i file depositati sono le stesse sorgenti con le tre palette risolte.

*Proposta e tavole: agosto 2026. La pagina di presentazione con le prove su carta, scuro e teal è l'artifact «Logotipo ESPOSIZIONE».*
