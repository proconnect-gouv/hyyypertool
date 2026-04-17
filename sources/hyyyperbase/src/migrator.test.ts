//

import { PGlite } from "@electric-sql/pglite";
import { describe, expect, test } from "bun:test";
import { sql } from "drizzle-orm";
import { drizzle as drizzle_node } from "drizzle-orm/node-postgres";
import { drizzle as drizzle_pglite } from "drizzle-orm/pglite";
import { migrate as pglite_migrate } from "drizzle-orm/pglite/migrator";
import { Client } from "pg";
import { migrate } from "./migrator";
import * as schema from "./schema";

//

const HYYYPERBASE_DATABASE_URL = process.env["HYYYPERBASE_DATABASE_URL"];

const migrationsFolder = new URL("../migrations", import.meta.url).pathname;

const table_exists_query = sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public'
  ORDER BY table_name ASC
`;

//

describe("pglite", () => {
  test("migration creates users table", async () => {
    const db = drizzle_pglite(new PGlite(undefined, { debug: 0 }));
    await pglite_migrate(db, { migrationsFolder });

    const { rows } = await db.execute(table_exists_query);

    expect(rows).toMatchInlineSnapshot(`
      [
        {
          "table_name": "response_templates",
        },
        {
          "table_name": "users",
        },
      ]
    `);
  });
});

describe.skipIf(!HYYYPERBASE_DATABASE_URL)("node-postgres", () => {
  test("migration creates users table", async () => {
    await using pg = {
      client: new Client(HYYYPERBASE_DATABASE_URL),
      async [Symbol.asyncDispose]() {
        await this.client.end();
      },
    };
    await pg.client.connect();
    const db = drizzle_node(pg.client, { schema });
    // Drop all tables for clean migration test
    await db.transaction(async (tx) => {
      await tx.execute(sql`DROP TABLE IF EXISTS response_templates CASCADE;`);
      await tx.execute(sql`DROP TABLE IF EXISTS users CASCADE;`);
      await tx.execute(sql`DROP TABLE IF EXISTS drizzle.__drizzle_migrations;`);
    });

    await migrate(db);

    const { rows } = await db.execute(table_exists_query);

    expect(rows).toMatchInlineSnapshot(`
      [
        {
          "table_name": "response_templates",
        },
        {
          "table_name": "users",
        },
      ]
    `);
  });
});
