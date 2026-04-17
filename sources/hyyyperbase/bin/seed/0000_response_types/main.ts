//

import { schema } from "#src";
import { SQL } from "bun";
import consola from "consola";
import { drizzle } from "drizzle-orm/bun-sql";
import { load_templates } from "./lib";

//

const sql = new SQL(
  process.env["HYYYPERBASE_DATABASE_URL"] ??
    "postgresql://postgres:postgres@localhost:5555/postgres",
);

using connection = await sql.reserve();
const db = drizzle(connection, { schema });

//

try {
  const response_files = await load_templates();
  console.log(response_files);
  const result = await db
    .insert(schema.response_templates)
    .values([])
    .onConflictDoNothing()
    .returning();

  const total = await db.select().from(schema.response_templates);
  console.assert(
    result.length === response_files.length,
    `Expected ${response_files.length} templates, got ${result.length}`,
  );

  consola.success(`✓ Upserted ${result.length} response templates`);
  consola.log(`✓ Total in database: ${total.length}`);
} catch (error) {
  consola.error("✘ Seed failed:", error);
  throw error;
}

//
