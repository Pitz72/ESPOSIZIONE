# Collaudo #01 — Migrazione da Corridor2193

Data: 2026-07-19 · Formato: `.iwstory` 0.2 · Core/CLI: 0.0.1 / 0.0.2

## Obiettivo

Stressare il modello dati migrando **contenuto reale** (non inventato) da un progetto esistente, per
scoprire i buchi del formato *prima* di costruirci sopra l'editor (Fase 3). Sorgente scelto:
**Corridor2193** (`doom-narrative`), il più stressante perché usa **condizioni-funzione**, skill check,
risorse multiple ed effetti tipizzati.

## Cosa è stato migrato

Uno slice dell'Atto 1: risveglio nel relitto → Hub Centrale → console aliena → diramazione settori.
15 nodi, 2 skill check, 4 scelte condizionali, 5 risorse, 6 flag. Sorgenti reali:
`scene_01_awakening.ts`, `scene_hub.ts`, `gameStore.ts`, `gameLogic.ts`, `flags.ts`.
Risultato: [`examples/corridor-act1.iwstory.json`](../examples/corridor-act1.iwstory.json).

## Esito dei tre setacci

| Setaccio | Esito |
|---|---|
| Schema JSON (Draft 2020-12) | ✅ conforme |
| Validatore statico | ✅ **0 errori**, 5 warning (W04) |
| Playthrough deterministico (CLI) | ✅ percorsi di successo e di fallimento verificati |

I 5 warning W04 sono un **risultato positivo**: il validatore ha scoperto che, entro lo slice, 5 flag
(`intro_played`, `has_weapon`, `red_static_triggered`, `hub_unlocked`, `knows_xibalba`) vengono dichiarati/
scritti ma **mai riletti** — stato narrativo morto che nel codice originale passa inosservato.

## Cosa il modello ha assorbito bene (conferme)

1. **Condizioni-funzione → mini-espressioni dichiarative.** La coppia mutuamente esclusiva del sorgente:
   ```ts
   condition: (state) => Boolean(state.flags[STORY_FLAGS.KEY_BETA_LABS])   // ACCESSO CONSENTITO
   condition: (state) => !state.flags[STORY_FLAGS.KEY_BETA_LABS]           // ACCESSO NEGATO
   ```
   è diventata:
   ```json
   { "lhs": "key_beta_labs", "op": "==", "rhs": true }
   { "lhs": "key_beta_labs", "op": "==", "rhs": false }
   ```
   e a runtime si comporta **identicamente**: con la chiave assente compare solo "ACCESSO NEGATO".
   Questa è la conferma centrale del progetto: la logica esce dalle funzioni e diventa dato editabile.

2. **Skill check binari.** `skillCheck { stat, difficulty, successSceneId, failureSceneId }` → forma breve
   `onSuccess`/`onFailure`. La formula custom del sorgente (`1d20 + stat ≥ difficoltà`, senza critici né
   parziali) si esprime con `ruleset.check` + `outcomeModel { partial:false, crits:"off" }`: il sistema a
   esiti graduati **degrada senza sforzo** al puro binario. Verificato: strength [4]→fallimento,
   tech [7]+5=12→successo, tutto riproducibile a seed fisso.

3. **Risorse ed effetti.** `hp/stress/ammo/credits` con clamp e `onDepleted` (hp→`game_over`);
   `setFlag/modifyStress/modifyHp/damage` → `set`/`adjustResource`. Verificato: HP 80→70 dopo un
   `escape_fail`, stress che sale con gli `onEnter`.

## Buchi e frizioni emersi

### G1 — Il gioco sorgente non ha un layer "skill" *(frizione ergonomica)*
Corridor tira direttamente su **attributi** (`strength/agility/tech`), senza il livello skill→attributo del
nostro modello. Ma lo schema **obbliga** ogni skill ad avere un `attribute` e richiede un array `attributes`.
Ho dovuto inventare due attributi-contenitore (`fisico`, `mente`) inutilizzati (con `adds:["skill"]`).
**Proposta:** consentire a `check` di puntare a una skill **o** a un attributo (un *stat ref* generico), e
rendere opzionale il layer attributi quando il gioco non ne ha uno.

