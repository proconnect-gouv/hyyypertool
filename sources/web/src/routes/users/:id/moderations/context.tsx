//

import type { DescribedBy } from "@~/app.core/schema";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import {
  GetModerationsByUserId,
  type GetModerationsByUserIdHandler,
} from "@~/moderations.repository/GetModerationsByUserId";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadModerationsPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { describedby, user_id }: { user_id: number } & DescribedBy,
) {
  const get_moderations_by_user_id = GetModerationsByUserId({ pg });
  const moderations = await get_moderations_by_user_id(user_id);

  return {
    describedby,
    moderations,
  };
}

//

export type ModerationList = Awaited<ReturnType<GetModerationsByUserIdHandler>>;
interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadModerationsPageVariables>>;
}

//

export const usePageRequestContext = useRequestContext<ContextVariablesType>;
