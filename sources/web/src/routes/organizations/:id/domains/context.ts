//

import type { App_Context } from "#src/middleware/context";
import { urls } from "#src/urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";
import { get_orginization_domains } from "./get_orginization_domains";

//

export async function loadDomainsPageVariables(
  pg: IdentiteProconnect_PgDatabase,
  { organization_id }: { organization_id: number },
) {
  const domains = await get_orginization_domains({ pg }, { organization_id });

  return {
    domains,
  };
}

//

const $get = urls.organizations[":id"].domains.$get;

type PageInputType = {
  out: InferRequestType<typeof $get>;
};

//

interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadDomainsPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;

export const AddDomainParams_Schema = z.object({ domain: z.string().min(1) });
