# v0.4.0 — Formato 0.4: crescita del personaggio, ingombro, personaggi pronti

Data: 2026-07-20 · Stato: **Completata** · `formatVersion` **0.3 → 0.4** (additiva, retro-compatibile)

Nasce da un confronto con l'autore su quattro punti: la gestione oggetti era un ripiego, mancava una fase
di configurazione iniziale, la storia deve ramificare anche sulle caratteristiche del personaggio, e —
soprattutto — nel modello *Disco Elysium* **una prova non cambia solo la storia, cambia chi sei**. Il motore
sapeva tirare i dadi sulle abilità ma non sapeva farle salire: questo rilascio chiude il buco.

## Aggiunto al formato

- **Crescita del personaggio**: due effetti nuovi, `adjustSkill` e `adjustAttribute`. I valori restano
  dentro i `min`/`max` dichiarati nel ruleset, quindi la scheda non si sfonda. Una prova riuscita, un
  pensiero interiorizzato o una scelta di carattere possono ora modificare il personaggio.
- **Capacità di trasporto** (`ruleset.inventory`): `baseCapacity` + `overflow` + `unitLabel`. Ogni oggetto
  ha `size` (default 1; `0` = non ingombra) e può *aggiungere* posti con `capacityBonus` — è così che si
  modellano cappotto, borsa, zaino. Con `overflow: "block"` (default) l'oggetto che non ci sta **non entra**.
  Tre riferimenti interrogabili in qualunque condizione: **`@capacity`**, **`@carried`**, **`@free`**.
  Senza `ruleset.inventory` non c'è alcun limite: chi non vuole l'ingombro non lo vede.
- **Personaggi pronti** (`ruleset.presets`): statistiche, indicatori ed equipaggiamento iniziale. Servono
  insieme come **default dell'autore** (`default: true`, al massimo uno) e come **archetipi che il gioco può
  far scegliere al giocatore**. Precedenza a `newGame`: build esplicito → preset → default della dichiarazione.
- **`setting`** (facoltativo, a livello di storia): mondo, tono, protagonista, appunti. Il motore lo ignora —
  è la casa della futura *Configurazione iniziale* dell'editor.

## Motore

- `capacityOf` / `carriedOf` / `freeSpaceOf` esportati dal core; `resolveRef` risolve `@capacity/@carried/@free`.
- `applyEffect`: crescita con clamp, `addItem` che rispetta l'ingombro.
- `newGame`: applica il preset (statistiche, indicatori, equipaggiamento) e fa il clamp di tutto ciò che
  arriva dall'esterno. L'equipaggiamento iniziale entra anche se ingombrante — lo dichiara l'autore.
- `resolvePreset(story, build)` per sapere da chi si sta partendo.

## Validatore

- **E08** (nuovo): personaggio pronto incoerente — id duplicato, più di un `default`, riferimenti a
  statistiche/indicatori/oggetti non dichiarati.
- **W07** (nuovo): equipaggiamento iniziale oltre la capacità di trasporto.
- **E03** esteso: `adjustSkill`/`adjustAttribute` verso abilità o caratteristiche inesistenti, e
  riferimenti d'ingombro scritti male.

## CLI

- `iw play … --preset <id>`: gioca partendo da un personaggio pronto (con errore utile se l'id non esiste).
- Riepilogo di fine partita più informativo: riga **personaggio** (statistiche *dopo* la crescita) e
  ingombro `3/5 tasche`. Corretto un crash latente sul riepilogo delle storie senza risorse (post-G11).

## Editor

- `effectToAuthor` traduce la crescita: *«Forza cresce di 1»*, *«Logica cala di 1»*.
- Il riconoscitore di conseguenze (`factLang`) ora conosce **abilità e caratteristiche**: *«aumenta Empatia
  di 1»* diventa `adjustSkill`, non un fatto nuovo. `Psiche -1` diventa `adjustAttribute`.
- I riferimenti d'ingombro hanno un nome d'autore (*«lo spazio libero»*) e compaiono negli elenchi delle
  condizioni quando la storia usa l'ingombro; anche gli oggetti sono ora selezionabili.

## Esempio

`atrio-villa` diventa la vetrina della 0.4: `setting`, due personaggi pronti (*L'investigatore consumato*
con il cappotto a tre tasche in più, *Lo scassinatore pentito* col grimaldello), tre oggetti con
`size`/`capacityBonus`, una scelta che appare solo se c'è spazio, e tre punti di crescita (il successo
critico sulla porta, il pensiero interiorizzato, la scelta di carattere che alza Forza e abbassa Logica).

## Test

**49 verdi** (29 core + 6 CLI + 14 editor). 13 nuovi in `core/src/growth.test.ts` su crescita, ingombro,
preset e le nuove regole del validatore.

## Verificato dal vivo

```
iw play examples/atrio-villa.iwstory.json --preset scassinatore --choices sali,prendi_lampada
  → "Prendi la lampada a olio" appare bloccata: capacità 2, occupata 1, servono 2 posti
iw play … --choices sali,prendi_lampada,cambia_approccio     (investigatore, default)
  → personaggio: … Logica 1, Forza 2   ·   inventario: cappotto, lampada (3/5 tasche)
```

Nell'editor (vista Autore): *«Appare solo se… Lampada a olio è uguale a 0 e anche lo spazio libero è almeno
2»*, *«Cosa cambia: Forza cresce di 1 · Logica cala di 1»*, e scrivendo *«aumenta Empatia di 1»* l'anteprima
risponde *«→ Empatia cresce di 1»* senza proporre alcun fatto.

## Prossimo

Pannello **Configurazione iniziale** nell'editor (setting, personaggi pronti, inventario di partenza,
capacità), poi il pannello **Oggetti** — che toglierà l'ultimo ripiego: l'oggetto non dichiarato modellato
come fatto «ha X».
