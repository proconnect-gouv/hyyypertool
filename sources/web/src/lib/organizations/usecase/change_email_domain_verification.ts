import { NotFoundError } from "#src/errors";
import { identite_runtime } from "#src/lib/activities";
import {
  schema,
  type IdentiteProconnectDatabaseCradle,
} from "@~/identite-proconnect/database";
import type { EmailDomainApprovedVerificationType } from "@~/identite-proconnect/types";
import { and, eq } from "drizzle-orm";
import { match } from "ts-pattern";

export async function change_email_domain_verification(
  { pg, sub }: IdentiteProconnectDatabaseCradle & { sub: string },
  {
    domain,
    organization_id,
    verification_type,
  }: {
    domain: string;
    organization_id: number;
    verification_type: EmailDomainApprovedVerificationType | "refused";
  },
) {
  const runtime = identite_runtime(pg).as({ type: "moderator", sub });

  if (verification_type === "refused") {
    await pg.transaction(async (tx) => {
      const domain_states = and(
        eq(schema.email_domains.domain, domain),
        eq(schema.email_domains.organization_id, organization_id),
      );

      const replaced = await tx
        .delete(schema.email_domains)
        .where(domain_states)
        .returning({
          verification_type: schema.email_domains.verification_type,
        });
      const [email_domain] = await tx
        .insert(schema.email_domains)
        .values({ domain, organization_id, verification_type })
        .returning({ id: schema.email_domains.id });

      await runtime.record(tx, {
        action: "domain.refused",
        context: {
          inputs: { domain, verification_type },
          outcome: {
            email_domain_id: email_domain!.id,
            replaced_verification_types: replaced.map(
              ({ verification_type }) => verification_type,
            ),
          },
        },
        organization_id,
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
}
