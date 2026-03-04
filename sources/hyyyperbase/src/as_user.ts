//

import { sql } from "drizzle-orm";
import type {
  PgDatabase,
  PgQueryResultHKT,
  PgTransaction,
} from "drizzle-orm/pg-core";
import type * as schema from "./schema";

//

type Db = PgDatabase<PgQueryResultHKT, typeof schema>;
type Tx = PgTransaction<PgQueryResultHKT, typeof schema, any>;

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
