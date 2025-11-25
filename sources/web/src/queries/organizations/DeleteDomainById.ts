//

import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

//

export function DeleteDomainById(pg: IdentiteProconnectPgDatabase) {
  return function delete_domain_by_id(id: number) {
    return pg
      .delete(schema.email_domains)
      .where(eq(schema.email_domains.id, id));
  };
}

export type DeleteDomainByIdHandler = ReturnType<typeof DeleteDomainById>;
export type DeleteDomainByIdDto = Awaited<ReturnType<DeleteDomainByIdHandler>>;
