import {
  schema,
  type IdentiteProconnectPgDatabase,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

export function delete_domain_by_id(
  pg: IdentiteProconnectPgDatabase,
  id: number,
) {
  return pg.delete(schema.email_domains).where(eq(schema.email_domains.id, id));
}

export type DeleteDomainByIdHandler = typeof delete_domain_by_id;
export type DeleteDomainByIdDto = Awaited<ReturnType<DeleteDomainByIdHandler>>;
