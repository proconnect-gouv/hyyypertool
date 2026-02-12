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

await client.end();
