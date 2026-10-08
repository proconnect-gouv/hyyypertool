# Hyyypertool

<p align="center">
    <img src=".github/Charco - Security.png">
</p>

> Backoffice moderation tool for MonComptePro

## Install 📦

First, you need bun to be installed: https://bun.sh/, or run `nix develop` to get a shell with the correct Node.js, Bun and Cypress versions (see `flake.nix`).

Then install dependencies with: `bun install`.

## Development 🚧

### Development server

Run docker containers: `docker compose up --wait`

Then run the app: `bun run scripts/dev.ts`.

Then go to http://localhost:3000/.

### Development database

Reset the local database with : `bun run scripts/seed.ts`.

> [!WARNING]
> This will delete all the data in the database.
> There is a lock in the [scripts/seed.ts](scripts/seed.ts) file to prevent production database seeding.

### E2E Testing

Two suites, split by what they need:

- **Feature tests** (`sources/web/src/routes/<area>/__features__/*.feature.test.ts`) — the default for new scenarios, written with [buncept](packages/buncept), a CodeceptJS-style `I` actor (`I.click(…)`, `I.see(…)`). They run in-process against a seeded database with auth and external APIs faked, so they need no running server. The pages load their island scripts from `bin/public/built`, so run `bun run build` first, then from the repo root: `bun run test:features`, or one file with `bun test sources/web/src/routes/moderations/__features__/moderation_list.feature.test.ts`.
- **Cypress** (`e2e/features/`) — only for what needs the full stack: a real login through the dev identity provider, per-role access (`auth/`, `team/`, `security/`). Run one with `bun run e2e:run test --spec="features/auth/connexion.feature"`.

## Deployment 🚀

### Release

Releases run through [`proconnect-gouv/release-action`](https://github.com/proconnect-gouv/release-action) on every push to `main` (`.github/workflows/release.yml`). Versions follow CalVer (`yyyy.m.minor`, one cycle per month).

#### 1. Describe user-facing changes

Add a plain Markdown file, without frontmatter, to `.release-it-changeset/` in your pull request:

```bash
echo "Ajout de la recherche avancée" > .release-it-changeset/$(date +%s)-feature.md
```

See the [action documentation](https://github.com/proconnect-gouv/release-action#changesets) for details.

#### 2. Merge the release pull request

After each merge to `main`, the action opens or updates the pull request `🔖 release <version>` from branch `release-it/next`. It bumps `package.json`, prepends the version section to `CHANGELOG.md` (changesets under "Changements", then commits grouped by gitmoji) and deletes the consumed changeset files.

Review and merge it when you want to ship. The action then creates the tag, the GitHub release and the `release/<version>` branch.

#### 3. Deploy to Environments

Once the release is complete:

1. Go to [Hyyypertool Sandbox](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool-sandbox) Scalingo
2. Manually deploy the release branch (the branch name looks like: `release/year.month.number`)
3. Repeat the same action in [Hyyypertool production](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool) Scalingo

#### 4. Post-Deployment

Finally, you need to make a summary note in the ProConnect general channel and pin the message.
