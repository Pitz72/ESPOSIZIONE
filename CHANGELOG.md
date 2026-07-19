# Changelog — InteractiveWriter

Registro delle versioni. Un file di dettaglio per ogni fase di sviluppo in [`CHANGELOG/`](CHANGELOG/).
Il progetto segue [Semantic Versioning](https://semver.org/lang/it/) in fase `0.y.z` (pre-1.0: l'API e il
formato possono cambiare in modo incompatibile tra minori).

| Versione | Fase | Stato | Dettaglio |
|---|---|---|---|
| 0.2.0 | Editor writer-first — layer linguistico e doppia vista | Completata | [CHANGELOG_v0.2.0.md](CHANGELOG/CHANGELOG_v0.2.0.md) |
| 0.1.0 | Fase 3 — Editor GUI (MVP editing-first, Tauri) | MVP completato | [CHANGELOG_v0.1.0.md](CHANGELOG/CHANGELOG_v0.1.0.md) |
| 0.0.4 | Formato checkless/statless + Collaudo #02 (lemmons) | Completata | [CHANGELOG_v0.0.4.md](CHANGELOG/CHANGELOG_v0.0.4.md) |
| 0.0.3 | Consolidamento formato v0.3 (post-collaudo #01) | Completata | [CHANGELOG_v0.0.3.md](CHANGELOG/CHANGELOG_v0.0.3.md) |
| 0.0.2 | Fase 2 — CLI headless (`iw validate` / `iw play`) | Completata | [CHANGELOG_v0.0.2.md](CHANGELOG/CHANGELOG_v0.0.2.md) |
| 0.0.1 | Fase 1 — Core (motore + validatore) | Completata | [CHANGELOG_v0.0.1.md](CHANGELOG/CHANGELOG_v0.0.1.md) |
| 0.0.0 | Fase 0 — Fondamenta (formato + schema + esempio) | Completata | [CHANGELOG_v0.0.0.md](CHANGELOG/CHANGELOG_v0.0.0.md) |

## Convenzione

- Ogni fase apre un file `CHANGELOG/CHANGELOG_vX.Y.Z.md`.
- `formatVersion` del formato `.iwstory` è versionato **separatamente** dalla versione del progetto
  (attualmente `formatVersion: "0.3"`).
