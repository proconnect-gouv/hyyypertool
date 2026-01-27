//

import { z } from "zod";

export const z_email_domain = z
  .email()
  .transform((email) => email.split("@")[1])
  .pipe(z.string());
