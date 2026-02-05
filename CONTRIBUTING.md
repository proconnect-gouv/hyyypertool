# Contributing

Thank you for your interest in contributing! We welcome improvements, bug fixes, and new features. To keep our workflow smooth and consistent, please follow these guidelines.

---

## Development Scripts

All scripts live in `/scripts/` and use Bun shell. npm scripts are entry points.

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run dev`        | Start dev environment (Docker, watchers, server) |
| `npm run build`      | Production build (client scripts + Tailwind CSS) |
| `npm run test`       | Run full test suite (format, types, tests)       |
| `npm run format`     | Check formatting                                 |
| `npm run format:fix` | Fix formatting                                   |
| `npm run db:migrate` | Run database migrations                          |
| `npm run db:seed`    | Migrate + seed database                          |
| `npm run db:reset`   | Reset database (same as db:seed)                 |
| `npm run db:studio`  | Open Drizzle Studio                              |

### Script Structure

```
scripts/
  build.ts        # Production build
  dev.ts          # Dev environment
  test.ts         # Test suite
  format.ts       # Formatter (--fix flag)
  db/
    migrate.ts    # Database migrations
    seed.ts       # Seed test data
    studio.ts     # Drizzle Studio
```

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
  - Database migrations to run: `npm run db:migrate`
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

import { NotFoundError } from "@~/core/error";
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

Our codebase uses file suffixes to indicate both **purity** (pure/impure) and **purpose** of code. This makes it easy to understand what a file does and how to test it at a glance.

### File Suffixes

| Suffix           | Pure/Impure | Contains                        | Example                         | Testing Strategy                       |
| ---------------- | ----------- | ------------------------------- | ------------------------------- | -------------------------------------- |
| `.rules.ts`      | Pure        | Business decision logic         | `eligibility.rules.ts`          | Unit tests, colocated, <10ms, no mocks |
| `.validation.ts` | Pure        | Input validation                | `join-input.validation.ts`      | Unit tests, colocated, no I/O          |
| `.mapper.ts`     | Pure\*      | Data transformation             | `insee-to-org.mapper.ts`        | Unit tests, colocated                  |
| `.workflow.ts`   | Impure      | Orchestration (Read→Decide→Act) | `join-organization.workflow.ts` | Integration tests, real DB, ~800ms     |
| `.router.ts`     | Impure      | HTTP routes (Hono)              | `join.router.ts`                | Route tests, HTTP + DB                 |
| `index.ts`       | Impure      | Router entry point              | `index.ts`                      | -                                      |
| `.query.ts`      | Impure      | SQL query builder               | `get-org-with-members.query.ts` | Integration tests, real DB             |

\*Mappers are pure but colocated with their feature for locality.

### Examples

**Pure business logic** (`.rules.ts`):

```typescript
// sources/web/src/routes/organizations/join/eligibility.rules.ts
export function can_join_organization(user: User, org: Organization): boolean {
  if (org.is_closed) return false;
  if (user.email_domain !== org.domain) return false;
  return true;
}

// Test colocated: eligibility.rules.test.ts
test("cannot join closed organization", () => {
  expect(can_join_organization(user, { is_closed: true })).toBe(false);
});
```

**Pure validation** (`.validation.ts`):

```typescript
// sources/web/src/routes/organizations/join/join-input.validation.ts
import { z } from "zod";

export const join_input_schema = z.object({
  organization_id: z.number().positive(),
  as_external: z.boolean().default(false),
});
```

**Pure mapper** (`.mapper.ts`):

```typescript
// sources/web/src/routes/organizations/join/insee-to-org.mapper.ts
export function map_insee_to_organization(
  insee_data: INSEEResponse,
): Organization {
  return {
    siret: insee_data.etablissement.siret,
    name: insee_data.etablissement.uniteLegale.denominationUniteLegale,
    // ... pure transformation
  };
}
```

**Impure workflow** (`.workflow.ts`):

```typescript
// sources/web/src/routes/organizations/join/join-organization.workflow.ts
export async function join_organization(
  pg: Database,
  { user_id, organization_id, as_external }: JoinParams,
) {
  // 1. Fetch data (impure)
  const user = await pg.query.users.findFirst({ where: eq(users.id, user_id) });
  const org = await pg.query.organizations.findFirst({
    where: eq(organizations.id, organization_id),
  });

  // 2. Business decision (pure - call .rules.ts)
  if (!can_join_organization(user, org)) {
    throw new ValidationError("Cannot join organization");
  }

  // 3. Save (impure)
  await pg
    .insert(members)
    .values({ user_id, organization_id, is_external: as_external });
}

// Test: join-organization.workflow.test.ts (integration test with real DB)
```

**HTTP routes** (`.router.ts`):

```typescript
// sources/web/src/routes/organizations/join/join.router.ts
import { Hono } from "hono";
import { join_organization } from "./join-organization.workflow";

