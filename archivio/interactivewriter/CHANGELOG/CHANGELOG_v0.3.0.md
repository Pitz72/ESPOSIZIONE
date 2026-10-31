# v0.3.0 — Fatti creati scrivendo e conseguenze "Cosa cambia"

Data: 2026-07-20 · Stato: **Completata (secondo mattone della ricostruzione writer-first)**

La leva n.1 di [docs/author-experience.md](../docs/author-experience.md) §5.1: **l'autore non dichiara più
niente in anticipo**. Scrive la conseguenza in italiano e il fatto nasce da solo. Lo `stateSchema` diventa un
sottoprodotto della scrittura, non il compito preliminare che genera il terrore della pagina bianca.

## Aggiunto

- **Riconoscitore di conseguenze in lingua naturale** (`editor/src/lib/factLang.ts`, modulo puro).
  Trasforma una frase d'autore in un `Effect` del formato e, se il riferimento non esiste, nella **proposta
  del fatto mancante** (chiave tecnica generata, etichetta = la frase scritta). Riconosce:
  | L'autore scrive | Diventa |
  |---|---|
  | `ora ha la chiave` | `set ha_la_chiave = true` |
  | `non ha più la chiave` | `set ha_la_chiave = false` |
  | `aumenta fiducia di Carli di 1` | `add fiducia_carli +1` |
  | `Stress +10` / `diminuisci stress di 5` | `adjustResource stress ±N` |
  | `ottieni il grimaldello` / `perdi il grimaldello` | `addItem` / `removeItem` |
  | `l'umore diventa cupo` | `set umore = "cupo"` |
  I riferimenti già esistenti (fatti, indicatori della scheda, oggetti) vengono **riconosciuti per nome** —
  niente doppioni. Un oggetto non dichiarato diventa il fatto «ha X» (convenzione G5 del collaudo #02).
  Quando la frase è ambigua l'editor **non indovina**: mostra degli esempi.
- **Editor delle conseguenze "Cosa cambia"** (`editor/src/components/EffectsEditor.tsx`), prima in sola
  lettura, ora scrivibile: elenco delle conseguenze in lingua d'autore, rimozione, aggiunta con
  **anteprima dal vivo** della frase interpretata e del fatto che verrà creato. Usato in tre punti:
  conseguenze di una **scelta**, e conseguenze d'ingresso di una **scena** (*solo la prima volta* /
  *ogni volta che ci si torna*, prima nemmeno visibili).
- **Fatto creato anche mentre si pone una condizione**: in *Appare solo se…* il pulsante **+ nuovo fatto**
  apre un campo in linea, crea il fatto e lo seleziona nella condizione in un solo gesto
  (niente `window.prompt`: nella webview di Tauri non è affidabile).
- **Nomi al posto degli id in "Cose che la storia ricorda"**: in vista Autore si modifica l'**etichetta** del
  fatto (la chiave tecnica resta sotto, intatta, e non rompe i riferimenti); la vista Tecnica continua a
  rinominare la chiave. Cambiando tipo l'etichetta si conserva.
- **`.claude/launch.json`** per avviare l'editor in preview con un comando solo.

## Test

- Nuovo `editor/src/lib/factLang.test.ts`: **14 test** (`cd editor && node --test src/lib/factLang.test.ts`)
  su slug/chiavi uniche, risoluzione dei riferimenti esistenti, i sei casi di traduzione, la creazione
  proposta e i rifiuti espliciti.
- Totale progetto: **36 test verdi** (16 core + 6 CLI + 14 editor).

## Verificato dal vivo (browser preview)

- Storia vuota → in *Cosa cambia entrando qui* si scrive `ora ha la chiave`: anteprima
  *«→ ha la chiave diventa vero · Creo anche «ha la chiave» — un fatto (sì / no)»*; con Invio la conseguenza
  entra e il fatto compare in *Cose che la storia ricorda*; il pannello dei consigli reagisce subito
  (*«Ti segni "ha la chiave" ma non lo controlli mai. Serve davvero?»*) — il cerchio scrittura → memoria →
  validazione si chiude.
- Esempio `lemmons-carli` → `astinenza +5` viene riconosciuto come l'indicatore **Astinenza da sigarette**
  già esistente, **senza** proporre alcun fatto nuovo.
- Scelta di una storia nuova → **+ nuovo fatto** → `ha parlato con la guardia` → la condizione diventa
  *«ha parlato con la guardia | è vero»*. Nessun id a schermo in tutto il percorso.

## Prossimo (roadmap AX)

Costruttore di condizioni composte a frase (*e anche / oppure / tranne quando*) · wizard **Prova di abilità**
con difficoltà a parole e % dal vivo · playtest incorporato · livelli 1–3 e template · canvas a grafo ·
dialog nativi Tauri.
