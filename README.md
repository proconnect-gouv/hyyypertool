# Hyyypertool

<p align="center">
    <img src=".github/Charco - Security.png">
</p>

> Backoffice moderation tool for MonComptePro

## Install 📦

First, you need bun to be installed: https://bun.sh/

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

When making changes that should trigger a release:

```bash
# Create the release notes directory
mkdir -p .release-it-changeset

# Create a release note file
touch .release-it-changeset/my-changes.md
```

Edit the file with your changes:

```markdown
---
"package-name": patch # or minor/major
"@scope/package-name": minor
---

Description of the changes made.

**Details:**

- Specific change details
- Additional context
```

#### 2. Automated Release

The release process is now automated via GitHub Actions:

1. Go to the [Hyyypertool](https://github.com/proconnect-gouv/hyyypertool/actions) repository
2. Go to the 'Actions' tab, click on 'Release it!'
3. Run the workflow from the master branch

The release-it plugin will:

- ✅ Detect unreleased changesets
- ✅ Determine appropriate version bump (patch/minor/major)
- ✅ Update package versions
- ✅ Generate changelog entries
- ✅ Create git tags and releases
- ✅ Clean up consumed changesets

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

You need to create a release, for that:

Go to the [Hyyypertool](https://github.com/proconnect-gouv/hyyypertool/actions) repository

Go to the ‘Actions’ tab, click on 'Release it!'

Run the workflow from the master branch

Once the release is complete, go to [Hyyypertool Sandbox](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool-sandbox) Scalingo

Manually deploy the release branch (the branch name looks like: release/year.month.number)

Repeat the same action in the [Hyypertool production](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool) Scalingo

Finally, you need to make a summary note in the ProConnect general channel and pin the message.
