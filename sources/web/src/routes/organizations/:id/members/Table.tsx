//

import type { Pagination } from "#src/schema";
import { button } from "#src/ui/button";
import { Foot } from "#src/ui/hx_table";
import { MemberRowActions } from "#src/ui/member-row-actions";
import { menu_item } from "#src/ui/menu";
import { Menu, Popover } from "#src/ui/menu/components";
import {
  hx_get_members_table_props,
  MEMBERS_TABLE_IDS,
  SelectAllMembersIsland,
} from "#src/ui/organizations/members";
import { row, table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { useContext, type PropsWithChildren } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import {
  MemberContext,
  type BatchAction,
  type Order,
  type Sort,
} from "./context";
import type { get_users_by_organization } from "./get_users_by_organization.query";

//

type QueryResult = Awaited<ReturnType<typeof get_users_by_organization>>;
type HxProps = ReturnType<typeof hx_get_members_table_props>;

// Sits inside the members page's hx-replace-url container: mutations must not rewrite the URL.
const no_replace_url = { "hx-replace-url": "false" } as const;
const selected_members = `#${MEMBERS_TABLE_IDS.table} input[name="user_id"]`;

export async function Table({
  is_editor = true,
  order,
  organization_id,
  pagination,
  query_members_collection,
  sort,
}: {
  is_editor?: boolean;
  order: Order;
  organization_id: number;
  pagination: Pagination;
  query_members_collection: QueryResult;
  sort: Sort | undefined;
}) {
  const { users, count } = query_members_collection;
  const hx_props = hx_get_members_table_props(organization_id);
  const sort_props = { hx_props, order, sort };
  const colspan = is_editor ? 9 : 8;

  return (
    <table
      aria-label="Membres de l’organisation"
      class={table({ class: "group/members" })}
      id={MEMBERS_TABLE_IDS.table}
    >
      <thead>
        {is_editor && (
          <BatchActions colspan={colspan} organization_id={organization_id} />
        )}
        <tr>
          {is_editor && (
            <th>
              <SelectAllMembersIsland />
            </th>
          )}
          <SortHeader {...sort_props} name="given-name">
            Prénom
          </SortHeader>
          <SortHeader {...sort_props} name="family-name">
            Nom
          </SortHeader>
          <SortHeader {...sort_props} name="is-external">
            Interne
          </SortHeader>
          <SortHeader {...sort_props} name="email">
            Email
          </SortHeader>
          <SortHeader {...sort_props} name="job">
            Fonction
          </SortHeader>
          <SortHeader {...sort_props} name="verification-type">
            Type de vérification
          </SortHeader>
          <SortHeader {...sort_props} name="created">
            Dates
          </SortHeader>
          <th>
            {sort && (
              <>
                <input
                  id={MEMBERS_TABLE_IDS.sort}
                  name="sort"
                  type="hidden"
                  value={sort}
                />
                <input
                  id={MEMBERS_TABLE_IDS.order}
                  name="order"
                  type="hidden"
                  value={order}
                />
              </>
            )}
          </th>
        </tr>
      </thead>

      <tbody {...no_replace_url}>
        {users.map((user) => (
          <MemberContext.Provider value={{ user, organization_id, is_editor }}>
            <Row />
          </MemberContext.Provider>
        ))}
      </tbody>

      <Foot
        colspan={colspan}
        count={count}
        hx_query_props={hx_props}
        id={MEMBERS_TABLE_IDS.page}
        pagination={pagination}
      />
    </table>
  );
}

function SortHeader({
  children,
  hx_props,
  name,
  order,
  sort,
}: PropsWithChildren<{
  hx_props: HxProps;
  name: Sort;
  order: Order;
  sort: Sort | undefined;
}>) {
  const current = sort === name ? order : undefined;
  return (
    <th
      aria-sort={
        current === "asc"
          ? "ascending"
          : current === "desc"
            ? "descending"
            : undefined
      }
    >
      <button
        {...hx_props}
        class="flex cursor-pointer items-center gap-1 font-semibold"
        hx-vals={JSON.stringify({
          order: current === "asc" ? "desc" : "asc",
          page: 1,
          sort: name,
        })}
        type="button"
      >
        {children}
        {current === "asc" && <span aria-hidden="true">↑</span>}
        {current === "desc" && <span aria-hidden="true">↓</span>}
      </button>
    </th>
  );
}

const verification_type_labels = [
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
] as const satisfies ReadonlyArray<readonly [BatchAction, string]>;

// Shown only while a row is checked (CSS :has, no script), like Gmail's toolbar.
function BatchActions({
  colspan,
  organization_id,
}: {
  colspan: number;
  organization_id: number;
}) {
  const batch = (action: BatchAction, confirm: string) => ({
    ...urls.organizations[":id"].members.$hx_post({
      param: { id: organization_id },
    }),
    "hx-confirm": confirm,
    "hx-include": selected_members,
    "hx-swap": "none",
    "hx-vals": JSON.stringify({ action }),
    type: "button" as const,
  });
  const action = button({ size: "sm", type: "tertiary" });

  return (
    <tr
      {...no_replace_url}
      class="hidden group-has-[.member-checkbox:checked]/members:table-row"
    >
      <td colspan={colspan}>
        <div
          aria-label="Actions sur les membres sélectionnés"
          class="flex flex-wrap items-center gap-2"
          role="toolbar"
        >
          <Menu>
            <Menu.Trigger>
              {({ target_id, ...props }) => (
                <button
                  {...props}
                  _={`
                    on click
                      toggle @hidden on #${target_id}
                      set @aria-expanded to (#${target_id}'s @hidden is null)
                    end
                    on click from elsewhere or keydown[key is 'Escape'] from window
                      add @hidden to #${target_id}
                      set @aria-expanded to 'false'
                    end
                  `}
                  class={button({
                    class: "group aria-expanded:bg-surface",
                    size: "sm",
                    type: "tertiary",
                  })}
                  type="button"
                >
                  🔄 Type de vérification
                  <svg
                    aria-hidden="true"
                    class="h-4 w-4 transition-transform group-aria-expanded:rotate-180"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222z" />
                  </svg>
                </button>
              )}
            </Menu.Trigger>
            <Menu.Popover>
              {(props) => (
                <Popover {...props} placement="bottom_start">
                  {verification_type_labels.map(([value, label]) => (
                    <button
                      {...batch(
                        value,
                        `Passer les membres sélectionnés en vérification « ${label} » ?`,
                      )}
                      class={menu_item()}
                      role="menuitem"
                    >
                      {label}
                    </button>
                  ))}
                </Popover>
              )}
            </Menu.Popover>
          </Menu>
          <button
            {...batch(
              "internal",
              "Passer les membres sélectionnés en interne ?",
            )}
            class={action}
          >
            ✅ Interne
          </button>
          <button
            {...batch(
              "external",
              "Passer les membres sélectionnés en externe ?",
            )}
            class={action}
          >
            ❌ Externe
          </button>
          <button
            {...batch(
              "remove",
              "Retirer les membres sélectionnés de l’organisation ? Chacun recevra un message de retrait.",
            )}
            class={button({ intent: "danger", size: "sm" })}
          >
            🚪🚶 Retirer de l’organisation
          </button>
        </div>
      </td>
    </tr>
  );
}

function Row({ variants }: { variants?: VariantProps<typeof row> }) {
  const { user, organization_id, is_editor } = useContext(MemberContext);

  return (
    <tr
      aria-label={`Membre ${user.given_name} ${user.family_name} (${user.email})`}
      class={row(variants)}
    >
      {is_editor && (
        <td>
          <input
            aria-label={`Sélectionner ${user.email}`}
            class="member-checkbox"
            name="user_id"
            type="checkbox"
            value={user.id}
          />
        </td>
      )}
      <td>{user.given_name}</td>
      <td>{user.family_name}</td>
      <td>{user.is_external ? "❌" : "✅"}</td>
      <td>
        <a href={urls.users[":id"].$url({ param: { id: user.id } }).pathname}>
          {user.email}
        </a>
      </td>
      <td>{user.job}</td>
      <td>
        {user.needs_official_contact_email_verification ? (
          <span title="En attente d'une vérification officielle de l'adresse e-mail de contact">
            ⚠️
          </span>
        ) : null}
        <VerificationTypeBadge value={user.verification_type} />
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
      <td class="space-x-2 text-end">
        {is_editor && (
          <MemberRowActions
            user_id={user.id}
            organization_id={organization_id}
            is_external={user.is_external}
            verification_type={user.verification_type}
            open_href={
              urls.users[":id"].$url({ param: { id: user.id } }).pathname
            }
          />
        )}
      </td>
    </tr>
  );
}

function VerificationTypeBadge({ value }: { value: string | null }) {
  const parsed = VerificationTypeSchema.safeParse(value);
  if (parsed.success) {
    return <>{parsed.data}</>;
  }
  return <span class="text-red-500">{value}</span>;
}
