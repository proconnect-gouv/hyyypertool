//

import { z } from "zod";

//

export const MODERATION_EVENTS = z.enum([
  "MODERATION_EMAIL_UPDATED",
  "MODERATION_UPDATED",
  "MODERATIONS_UPDATED",
]);
