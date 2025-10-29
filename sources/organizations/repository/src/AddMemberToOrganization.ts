//

import { NotFoundError } from "@~/core/error";
import { z_email_domain } from "@~/core/schema";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
  type Writable_Users_Organizations,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";
import { match } from "ts-pattern";

//

export function AddMemberToOrganization(pg: IdentiteProconnect_PgDatabase) {
  return async function add_member_to_organization(
    values: Writable_Users_Organizations & {
      organization_id: number;
      user_id: number;
    },
  ) {
    const { organization, user } = await pg.transaction(async (tx) => {
      const user = await tx.query.users.findFirst({
        columns: { email: true },
        where: eq(schema.users.id, values.user_id),
      });

      if (!user) {
        throw new NotFoundError(`User ${values.user_id} not found.`);
      }

      const organization = await tx.query.organizations.findFirst({
        columns: {
          id: true,
        },
        where: eq(schema.organizations.id, values.organization_id),
      });

      if (!organization) {
        throw new NotFoundError(
          `Organization ${values.organization_id} not found.`,
        );
      }

      return { organization, user };
    });

    const domain = z_email_domain.parse(user.email, { path: ["user.email"] });
    domain;
    const verification_type = match(organization)
      // .when(
      //   ({ external_authorized_email_domains }) =>
      //     external_authorized_email_domains.includes(domain),
      //   () => "verified_email_domain",
      // )
      // .when(
      //   ({ trackdechets_email_domains }) =>
      //     trackdechets_email_domains.includes(domain),
      //   () => "trackdechets_email_domain",
      // )
      // .when(
      //   ({ verified_email_domains }) => verified_email_domains.includes(domain),
      //   () => "verified_email_domain",
      // )
      .otherwise(() => null);

    const user_organization = await pg
      .insert(schema.users_organizations)
      .values({
        ...values,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        verification_type,
      })
      .returning();

    return user_organization.at(0)!;
  };
}

export type AddMemberToOrganizationHandler = ReturnType<
  typeof AddMemberToOrganization
>;
export type AddMemberToOrganizationDto = Awaited<
  ReturnType<AddMemberToOrganizationHandler>
>;
