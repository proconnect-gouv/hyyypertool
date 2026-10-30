import type { Pagination } from "#src/schema";
import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { desc, count as drizzle_count, ilike, or } from "drizzle-orm";

export async function get_users_list(
  pg: IdentiteProconnectPgDatabase,
  {
    pagination = { page: 0, page_size: 10 },
    search,
  }: {
    pagination?: Pagination;
    search?: string;
  },
) {
  const { page, page_size: take } = pagination;

  const where = or(
    ilike(schema.users.family_name, `%${search ?? ""}%`),
    ilike(schema.users.given_name, `%${search ?? ""}%`),
    ilike(schema.users.email, `%${search ?? ""}%`),
  );

  return pg.transaction(async function users_with_count(tx) {
    const users = await tx
      .select({
        id: schema.users.id,
        email: schema.users.email,
        created_at: schema.users.created_at,
        family_name: schema.users.family_name,
        given_name: schema.users.given_name,
        email_verified_at: schema.users.email_verified_at,
        last_sign_in_at: schema.users.last_sign_in_at,
      })
      .from(schema.users)
      .where(where)
      .orderBy(desc(schema.users.created_at))
      .limit(take)
      .offset(page * take);

    const [{ value: count } = { value: NaN }] = await tx
      .select({ value: drizzle_count() })
      .from(schema.users)
      .where(where);
    return { users, count };
  });
}

export type GetUsersListHandler = typeof get_users_list;
export type GetUsersListDto = Awaited<ReturnType<GetUsersListHandler>>;
