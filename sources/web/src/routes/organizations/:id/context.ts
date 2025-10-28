//

import type { App_Config } from "#src/config";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import { GetBanaticUrl } from "@~/organizations.lib/usecase";
import {
  GetDomainCount,
  GetOrganizationById,
  GetOrganizationMembersCount,
} from "@~/organizations.repository";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//
export async function loadOrganizationPageVariables(
  config: App_Config,
  pg: IdentiteProconnect_PgDatabase,
  { id }: { id: number },
) {
  const get_organization_by_id = GetOrganizationById(pg, {
    columns: {
      cached_activite_principale: true,
      cached_adresse: true,
      cached_categorie_juridique: true,
      cached_code_officiel_geographique: true,
      cached_code_postal: true,
      cached_enseigne: true,
      cached_est_active: true,
      cached_etat_administratif: true,
      cached_libelle_activite_principale: true,
      cached_libelle_categorie_juridique: true,
      cached_libelle_tranche_effectif: true,
      cached_libelle: true,
      cached_nom_complet: true,
      cached_tranche_effectifs: true,
      created_at: true,
      id: true,
      siret: true,
      updated_at: true,
    },
  });
  const organization = await get_organization_by_id(id);
  const siren = organization.siret.substring(0, 9);
  const get_banatic_url = GetBanaticUrl({
    http_timout: config.HTTP_CLIENT_TIMEOUT,
  });

  const query_organization_domains_count = GetDomainCount(pg)(id);
  const query_organization_members_count = GetOrganizationMembersCount(pg)(id);

  return {
    banaticUrl: (await get_banatic_url(siren)).url,
    organization,
    query_organization_domains_count,
    query_organization_members_count,
  };
}

export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof loadOrganizationPageVariables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.organizations[":id"].$get;
type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;
