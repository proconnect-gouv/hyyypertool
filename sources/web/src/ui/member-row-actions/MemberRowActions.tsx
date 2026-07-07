//

import { menu_item } from "#src/ui/menu";
import { HorizontalMenu } from "#src/ui/menu/components";
import { urls } from "#src/urls";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";

//

export async function MemberRowActions({
  user_id,
  organization_id,
  is_external,
  verification_type,
  open_href,
}: {
  user_id: number;
  organization_id: number;
  is_external: boolean;
  verification_type: string | null;
  open_href: string;
}) {
  return (
    <HorizontalMenu>
      <ul class=" [&_li+li]:border-t-grey-200 list-none p-0 [&_li+li]:border-t">
        <li>
          <a class={menu_item({ override: "[href]" })} href={open_href}>
            Ouvrir
          </a>
        </li>
        <li>
          <button
            class={menu_item()}
            {...urls.organizations[":id"].members[":user_id"].$hx_delete({
              param: {
                id: organization_id,
                user_id: user_id,
              },
            })}
            hx-swap="none"
          >
            🚪🚶retirer de l'orga
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...urls.organizations[":id"].members[":user_id"].$hx_patch({
              param: {
                id: organization_id,
                user_id: user_id,
              },
              form: {
                verification_type:
                  VerificationTypeSchema.enum.in_liste_dirigeants_rna,
              },
            })}
            hx-swap="none"
          >
            🔄 vérif: liste dirigeants
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...urls.organizations[":id"].members[":user_id"].$hx_patch({
              param: {
                id: organization_id,
                user_id: user_id,
              },
              form: {
                verification_type: VerificationTypeSchema.enum.domain,
              },
            })}
            hx-swap="none"
          >
            🔄 vérif: domaine email
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...urls.organizations[":id"].members[":user_id"].$hx_patch({
              param: {
                id: organization_id,
                user_id: user_id,
              },
              form: {
                verification_type:
                  VerificationTypeSchema.enum.official_contact_email,
              },
            })}
            hx-swap="none"
          >
            🔄 vérif: mail officiel
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...urls.organizations[":id"].members[":user_id"].$hx_patch({
              param: {
                id: organization_id,
                user_id: user_id,
              },
              form: {
                verification_type:
                  VerificationTypeSchema.enum.no_validation_means_available,
              },
            })}
            hx-swap="none"
          >
            🔄 vérif: no validation means available
          </button>
        </li>
        <li>
          <button
            class={menu_item()}
            {...urls.organizations[":id"].members[":user_id"].$hx_patch({
              param: {
                id: organization_id,
                user_id: user_id,
              },
              form: {
                verification_type:
                  VerificationTypeSchema.enum
                    .verified_by_coop_mediation_numerique,
              },
            })}
            hx-swap="none"
          >
            🔄 vérif: verified by coop mediation numerique
          </button>
        </li>
        <li>
          {verification_type ? (
            <button
              class={menu_item()}
              {...urls.organizations[":id"].members[":user_id"].$hx_patch({
                param: {
                  id: organization_id,
                  user_id: user_id,
                },
                form: {
                  verification_type:
                    VerificationTypeSchema.enum.domain_not_verified_yet,
                },
              })}
              hx-swap="none"
            >
              🚫 non vérifié
            </button>
          ) : (
            <></>
          )}
        </li>
        <li>
          <button
            class={menu_item()}
            {...urls.organizations[":id"].members[":user_id"].$hx_patch({
              param: {
                id: organization_id,
                user_id: user_id,
              },
              form: {
                is_external: String(!is_external),
              },
            })}
            hx-swap="none"
          >
            🔄 interne/externe
          </button>
        </li>
      </ul>
    </HorizontalMenu>
  );
}