export const join_router = new Hono().post("/", async (c) => {
  const { user_id, organization_id } = await c.req.json();
  await join_organization(c.var.identite_pg, { user_id, organization_id });
  return c.json({ success: true });
});
```

**Router entry point** (`index.ts`):

```typescript
// sources/web/src/routes/organizations/join/index.ts
import { join_router } from "./join.router";
export default join_router;

// Parent router imports this:
// import join_router from "./join";
// app.route("/join", join_router);
```

### When to Use Each Suffix

- Use `.rules.ts` when: Writing business logic that returns boolean/decision with no I/O
- Use `.validation.ts` when: Validating input shape with Zod schemas
- Use `.mapper.ts` when: Transforming external API data to domain types
- Use `.workflow.ts` when: Orchestrating multiple steps (fetch → decide → save)
- Use `.router.ts` when: Defining HTTP endpoints (GET, POST, PATCH, DELETE)
- Use `.query.ts` when: Building complex SQL queries with Drizzle
- Use `index.ts` when: Exporting a Hono router as the feature entry point

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

### When to Extract to Domain Packages

Extract complex business logic to domain packages (`@~/organizations`, `@~/moderations`) when:

- Logic is genuinely reusable across 3+ features
- Pure business rules need to be tested in isolation
- Domain concepts are complex enough to deserve their own package

```typescript
// Domain package: sources/organizations/src/rules/eligibility.rules.ts
export function can_join_organization(...) { ... }

// Feature uses domain logic:
import { can_join_organization } from "@~/organizations/rules/eligibility.rules";
```

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

1. **Is it pure business logic?**
   - Simple: Feature folder with `.rules.ts` suffix
   - Complex/reusable: Extract to domain package `@~/organizations/rules/`

2. **Is it data transformation?**
   - Colocate mapper with feature: `insee-to-org.mapper.ts`

3. **Is it orchestration?**
   - Feature folder with `.workflow.ts` suffix

4. **Is it HTTP routing?**
   - Feature folder with `.router.ts` + `index.ts` entry point

5. **Is it UI component?**
   - Shared: `#src/ui/button` (via barrel)
   - Feature-specific: `/feature/ComponentName.tsx`

6. **Is it database query?**
   - Colocate with feature: `get-org-details.query.ts`

---

## Migrating to Feature-First Structure

We're gradually migrating to feature-first organization using the **strangler fig pattern** (not big-bang reorg).

### Migration Strategy

- **Opportunistic**: Migrate features when you touch them, not all at once
- **Timeline**: 6-12 months for natural evolution
- **No breaking changes**: Old code keeps working during migration
- **Start small**: Begin with simple features (health checks, simple CRUD)

### Step-by-Step Migration Example

Let's migrate `/moderations/:id/processed` feature:

**Before** (Phase 2A structure):

```
/:id/
├── processed.ts           # Handler + logic mixed
├── processed.test.ts      # Test
└── mark_as_processed.ts   # Thin wrapper
```

**After** (Phase 4 feature-first):

```
/:id/processed/
├── index.ts                    # Router entry (exports Hono router)
├── processed.router.ts         # HTTP routes only
├── mark-as-processed.workflow.ts  # Orchestration extracted
└── workflow.test.ts            # Integration test (renamed, moved)
```

**Migration steps**:

1. **Create feature folder**: `mkdir /:id/processed/`
2. **Extract HTTP layer**: Move route definition → `processed.router.ts`
3. **Extract orchestration**: Move business logic → `mark-as-processed.workflow.ts`
4. **Create entry point**: Add `index.ts` that exports the router
5. **Move tests**: Rename and move → `workflow.test.ts`
6. **Update imports**: Fix references in parent router
7. **Delete old files**: Remove `processed.ts`, `mark_as_processed.ts`
8. **Run tests**: Verify all tests pass

**Checklist** (copy when migrating):

```
- [ ] Create feature folder
- [ ] Apply file suffixes (.router.ts, .workflow.ts, etc.)
- [ ] Extract pure logic to .rules.ts (if any)
- [ ] Colocate tests (next to source files)
- [ ] Update imports in parent router
- [ ] Delete old files
- [ ] Run: npm run test
- [ ] Git commit
```

### Tips for Migration

- **Keep it simple**: Don't over-engineer. If a feature is 2 files, that's fine.
- **File suffixes are optional initially**: Focus on folder structure first
- **Tests can migrate gradually**: Colocate new tests, leave old ones temporarily
- **Ask for help**: Open an issue or ask in Tchap if unsure about structure

---

## Questions or Help

If you need assistance, please open an issue or ask in our [community channel](https://tchap.gouv.fr/#/room/!kBghcRpyMNThkFQjdW:agent.dinum.tchap.gouv.fr?via=agent.dinum.tchap.gouv.fr&via=agent.finances.tchap.gouv.fr&via=agent.interieur.tchap.gouv.fr). We appreciate your contributions!
