# DUTCHEYY Records — Levitate

Web operating system for catalogue, radio pitching, sync, A&R and metadata.

Branding uses the Dutcheyy Records purple seal (`public/brand/logo-seal.jpg`) and portrait mark (`public/brand/logo-portrait.jpg`).

## Data

Seeded from `DUTCHEYYS_MASTER_RECORDS_V3_TRUTH_METADATA.xlsx` via `data/master-import.json`:

- Radio Database
- Music Supervisors
- Sync Briefs
- Placements (also used as Spotify / playlist pitch stubs until the playlist sheet is imported)

Workspace state lives in `data/store.json` (reset from Data Management).

## Run

```bash
npm run dev
```

Open http://localhost:3000
