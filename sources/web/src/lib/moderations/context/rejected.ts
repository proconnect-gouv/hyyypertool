//

import type { CrispApi } from "#src/lib/crisp";
import type { GetModerationWithUserDto } from "#src/queries/moderations";
import type { IdentiteProconnectPgDatabase } from "@~/identite-proconnect/database";
import type { RejectedMessage } from "../schema/rejected.form";

//

export type RejectedModeration_Context = {
  crisp: CrispApi;
  moderation: GetModerationWithUserDto;
  pg: IdentiteProconnectPgDatabase;
  reason: string;
  resolve_delay: number;
  subject: string;
  userinfo: { email: string; given_name: string; usual_name: string };
};
export type RejectedFullMessage = RejectedMessage & { to: string };
