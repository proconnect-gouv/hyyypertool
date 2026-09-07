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

Run specific e2e test: `bun run e2e:run test --spec="features/organizations/dinum.feature"`

## Deployment 🚀

### Automated Release Process (Recommended)

Hyyypertool now uses a custom changeset plugin for automated versioning and changelog generation, eliminating the need for `@changesets/cli`.

#### 1. Create Release Notes

```bash
echo "✨ Ajout de la recherche avancée" > .release-it-changeset/$(date +%s)-feature.md
echo "🐛 Correction d'un problème d'affichage" > .release-it-changeset/$(date +%s)-bug.md
echo "💄 Simplification du parcours de connexion" > .release-it-changeset/$(date +%s)-ui.md
```

See [plugin documentation](packages/release-it-changeset-plugin/README.md) for more examples.

> [!NOTE]
> Unlike `@changesets/cli`, this plugin uses plain markdown files without frontmatter.
> Versioning is handled by `@csmith/release-it-calver-plugin` (CalVer format: `yyyy.mm.minor`).

#### 2. Automated Release

The release process is automated via GitHub Actions:

1. Go to the [Hyyypertool Actions](https://github.com/proconnect-gouv/hyyypertool/actions)
2. Click on 'Release it!'
3. Run the workflow from the main branch

The release-it plugin will:

- ✅ Detect unreleased changesets in `.release-it-changeset/`
- ✅ Generate changelog entries under "Changements" section
- ✅ Format changelog with Prettier
- ✅ Create git tags and releases
- ✅ Clean up consumed changeset files

#### 3. Deploy to Environments

Once the release is complete:

1. Go to [Hyyypertool Sandbox](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool-sandbox) Scalingo
2. Manually deploy the release branch (the branch name looks like: `release/year.month.number`)
3. Repeat the same action in [Hyyypertool production](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool) Scalingo

#### 4. Post-Deployment

Finally, you need to make a summary note in the ProConnect general channel and pin the message.

### Manual Release (Legacy)

If you need to bypass the automated process:

```bash
# Dry run to see what will happen
npx release-it --dry-run

# Perform manual release
npx release-it
```

### Release Configuration

The release process uses the `@~/release-it-changeset-plugin` which integrates with changesets. See the [plugin documentation](packages/release-it-changeset-plugin/README.md) for detailed configuration options.
