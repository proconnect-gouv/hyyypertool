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
}

export async function reset() {
  await client.exec(`TRUNCATE TABLE users RESTART IDENTITY CASCADE;`);
}

//

beforeAll(setup);
