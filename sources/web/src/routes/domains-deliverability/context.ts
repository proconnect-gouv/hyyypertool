//

import type { App_Context } from "#src/middleware/context";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import type { Env } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadEmailDeliverabilityPageVariables(
  pg: IdentiteProconnect_PgDatabase,
) {
  const whitelist = await pg.query.email_deliverability_whitelist.findMany({
    orderBy: (table, { desc }) => [desc(table.verified_at)],
  });

  return { whitelist };
}

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadEmailDeliverabilityPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

export const usePageRequestContext = useRequestContext<ContextType>;
