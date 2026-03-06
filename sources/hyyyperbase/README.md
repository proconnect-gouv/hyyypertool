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
