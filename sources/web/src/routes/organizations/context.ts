//

import type { App_Context } from "#src/middleware/context";
import { GetOrganizationsList } from "#src/queries/organizations";
import type { urls } from "#src/urls";
import {
  Entity_Schema,
  Pagination_Schema,
  Search_Schema,
} from "@~/core/schema";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect/database";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function loadOrganizationsListPageVariables(
  pg: IdentiteProconnect_PgDatabase,
) {
  return {
    query_organizations: GetOrganizationsList(pg),
  };
}

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadOrganizationsListPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

export const PageQuery_Schema = Pagination_Schema.merge(Search_Schema).merge(
  Entity_Schema.partial(),
);

type PageInputType = {
  out: InferRequestType<typeof urls.organizations.$get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
