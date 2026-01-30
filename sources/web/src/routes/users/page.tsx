//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import { Foot } from "#src/ui/hx_table";
import { row } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { hx_urls } from "#src/urls";
import type { Pagination } from "@~/core/schema";
import { query_schema } from "./context";
import type { get_users_list } from "./get_users_list.query";

//

const $search = hyper_ref();
const $table = hyper_ref();
const hx_users_list_query_props = {
  ...hx_urls.users.$get({ query: {} }),
  "hx-include": hx_include([$table, $search, query_schema.keyof().enum.page]),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
};

//

type QueryResult = Awaited<ReturnType<typeof get_users_list>>;
type User = QueryResult["users"][number];

export default async function Page({
  q,
  pagination,
  query_result: queryResult,
}: {
  q?: string | string[];
  pagination: Pagination;
  query_result: QueryResult;
}) {
  return (
    <main class="fr-container my-12">
      <h1>Liste des utilisateurs</h1>
      <Filter q={q} />
      <Table pagination={pagination} query_result={queryResult} />
    </main>
  );
}

//

function Filter({ q }: { q?: string | string[] }) {
  return (
    <form
      {...hx_users_list_query_props}
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

async function Table({
  pagination,
  query_result: queryResult,
}: {
  pagination: Pagination;
  query_result: QueryResult;
}) {
  const { count, users } = queryResult;

  return (
    <div class="fr-table *:table!" id={$table}>
      <table>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Date de création</th>
            <th>Dernière connexion</th>
            <th>Email vérifié le</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Row key={`${user.id}`} user={user} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_users_list_query_props}
          id={$table}
          name={query_schema.keyof().enum.page}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({ key, user }: { key?: string; user: User }) {
  return (
    <tr
      aria-label={`Utilisateur ${user.given_name} ${user.family_name} (${user.email})`}
      onclick={`window.location = '${
        hx_urls.users[":id"].$url({
          param: { id: user.id },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      key={key}
    >
      <td>{user.given_name}</td>
      <td>{user.family_name}</td>
      <td>{user.email}</td>
      <td>
        <LocalTime date={user.created_at} />
      </td>
      <td>
        <LocalTime date={user.last_sign_in_at} />
      </td>
      <td>
        <LocalTime date={user.email_verified_at} />
      </td>
      <td>{user.id}</td>
      <td class="text-right!">➡️</td>
    </tr>
  );
}
