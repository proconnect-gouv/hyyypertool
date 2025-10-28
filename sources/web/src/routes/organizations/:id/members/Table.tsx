//

import { hx_include } from "#src/htmx";
import { Foot } from "@~/app.ui/hx_table";
import { menu_item } from "@~/app.ui/menu";
import { Horizontal_Menu } from "@~/app.ui/menu/components";
import { row } from "@~/app.ui/table";
import { hx_urls, urls } from "@~/app.urls";
import {
  Verification_Type_Schema,
  type Verification_Type,
} from "@~/identite-proconnect.lib/verification_type";
import { useContext } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { Member_Context, usePageRequestContext } from "./context";

//

export async function Table() {
  const {
    req,
    var: { pagination, query_members_collection, organization_id },
  } = usePageRequestContext();
  const { describedby, page_ref } = req.valid("query");
  const { users, count } = await query_members_collection;

  const hx_member_query_props = {
    ...(await hx_urls.organizations[":id"].members.$get({
      param: {
        id: organization_id.toString(),
      },
      query: { describedby, page_ref },
    })),
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
            <th></th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <Member_Context.Provider value={{ user }}>
              <Row />
            </Member_Context.Provider>
          ))}
        </tbody>

        <Foot
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
  const { user } = useContext(Member_Context);
  const verification_type = user.verification_type as Verification_Type;
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
      <td>{verification_type}</td>
      <td>
        <Row_Actions />
      </td>
    </tr>
  );
}

async function Row_Actions() {
  const {
    var: { organization_id },
  } = usePageRequestContext();
  const { user } = useContext(Member_Context);
  const { id: user_id, is_external, verification_type } = user;

  return (
    <Horizontal_Menu>
      <ul class="list-none p-0">
        <li>
          <a
            class={menu_item({ override: "[href]" })}
            href={
              urls.users[":id"].$url({ param: { id: user.id.toString() } })
                .pathname
            }
          >
            Ouvrir
          </a>
        </li>
        <li>
          <button
            class={menu_item()}
            {...await hx_urls.organizations[":id"].members[":user_id"].$delete({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
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
            {...await hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
              form: {
                verification_type:
                  Verification_Type_Schema.enum.in_liste_dirigeants_rna,
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
            {...await hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
              form: {
                verification_type: Verification_Type_Schema.enum.domain,
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
            {...await hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
              form: {
                verification_type:
                  Verification_Type_Schema.enum.official_contact_email,
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
            {...await hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
              form: {
                verification_type:
                  Verification_Type_Schema.enum.no_validation_means_available,
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
            {...await hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
              },
              form: {
                verification_type: "verified_by_coop_mediation_numerique",
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
              {...await hx_urls.organizations[":id"].members[":user_id"].$patch(
                {
                  param: {
                    id: organization_id.toString(),
                    user_id: user_id.toString(),
                  },
                  form: {
                    verification_type: "",
                  },
                },
              )}
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
            {...await hx_urls.organizations[":id"].members[":user_id"].$patch({
              param: {
                id: organization_id.toString(),
                user_id: user_id.toString(),
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
