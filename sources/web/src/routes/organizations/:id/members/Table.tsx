//

import { hx_include } from "#src/htmx";
import { Foot } from "#src/ui/hx_table";
import { menu_item } from "#src/ui/menu";
import { Horizontal_Menu } from "#src/ui/menu/components";
import { row } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import type { Pagination } from "@~/core/schema";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { useContext } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { MemberContext } from "./context";
import type { get_users_by_organization } from "./get_users_by_organization.query";

//

type QueryResult = Awaited<ReturnType<typeof get_users_by_organization>>;

export async function Table({
  organization_id,
  pagination,
  query_members_collection,
  describedby,
  page_ref,
}: {
  organization_id: number;
  pagination: Pagination;
  query_members_collection: QueryResult;
  describedby: string;
  page_ref: string;
}) {
  const { users, count } = query_members_collection;

  const hx_member_query_props = {
    ...urls.organizations[":id"].members.$hx_get({
      param: {
        id: organization_id,
      },
      query: { describedby, page_ref },
    }),
    "hx-include": hx_include([page_ref]),
  };

  return (
    <div class="fr-table *:table!">
      <table aria-describedby={describedby}>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Interne</th>
            <th>Email</th>
            <th>Fonction</th>
            <th>Type de vérification</th>
            <th>Dates</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <MemberContext.Provider value={{ user, organization_id }}>
              <Row />
            </MemberContext.Provider>
          ))}
        </tbody>

        <Foot
          colspan={8}
          count={count}
          hx_query_props={hx_member_query_props}
          id={page_ref}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({ variants }: { variants?: VariantProps<typeof row> }) {
  const { user } = useContext(MemberContext);
  const verification_type = VerificationTypeSchema.parse(
    user.verification_type,
  );

  return (
    <tr
      aria-label={`Membre ${user.given_name} ${user.family_name} (${user.email})`}
      class={row(variants)}
    >
      <td>{user.given_name}</td>
      <td>{user.family_name}</td>
      <td>{user.is_external ? "❌" : "✅"}</td>
      <td>{user.email}</td>
      <td>{user.job}</td>
      <td>
        {user.needs_official_contact_email_verification ? (
          <span title="En attente d'une vérification officielle de l'adresse e-mail de contact">
            ⚠️
          </span>
        ) : null}
        {verification_type}
      </td>
      <td class="text-sm whitespace-nowrap">
        <div title="Ajouté le">
          ➕ <LocalTime date={user.created_at} />
        </div>
        {user.updated_at !== user.created_at && (
          <div title="Modifié le">
            ✏️ <LocalTime date={user.updated_at} />
          </div>
        )}
      </td>
      <td>
        <Row_Actions />
      </td>
    </tr>
  );
}

async function Row_Actions() {
  const { user, organization_id } = useContext(MemberContext);
  const { id: user_id, is_external, verification_type } = user;

  return (
    <Horizontal_Menu>
      <ul class="list-none p-0">
        <li>
          <a
            class={menu_item({ override: "[href]" })}
            href={urls.users[":id"].$url({ param: { id: user.id } }).pathname}
          >
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
                    .imported_from_coop_mediation_numerique,
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
    </Horizontal_Menu>
  );
}
