//

import { PaginationSchema } from "@~/core/schema";
import { z } from "zod/v4";

//

export const MODERATION_TABLE_ID = "moderation_table";
export const MODERATION_TABLE_PAGE_ID = "moderation_table_page";

export const search_schema = z.object({
  day: z
    .string()
    .default("")
    .transform((v) => {
      if (v === "") return undefined;
      return new Date(v);
    }),
  search_siret: z.string().default(""),
  search_email: z.string().default(""),
  processed_requests: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  hide_non_verified_domain: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
  hide_join_organization: z
    .string()
    .default("false")
    .transform((v) => v === "true"),
});
export type Search = z.infer<typeof search_schema>;

export const query_schema = search_schema
  .extend(PaginationSchema.shape)
  .partial();
