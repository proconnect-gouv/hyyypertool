//

import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { z } from "zod";

//

export const validate_form_schema = z.object({
  add_domain: z.stringbool().default(false),
  add_member: z.enum(["AS_INTERNAL", "AS_EXTERNAL"]),
  send_notification: z.stringbool().default(false),
  verification_type: VerificationTypeSchema.optional(),
});

export const validate_form_fields = validate_form_schema.keyof().enum;
export const validate_add_member = validate_form_schema.shape.add_member.enum;
