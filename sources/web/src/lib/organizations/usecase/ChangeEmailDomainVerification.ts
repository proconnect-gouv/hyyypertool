//

import { NotFoundError } from "#src/errors";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import type { EmailDomainApprovedVerificationType } from "@~/identite-proconnect/types";
import { createIdentiteRuntime } from "@proconnect-gouv/proconnect.identite.runtime";
import { and, eq } from "drizzle-orm";
import { match } from "ts-pattern";

//

export function ChangeEmailDomainVerification({
  pg,
}: IdentiteProconnectDatabaseCradle) {
  const runtime = createIdentiteRuntime({ db: pg });

  return async function change_email_domain_verification({
    domain,
    organization_id,
    verification_type,
  }: {
    domain: string;
    organization_id: number;
    verification_type: EmailDomainApprovedVerificationType | "refused";
  }) {
    if (verification_type === "refused") {
      await pg.transaction(async (tx) => {
        const domain_states = and(
          eq(schema.email_domains.domain, domain),
          eq(schema.email_domains.organization_id, organization_id),
        );

        await tx.delete(schema.email_domains).where(domain_states);
        await tx.insert(schema.email_domains).values({
          domain,
          organization_id,
          verification_type,
        });
      });

      return { kind: "domain_refused" } as const;
    }

    const outcome = await runtime.markDomainAsVerified({
      domain,
      domain_verification_type: verification_type,
      organization_id,
    });

    return match(outcome)
      .with({ kind: "domain_verified" }, (verified) => verified)
      .with({ kind: "organization_not_found" }, () => {
        throw new NotFoundError("Organization not found.");
      })
      .exhaustive();
  };
}
