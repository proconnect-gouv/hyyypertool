# Response Templates Seed

Seeds 33 response templates into the database with idempotency guarantees.

## Idempotency

Uses PostgreSQL `INSERT...ON CONFLICT DO NOTHING` (upsert) pattern:

- **Unique constraint** on `label` prevents duplicates
- Safe to re-run multiple times without side effects
- Subsequent runs update existing templates, not create new ones

## Run

```bash
bun run bin/seed/0000_response_types/main.ts
```

## Test

```bash
HYYYPERBASE_DATABASE_URL="postgresql://user:pass@host:5432/db" bun test
```
