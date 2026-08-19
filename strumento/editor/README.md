# @interactivewriter/editor

Editor grafico di InteractiveWriter — **Tauri v2 + React 19 + Vite**, editing-first. Riusa
`@interactivewriter/core` per la validazione live.

## Avvio

```bash
cd editor
npm install            # offline se la cache ha già React/Vite/Tauri
npm run dev            # frontend nel browser su http://localhost:1420
npm run tauri:dev      # app desktop nativa (richiede Rust)
```

Il frontend gira anche in un browser normale (adapter di I/O in `src/lib/fileIO.ts`), quindi è verificabile
senza il guscio Tauri.

## Struttura

- `src/App.tsx` — orchestratore (caricamento, validazione live, salvataggio).
- `src/components/` — `Sidebar`, `NodeInspector` (con editor di condizione a foglia), `StateSchemaEditor`,
  `ValidationPanel`.
- `src/lib/` — `fileIO` (apertura/salvataggio), `summarize` (condizioni/effetti → testo).
- `src-tauri/` — guscio desktop Tauri v2.

Stato e roadmap: vedi [CHANGELOG_v0.1.0](../CHANGELOG/CHANGELOG_v0.1.0.md).