### G2 — Nessun posto per gli hint di presentazione per riga *(perdita nel round-trip)*
I segmenti di dialogo Corridor hanno `typingSpeed` e `glitchEffect` (istruzioni UI). Il formato è
presentation-agnostic *per scelta*, ma alcuni sono **hint autoriali** che si vorrebbe preservare.
**Proposta:** campo opzionale `hints` (oggetto libero) su `contentBlock`, ignorato dal motore ma
conservato per lo shell. Non intacca la logica.

### G3 — Le scelte non hanno una categoria *(perdita di metadato)*
Corridor marca ogni scelta con `type` (combat/stealth/tech/aggressive/professional/neutral/locked) per
stile e affinità. Il nostro `Choice` non ha un equivalente.
**Proposta:** `tag?: string[]` opzionale su `choice`.

### G4 — `onEnter` non idempotente: i cicli impilano gli effetti *(insidia di design)*
Rientrando in un nodo tramite un ciclo (`hub_labs_denied → back_to_choices → hub_console_success`), il suo
`onEnter` **ri-applica** `+10 stress`. Nel playthrough lo stress finale è **55 invece di 45**. Questo
riproduce *fedelmente* il comportamento del sorgente (anche là `modifyStress(10)` si impilerebbe), ma è una
trappola diffusa nelle storie con hub e ritorni.
**Proposta:** distinguere `onEnter` (sempre) da `onFirstEnter` (solo alla prima visita), oppure effetti con
flag `once`. Il motore traccia già `history`, quindi "prima visita" è calcolabile a costo zero.

### G5 — Item modellato come flag *(scelta di modellazione, non un buco)*
`KEY_BETA_LABS` è concettualmente un oggetto (`item_key_beta_labs`) ma nel sorgente vive nei flag. L'ho
modellato come var booleana (fedele al codice). Il formato offre entrambe le strade (`@item:` vs var):
serve una **convenzione/guida** su quando usare l'una o l'altra.

### G6 — Confini verso scene non ancora migrate *(nota per l'editor)*
Lo slice puntava a scene esterne (`act2_b1_start`…). Per non far scattare E01/W01 ho creato nodi-confine
espliciti. Nessuna modifica al formato, ma l'editor (Fase 3) dovrà gestire i **riferimenti esterni non
ancora importati** come stub/segnaposto di prima classe.

## Raccomandazioni

Prima della Fase 3 conviene consolidare il formato in una **0.3** che raccolga almeno gli additivi a basso
rischio (G2 `hints`, G3 `tag`) e i due miglioramenti di sostanza (G1 stat ref, G4 `onFirstEnter`/`once`).
Sono tutti **retro-compatibili** (campi opzionali / nuove alternative), quindi l'esempio `atrio-villa` e
questo `corridor-act1` restano validi.

## Verdetto

Il modello dati **regge il contenuto reale**: la migrazione è avvenuta senza forzature strutturali, la
logica-funzione è diventata dato, e il validatore ha dato valore immediato trovando stato morto. I buchi
emersi sono tutti **estensioni compatibili**, non ripensamenti. Via libera alla Fase 3 dopo il
consolidamento 0.3.

## Esito del consolidamento (formato v0.3 — vedi CHANGELOG 0.0.3)

G1, G2, G3, G4 **integrati** e retro-compatibili. `examples/corridor-act1.iwstory.json` è stato riscritto
come showcase: statistiche come **attributi diretti** (niente skill fittizie), `tags` sulle scelte, `hints`
sul blocco glitch, e lo stress della console spostato in `onFirstEnter`. Ri-collaudo: rientrando nella
console via `back_to_choices` lo stress finale è ora **45** invece di 55 — l'impilamento (G4) è risolto.
G5 (item vs flag) e G6 (riferimenti esterni) restano note per la guida autoriale e per l'editor.
