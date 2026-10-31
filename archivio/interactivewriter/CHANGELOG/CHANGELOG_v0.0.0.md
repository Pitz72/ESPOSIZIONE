# v0.0.0 — Fase 0: Fondamenta

Data: 2026-07-19 · Stato: **Completata**

Prima gettata di fondamenta del framework. Nessun codice eseguibile: solo il *contratto* (formato) e la sua
documentazione.

## Aggiunto

- **`DESIGN.md`** — documento di design: diagnosi del problema di scala, architettura a 5 strati
  (Formato → Motore → Validatore → Editor → Ponte LLM), modello dati in dettaglio, ciclo di runtime, piano
  di migrazione dei 4 progetti esistenti, roadmap.
- **`schema/iwstory.schema.json`** — JSON Schema (Draft 2020-12) del formato `.iwstory` (`formatVersion: "0.1"`).
- **`examples/atrio-villa.iwstory.json`** — micro-storia dimostrativa, validata contro lo schema.
- **`README.md`** — orientamento del repository.

## Decisioni architetturali

- Sistema RPG **configurabile per progetto** (non cablato nel framework).
- Logica narrativa come **mini-espressioni dichiarative** (nessuna funzione JS).
- Editor come **app desktop Tauri + React**.

## Note

- `formatVersion` nasce a `"0.1"` (vedi 0.0.1 per il salto a `"0.2"`).
