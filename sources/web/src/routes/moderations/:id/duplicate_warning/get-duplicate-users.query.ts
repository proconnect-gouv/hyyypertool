//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { and, asc, eq, ilike, not, or } from "drizzle-orm";

//

export async function get_duplicate_users(
  pg: IdentiteProconnect_PgDatabase,
  moderation_id: number,
) {
  const moderation = await pg.query.moderations.findFirst({
    columns: { organization_id: true },
    with: {
      user: { columns: { id: true, given_name: true, family_name: true } },
    },
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  const {
    organization_id,
    user: { family_name, id: user_id },
  } = moderation;

  return await pg
    .select({
      email: schema.users.email,
      family_name: schema.users.family_name,
      given_name: schema.users.given_name,
      user_id: schema.users_organizations.user_id,
    })
    .from(schema.users_organizations)
    .leftJoin(
      schema.users,
      eq(schema.users_organizations.user_id, schema.users.id),
    )
    .where(
      and(
        or(ilike(schema.users.family_name, family_name ?? "")),
        not(eq(schema.users.id, user_id)),
        eq(schema.users_organizations.organization_id, organization_id),
      ),
    )
    .orderBy(asc(schema.users.created_at));
}
