//

import { type Pagination } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "#src/urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import {
  GetUsersByOrganizationId,
  type GetUsersByOrganizationIdDto,
} from "@~/users.repository";
import type { Env, InferRequestType } from "hono";
import { createContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadMembersPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  {
    organization_id,
    pagination,
  }: {
    organization_id: number;
    pagination: Pagination;
  },
) {
  const query_members_collection = GetUsersByOrganizationId(pg)({
    organization_id,
    pagination: { ...pagination, page: pagination.page - 1 },
  });

  return {
    organization_id,
    pagination,
    query_members_collection,
  };
}

//

export const Member_Context = createContext({
  user: {} as GetUsersByOrganizationIdDto["users"][number],
});

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadMembersPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.organizations[":id"].members.$get;
type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
