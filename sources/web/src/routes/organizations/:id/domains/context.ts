//

import { EmailDomainVerificationEnum } from "@~/identite-proconnect/types";
import { z } from "zod";

//

export const add_params = z.object({ domain: z.string().min(1) });

export const patch_query = z.object({
  type: EmailDomainVerificationEnum.extract([
    EmailDomainVerificationEnum.enum.verified,
    EmailDomainVerificationEnum.enum.external,
    EmailDomainVerificationEnum.enum.refused,
  ]),
});

export type PatchQuery = z.infer<typeof patch_query>;
