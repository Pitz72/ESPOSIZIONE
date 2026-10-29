# Quattro proposte per il logotipo

*29 ottobre 2026. **Scelta la quarta, «I due punti»**, lo stesso giorno: le forme definitive sono nella cartella sopra, descritte in [`USO.md`](../USO.md). Questa cartella resta com'era al momento della scelta.*

La tavola per confrontarle, con le animazioni che girano, è la pagina **«Logotipo ESPOSIZIONE — proposte»**: <https://claude.ai/artifact/KSyXNknzS1EKnV96hNeT7E>. È privata: la vede solo chi ha ricevuto l'accesso.

## Perché cambiare

Il logotipo di agosto ha un dado a venti facce. Dal documento 3.0, però, ESPOSIZIONE si gioca con **due dadi a sei facce**, quindi quel dado racconta un gioco che non è il nostro. In più, la parola composta in maiuscolo spaziato non dice niente dell'idea del gioco: essere visti, o non esserlo.

## Che cosa hanno in comune

- Le lettere sono **TeX Gyre Pagella**, il carattere del documento, convertite in tracciati.
- C'è un solo colore d'accento, la **terracotta** del logotipo di oggi. Tutto il resto è inchiostro.
- Ogni proposta ha tre forme: quella **piatta** (su carta e su scuro, con l'icona), la **prova sul cuoio** e l'**idea per l'animazione**.
- Sul cuoio ogni proposta si stampa con un solo inchiostro, l'oro a caldo. Fa eccezione la prima, che usa anche l'impressione a secco.

## Le quattro idee

### 1. Il fascio

La parola sta al buio, e una lanterna (il punto) ne illumina una parte. Le lettere nel fascio sono piene, le altre hanno solo il contorno: «in vista» e «al coperto», detti con le lettere.

- **Sul cuoio** è la prova più bella: le lettere nella luce sono in oro, le altre impresse a secco, dello stesso colore della pelle.
- **In movimento** il fascio passa sopra la parola, va oltre, torna indietro e si ferma.
- **Il limite.** Sotto i due centimetri il contorno sparisce, quindi serve una versione tutta piena per le misure piccole. Anche l'icona a 16 pixel regge male.

### 2. I tre gradi

Una E disegnata apposta. I suoi tre bracci sono i tre gradi: vuoto (al coperto), mezzo pieno (in vista), pieno (allo scoperto). Il marchio è la regola del gioco.

- **Nei videogiochi** la E può diventare l'indicatore dell'esposizione sullo schermo.
- **In movimento** i bracci si riempiono uno dopo l'altro, poi arriva la parola.
- **Sul cuoio** c'è la E grande, in oro, con la parola sotto.
- **Il limite.** È la proposta più moderna e la meno da libro antico. Da sola, la E si capisce soltanto accanto alla parola.

### 3. La marca

Un sigillo da stampatore. Intorno corrono le quattro domande del gioco: puoi · riesci · costa · dopo. Al centro ci sono due dadi a sei facce che mostrano 3 e 4, cioè sette, il tiro più probabile.

- **Sul cuoio** è il medaglione classico al centro della copertina: è la proposta più da libro.
- **In movimento** i dadi rotolano dentro il sigillo, che intanto gira e si ferma.
- **Il limite.** I dadi sono il segno più comune dei giochi di ruolo. Le quattro parole intorno si leggono solo in grande, e infatti l'icona le toglie.

### 4. I due punti

La parola in minuscolo, con due dadi al posto dei puntini delle due i. Due dadi, come nel gioco.

- È la più semplice e la più leggibile, a ogni misura.
- **In movimento** i dadi cadono, rimbalzano e diventano i puntini.
- **Il limite.** Il minuscolo è meno solenne su una copertina. Sotto una certa misura, poi, i dadi diventano quadratini.

## Le copertine

Le copertine di cuoio sono prove generate, non foto: pelle e oro sono simulati, e servono a vedere come rende il segno in oro e a secco. Per la stampa vera si parte dal file piatto `-positivo.svg`, che è già a un colore. Per la prima proposta servono due lastre, una per l'oro e una per il secco.

## I file

| File | Che cos'è |
|---|---|
| `pN-…-positivo.svg`, `pN-…-negativo.svg` | la forma piatta, su chiaro e su scuro |
| `pN-…-icona-positivo.svg`, `pN-…-icona-negativo.svg` | l'icona, in un quadrato con gli angoli arrotondati |
| `pN-…-cuoio.jpg` | la prova sulla copertina di cuoio |
| `pN-anim-….svg` | i livelli dell'animazione, su scuro: si sovrappongono e si muovono |
| `misure.json` | dove stanno, in percentuale, il cono, i bracci e i dadi, per animare i livelli |
| `genera.py` | rifà tutto: `python genera.py` (servono fonttools, PyMuPDF, numpy e Pillow) |

## Dopo la scelta

Scelta una proposta, o due da incrociare, si disegnano le forme definitive: le tre varianti di colore, le misure minime, la versione tutta piena per le misure piccole. Poi si riscrive `USO.md`, si aggiornano i README e i PDF, e il logo animato per i videogiochi parte dall'idea di movimento della proposta scelta.
