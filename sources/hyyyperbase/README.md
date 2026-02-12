# hyyyperbase

The Hyper-Data-Layer for ProConnect. Native PostgreSQL Row-Level Security (RLS) meets Drizzle ORM.

## The Vision

`hyyyperbase` moves the "Who can see what?" logic out of application code and into the database. This ensures that even if a developer makes a mistake in a UI component or a REST endpoint, the database remains the final arbiter of truth.

## Usage

### User-Based Access (RLS)

Wrap your queries with `as_user`. This creates a transaction, sets the session variables (`app.user_id`, `app.role`), and executes your function.

```typescript
import { as_user, schema } from "@~/hyyyperbase";

const user = { id: 42, role: "visitor" };

const result = await as_user(db, user, async (tx) => {
  // RLS policy applied: e.g. "visitor" can only see their own profile
  return tx.select().from(schema.users);
});
```

### Admin Access

Admins are just users with role="admin". The `admin` role has policies granting full access.

```typescript
import { as_user, schema } from "@~/hyyyperbase";
import { eq } from "drizzle-orm";

const admin_user = { id: 1, role: "admin" };

await as_user(db, admin_user, async (tx) => {
  // Can delete any user because role is admin
  return tx.delete(schema.users).where(eq(schema.users.id, 99));
});
```

## Schema

We use Drizzle's `pgPolicy` to define access rules directly in the schema.

```typescript
export const users = pgTable(
  "users",
  {
    created_at: timestamp("created_at").defaultNow().notNull(),
    disabled_at: timestamp("disabled_at"),
    email: text("email").notNull().unique(),
    id: serial("id").primaryKey(),
    role: text("role").default("visitor").notNull(),
    updated_at: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    pgPolicy("admin_all", {
      /* full access for admin role */
    }),
    pgPolicy("god_all", {
      /* full access for god role */
    }),
    pgPolicy("moderator_select", {
      /* can read active (non-disabled) users */
    }),
    pgPolicy("no_self_delete", {
      /* restrictive: no user can delete themselves */
    }),
    pgPolicy("self_select", {
      /* users can see their own row */
    }),
    pgPolicy("self_update", {
      /* users can update their own row */
    }),
  ],
);
```

## Testing

Tests use PGlite (in-memory WASM PostgreSQL) by default. Import from `@~/hyyyperbase/testing`:

```typescript
import { as_user, schema } from "@~/hyyyperbase";
import { hyyyper_pglite, reset } from "@~/hyyyperbase/testing";
import { insert_admin, insert_jeanbon } from "@~/hyyyperbase/testing/users";
import { beforeEach, expect, test } from "bun:test";

beforeEach(reset);

test("admin can see all users", async () => {
  const admin = await insert_admin(hyyyper_pglite);
  await insert_jeanbon(hyyyper_pglite);

  const result = await as_user(hyyyper_pglite, admin, (tx) =>
    tx.select().from(schema.users),
  );

  expect(result).toHaveLength(2);
});
```

### Available test seeds

| Function               | Role      | Email                   |
| :--------------------- | :-------- | :---------------------- |
| `insert_admin`         | admin     | admin@omega.gouv.com    |
| `insert_god`           | god       | god@yopmail.com         |
| `insert_moderateur`    | moderator | moderateur@beta.gouv.fr |
| `insert_jeanbon`       | visitor   | jeanbon@yopmail.com     |
| `insert_disabled_user` | visitor   | disabled@yopmail.com    |

## Critical Trade-offs

| Choice                        | Benefit                                                            | Counterpoint / Risk                                                |
| :---------------------------- | :----------------------------------------------------------------- | :----------------------------------------------------------------- |
| **Session Vars (`app.role`)** | Compatible with environments without `CREATEROLE` (e.g. Scalingo). | Requires disciplined transaction wrapping (provided by `as_user`). |
| **`FORCE RLS`**               | Enforces policies even for the table owner.                        | Essential for Scalingo where the app connects as the owner.        |
| **Transaction Wrapping**      | Prevents connection "pollution" (leaking session vars).            | Performance overhead (~1ms); connection pool pressure.             |

## Migrations

Migrations are standard Drizzle migrations.

```bash
# Generate migrations
bun run generate

# Apply migrations (locally or in CI/CD)
bun run migrate
```

## Structure

```
src/
├── index.ts              # @~/hyyyperbase — schema, roles, types, as_user
├── schema.ts             # table + RLS policies
├── as_user.ts            # RLS context switch function
├── migrator.ts           # node-postgres migrate()
└── testing/
    ├── index.ts          # @~/hyyyperbase/testing — PGlite harness
    ├── pg.ts             # node-postgres harness (internal)
    └── users.ts          # @~/hyyyperbase/testing/users — test seed data
```
