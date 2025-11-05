//

import type { DescribedBy } from "@~/core/schema";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { get_moderations_by_user_id } from "#src/queries/moderations";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadModerationsPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { describedby, user_id }: { user_id: number } & DescribedBy,
) {
  const moderations = await get_moderations_by_user_id(pg, user_id);

  return {
    describedby,
    moderations,
  };
}

//

export type ModerationList = Awaited<ReturnType<typeof get_moderations_by_user_id>>;
interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadModerationsPageVariables>>;
}

//

export const usePageRequestContext = useRequestContext<ContextVariablesType>;
