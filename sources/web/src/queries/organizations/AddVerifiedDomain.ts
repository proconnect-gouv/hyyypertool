//

import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect/database";
import type { MCP_EmailDomain_Type } from "@~/identite-proconnect/types";
import { eq } from "drizzle-orm";

//

export function AddVerifiedDomain(pg: IdentiteProconnect_PgDatabase) {
  return async function add_verified_domain({
    id,
  }: {
    id: number;
    domain: string;
  }) {
    return pg
      .update(schema.email_domains)
      .set({
        verification_type: "verified" as MCP_EmailDomain_Type,
        verified_at: new Date().toISOString(),
      })
      .where(eq(schema.email_domains.id, id))
      .returning({ id: schema.email_domains.id });
  };
}

export type AddVerifiedDomainHandler = ReturnType<typeof AddVerifiedDomain>;
export type AddVerifiedDomainDto = Awaited<
  ReturnType<AddVerifiedDomainHandler>
>;
