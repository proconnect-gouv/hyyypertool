//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { ilike, or } from "drizzle-orm";

//

export function FindUsersByName(pg: IdentiteProconnect_PgDatabase) {
  return async function find_users_by_name(name: string) {
    return pg.query.users.findMany({
      where: or(
        ilike(schema.users.given_name, name),
        ilike(schema.users.family_name, name),
      ),
    });
  };
}

export type FindUsersByNameHandler = ReturnType<typeof FindUsersByName>;
export type FindUsersByNameDto = Awaited<ReturnType<FindUsersByNameHandler>>;
