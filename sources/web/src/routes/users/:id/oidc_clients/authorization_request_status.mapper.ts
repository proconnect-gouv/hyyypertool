//

import { AuthorizationRequestOutcomeEnum } from "@proconnect-gouv/proconnect.identite/types";
import { match } from "ts-pattern";

//

// identite's oidc-provider Interaction TTL (tokenTtlInSeconds)
const INTERACTION_TTL_IN_MS = 60 * 60 * 1000;

export function authorization_request_status_label({
  created_at,
  interaction_cid,
  now,
  outcome,
}: {
  created_at: string;
  interaction_cid: string | null;
  now: Date;
  outcome: string | null;
}) {
  const parsed_outcome = AuthorizationRequestOutcomeEnum.safeParse(outcome);
  if (interaction_cid === null)
    return parsed_outcome.success ? "Sans interaction" : "—";
  if (parsed_outcome.success)
    return match(parsed_outcome.data)
      .with("succeeded", () => "Terminée")
      .exhaustive();
  if (outcome !== null) return "—";
  const age_in_ms = now.getTime() - new Date(created_at).getTime();
  return age_in_ms >= INTERACTION_TTL_IN_MS ? "Interrompue" : "—";
}
