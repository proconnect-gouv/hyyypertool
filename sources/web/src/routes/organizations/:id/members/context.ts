//

import { IdSchema, PaginationSchema, SearchSchema } from "#src/schema";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { createContext } from "hono/jsx";
import { z } from "zod";
import type { get_users_by_organization } from "./get_users_by_organization.query";

//

type User = Awaited<
  ReturnType<typeof get_users_by_organization>
>["users"][number];

export const MemberContext = createContext({
  user: {} as User,
  organization_id: 0,
  is_editor: true,
  has_selection: true,
});

//

export const SortSchema = z.enum([
  "created",
  "email",
  "family-name",
  "given-name",
  "is-external",
  "job",
  "verification-type",
]);
export type Sort = z.infer<typeof SortSchema>;

export const OrderSchema = z.enum(["asc", "desc"]);
export type Order = z.infer<typeof OrderSchema>;

export const query_schema = PaginationSchema.extend(SearchSchema.shape).extend({
  order: OrderSchema.default("asc"),
  page_size: z.coerce.number().optional(),
  sort: SortSchema.optional(),
});

//

export const BatchActionSchema = z.enum([
  "external",
  "internal",
  "remove",
  ...VerificationTypeSchema.options,
]);
export type BatchAction = z.infer<typeof BatchActionSchema>;

export const batch_form_schema = z.object({
  action: BatchActionSchema,
  user_id: z.preprocess((value) => [value].flat(), z.array(IdSchema).min(1)),
});

export const export_query_schema = z.object({
  user_id: z.preprocess(
    (value) => (value === undefined ? [] : [value].flat()),
    z.array(IdSchema),
  ),
});
