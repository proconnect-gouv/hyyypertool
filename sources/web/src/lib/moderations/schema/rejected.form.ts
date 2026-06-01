//

import { z } from "zod";

//

export const reject_form_schema = z.object({
  message: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  end_user_reason: z.string().trim().min(1),
  allow_editing: z.coerce.boolean().optional().default(false),
});

export type RejectedMessage = z.infer<typeof reject_form_schema>;
