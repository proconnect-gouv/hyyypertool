import type { IdentiteRuntime, KnownActivity } from "#src/lib/activities";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import { eq } from "drizzle-orm";

export async function remove_domain_email_by_id(
  {
    pg,
    runtime,
  }: IdentiteProconnectDatabaseCradle & { runtime: IdentiteRuntime },
  id: number,
) {
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

    const domain_removed: KnownActivity = {
      action: "domain.removed",
      context: {
        inputs: { domain: removed.domain },
        outcome: {
          email_domain_id: id,
          previous_verification_type: removed.verification_type,
        },
      },
    };
    const activity = {
      ...domain_removed,
      organization_id: removed.organization_id,
    };
    // typing gap only (proconnect-identite#2451): record() is insertActivity, typed for app-owned actions
    await runtime.record(tx, activity as never);

    return { kind: "domain_removed" } as const;
  });
}

export type RemoveDomainEmailByIdHandler = typeof remove_domain_email_by_id;
