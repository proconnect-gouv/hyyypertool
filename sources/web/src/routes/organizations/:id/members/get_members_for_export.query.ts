//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, desc, eq, inArray } from "drizzle-orm";

//

export function get_members_for_export(
  pg: IdentiteProconnectPgDatabase,
  {
    organization_id,
    user_ids,
  }: {
    organization_id: number;
    user_ids: number[];
  },
) {
  return pg
    .select({
      created_at: schema.users_organizations.created_at,
      email: schema.users.email,
      family_name: schema.users.family_name,
      given_name: schema.users.given_name,
      is_external: schema.users_organizations.is_external,
      job: schema.users.job,
      updated_at: schema.users_organizations.updated_at,
      verification_type: schema.users_organizations.verification_type,
    })
    .from(schema.users)
    .innerJoin(
      schema.users_organizations,
      eq(schema.users.id, schema.users_organizations.user_id),
    )
    .where(
      and(
        eq(schema.users_organizations.organization_id, organization_id),
        user_ids.length > 0 ? inArray(schema.users.id, user_ids) : undefined,
      ),
    )
    .orderBy(desc(schema.users.created_at), desc(schema.users.id));
}
