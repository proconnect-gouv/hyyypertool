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

import { NotFoundError } from "@~/core/error";
import type { IdentiteProconnectDatabaseCradle } from "@~/identite-proconnect.database";
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

1. **Use Real Database**: Import `pg` from `@~/identite-proconnect.database/testing` instead of mocking
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

import { schema } from "@~/identite-proconnect.database";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
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

## Questions or Help

If you need assistance, please open an issue or ask in our [community channel](https://tchap.gouv.fr/#/room/!kBghcRpyMNThkFQjdW:agent.dinum.tchap.gouv.fr?via=agent.dinum.tchap.gouv.fr&via=agent.finances.tchap.gouv.fr&via=agent.interieur.tchap.gouv.fr). We appreciate your contributions!
