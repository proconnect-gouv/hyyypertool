//

import { schema } from "#src";
import { migrate } from "#src/migrator";
import consola, { LogLevels } from "consola";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";

//

const connectionString =
  process.env["HYYYPERBASE_DATABASE_URL"] ??
  "postgresql://postgres:postgres@localhost:5555/postgres";
const client = new Client({ connectionString });
await client.connect();

consola.info("📦 Migrating Hyyyperbase database", connectionString);
const db = drizzle(client, {
  logger: consola.level >= LogLevels.verbose,
  schema,
});

await migrate(db);

const admin_email = process.env["HYYYPERBASE_ADMIN"];
if (admin_email) {
  await db
    .insert(schema.users)
    .values({ email: admin_email, role: "admin" })
    .onConflictDoNothing({ target: schema.users.email });
  consola.info(`👑 Ensured admin user: ${admin_email}`);
}

await client.end();
