//

import { z_coerce_boolean } from "@~/core/schema";
import { UserOrganizationLinkVerificationTypeSchema } from "@~/identite-proconnect/types";
import { z } from "zod";

//

export const validate_form_schema = z.object({
  add_domain: z.string().default("false").pipe(z_coerce_boolean),
  add_member: z.enum(["AS_INTERNAL", "AS_EXTERNAL"]),
  send_notification: z.string().default("false").pipe(z_coerce_boolean),
  verification_type: UserOrganizationLinkVerificationTypeSchema.or(
    z.literal("null").transform(() => null),
  ).default(null),
});
