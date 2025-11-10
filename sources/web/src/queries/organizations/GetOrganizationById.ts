//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import { eq } from "drizzle-orm";

//
type OrganizationQueryConfigColumns = Partial<
  Record<keyof typeof schema.organizations._.columns, true>
>;

export function GetOrganizationById<
  TColumns extends OrganizationQueryConfigColumns,
>(pg: IdentiteProconnect_PgDatabase, { columns }: { columns: TColumns }) {
  return async function get_organization_by_id(organization_id: number) {
    const organization = await pg.query.organizations.findFirst({
      columns,
      where: eq(schema.organizations.id, organization_id),
    });

    if (!organization) throw new NotFoundError("Organization Not Found.");

    return organization;
  };
}

export type GetOrganizationByIdHandler<
  TColumns extends OrganizationQueryConfigColumns,
> = ReturnType<typeof GetOrganizationById<TColumns>>;
