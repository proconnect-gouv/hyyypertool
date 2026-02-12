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

const policy_query = sql`
  SELECT
    p.polname as name,
    CASE WHEN p.polpermissive THEN 'permissive' ELSE 'restrictive' END as kind,
    CASE p.polcmd
      WHEN 'r' THEN 'select'
      WHEN 'a' THEN 'insert'
      WHEN 'w' THEN 'update'
      WHEN 'd' THEN 'delete'
      WHEN '*' THEN 'all'
    END as command,
    c.relrowsecurity as rls,
    c.relforcerowsecurity as force_rls
  FROM pg_policy p
  JOIN pg_class c ON c.oid = p.polrelid
  WHERE c.relname = 'users'
  ORDER BY p.polname
`;

const expected_policies = [
  {
    command: "all",
    force_rls: true,
    kind: "permissive",
    name: "admin_all",
    rls: true,
  },
  {
    command: "all",
    force_rls: true,
    kind: "permissive",
    name: "god_all",
    rls: true,
  },
  {
    command: "select",
    force_rls: true,
    kind: "permissive",
    name: "moderator_select",
    rls: true,
  },
  {
    command: "delete",
    force_rls: true,
    kind: "restrictive",
    name: "no_self_delete",
    rls: true,
  },
  {
    command: "select",
    force_rls: true,
    kind: "permissive",
    name: "self_select",
    rls: true,
  },
  {
    command: "update",
    force_rls: true,
    kind: "permissive",
    name: "self_update",
    rls: true,
  },
];

//

describe("pglite", () => {
  test("migration creates correct RLS policies", async () => {
    const db = drizzle_pglite(new PGlite(undefined, { debug: 0 }));
    await pglite_migrate(db, { migrationsFolder });

    const { rows } = await db.execute(policy_query);

    expect(rows).toEqual(expected_policies);
  });
});

describe.skipIf(!HYYYPERBASE_DATABASE_URL)("node-postgres", () => {
  test("migration creates correct RLS policies", async () => {
    const pool = new Pool({ connectionString: HYYYPERBASE_DATABASE_URL });
    const db = drizzle_node(pool);

    try {
      await db.execute(sql`DROP TABLE IF EXISTS users CASCADE`);
      await db
        .execute(sql`DELETE FROM drizzle.__drizzle_migrations`)
        .catch(() => {});

      await migrate(db);

      const { rows } = await db.execute(policy_query);

      expect(rows).toEqual(expected_policies);
    } finally {
      await pool.end();
    }
  });
});
