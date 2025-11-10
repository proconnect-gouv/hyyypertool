//

import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export function RemoveDomainEmailById({
  pg,
}: IdentiteProconnectDatabaseCradle) {
  return async function remove_domain_email_by_id(id: number) {
    return pg
      .delete(schema.email_domains)
      .where(eq(schema.email_domains.id, id));
  };
}

export type RemoveDomainEmailByIdHandler = ReturnType<
  typeof RemoveDomainEmailById
>;
