//

import { EmailDomainVerificationTypes } from "@~/identite-proconnect/types";
import { z } from "zod";

//

export const add_params = z.object({ domain: z.string().min(1) });

export const patch_query = z.object({
  type: EmailDomainVerificationTypes.extract([
    EmailDomainVerificationTypes.enum.verified,
    EmailDomainVerificationTypes.enum.external,
    EmailDomainVerificationTypes.enum.refused,
  ]),
});

export type PatchQuery = z.infer<typeof patch_query>;
