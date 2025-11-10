//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import { and, eq, like } from "drizzle-orm";

//

export function CountGmailMembers(pg: IdentiteProconnect_PgDatabase) {
  return function count_gmail_members({
    domain,
    siret,
  }: {
    domain: string;
    siret: string;
  }) {
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
  };
}

export type CountGmailMembersHandler = ReturnType<typeof CountGmailMembers>;
export type CountGmailMembersDto = Awaited<
  ReturnType<CountGmailMembersHandler>
>;
