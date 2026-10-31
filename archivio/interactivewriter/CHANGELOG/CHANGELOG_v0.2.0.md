# v0.2.0 — Editor writer-first: layer linguistico e doppia vista

Data: 2026-07-20 · Stato: **Completata (primo mattone della ricostruzione)**

Prima tappa della ricostruzione dell'editor secondo [docs/author-experience.md](../docs/author-experience.md).
Trasforma l'interfaccia dalla lingua del programmatore a quella dell'autore, con un interruttore che mostra
lo **stesso** `.iwstory` in due lingue.

## Aggiunto

- **Doppia vista Autore / Tecnica** (`src/view.ts`, interruttore in alto). Di default: Autore. La vista
  tecnica resta disponibile per l'utente esperto, il debug e il futuro ponte LLM. Non è una seconda fonte di
  verità: è lo stesso dato spiegato in due modi.
- **Traduttore in lingua d'autore** (`src/lib/authorLang.ts`):
  - riferimenti → nomi amichevoli (i fatti usano la loro etichetta, non l'id);
  - **condizioni → frasi**: `arc_pagamenti == false` diventa *«Arco: pagamenti in contanti è falso»*;
    i booleani si riducono a *è vero / è falso*; composte con *e anche / oppure / tranne quando*;
  - **effetti → frasi**: *«aumenta Fiducia di Carli di 1»*, *«ottieni Grimaldello»*, *«Morale −1»*;
  - **prove → lingua naturale**: *«Prova di Forza — difficoltà Medio»* con **≈ % di riuscita per un
    personaggio medio** calcolata enumerando la distribuzione dei dadi del ruleset;
  - **validazione gentile**: i codici E/W diventano consigli (*«Ti segni "ha la chiave" ma non lo controlli
    mai. Serve davvero?»*, *«Questa scelta non porta a nessuna scena. Vuoi collegarla?»*).
- **Interfaccia ricablata** nel vocabolario dell'autore (vista Autore):
  - lista **Scene** con i titoli (niente id); tab **Scene / Cosa ricorda / Personaggio**;
  - ispettore **Scena**: *Racconto — cosa vede il lettore*, *Porta a…* con i titoli delle scene,
    *Appare solo se…* a frase, *Cosa cambia*, *Solo la prima volta / Ogni volta che entri*;
  - **Cose che la storia ricorda**: tipi in parole (*un fatto sì/no*, *un contatore*, *uno stato tra alcuni*);
  - **Scheda del personaggio**: Caratteristiche, Abilità, Indicatori, Regola delle prove;
  - pannello **Come va la storia** (validazione gentile).

## Verificato dal vivo (browser preview)

Sull'esempio `lemmons-carli`: lista delle 18 scene per titolo; blocchi con *«appare se Ha la bici di Mario è
vero»*; scelte dell'hub con *Porta a…* per titolo e *Appare solo se… Arco: pagamenti in contanti è falso*;
pannello di consigli gentili. L'interruttore **Tecnica** riporta id, `== false`, codici W04 e path.

## Prossimo (roadmap AX)

Fatti creati scrivendo · costruttore di condizioni composte a frase · wizard Prova con % dal vivo ·
playtest incorporato · livelli 1–3 e template · canvas a grafo · dialog nativi Tauri.
