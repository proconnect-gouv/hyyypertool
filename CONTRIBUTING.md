# Contributing

Thank you for your interest in contributing! We welcome improvements, bug fixes, and new features. To keep our workflow smooth and consistent, please follow these guidelines.

---

## Branches

### Main branch

- The default development branch is `main`.

### Branch naming

- Use a descriptive name that recalls the purpose, for example:
  - `feature-add-authentication`
  - `fix-update-dependencies`

- Avoid generic names like `patch-1` or `branch123`.
- Feel free to choose any clear, concise format.

---

## Commits

### Scope

- Make small, focused commits (micro commits).
- Avoid touching too many files in a single commit.

### Message format

- Use [Gitmoji](https://gitmoji.dev/) for an emoji prefix (e.g., `✨`, `🐛`, `💄`).
- Write a short subject that clearly describes the change; it will appear in the changelog.
  - Example: `💄 change duplicate icon`

### Commit body

- Include detailed context or rationale here.
- Do **not** post PR details or discussion in external chat channels; document them in the commit instead.

---

## Pull Requests

### Labels

- GitHub will apply labels automatically.

### Content

- Keep PRs small and focused; ideally one commit per PR.
- PRs are merged into `main` using a **merge commit**.
- Clean up or squash commits before pushing (on macOS, you can use [GitUp](https://github.com/git-up/GitUp)).

### Title

- **Single-commit PR**: use the default commit message as the PR title.
- **Multi-commit PR**: craft a title following the commit message guidelines above.

### Description

- **Single-commit PR**: the default description is usually sufficient.
- **When needed**, add context, for example:
  - Database migrations to run: `npm run migrate`
  - This PR reverts #123.

- Link related Trello cards using the Trello Power-Up.
- Feel free to include illustrative GIFs to demonstrate changes.

---

## UseCase Convention

UseCases follow a consistent factory pattern for dependency injection and type safety.

### Structure

```typescript
// Factory function that takes dependencies
export function UseCaseName({ dependency1, dependency2 }: DependencyCradle) {
  // Return the actual usecase function
  return async function use_case_name(params: InputType) {
    // Implementation
    return result;
  };
}

// Export handler type for dependency injection
export type UseCaseNameHandler = ReturnType<typeof UseCaseName>;

// Optional: Export output type if needed elsewhere
export type UseCaseNameOutput = Awaited<ReturnType<UseCaseNameHandler>>;
```

### Conventions

1. **Factory Pattern**: Each usecase is a factory function that accepts dependencies and returns the actual usecase function
2. **Naming**:
   - Factory function: `PascalCase` (e.g., `GetUserInfo`)
   - Returned function: `snake_case` (e.g., `get_user_info`)
3. **Dependencies**: Use typed cradles (e.g., `IdentiteProconnectDatabaseCradle`) for dependency injection
4. **Types**: Export `Handler` type for the returned function, optionally export `Output` type
5. **Comments**: Use `//` comment blocks to separate sections
6. **Error Handling**:
   - Throw appropriate errors (e.g., `NotFoundError`) with descriptive messages
   - Prefer `import { to } from "await-to-js"` over try/catch blocks for cleaner error handling
   - Always try to track error cause when instantiating new errors using the `cause` option
7. **Async**: All usecase functions should be async

### Example

```typescript
//

import { NotFoundError } from "#src/errors";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect/database";
import { to } from "await-to-js";

//

export function GetUserInfo({ pg }: IdentiteProconnectDatabaseCradle) {
  return async function get_user_info(id: number) {
    const user = await pg.query.users.findFirst({
      where: (table, { eq }) => eq(table.id, id),
    });

    if (!user) throw new NotFoundError(`User ${id} not found.`);
    return user;
  };
}

export type GetUserInfoHandler = ReturnType<typeof GetUserInfo>;
export type GetUserInfoOutput = Awaited<ReturnType<GetUserInfoHandler>>;
```

**Error Handling with await-to-js:**

```typescript
export function ProcessUserData({ external_service }: Dependencies) {
  return async function process_user_data(id: number) {
    // Prefer this pattern over try/catch
    const [error, result] = await to(external_service.fetchData(id));

    if (error) {
      // Handle specific error types and track the original cause
      if (error instanceof NetworkError) {
        throw new ServiceUnavailableError("External service unavailable", {
          cause: error,
        });
      }

      // Always preserve the original error as cause when wrapping
      throw new ProcessingError("Failed to process user data", {
        cause: error,
      });
    }

    return result;
  };
}
```

---

## Testing Convention

Write comprehensive tests following these guidelines:

### Repository Layer Tests

1. **Use Real Database**: Import `pg` from `@~/identite-proconnect/database/testing` instead of mocking
2. **Database Setup**: Always include `beforeAll(migrate)` and `beforeEach(empty_database)`
3. **Seed Data**: Use unicorn seed functions (e.g., `create_adora_pony_user`, `create_pink_diamond_user`, `create_red_diamond_user`)
4. **Time Control**: Use `setSystemTime()` for deterministic timestamps in tests
5. **Snapshots Over Multiple Expects**: Prefer `toMatchInlineSnapshot()` for complex object assertions over multiple individual expects
6. **Auto-generated Snapshots**: When using `toMatchInlineSnapshot()`, let Bun test write the string value automatically by running the test first with an empty string or no parameter
7. **Comprehensive Coverage**: Test all major functionality including:
   - Basic operations (CRUD)
   - Edge cases (empty results, not found)
   - Filtering and search functionality
   - Pagination behavior
   - Data ordering

### Example

```typescript
//

import { schema } from "@~/identite-proconnect/database";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, setSystemTime, test } from "bun:test";
import { GetUsersList } from "./GetUsersList";

//

beforeAll(migrate);
beforeEach(empty_database);

beforeAll(() => {
  setSystemTime(new Date("2222-01-01T00:00:00.000Z"));
});

test("returns paginated users list with default pagination", async () => {
  await create_adora_pony_user(pg);

  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({});

  // Let Bun auto-generate the snapshot - comprehensive validation
  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "adora.pony@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Pony",
          "given_name": "Adora",
          "id": 1,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});

test("filters users by search term", async () => {
  await create_adora_pony_user(pg);
  await create_pink_diamond_user(pg);

  const get_users_list = GetUsersList(pg);
  const result = await get_users_list({ search: "pony" });

  expect(result).toMatchInlineSnapshot(`
    {
      "count": 1,
      "users": [
        {
          "created_at": "2222-01-01 00:00:00+00",
          "email": "adora.pony@unicorn.xyz",
          "email_verified_at": null,
          "family_name": "Pony",
          "given_name": "Adora",
          "id": 1,
          "last_sign_in_at": null,
        },
      ],
    }
  `);
});
```

---

## Context Usage Convention

### Server vs Client Context

- **Pages/Routes**: Use `useRequestContext` for server data access
- **UI Components**: Use `createContext` for client state management

This separation ensures clear architectural boundaries between server-side data concerns and client-side UI state.

### Page Variables Pattern

Use `loadPageVariables` functions for consistent data loading:

```typescript
export async function loadDomainPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { id }: { id: number },
) {
  // Data loading logic
  return { data1, data2, ... };
}

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadDomainPageVariables>>;
}
```

#### Helper Function

Use `set_variables` helper for bulk context variable assignment:

```typescript
import { set_variables } from "@~/app.middleware/context/set_variables";

async function set_variables_middleware(
  { req, set, var: { identite_pg } },
  next,
) {
  const { id } = req.valid("param");
  const variables = await loadPageVariables(identite_pg, { id });
  set_variables(set, variables);
  return next();
}
```

- **Naming**: `loadDomainPageVariables` (e.g., `loadUserPageVariables`)
- **Type inference**: Use `Awaited<ReturnType<...>>` for automatic typing
- **Single source**: Consolidate all page data loading in one function
- **Helper usage**: Use `set_variables(set, variables)` for bulk assignment

---

## File Naming Grammar

Our codebase uses file suffixes to indicate the **purpose** of code. This makes it easy to understand what a file does at a glance.

### File Suffixes That Actually Exist

| Suffix                       | Contains                | Example                              | Testing Strategy           |
| ---------------------------- | ----------------------- | ------------------------------------ | -------------------------- |
| `index.ts` / `index.tsx`     | Route handler (Hono)    | `routes/users/:id/index.tsx`         | Route tests, HTTP + DB     |
| `.query.ts`                  | SQL query (Drizzle)     | `get_moderations_list.query.ts`      | Integration tests, real DB |
| `.client.ts` / `.client.tsx` | Preact island (browser) | `search-email.client.tsx`            | DOM tests                  |
| `.mapper.ts`                 | Data transformation     | `moderation_type.mapper.ts`          | Unit tests, colocated      |
| `.test.ts`                   | Test file               | `get_moderations_list.query.test.ts` | Colocated with source      |

**Note**: `.rules.ts`, `.workflow.ts`, `.validation.ts`, `.router.ts` are NOT currently used in the codebase. Avoid creating them.

### Real Examples

**Route handler** (`index.tsx`):

```typescript
// sources/web/src/routes/users/:id/index.tsx
import { Hono } from "hono";
import { GetUserById } from "#src/queries/users";
import { GetUserInfo } from "#src/lib/users/usecase";

export const users_id = new Hono<Variables>()
  .get("/", async (c) => {
    const id = c.req.param("id");
    const identite_pg = c.var.identite_pg;

    const get_user_by_id = GetUserById({ columns: { ... } });
    const user = await get_user_by_id(identite_pg, Number(id));

    const get_user_info = GetUserInfo({ pg: identite_pg });
    const info = await get_user_info(Number(id));

    return c.render(<UserPage user={user} info={info} />);
  });
```

**Colocated query** (`.query.ts`):

```typescript
// sources/web/src/routes/moderations/get_moderations_list.query.ts
import { eq, like, desc } from "drizzle-orm";
import { schema } from "@~/identite-proconnect/database";

export async function get_moderations_list(
  pg: IdentiteProconnectPgDatabase,
  { pagination, search }: { pagination: Pagination; search?: string },
) {
  const conditions = search ? like(schema.moderations.email, `%${search}%`) : undefined;
  const moderations = await pg
    .select({ ... })
    .from(schema.moderations)
    .where(conditions)
    .orderBy(desc(schema.moderations.createdAt))
    .limit(pagination.limit)
    .offset(pagination.offset);

  return moderations;
}
```

**Preact Island** (`.client.tsx`):

```typescript
// sources/web/src/routes/moderations/search-email.client.tsx
/* @jsxImportSource preact */
import { signal } from "@preact/signals";

const searchEmail = signal("");

export function SearchEmail() {
  return (
    <input
      value={searchEmail}
      onInput={(e) => {
        searchEmail.value = e.currentTarget.value;
        // Trigger HTMX search
        htmx.ajax("GET", "/moderations", {
          target: "#moderations-table",
          swap: "innerHTML",
        });
      }}
      placeholder="Rechercher par email..."
    />
  );
}
```

**Pure mapper** (`.mapper.ts`):

```typescript
// sources/web/src/lib/moderations/moderation_type.mapper.ts
export type ModerationType =
  | "create_organization"
  | "join_organization"
  | "add_external_member";

export function moderation_type_to_label(type: ModerationType): string {
  const labels: Record<ModerationType, string> = {
    create_organization: "Création d'organisation",
    join_organization: "Demande d'adhésion",
    add_external_member: "Membre externe",
  };
  return labels[type];
}
```

### When to Use Each Suffix

- Use `index.ts` / `index.tsx` when: Exporting a Hono router as the feature entry point
- Use `.query.ts` when: Writing SQL queries with Drizzle (prefer colocated with route)
- Use `.client.tsx` when: Creating Preact components that run in the browser
- Use `.mapper.ts` when: Transforming data between formats (pure function)
- Use `.test.ts` when: Writing tests (colocate next to source file)

---

## Feature-First Organization

Organize routes by **user-facing capability** (feature-first) rather than technical layer (layer-first). Related code lives together in feature folders.

### Folder Structure Rules

**Feature depth: Max 2-3 levels**

```
web/src/routes/organizations/
├── join/                       # Feature: Join organization
│   ├── index.ts                # Router entry point
│   ├── join.router.ts          # HTTP routes
│   ├── join-organization.workflow.ts
│   ├── eligibility.rules.ts    # Pure logic
│   ├── eligibility.rules.test.ts
│   └── insee-to-org.mapper.ts  # Colocated with feature
├── verify-dirigeant/           # Feature: Verify company director
│   ├── index.ts
│   ├── verify.router.ts
│   └── ...
└── :id/                        # Feature: Organization detail
    ├── index.ts
    ├── page.tsx
    └── members/                # Nested feature (max depth)
        ├── index.ts
        └── ...
```

**When feature grows too large**: Use file prefixes, not deeper folders

```
✅ Good (flat with prefixes):
/join/
├── join-with-invitation.workflow.ts
├── join-as-external.workflow.ts
└── join-eligibility.rules.ts

❌ Bad (too nested):
/join/
└── workflows/
    └── invitation/
        └── with-email/
            └── workflow.ts
```

### Test Colocation

Tests live **next to source files**, not in separate `/tests/` tree:

```
/join/
├── eligibility.rules.ts
├── eligibility.rules.test.ts    # Unit test (same folder)
├── join-organization.workflow.ts
└── join-organization.workflow.test.ts  # Integration test (same folder)
```

**Exception**: E2E tests stay in `/e2e/` directory (cross-feature user journeys).

### Where Code Lives

**Default**: Keep everything flat in the route feature folder. If it's not shared, it stays with the route.

- **Route handler**: `index.ts` with `new Hono()` - loads data, renders page
- **Feature query**: Colocated `.query.ts` file - direct async function
- **Client interaction**: Colocated `.client.tsx` file - Preact island

**When shared across 3+ routes**: Move to `#src/lib/{domain}/` or `#src/queries/{domain}/` (legacy pattern).

```typescript
// Default: flat in the route
import { get_moderations_list } from "./get_moderations_list.query";

// Shared across routes: lib barrel
import { build_moderation_update } from "#src/lib/moderations";
```

**Legacy patterns**: `sources/web/src/queries/{domain}/` and `sources/web/src/lib/{domain}/usecase/` contain shared query factories and usecases from the original architecture. New feature-specific queries should prefer colocated `.query.ts` files flat in the route folder.

### When to Use Context Access

For UI components and infrastructure, use context access via barrel files (`#src/*/index.ts`):

```typescript
// ✅ Good: Context access via barrel
import { Button } from "#src/ui/button";
import { htmx } from "#src/htmx";
import { NotFoundError } from "#src/errors";

// ❌ Bad: No /shared/ folder
import { OrganizationsRepo } from "#src/shared/db/organizations.repo";
```

### Decision Tree: "Where Does This Code Go?"

1. **Is it a route?**
   - Use `index.ts` with `new Hono()` - loads data, renders page

2. **Is it a feature-specific query?**
   - Colocate `.query.ts` file in route folder

3. **Is it a client interaction?**
   - Use `.client.tsx` Preact island

4. **Is it data transformation?**
   - Use `.mapper.ts` - colocated with feature

5. **Is it shared logic across 3+ routes?**
   - Move to `#src/lib/{domain}/` or `#src/queries/{domain}/`

6. **Is it a UI component?**
   - Shared: `#src/ui/button` (via barrel)
   - Feature-specific: `/feature/ComponentName.tsx`

---

## Questions or Help

If you need assistance, please open an issue or ask in our [community channel](https://tchap.gouv.fr/#/room/!kBghcRpyMNThkFQjdW:agent.dinum.tchap.gouv.fr?via=agent.dinum.tchap.gouv.fr&via=agent.finances.tchap.gouv.fr&via=agent.interieur.tchap.gouv.fr). We appreciate your contributions!
