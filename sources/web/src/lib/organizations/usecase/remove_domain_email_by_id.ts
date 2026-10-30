import { identite_runtime } from "#src/lib/activities";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

export async function remove_domain_email_by_id(
  { pg, sub }: IdentiteProconnectDatabaseCradle & { sub: string },
  id: number,
) {
  const runtime = identite_runtime(pg).as({ type: "moderator", sub });

  return pg.transaction(async (tx) => {
    const [removed] = await tx
      .delete(schema.email_domains)
      .where(eq(schema.email_domains.id, id))
      .returning({
        domain: schema.email_domains.domain,
        organization_id: schema.email_domains.organization_id,
        verification_type: schema.email_domains.verification_type,
      });
    if (!removed) return { kind: "domain_not_found" } as const;

    await runtime.record(tx, {
      action: "domain.removed",
      context: {
        inputs: { domain: removed.domain },
        outcome: {
          email_domain_id: id,
          previous_verification_type: removed.verification_type,
        },
      },
      organization_id: removed.organization_id,
    });

    return { kind: "domain_removed" } as const;
  });
}

export type RemoveDomainEmailByIdHandler = typeof remove_domain_email_by_id;
