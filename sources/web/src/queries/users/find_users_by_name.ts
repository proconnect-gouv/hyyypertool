import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { ilike, or } from "drizzle-orm";

export async function find_users_by_name(
  pg: IdentiteProconnectPgDatabase,
  name: string,
) {
  return pg.query.users.findMany({
    where: or(
      ilike(schema.users.given_name, name),
      ilike(schema.users.family_name, name),
    ),
  });
}

export type FindUsersByNameHandler = typeof find_users_by_name;
export type FindUsersByNameDto = Awaited<ReturnType<FindUsersByNameHandler>>;
