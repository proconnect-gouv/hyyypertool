# hyyyperbase

PostgreSQL Row-Level Security (RLS) with Drizzle ORM for ProConnect.

## Usage

```typescript
import { as_user, schema } from "@~/hyyyperbase";

// Queries run inside a transaction with RLS session variables set
const result = await as_user(db, { id: 42, role: "visitor" }, (tx) =>
  tx.select().from(schema.users),
);
```

`as_god` bypasses RLS for privileged operations (seeding, migrations):

```typescript
import { as_god } from "@~/hyyyperbase";

await as_god(db, (tx) => tx.delete(schema.users).returning());
```

## Roles

| Role        | Access                          |
| :---------- | :------------------------------ |
| `admin`     | Full CRUD on all rows           |
| `moderator` | Read-only on non-disabled users |
| `visitor`   | Read/update own row only        |

`god` is not a user role — it's an internal RLS policy for privileged operations via `as_god`.

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
