# Che cosa resta da fare

*Scritto il 29 ottobre 2026, alla fine della revisione. La prossima sessione parte da qui. Quando una voce si chiude, la si toglie da questo foglio, e il commit dice com'è stata chiusa.*

## Dove siamo

- **Il motore 3.0** (`strumento/motore/`, versione 3.0.0-alpha.2) passa tutti i 56 test. I controlli non trovano errori né avvisi nelle 59 scene della Santa Rita, e i tipi sono a posto.
- **Il documento di design** è stato rivisto il 29 ottobre: davanti le regole come sono oggi, in appendice la storia delle scelte. Gli ultimi due commit sono `4a5da65` (la revisione) e `e33b47d` (i nomi nuovi: il grado di mezzo si chiama «in vista», lo spostamento della soglia «scatto»).
- **Tre formati dalla stessa fonte**: il librogame in PDF, la partita nel terminale, l'app web.
- **Nessuna persona ha ancora giocato il 3.0.** Non è un blocco: si progetta con il ragionamento e con le simulazioni, e le prove con le persone correggono quando arrivano.

### Come si rimette in moto

Dalla cartella `strumento/motore/`:

```
node --test                              i test
node src/cli.ts controlla                i controlli della storia
node src/cli.ts simula --partite 1000    le simulazioni del §54.2
node src/cli.ts libro                    il librogame, in libro/santa-rita.md
node web/costruisci.mjs                  l'app, in libro/santa-rita.html
../editor/node_modules/.bin/tsc.cmd -p tsconfig.json    il controllo dei tipi
```

I PDF si rifanno da PowerShell, nella cartella `typst/`, con `.\build.ps1`. Servono Python e Typst 0.14 o successivo; i font sono già nel repository.

---

## 1. Subito: la prossima sessione

### 1.1 I prezzi della Santa Rita

**Il problema.** Il *Quasi* è una scelta vera soltanto allo scoperto. Chi gioca bene vince 81 partite su 100 sia scegliendo con i conti, sia prendendo sempre tutto (§54.2, criterio 3). Le regole del §28.3 sono giuste, ma nella Santa Rita le prove decisive hanno prezzi leggeri: una moneta, un'ora, una sbucciatura. Prendere tutto costa troppo poco perché valga la pena di pensarci.

**Che cosa fare.**

1. Trovare le prove decisive, cioè quelle sulle strade più brevi verso la vittoria. Il giocatore con un obiettivo le conosce già: `distanzeDallaVittoria` in `src/simulazione.ts`.
2. Dare a ciascuna un prezzo che pesi, scritto nella storia (`dati/santa-rita.storia.json`) e credibile nel porto: un legame che si guasta, una notizia che si perde, la Traccia che sale in un'altra zona, la nave che anticipa la partenza, una cosa che si rompe.
3. Rimisurare con `node src/cli.ts simula --partite 1000`.

**Quando è fatta.** Il giocatore con un obiettivo vince più spesso di ciascuna delle sue tre copie: sempre tutto, sempre la metà, sempre lascio perdere. Poi si aggiornano la tabella del §54.2 e il punto 4 di «Che cosa manca al motore» in `ROADMAP.md`.

**Attenzione.** Il criterio non si sposta per farlo tornare (§54.4). Se i prezzi non bastano, il documento lo dice, e si torna a guardare la regola.

### 1.2 I due criteri che nessuno misura

Il §54.2 ha due criteri ancora senza misura.

- **Criterio 4: esiste una situazione in cui conviene essere in vista** invece che al coperto. La simulazione deve contare le prove fatte in vista quando c'era una strada al coperto, e chi ha vinto di più fra chi l'ha presa e chi no.
- **Criterio 6: il pericolo resta.** Il temerario deve subire almeno un rovescio o una ferita in più di metà delle partite. Oggi la simulazione dà soltanto la media dei rovesci; serve il numero di partite con almeno un rovescio o una ferita.

Tutti e due si aggiungono in `src/simulazione.ts` e nella stampa del comando `simula`.

---

## 2. Decisioni che spettano a Simone

| Decisione | Che cosa c'è sul tavolo | Che cosa serve per chiuderla |
|---|---|---|
| **Il logotipo** | Quattro proposte nuove, del 29 ottobre 2026, nella cartella [`typst/assets/logo/proposte/`](typst/assets/logo/proposte/LEGGIMI.md), e da confrontare sulla tavola «Logotipo ESPOSIZIONE — proposte» (il collegamento è nel `LEGGIMI.md`). Ognuna ha la forma piatta, la prova sul cuoio e l'animazione. | Sceglierne una, o due da incrociare. Poi si rigenerano le forme definitive con le tre varianti di colore, si riscrive la tavola d'uso (`USO.md`), e si aggiornano README e PDF. |
| **Il vecchio InteractiveWriter** | `strumento/core`, `strumento/cli` e `strumento/editor` sono il codice d'origine, superato dal motore. Non seguono più le regole del documento. | Toglierlo alleggerisce il repository. Prima però vanno spostati esbuild e TypeScript in un `package.json` del motore: oggi l'app e il controllo dei tipi usano quelli di `strumento/editor/node_modules`. L'editor nuovo è la Fase 4. |
| **La lingua delle chiavi nei dati** | Oggi le chiavi dei file JSON sono in italiano (`sposta`, `scatti`, `nonRiesci`…). Era la decisione D-S4 del vecchio piano dello strumento. | Va decisa prima dello schema JSON della 3.1. Le altre decisioni di quel piano (D-S3, D-S5, D-S6, in `archivio/ROADMAP-STRUMENTO.md`) riguardavano il vecchio motore e non valgono più. |

