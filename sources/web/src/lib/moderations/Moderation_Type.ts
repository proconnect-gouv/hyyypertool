//

import { z } from "zod/v4";

//

export const ModerationTypeSchema = z.enum([
  "ask_for_sponsorship",
  "big_organization_join",
  "non_verified_domain",
  "organization_join_block",
]);

export type ModerationType = z.TypeOf<typeof ModerationTypeSchema>;
