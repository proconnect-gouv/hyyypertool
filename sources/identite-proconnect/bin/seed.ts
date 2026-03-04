//

import { schema } from "#src/database";
import { delete_database, insert_database } from "#src/database/seed";
import consola, { LogLevels } from "consola";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

//

const client = new pg.Client({
  connectionString:
    process.env["DATABASE_URL"] ??
    "postgresql://postgres:postgres@localhost:5432/postgres",
});
await client.connect();

const db = drizzle(client, {
  logger: consola.level >= LogLevels.verbose,
  schema,
});

await delete_database(db);
await insert_database(db);

await client.end();
