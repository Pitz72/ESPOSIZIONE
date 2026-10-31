# Che cosa resta da fare

*Scritto il 29 ottobre 2026, alla fine della revisione, e aggiornato il 31 ottobre. La prossima sessione parte da qui. Quando una voce si chiude, la si toglie da questo foglio, e il commit dice com'è stata chiusa.*

## Dove siamo

- **Il motore 3.0** (`strumento/motore/`, versione 3.0.0-alpha.2) passa tutti i 61 test. I controlli non trovano errori né avvisi nelle 59 scene della Santa Rita, e i tipi sono a posto.
- **Le simulazioni sono chiuse**: dal 31 ottobre tutti e sei i criteri del §54.2 sono misurati e superati. A volte conviene essere in vista: davanti alla guardia del porto, quando la nave sta per salpare, chi convince l'ufficiale vince 91 partite su 100, chi gli lascia la bolla e aspetta 54. E la temeraria si fa male in 67 partite su 100.
- **Il documento di design** è stato rivisto il 29 ottobre: davanti le regole come sono oggi, in appendice la storia delle scelte. Gli ultimi due commit sono `4a5da65` (la revisione) e `e33b47d` (i nomi nuovi: il grado di mezzo si chiama «in vista», lo spostamento della soglia «scatto»).
- **Tre formati dalla stessa fonte**: il librogame in PDF, la partita nel terminale, l'app web.
- **Il *Quasi* è una scelta vera** dal 31 ottobre: le prove decisive della Santa Rita hanno un prezzo che pesa, e chi sceglie con giudizio vince 79 partite su 100 contro le 64 di chi prende sempre tutto (§54.2).
- **InteractiveWriter è uscito** dal ramo principale il 31 ottobre: il motore ha i suoi strumenti di costruzione, e la storia del vecchio strumento è in [`archivio/interactivewriter/`](archivio/interactivewriter/LEGGIMI.md), con il codice nel segnalibro `interactivewriter`.
- **Il logotipo è scelto**: la parola in minuscolo con due dadi al posto dei puntini delle i, il 29 ottobre. Le forme, i colori e le regole sono in [`typst/assets/logo/USO.md`](typst/assets/logo/USO.md).
- **Nessuna persona ha ancora giocato il 3.0.** Non è un blocco: si progetta con il ragionamento e con le simulazioni, e le prove con le persone correggono quando arrivano.

### Come si rimette in moto

Dalla cartella `strumento/motore/`:

```
node --test                              i test
node src/cli.ts controlla                i controlli della storia
node src/cli.ts simula --partite 1000    le simulazioni del §54.2 (una quarantina di secondi)
node src/cli.ts libro                    il librogame, in libro/santa-rita.md
npm run app                              l'app, in libro/santa-rita.html
npm run tipi                             il controllo dei tipi
```

Gli ultimi due chiedono esbuild e TypeScript: la prima volta, nella stessa cartella, `npm install`.

I PDF si rifanno da PowerShell, nella cartella `typst/`, con `.\build.ps1`. Servono Python e Typst 0.14 o successivo; i font sono già nel repository.

---

## 1. Subito: la prossima sessione

Le simulazioni non chiedono altro lavoro. Le strade sono due, e la scelta spetta a Simone:

- **la lettura frase per frase del documento di design** (§3), che conviene fare prima del manuale;
- **la 3.1**, cominciando dalla mappa dei luoghi (§4). Prima dello schema dei dati serve la decisione sulla lingua delle chiavi (§2).

---

## 2. Decisioni che spettano a Simone

| Decisione | Che cosa c'è sul tavolo | Che cosa serve per chiuderla |
|---|---|---|
| **La lingua delle chiavi nei dati** | Oggi le chiavi dei file JSON sono in italiano (`sposta`, `scatti`, `nonRiesci`…). Era la decisione D-S4 del vecchio piano dello strumento. | Va decisa prima dello schema JSON della 3.1. Le altre decisioni di quel piano (D-S3, D-S5, D-S6, in `archivio/ROADMAP-STRUMENTO.md`) riguardavano il vecchio motore e non valgono più. |

---

## 3. Piccole cose da sistemare

- **La lingua del documento di design.** Il 29 ottobre sono stati riscritti i passaggi confusi, non tutte le 32.000 parole. Manca una lettura frase per frase, con `archivio/LINGUA-DEL-MANUALE.md` accanto. Conviene farla prima del manuale.

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
- **Il manuale e la pubblicazione** (Fase 6). Qui nasce il **libro delle regole**, con la copertina in cuoio. Il file per l'oro a caldo è già pronto: la forma centrata a un colore, da non stampare sotto i 100 mm di larghezza.
- **Il logo animato** per i videogiochi. Il riferimento c'è già, `typst/assets/logo/esposizione-animato.svg`: i dadi cadono, rimbalzano e diventano i puntini. La versione per i giochi parte da lì; i tempi e i nomi delle parti sono in `USO.md`.
- **Le persone**, quando arrivano: `PER-CHI-PROVA.txt` e il §54.3 dicono che cosa guardare, e l'app registra da sola i tempi di lettura dei quadri e le scelte nei *Quasi*.

---

## Come si lavora

- A fine modifica: commit, push, e controllo che il repository locale e quello su GitHub coincidano. I messaggi dei commit raccontano che cosa è cambiato, in italiano.
- Le parole del gioco si provano nell'italiano di tutti i giorni, e le decide Simone.
- Il documento di design si aggiorna insieme al codice e dice le regole come sono oggi. La storia delle scelte va nelle appendici.
- Si progetta senza aspettare le prove con le persone: le risposte, quando arrivano, correggono quello che si è deciso.
