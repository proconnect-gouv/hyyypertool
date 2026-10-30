import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq, ilike } from "drizzle-orm";

export async function get_emails_by_organization_id(
  pg: IdentiteProconnectPgDatabase,
  {
    family_name,
    organization_id,
  }: {
    family_name: string;
    organization_id: number;
  },
) {
  const same_family_name_members = await pg
    .select({ email: schema.users.email })
    .from(schema.users)
    .innerJoin(
      schema.users_organizations,
      eq(schema.users.id, schema.users_organizations.user_id),
    )
    .where(
      and(
        eq(schema.users_organizations.organization_id, organization_id),
        ilike(schema.users.family_name, family_name),
      ),
    );

  if (same_family_name_members.length > 0) return same_family_name_members;

  return pg
    .select({ email: schema.users.email })
    .from(schema.users)
    .innerJoin(
      schema.users_organizations,
      eq(schema.users.id, schema.users_organizations.user_id),
    )
    .where(eq(schema.users_organizations.organization_id, organization_id));
}

export type GetEmailsByOrganizationIdHandler =
  typeof get_emails_by_organization_id;
export type GetEmailsByOrganizationIdDto = Awaited<
  ReturnType<GetEmailsByOrganizationIdHandler>
>;
