//

import z from "zod";

//

// Shared schemas for form validation
export const whitelist_form_schema = z.object({
  problematic_email: z.string().min(1),
});

export const whitelist_param_schema = z.object({
  email_domain: z.string(),
});
