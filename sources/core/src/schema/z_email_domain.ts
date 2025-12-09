//

import { z } from "zod/v4";

export const z_email_domain = z
  .email()
  .transform((email) => email.split("@")[1])
  .pipe(z.string());
