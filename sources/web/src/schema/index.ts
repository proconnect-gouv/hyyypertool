//

import { z } from "zod";
export { z_email_domain } from "./z_email_domain";
export { z_empty_string_to_undefined } from "./z_empty_string_to_undefined";
export { z_username } from "./z_username";

//

export const IdSchema = z.string().pipe(z.coerce.number());
export const EntitySchema = z.object({
  id: IdSchema,
});

//

export const PaginationSchema = z.object({
  page: z.coerce
    .number()
    .transform((number) => Math.max(1, number))
    .default(1),
  page_size: z.coerce.number().default(10),
});
export type Pagination = z.infer<typeof PaginationSchema>;

//

export const SearchSchema = z.object({
  q: z.string().default(""),
});
export type Search = z.infer<typeof SearchSchema>;
//

export const DescribedBySchema = z.object({
  describedby: z.string(),
});
export type DescribedBy = z.infer<typeof DescribedBySchema>;
export const MfaAcrValueSchema = z.enum([
  "eidas2",
  "eidas3",
  "https://proconnect.gouv.fr/assurance/self-asserted-2fa",
  "https://proconnect.gouv.fr/assurance/consistency-checked-2fa",
]);

export type MfaAcrValue = z.infer<typeof MfaAcrValueSchema>;
