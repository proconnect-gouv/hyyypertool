//

import { z } from "zod/v4";

//

export const EmailDomainTypeSchema = z
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

export type EmailDomainType = z.infer<typeof EmailDomainTypeSchema>;
