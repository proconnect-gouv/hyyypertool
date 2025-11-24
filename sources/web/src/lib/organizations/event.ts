//

import { z } from "zod/v4";

//

export const ORGANISATION_EVENTS = z.enum([
  "DOMAIN_UPDATED",
  "EXTERNAL_DOMAIN_UPDATED",
  "MEMBERS_UPDATED",
]);
