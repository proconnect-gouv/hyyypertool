import { hyper_ref } from "@~/app.core/html";
import { Pagination_Schema } from "@~/app.core/schema";
import { copy_text_content_to_clipboard } from "@~/app.ui/button/scripts";
import { Foot } from "@~/app.ui/hx_table";
import { row } from "@~/app.ui/table";
import { urls } from "@~/app.urls";
import {
  GetUnverifiedDomains,
  type GetUnverifiedDomainsDto,
} from "@~/organizations.repository";
import { match } from "ts-pattern";
import { query_schema, usePageRequestContext } from "./context";

//
export async function Page() {
  const {
    var: { $describedby, hx_domains_query_props },
  } = usePageRequestContext();

  return (
    <main
      class="fr-container my-12"
      {...hx_domains_query_props}
      hx-sync="this"
      hx-trigger={[
        `every 22s [document.visibilityState === 'visible']`,
        `visibilitychange[document.visibilityState === 'visible'] from:document`,
      ].join(", ")}
    >
      <h1 id={$describedby}>Liste des domaines à vérifier</h1>
      <Filter />
      <Table />
    </main>
  );
}

function Filter() {
  const {
    req,
    var: { $search, hx_domains_query_props },
  } = usePageRequestContext();
  const { q } = req.valid("query");
  return (
    <form
      {...hx_domains_query_props}
      hx-trigger={[`keyup changed delay:500ms from:#${$search}`].join(", ")}
    >
      <div class="fr-search-bar" role="search">
        <label class="fr-label" for={$search}>
          Recherche
        </label>
        <input
          class="fr-input"
          id={$search}
          name={query_schema.keyof().enum.q}
          placeholder="Recherche"
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

async function Table() {
  const {
    req,
    var: { $describedby, $table, hx_domains_query_props, identite_pg },
  } = usePageRequestContext();
  const { q } = req.valid("query");
  const pagination = match(
    Pagination_Schema.safeParse(req.query(), { path: ["req.query()"] }),
  )
    .with({ success: true }, ({ data }) => data)
    .otherwise(() => Pagination_Schema.parse({}));

  const get_unverified_domains = GetUnverifiedDomains(identite_pg);
  const { count, domains } = await get_unverified_domains({
    pagination: { ...pagination, page: pagination.page - 1 },
    search: q ? String(q) : undefined,
  });

  return (
    <div class="fr-table *:table!" id={$table}>
      <table aria-describedby={$describedby}>
        <thead>
          <tr>
            <th></th>
            <th>Domaine</th>
            <th>Siret</th>
            <th>Dénomination</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {domains.map((domain) => (
            <Row key={`${domain.id}`} domains={domain} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_domains_query_props}
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
  domains: { organization, domain },
}: {
  key?: string;
  domains: GetUnverifiedDomainsDto["domains"][number];
}) {
  const $domain = hyper_ref();
  return (
    <tr
      aria-label={`Domaine non vérifié ${domain} pour ${organization.cached_libelle}`}
      _={`on click set the window's location to '${
        urls.organizations[":id"].$url({
          param: { id: organization.id.toString() },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      key={key}
    >
      <td></td>
      <td>
        <span id={$domain}> {domain} </span>
        <button
          aria-hidden="true"
          class="fr-p-O leading-none"
          title="Copier le nom de domaine"
          _={copy_text_content_to_clipboard(`#${$domain}`)}
        >
          <span
            aria-hidden="true"
            class="fr-icon-device-line"
            style={{ color: "var(--text-disabled-grey)" }}
          />
        </button>
      </td>
      <td>{organization.siret}</td>
      <td>{organization.cached_libelle}</td>
      <td>{organization.id}</td>
      <td class="text-right!">➡️</td>
    </tr>
  );
}
