//

import { z } from "zod";

//

export const Moderation_Type_Schema = z.enum([
  "ask_for_sponsorship",
  "big_organization_join",
  "non_verified_domain",
  "organization_join_block",
]);

export type Moderation_Type = z.TypeOf<typeof Moderation_Type_Schema>;
