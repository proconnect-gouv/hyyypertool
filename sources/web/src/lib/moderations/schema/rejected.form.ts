//

import { z } from "zod/v4";

//

export const reject_form_schema = z.object({
  message: z.string().trim(),
  reason: z.string().trim(),
  subject: z.string().trim(),
});

export type RejectedMessage = z.infer<typeof reject_form_schema>;
