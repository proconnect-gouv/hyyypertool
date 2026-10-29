//

import { EmailDomainVerificationEnum } from "@~/identite-proconnect/types";
import { z } from "zod";

//

export const domain_activities = {
  "domain.refused": z.object({
    inputs: z.object({
      domain: z.string(),
      verification_type: z.literal(EmailDomainVerificationEnum.enum.refused),
    }),
    outcome: z.object({
      email_domain_id: z.number(),
      replaced_verification_types: z.array(z.string()),
    }),
  }),
};
