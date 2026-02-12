//

import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { migrate as node_postgres_migrator } from "drizzle-orm/node-postgres/migrator";
import { resolve } from "path";

//

const migrationsFolder = resolve(import.meta.dir, "../migrations");

export async function migrate(db: NodePgDatabase<Record<string, unknown>>) {
  console.log(`[hyyyperbase] Running migrations from ${migrationsFolder}...`);
  await node_postgres_migrator(db, { migrationsFolder });
}
