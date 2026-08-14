//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import type { Pagination } from "#src/schema";
import { date_to_dom_string } from "#src/time";
import { button } from "#src/ui/button";
import { card } from "#src/ui/card";
import { input } from "#src/ui/form";
import { Foot } from "#src/ui/hx_table";
import { Svg } from "#src/ui/icons/components";
import { row, table } from "#src/ui/table";
import { Time } from "#src/ui/time";
import { isSiretValid } from "@proconnect-gouv/proconnect.core/security";
import { urls } from "#src/urls";
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
  is_editor,
}: {
  q?: string | string[];
  pagination: Pagination;
  query_result: QueryResult;
  is_editor: boolean;
}) {
  return (
    <main class="container mx-auto my-12 px-4">
      <div class="mb-6 flex items-baseline justify-between">
        <h1 class="mb-0">Liste des organisations</h1>
        {is_editor && (
          <a href={urls.organizations.new.$url().pathname} class={button()}>
            Ajouter une organisation
          </a>
        )}
      </div>
      <Filter q={q} />
      <Table
        q={q}
        pagination={pagination}
        query_result={query_result}
        is_editor={is_editor}
      />
    </main>
  );
}

function Filter({ q }: { q?: string | string[] }) {
  return (
    <form
      {...hx_organizations_query_props}
      hx-trigger={[
        `keyup changed delay:500ms from:#${$search}`,
        "popstate from:window throttle:1s",
      ].join(", ")}
      hx-vals={JSON.stringify({ page: 1 })}
    >
      <div class="flex items-stretch" role="search">
        <label class="sr-only" for={$search}>
          Recherche
        </label>
        <input
          class={input({ class: "flex-1" })}
          id={$search}
          name={query_schema.keyof().enum.q}
          placeholder="Rechercher par nom ou SIRET"
          value={q}
          type="search"
        />
        <button class={button()} title="Rechercher">
          Rechercher
        </button>
      </div>
    </form>
  );
}

async function Table({
  q,
  pagination,
  query_result,
  is_editor,
}: {
  q?: string | string[];
  pagination: Pagination;
  query_result: QueryResult;
  is_editor: boolean;
}) {
  const { count, organizations } = query_result;
  const searched_siret = isSiretValid(q) ? q : undefined;

  if (count === 0 && searched_siret)
    return <EmptySiretSearch siret={searched_siret} is_editor={is_editor} />;

  return (
    <div id={$table}>
      <table class={table()}>
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

function EmptySiretSearch({
  siret,
  is_editor,
}: {
  siret: string;
  is_editor: boolean;
}) {
  const href = `${urls.organizations.new.$url().pathname}?siret=${siret}`;
  const { base, title, desc } = card();

  return (
    <div class={base({ class: "mb-4 items-center py-12 text-center" })}>
      <span class="text-muted mb-4 text-4xl" aria-hidden="true">
        <Svg name="search" />
      </span>
      <p class={title()}>Aucune organisation trouvée</p>
      <p class={desc({ class: "max-w-prose" })}>
        Aucune organisation n'existe pour le SIRET <strong>{siret}</strong>.
        {is_editor
          ? " Vous pouvez l'ajouter à partir de ses informations légales."
          : ""}
      </p>
      {is_editor && (
        <a class={button({ class: "mt-6" })} href={href}>
          Ajouter cette organisation
        </a>
      )}
    </div>
  );
}
