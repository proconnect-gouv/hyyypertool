//

import type { HyyyperPgDatabase } from "#src";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll } from "bun:test";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../schema";

//

const client = new PGlite(undefined, { debug: 0 });

const migrationsFolder = new URL("../../migrations", import.meta.url).pathname;

export const hyyyper_pglite: HyyyperPgDatabase = drizzle(client, { schema });

export async function setup() {
  await migrate(drizzle(client, { schema }), { migrationsFolder });

  // PGlite runs as superuser — superusers bypass RLS even with FORCE.
  // Create a non-privileged role and switch to it so RLS is enforced,
  // matching production behavior where FORCE RLS applies to the table owner.
  await client.exec(`
    CREATE ROLE app_user NOLOGIN;
    GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
    GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO app_user;
    SET ROLE app_user;
  `);
}

export async function reset() {
  await client.exec(`
    RESET ROLE;
    TRUNCATE TABLE users RESTART IDENTITY CASCADE;
    SET ROLE app_user;
  `);
}

//

beforeAll(setup);
