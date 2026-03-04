//

import { schema } from "#src";
import {
  insert_admin,
  insert_god,
  insert_jeanbon,
  insert_moderateur,
} from "#src/testing/users";
import consola, { LogLevels } from "consola";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

//

const client = new pg.Client({
  connectionString:
    process.env["HYYYPERBASE_DATABASE_URL"] ??
    "postgresql://postgres:postgres@localhost:5555/postgres",
});
await client.connect();

const db = drizzle(client, {
  logger: consola.level >= LogLevels.verbose,
  schema,
});

// Wipe
await db.execute(sql`SELECT set_config('app.role', 'god', true)`);
const deleted = await db.delete(schema.users).returning();
consola.verbose(`🚮 DELETE ${deleted.length} users`);

// Seed
for (const insert of [
  insert_admin,
  insert_god,
  insert_jeanbon,
  insert_moderateur,
]) {
  const user = await insert(db);
  consola.verbose(`🌱 INSERT user ${user.email} (${user.role})`);
}

await client.end();
