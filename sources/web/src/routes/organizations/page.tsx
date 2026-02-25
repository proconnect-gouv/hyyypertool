//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import { date_to_dom_string } from "#src/time";
import { Foot } from "#src/ui/hx_table";
import { row } from "#src/ui/table";
import { Time } from "#src/ui/time";
import { urls } from "#src/urls";
import type { Pagination } from "@~/core/schema";
import { query_schema } from "./context";
import type { get_organizations_list } from "./get_organizations_list.query";

//

const $table = hyper_ref();
const $search = hyper_ref();

const hx_organizations_query_props = {
  ...urls.organizations.$hx_get({ query: {} }),
  "hx-include": hx_include([$table, $search, query_schema.keyof().enum.page]),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
};

//

type QueryResult = Awaited<ReturnType<typeof get_organizations_list>>;
type Organization = QueryResult["organizations"][number];

export default async function Page({
  q,
  pagination,
  query_result,
}: {
  q?: string | string[];
  pagination: Pagination;
  query_result: QueryResult;
}) {
  return (
    <main class="fr-container my-12">
      <h1>Liste des organisations</h1>
      <Filter q={q} />
      <Table pagination={pagination} query_result={query_result} />
    </main>
  );
}

function Filter({ q }: { q?: string | string[] }) {
  return (
    <form
      {...hx_organizations_query_props}
      hx-trigger={[`keyup changed delay:500ms from:#${$search}`].join(", ")}
      hx-vals={JSON.stringify({ page: 1 })}
    >
      <div class="fr-search-bar" role="search">
        <label class="fr-label" for={$search}>
          Recherche
        </label>
        <input
          class="fr-input"
          id={$search}
          name={query_schema.keyof().enum.q}
          placeholder="Rechercher par nom ou SIRET"
          value={q}
          type="search"
        />
        <button class="fr-btn" title="Rechercher">
          Rechercher
        </button>
      </div>
    </form>
  );
}

async function Table({
  pagination,
  query_result,
}: {
  pagination: Pagination;
  query_result: QueryResult;
}) {
  const { count, organizations } = query_result;

  return (
    <div class="fr-table *:table!" id={$table}>
      <table>
        <thead>
          <tr>
            <th>Date de création</th>
            <th>Siret</th>
            <th>Dénomination</th>
            <th>Domaines</th>
            <th>Code officiel géographique</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {organizations.map((organization) => (
            <Row key={`${organization.id}`} organization={organization} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_organizations_query_props}
          id={$table}
          name={query_schema.keyof().enum.page}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({
  key,
  organization,
}: {
  key?: string;
  organization: Organization;
}) {
  const href = urls.organizations[":id"].$url({
    param: { id: organization.id },
  }).pathname;

  return (
    <tr
      aria-label={`Organisation ${organization.cached_libelle} (${organization.siret})`}
      class={row({
        is_clickable: true,
        class:
          "relative focus-within:outline focus-within:outline-2 focus-within:outline-blue-500",
      })}
      key={key}
    >
      <td>
        <Time date={organization.created_at}>
          {date_to_dom_string(new Date(organization.created_at))}
        </Time>
      </td>
      <td>{organization.siret}</td>
      <td>{organization.cached_libelle}</td>
      <td>
        {organization.email_domains.map((domain) => domain.domain).join(", ")}
      </td>
      <td>{organization.cached_code_officiel_geographique}</td>
      <td>
        <a
          class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          href={href}
          aria-label={`Organisation ${organization.cached_libelle} (${organization.siret})`}
        >
          {organization.id}
        </a>
      </td>
    </tr>
  );
}
