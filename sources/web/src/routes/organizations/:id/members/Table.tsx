//

import { hx_include } from "#src/htmx";
import type { Pagination } from "#src/schema";
import { Foot } from "#src/ui/hx_table";
import { MemberRowActions } from "#src/ui/member-row-actions";
import { row, table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
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
  is_editor = true,
}: {
  organization_id: number;
  pagination: Pagination;
  query_members_collection: QueryResult;
  describedby: string;
  page_ref: string;
  is_editor?: boolean;
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
    <table class={table()} aria-describedby={describedby}>
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
          <MemberContext.Provider value={{ user, organization_id, is_editor }}>
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
  );
}

function Row({ variants }: { variants?: VariantProps<typeof row> }) {
  const { user, organization_id, is_editor } = useContext(MemberContext);

  return (
    <tr
      aria-label={`Membre ${user.given_name} ${user.family_name} (${user.email})`}
      class={row(variants)}
    >
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
