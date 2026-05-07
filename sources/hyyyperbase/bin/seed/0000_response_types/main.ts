//

import { schema } from "#src";
import { SQL } from "bun";
import consola from "consola";
import { drizzle } from "drizzle-orm/bun-sql";
import { load_templates } from "./lib";

//

const sql = new SQL(
  process.env["HYYYPERBASE_DATABASE_URL"] ??
    "postgresql://postgres:postgres@localhost:5555/hyyyperbase",
);

using connection = await sql.reserve();
const db = drizzle(connection, { schema });

//

try {
  const response_templates = await load_templates();
  console.log(response_templates);
  const result = await db
    .insert(schema.response_templates)
    .values(response_templates)
    .onConflictDoNothing()
    .returning();

  const total = await db.select().from(schema.response_templates);
  console.assert(
    total.length >= response_templates.length,
    `Expected at least ${response_templates.length} templates, got ${total.length}`,
  );

  consola.success(
    `✓ Inserted ${result.length} new, ${total.length} total response templates`,
  );
} catch (error) {
  consola.error("✘ Seed failed:", error);
  throw error;
}

//
