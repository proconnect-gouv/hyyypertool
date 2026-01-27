//

import { UserOrganizationLinkVerificationTypeSchema } from "@~/identite-proconnect/types";
import { z } from "zod";

//

export const validate_form_schema = z.object({
  add_domain: z.stringbool().default(false),
  add_member: z.enum(["AS_INTERNAL", "AS_EXTERNAL"]),
  send_notification: z.stringbool().default(false),
  verification_type: UserOrganizationLinkVerificationTypeSchema.or(
    z.literal("null").transform(() => null),
  ).default(null),
});
