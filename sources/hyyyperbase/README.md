# hyyyperbase

PostgreSQL database layer with Drizzle ORM for ProConnect.

## Usage

```typescript
import { schema } from "@~/hyyyperbase";

const users = await db.select().from(schema.users);
```

## Roles

| Role        | Access                          |
| :---------- | :------------------------------ |
| `admin`     | Full CRUD on all rows           |
| `moderator` | Read-only on non-disabled users |
| `visitor`   | Read/update own row only        |

Access control is enforced at the application layer via ProConnect OIDC, encrypted sessions, and the `authorized()` middleware — not at the database level. See ADR discussion for rationale.

## Migrations

```bash
bun run generate  # Generate migrations from schema changes
bun run migrate   # Apply migrations
```

## Testing

Tests use PGlite (in-memory WASM PostgreSQL). See `src/testing/` for helpers.

```bash
bun test --cwd sources/hyyyperbase
```

## Seeding Data

### Local Development/Testing

Use seed scripts in `bin/seed/` to populate local databases with test fixtures.

```bash
bun run testing:seed # bun run bin/testing/seed.ts
```

Seed scripts:

- Are **environment-isolated** (detect local vs. production via `ENVIRONMENT` or connection string)
- Accept **explicit flags/args** (never auto-detect context silently)
- Use **test data only** (clearly marked as fixtures; no copy-paste of real data)
- Are **idempotent**: Use `INSERT ... ON CONFLICT DO UPDATE` (upsert) to safely re-run without duplication
  - Schema tables used for seeding have **unique constraints** (e.g., `label` on `response_templates`)
  - Safe to run multiple times; existing rows are updated, not duplicated

### Production Data Injection

One-time data injections (regulatory fixes, backfills, migrations) in production should use [Scalingo Platform Tasks](https://doc.scalingo.com/platform/app/tasks):

```bash
scalingo --app=<app-name> run <command>
```

**Security essentials for production seeds:**

1. **Environment lock**: Never run against production unless explicitly verified

   ```typescript
   if (process.env.ENVIRONMENT !== "production") {
     throw new Error(
       "This script only runs in production (ENVIRONMENT=production)",
     );
   }
   ```

2. **Read-only verification first**: Query affected data before mutation

   ```typescript
   const affected = await db.select().from(table).where(condition);
   console.log(`Will update ${affected.length} rows`);
   // Require manual approval before proceeding
   ```

3. **Atomic transactions**: Wrap in a transaction; fail loudly on any error

   ```typescript
   await db.transaction(async (tx) => {
     // mutations here
   }); // Auto-rollback on exception
   ```

4. **Audit trails**: Log who ran it, when, what changed (before/after counts)

   ```typescript
   console.log({
     timestamp: new Date().toISOString(),
     script: import.meta.url,
     rowsAffected: result.length,
   });
   ```

5. **No secrets in code**: Connection strings from environment; API keys from vaults
   - Never hardcode DB credentials or tokens
   - Use Scalingo environment variables or secret management

6. **Rehearsal**: Test against a production replica first
   - Run against staging with identical schema
   - Verify output before production run

7. **Reversibility plan**: Document rollback steps
   - If this script fails, what's the fix? (restore from backup, reverse mutations, etc.)
   - Keep before/after snapshots for audit
