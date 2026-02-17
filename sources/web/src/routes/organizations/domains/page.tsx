import { CopyButton } from "#src/ui/button/components";
import { Foot } from "#src/ui/hx_table";
import { row } from "#src/ui/table";
import { urls } from "#src/urls";
import type { Pagination } from "@~/core/schema";
import { createContext, useContext } from "hono/jsx";
import type { get_unverified_domains } from "./get_unverified_domains.query";
import { query_schema } from "./index";

//

type UnverifiedDomainsDto = Awaited<ReturnType<typeof get_unverified_domains>>;

interface PageContext {
  $describedby: string;
  $search: string;
  $table: string;
  hx_domains_query_props: Record<string, any>;
  query: { q?: string | string[] };
  pagination: Pagination;
  count: number;
  domains: UnverifiedDomainsDto["domains"];
}

const PageContext = createContext<PageContext | undefined>(undefined);

export async function Page(props: PageContext) {
  return (
    <PageContext.Provider value={props}>
      <Main />
    </PageContext.Provider>
  );
}

function Main() {
  const context = useContext(PageContext)!;
  const { $describedby, hx_domains_query_props } = context;

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
  const context = useContext(PageContext)!;
  const { $search, hx_domains_query_props, query } = context;
  const { q } = query;
  return (
    <form
      {...hx_domains_query_props}
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

function Table() {
  const context = useContext(PageContext)!;
  const {
    $describedby,
    $table,
    hx_domains_query_props,
    pagination,
    count,
    domains,
  } = context;

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
  domains: { organization, domain: domainName },
}: {
  key?: string;
  domains: UnverifiedDomainsDto["domains"][number];
}) {
  return (
    <tr
      aria-label={`Domaine non vérifié ${domainName} pour ${organization.cached_libelle}`}
      onclick={`window.location = '${
        urls.organizations[":id"].$url({
          param: { id: organization.id },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      key={key}
    >
      <td></td>
      <td>
        <span>{domainName}</span>
        <CopyButton
          class="fr-p-O leading-none"
          text={domainName}
          title="Copier le nom de domaine"
          variant={{ size: "sm", type: "tertiary" }}
        />
      </td>
      <td>{organization.siret}</td>
      <td>{organization.cached_libelle}</td>
      <td>{organization.id}</td>
      <td class="text-right!">➡️</td>
    </tr>
  );
}
