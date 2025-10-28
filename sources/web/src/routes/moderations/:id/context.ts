//

import type { App_Config } from "@~/app.core/config/index";
import { z_email_domain } from "@~/app.core/schema/z_email_domain";
import type { App_Context } from "@~/app.middleware/context";
import { urls } from "@~/app.urls";
import type { IdentiteProconnect_PgDatabase } from "@~/identite-proconnect.database";
import {
  GetModerationWithDetails,
  type GetModerationWithDetailsDto,
} from "@~/moderations.repository";
import { GetBanaticUrl } from "@~/organizations.lib/usecase";
import {
  GetDomainCount,
  GetOrganizationById,
  GetOrganizationMember,
  GetOrganizationMembersCount,
} from "@~/organizations.repository";
import { to } from "await-to-js";
import type { Env, InferRequestType } from "hono";
import { useRequestContext } from "hono/jsx-renderer";

//

export async function load_moderation_page_variables(
  config: App_Config,
  pg: IdentiteProconnect_PgDatabase,
  { id }: { id: number },
) {
  const get_moderation_with_details = GetModerationWithDetails(pg);
  const [moderation_error, moderation] = await to(
    get_moderation_with_details(id),
  );

  if (moderation_error) {
    throw moderation_error;
  }

  //

  const domain = z_email_domain.parse(moderation.user.email, {
    path: ["moderation.users.email"],
  });

  //

  const get_organization_member = GetOrganizationMember(pg);
  const organization_member = await get_organization_member({
    organization_id: moderation.organization_id,
    user_id: moderation.user.id,
  });

  //

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
  const organization_fiche = await get_organization_by_id(
    moderation.organization_id,
  );

  const siren = organization_fiche.siret.substring(0, 9);
  const get_banatic_url = GetBanaticUrl({
    http_timout: config.HTTP_CLIENT_TIMEOUT,
  });
  const get_organization_members_count = GetOrganizationMembersCount(pg);
  const get_domain_count = GetDomainCount(pg);

  //

  return {
    banaticUrl: (await get_banatic_url(siren)).url,
    domain,
    moderation,
    organization_fiche,
    organization_member,
    query_domain_count: get_domain_count(moderation.organization_id),
    query_organization_members_count: get_organization_members_count(
      moderation.organization_id,
    ),
  };
}

export interface ModerationContext extends Env {
  Variables: {
    moderation: GetModerationWithDetailsDto;
  };
}
export interface ContextVariablesType extends Env {
  Variables: Awaited<ReturnType<typeof load_moderation_page_variables>>;
}
export type ContextType = App_Context & ContextVariablesType;

//

const $get = typeof urls.moderations[":id"].$get;

type PageInputType = {
  out: InferRequestType<typeof $get>;
};

export const usePageRequestContext = useRequestContext<
  ContextType,
  any,
  PageInputType
>;

//
