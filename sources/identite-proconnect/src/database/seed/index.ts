//

import consola, { LogLevels } from "consola";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { schema } from "..";
import { delete_database } from "./delete";
import { insert_database } from "./insert";

//

export async function seed() {
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

  return null;
}