---

## 3. Piccole cose da sistemare

- `strumento/README.md` rimanda ancora a `../ESPOSIZIONE-DESIGN.md`, che è il 2.0 ed è in archivio: va puntato a `ESPOSIZIONE-DESIGN-3.md`. Quel README, e `strumento/ROADMAP.md`, descrivono ancora InteractiveWriter com'era a luglio 2026. Se il vecchio codice esce (§2), escono anche loro.
- `ROADMAP.md`, in «Dove siamo», parla di dieci strategie automatiche: dal 29 ottobre sono tredici.
- **La lingua del documento di design.** Il 29 ottobre sono stati riscritti i passaggi confusi, non tutte le 32.000 parole. Manca una lettura frase per frase, con `archivio/LINGUA-DEL-MANUALE.md` accanto. Conviene farla dopo i prezzi e prima del manuale.

---

## 4. Il motore stabile, 3.1

È la Fase 2 della roadmap: tutto ciò che serve perché il motore si possa dare ad altri. L'ordine consigliato mette prima ciò che toglie lavoro a chi scrive, perché oggi la Santa Rita sono quasi novecento righe di dati scritte a mano.

1. **La mappa dei luoghi.** Gli spostamenti li calcola il motore, invece di scriverli in ogni scena.
2. **Le routine delle persone.** Dove sta ciascuno in ogni ora del giorno.
3. **I dialoghi per argomenti.** Il gioco offre da solo «Chiedo a Bressan di Grimani», e la risposta dipende dal legame.
4. **Lo schema dei dati**, in JSON Schema, con messaggi d'errore scritti per chi scrive e non per chi programma. Prima va decisa la lingua delle chiavi (§2).
5. **I salvataggi con una versione**, perché una partita salvata sopravviva a una storia corretta.
6. **I testi separati dalle regole**, per tradurre una storia senza toccarne la logica.
7. **La documentazione dell'interfaccia** del motore (`vista`, `agisci`, gli eventi con i loro dati), per chi costruisce giochi grafici.
8. **La modalità racconto**: niente morte e scadenze lunghe il doppio, per chi vuole la storia senza la tensione. Si dichiara all'inizio della partita.

**Uscita:** la 3.1 con i test verdi, lo schema pubblicato, e una storia scritta da una persona che non ha partecipato allo sviluppo, con la sola documentazione.

---

## 5. Più avanti

- **La prova dei generi** (Fase 3): sei storie brevi, ognuna con la sua tabella degli attriti: giallo, horror, fantasy con magia, dramma sociale, fantascienza, racconto per ragazzi. Si parte dalle tre ambientazioni abbozzate nella Parte X del documento.
- **ESPOSIZIONE Studio** (Fase 4): l'editor per chi scrive, ricostruito sul motore 3.x.
- **I formati** (Fase 5): l'app con un tema per ogni ambientazione, il librogame, l'EPUB, il kit per il tavolo, l'esportazione per i motori grafici (Phaser, PixiJS, Godot, Ren'Py).
- **Il manuale e la pubblicazione** (Fase 6). Qui nasce il **libro delle regole**, con la copertina in cuoio: il logotipo scelto ci arriva con la sua versione per la stampa a caldo in oro e per l'impressione a secco.
- **Il logo animato** per i videogiochi: si disegna dopo la scelta del logotipo, partendo dall'idea di movimento che ogni proposta già dichiara.
- **Le persone**, quando arrivano: `PER-CHI-PROVA.txt` e il §54.3 dicono che cosa guardare, e l'app registra da sola i tempi di lettura dei quadri e le scelte nei *Quasi*.

---

## Come si lavora

- A fine modifica: commit, push, e controllo che il repository locale e quello su GitHub coincidano. I messaggi dei commit raccontano che cosa è cambiato, in italiano.
- Le parole del gioco si provano nell'italiano di tutti i giorni, e le decide Simone.
- Il documento di design si aggiorna insieme al codice e dice le regole come sono oggi. La storia delle scelte va nelle appendici.
- Si progetta senza aspettare le prove con le persone: le risposte, quando arrivano, correggono quello che si è deciso.
