import { NotFoundError } from "#src/errors";
import type { IdentiteRuntime } from "#src/lib/activities";
import type { EmailDomainNoPendingVerificationType } from "@proconnect-gouv/proconnect.identite/types";
import { match } from "ts-pattern";

export async function change_email_domain_verification(
  { runtime }: { runtime: IdentiteRuntime },
  {
    domain,
    organization_id,
    verification_type,
  }: {
    domain: string;
    organization_id: number;
    verification_type: EmailDomainNoPendingVerificationType;
  },
) {
  const outcome = await runtime.changeEmailDomainVerification({
    domain,
    organization_id,
    verification_type,
  });

  return match(outcome)
    .with({ kind: "domain_verification_changed" }, (changed) => changed)
    .with({ kind: "organization_not_found" }, () => {
      throw new NotFoundError("Organization not found.");
    })
    .exhaustive();
}
