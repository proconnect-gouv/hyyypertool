//

import { z } from "zod";

export const z_email_domain = z
  .string()
  .email()
  .transform((email) => email.split("@")[1]);
