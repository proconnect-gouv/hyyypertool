//

import type { CrispApi } from "@~/crisp.lib/api";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import type { GetModerationWithUserDto } from "#src/queries/moderations";
import type { RejectedMessage } from "../schema/rejected.form";

//

export type RejectedModeration_Context = {
  crisp: CrispApi;
  moderation: GetModerationWithUserDto;
  pg: IdentiteProconnect_PgDatabase;
  reason: string;
  resolve_delay: number;
  subject: string;
  userinfo: { email: string; given_name: string; usual_name: string };
};
export type RejectedFullMessage = RejectedMessage & { to: string };
