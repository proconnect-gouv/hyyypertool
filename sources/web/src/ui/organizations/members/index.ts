//

import { hx_include } from "#src/htmx";
import { urls } from "#src/urls";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";

//

export const MEMBERS_TABLE_IDS = {
  export: "organization_members_export",
  order: "organization_members_order",
  page: "organization_members_page",
  search: "organization_members_search",
  sort: "organization_members_sort",
  table: "organization_members_table",
} as const;

export const VERIFICATION_TYPE_LABELS = [
  [VerificationTypeSchema.enum.in_liste_dirigeants_rna, "liste dirigeants"],
  [VerificationTypeSchema.enum.domain, "domaine email"],
  [VerificationTypeSchema.enum.official_contact_email, "mail officiel"],
  [
    VerificationTypeSchema.enum.no_validation_means_available,
    "no validation means available",
  ],
  [
    VerificationTypeSchema.enum.verified_by_coop_mediation_numerique,
    "verified by coop mediation numerique",
  ],
  [VerificationTypeSchema.enum.domain_not_verified_yet, "non vérifié"],
] as const;

// The members page and its embeds share these; each container sets its own hx-target.
// The response is the full members page: keep the embedding page's <title>.
export function hx_get_members_table_props(organization_id: number) {
  const { order, page, search, sort, table } = MEMBERS_TABLE_IDS;
  return {
    ...urls.organizations[":id"].members.$hx_get({
      param: { id: organization_id },
      query: {},
    }),
    "hx-include": hx_include([order, page, search, sort]),
    "hx-select": `#${table}`,
    "hx-swap": "innerHTML ignoreTitle:true",
  };
}

export { SelectAllMembersIsland } from "./SelectAllMembersIsland";
