//

import type { App_Context } from "#src/middleware/context";
import {
  Pagination_Schema,
  z_coerce_boolean,
  z_empty_string_to_undefined,
  type Pagination,
} from "@~/core/schema";
import type { GetModerationsListHandler } from "@~/moderations.repository";
import type { Env } from "hono";
import { createContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { z } from "zod";

//

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";

export const Search_Schema = z.object({
  day: z
    .string()
    .default("")
    .pipe(z.coerce.date().or(z_empty_string_to_undefined)),
  search_siret: z.string().default(""),
  search_email: z.string().default(""),
  processed_requests: z.string().pipe(z_coerce_boolean).default("false"),
  hide_non_verified_domain: z.string().pipe(z_coerce_boolean).default("false"),
  hide_join_organization: z.string().pipe(z_coerce_boolean).default("false"),
});
export const Page_Query = Search_Schema.merge(Pagination_Schema).partial();
export type Search = z.infer<typeof Search_Schema>;

//
export type GetModerationsListDTO = Awaited<
  ReturnType<GetModerationsListHandler>
>;

export async function load_moderations_list_page_variables({
  pagination,
  search,
}: {
  pagination: Pagination;
  search: Search;
}) {
  return {
    pagination,
    search,
  };
}

//

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof load_moderations_list_page_variables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

export const usePageRequestContext = useRequestContext<ContextType, any, any>;

export default createContext({
  query_moderations_list: {} as Promise<GetModerationsListDTO>,
  pagination: {} as Pagination,
});
