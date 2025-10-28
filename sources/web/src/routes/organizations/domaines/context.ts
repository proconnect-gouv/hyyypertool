//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import { Pagination_Schema, Search_Schema } from "@~/app.core/schema";
import type { App_Context } from "@~/app.middleware/context";
import { hx_urls, urls } from "#src/urls";
import { type Env, type InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export const query_schema = Pagination_Schema.merge(Search_Schema);

//

export async function loadDomainesPageVariables() {
  const $describedby = hyper_ref();
  const $table = hyper_ref();
  const $search = hyper_ref();

  const hx_domains_query_props = {
    ...(await hx_urls.organizations.domains.$get({ query: {} })),
    "hx-include": hx_include([$search, $table, query_schema.keyof().enum.page]),
    "hx-replace-url": true,
    "hx-select": `#${$table} > table`,
    "hx-target": `#${$table}`,
  };

  return {
    $describedby,
    $search,
    $table,
    hx_domains_query_props,
  };
}

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadDomainesPageVariables>>;
}

export type ContextType = App_Context & ContextVariablesType;

//

type PageInputType = {
  out: InferRequestType<typeof urls.organizations.domains.$get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
