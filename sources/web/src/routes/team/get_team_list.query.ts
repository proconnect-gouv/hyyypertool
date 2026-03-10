//

import type { Pagination } from "#src/schema";
import { type HyyyperPgDatabase, schema } from "@~/hyyyperbase";
import { desc, count as drizzle_count, ilike, or } from "drizzle-orm";

//

export async function get_team_list(
  pg: HyyyperPgDatabase,
  {
    pagination = { page: 0, page_size: 10 },
    search,
  }: {
    search?: string;
    pagination?: Pagination;
  },
) {
  const { page, page_size: take } = pagination;

  const where = or(
    ilike(schema.users.email, `%${search ?? ""}%`),
    ilike(schema.users.role, `%${search ?? ""}%`),
  );

  return pg.transaction(async function team_with_count(tx) {
    const members = await tx
      .select({
        id: schema.users.id,
        email: schema.users.email,
        role: schema.users.role,
        created_at: schema.users.created_at,
        updated_at: schema.users.updated_at,
        disabled_at: schema.users.disabled_at,
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
    return { members, count };
  });
}
