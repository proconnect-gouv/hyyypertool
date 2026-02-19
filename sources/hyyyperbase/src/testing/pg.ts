//

import type { HyyyperPgDatabase } from "#src";
import { migrate } from "#src/migrator";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../schema";

//

export const url = process.env["HYYYPERBASE_DATABASE_URL"];

const client = new Client({ connectionString: url });

export const hyyyper_pg: HyyyperPgDatabase = drizzle(client, { schema });

const ready = url
  ? client.connect().then(() => migrate(drizzle(client, { schema })))
  : undefined;

export async function setup() {
  await ready;
}

export async function reset() {
  await ready;
  await hyyyper_pg.execute(sql`TRUNCATE TABLE users RESTART IDENTITY CASCADE`);
}
