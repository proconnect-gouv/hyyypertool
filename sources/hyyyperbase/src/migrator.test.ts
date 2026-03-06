//

import { PGlite } from "@electric-sql/pglite";
import { describe, expect, test } from "bun:test";
import { sql } from "drizzle-orm";
import { drizzle as drizzle_node } from "drizzle-orm/node-postgres";
import { drizzle as drizzle_pglite } from "drizzle-orm/pglite";
import { migrate as pglite_migrate } from "drizzle-orm/pglite/migrator";
import { Pool } from "pg";
import { migrate } from "./migrator";

//

const HYYYPERBASE_DATABASE_URL = process.env["HYYYPERBASE_DATABASE_URL"];

const migrationsFolder = new URL("../migrations", import.meta.url).pathname;

const table_exists_query = sql`
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'users'
  ) as exists
`;

//

describe("pglite", () => {
  test("migration creates users table", async () => {
    const db = drizzle_pglite(new PGlite(undefined, { debug: 0 }));
    await pglite_migrate(db, { migrationsFolder });

    const { rows } = await db.execute(table_exists_query);

    expect(rows).toEqual([{ exists: true }]);
  });
});

describe.skipIf(!HYYYPERBASE_DATABASE_URL)("node-postgres", () => {
  test("migration creates users table", async () => {
    const pool = new Pool({ connectionString: HYYYPERBASE_DATABASE_URL });
    const db = drizzle_node(pool);

    try {
      await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
      await db.execute(sql`DROP SEQUENCE IF EXISTS users_id_seq CASCADE`);
      await db
        .execute(sql`DELETE FROM drizzle.__drizzle_migrations`)
        .catch(() => {});

      await migrate(db);

      const { rows } = await db.execute(table_exists_query);

      expect(rows).toEqual([{ exists: true }]);
    } finally {
      await pool.end();
    }
  });
});
