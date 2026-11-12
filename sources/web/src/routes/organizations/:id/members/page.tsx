//

import { hx_trigger_from_body } from "#src/htmx";
import { ORGANISATION_EVENTS } from "#src/lib/organizations";
import type { Pagination } from "#src/schema";
import { button } from "#src/ui/button";
import { input } from "#src/ui/form";
import {
  hx_get_members_table_props,
  MEMBERS_TABLE_IDS,
} from "#src/ui/organizations/members";
import { urls } from "#src/urls";
import type { Order, Sort } from "./context";
import type { get_users_by_organization } from "./get_users_by_organization.query";
import type { get_organization_by_id } from "../get_organization_by_id.query";
import { Table } from "./Table";

//

type Organization = Awaited<ReturnType<typeof get_organization_by_id>>;

export default async function Page({
  is_editor,
  order,
  organization,
  pagination,
  q,
  query_members_collection,
  sort,
}: {
  is_editor: boolean;
  order: Order;
  organization: Organization;
  pagination: Pagination;
  q: string;
  query_members_collection: Awaited<
    ReturnType<typeof get_users_by_organization>
  >;
  sort: Sort | undefined;
}) {
  const hx_props = hx_get_members_table_props(organization.id);

  return (
    <main class="container mx-auto my-12 px-4">
      <a
        href={
          urls.organizations[":id"].$url({ param: { id: organization.id } })
            .pathname
        }
      >
        ← {organization.cached_libelle} ({organization.siret})
      </a>
      <h1>👥 Membres de l’organisation</h1>

      <form
        {...hx_props}
        hx-replace-url="true"
        hx-target={`#${MEMBERS_TABLE_IDS.table}`}
        hx-swap="outerHTML"
        hx-trigger={[
          `keyup changed delay:500ms from:#${MEMBERS_TABLE_IDS.search}`,
          "submit",
        ].join(", ")}
        hx-vals={JSON.stringify({ page: 1 })}
      >
        <div class="flex items-stretch" role="search">
          <label class="sr-only" for={MEMBERS_TABLE_IDS.search}>
            Rechercher un membre
          </label>
          <input
            class={input({ class: "flex-1" })}
            id={MEMBERS_TABLE_IDS.search}
            name="q"
            placeholder="Rechercher par nom, prénom ou email"
            type="search"
            value={q}
          />
          <button class={button()} title="Rechercher">
            Rechercher
          </button>
        </div>
      </form>

      <div
        {...hx_props}
        hx-replace-url="true"
        hx-target="this"
        hx-trigger={hx_trigger_from_body([
          ORGANISATION_EVENTS.enum.MEMBERS_UPDATED,
        ]).join(", ")}
      >
        <Table
          is_editor={is_editor}
          order={order}
          organization_id={organization.id}
          pagination={pagination}
          query_members_collection={query_members_collection}
          sort={sort}
        />
      </div>
    </main>
  );
}
