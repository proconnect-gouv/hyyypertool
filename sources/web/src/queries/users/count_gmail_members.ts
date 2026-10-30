import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq, like } from "drizzle-orm";

export function count_gmail_members(
  pg: IdentiteProconnectPgDatabase,
  { domain, siret }: { domain: string; siret: string },
) {
  return pg
    .select({
      email: schema.users.email,
      organization: {
        cached_libelle: schema.organizations.cached_libelle,
        siret: schema.organizations.siret,
      },
    })
    .from(schema.users)
    .innerJoin(
      schema.users_organizations,
      eq(schema.users.id, schema.users_organizations.user_id),
    )
    .innerJoin(
      schema.organizations,
      eq(schema.users_organizations.organization_id, schema.organizations.id),
    )
    .where(
      and(
        like(schema.organizations.siret, `${siret}%`),
        like(schema.users.email, `%${domain}`),
      ),
    );
}

export type CountGmailMembersHandler = typeof count_gmail_members;
export type CountGmailMembersDto = Awaited<
  ReturnType<CountGmailMembersHandler>
>;
