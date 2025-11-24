//

import { z } from "zod/v4";

//

export const EmailDomain_Type_Schema = z
  .enum([
    "authorized", // legacy ?
    "blacklisted",
    "external",
    "official_contact",
    "refused",
    "trackdechets_postal_mail",
    "verified",
  ])
  .nullable();

export type EmailDomain_Type = z.infer<typeof EmailDomain_Type_Schema>;
