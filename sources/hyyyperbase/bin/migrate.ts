//

import { schema } from "#src";
import { migrate } from "#src/migrator";
import { seed_admins } from "#src/seed_admins";
import consola, { LogLevels } from "consola";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

//

const HYYYPERBASE_DATABASE_URL =
  process.env["HYYYPERBASE_DATABASE_URL"] ??
  "postgresql://postgres:postgres@localhost:5555/postgres";
const ADMIN_EMAILS = process.env["ADMIN_EMAILS"] ?? "";

//

const client = new Client({ connectionString: HYYYPERBASE_DATABASE_URL });
await client.connect();

consola.info("📦 Migrating Hyyyperbase database", HYYYPERBASE_DATABASE_URL);
const db = drizzle(client, {
  logger: consola.level >= LogLevels.verbose,
  schema,
});

await migrate(db);

await seed_admins(
  db,
  ADMIN_EMAILS.split(",")
    .map((email) => email.trim())
    .filter(Boolean),
);

await client.end();
