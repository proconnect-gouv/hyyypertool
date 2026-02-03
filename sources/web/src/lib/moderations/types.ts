//

import { ModerationTypeSchema } from "@~/identite-proconnect/types";
import { z } from "zod";

//

type LegacyModerationType = "ask_for_sponsorship" | "big_organization_join";
export type ModerationType =
  | z.TypeOf<typeof ModerationTypeSchema>
  | LegacyModerationType;
