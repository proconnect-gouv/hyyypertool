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

You need to create a release, for that:

Go to the [Hyyypertool](https://github.com/proconnect-gouv/hyyypertool/actions) repository

Go to the ‘Actions’ tab, click on 'Release it!'

Run the workflow from the master branch

Once the release is complete, go to [Hyyypertool Sandbox](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool-sandbox) Scalingo

Manually deploy the release branch (the branch name looks like: release/year.month.number)

Repeat the same action in the [Hyypertool production](https://dashboard.scalingo.com/apps/osc-secnum-fr1/hyyypertool) Scalingo

Finally, you need to make a summary note in the ProConnect general channel and pin the message.
