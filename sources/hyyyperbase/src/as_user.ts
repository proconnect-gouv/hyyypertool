//

import { sql, type ExtractTablesWithRelations } from "drizzle-orm";
import type {
  PgDatabase,
  PgQueryResultHKT,
  PgTransaction,
} from "drizzle-orm/pg-core";
import type * as schema from "./schema";

//

type Schema = ExtractTablesWithRelations<typeof schema>;
type Db = PgDatabase<PgQueryResultHKT, typeof schema, Schema>;
type Tx = PgTransaction<PgQueryResultHKT, typeof schema, Schema>;

export async function as_user<T>(
  db: Db,
  user: { id: number; role: string },
  fn: (tx: Tx) => T,
): Promise<Awaited<T>> {
  return db.transaction(async (tx) => {
    await tx.execute(
      sql`SELECT set_config('app.user_id', ${String(user.id)}, true)`,
    );
    await tx.execute(sql`SELECT set_config('app.role', ${user.role}, true)`);

    return fn(tx);
  }) as Promise<Awaited<T>>;
}

export async function as_god<T>(
  db: Db,
  fn: (tx: Tx) => T,
): Promise<Awaited<T>> {
  return db.transaction(async (tx) => {
    await tx.execute(sql`SELECT set_config('app.role', 'god', true)`);

    return fn(tx);
  }) as Promise<Awaited<T>>;
}
