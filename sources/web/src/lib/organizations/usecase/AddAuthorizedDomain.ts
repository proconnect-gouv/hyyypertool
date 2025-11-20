//

import { BadRequestError } from "#src/errors";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES } from "@~/identite-proconnect/types";

//

export function AddAuthorizedDomain({ pg }: IdentiteProconnectDatabaseCradle) {
  return async function add_authorized_domain(
    organization_id: number,
    domain: string,
  ) {
    if (domain.includes("@"))
      throw new BadRequestError("Domain should not contain the '@' character");
    return pg.insert(schema.email_domains).values({
      domain,
      organization_id,
      verification_type: EMAIL_DOMAIN_APPROVED_VERIFICATION_TYPES.enum.verified,
    });
  };
}

export type AddAuthorizedDomainHandler = ReturnType<typeof AddAuthorizedDomain>;
