//

import { schema } from "#src";
import { insert_central_administration_response } from "#src/testing/response_templates";
import {
  insert_admin,
  insert_jeanbon,
  insert_moderateur,
} from "#src/testing/users";
import consola, { LogLevels } from "consola";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";

//

if (process.env["NODE_ENV"] === "production") {
  consola.fatal("🚨 This script should not be run in production");
  process.exit(1);
}

const client = new pg.Client({
  connectionString:
    process.env["HYYYPERBASE_DATABASE_URL"] ??
    "postgresql://hyyypertool:hyyypertool@localhost:5555/hyyyperbase",
});
await client.connect();

const db = drizzle(client, {
  logger: consola.level >= LogLevels.verbose,
  schema,
});

//

{
  const deleted = await db.delete(schema.users).returning();
  consola.verbose(`🚮 DELETE ${deleted.length} users`);
}

{
  const deleted = await db.delete(schema.response_templates).returning();
  consola.verbose(`🚮 DELETE ${deleted.length} response_templates`);
}

//

for (const insert of [insert_admin, insert_jeanbon, insert_moderateur]) {
  const user = await insert(db);
  consola.verbose(`🌱 INSERT user ${user.email} (${user.role})`);
}

for (const insert of [insert_central_administration_response]) {
  const user = await insert(db);
  consola.verbose(`🌱 INSERT response_templates ${user.label})`);
}

await client.end();
