//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import type { Pagination } from "#src/schema";
import { button } from "#src/ui/button";
import { input } from "#src/ui/form";
import { Foot } from "#src/ui/hx_table";
import { row, table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import { query_schema } from "./context";
import type { get_users_list } from "./get_users_list.query";

//

const $search = hyper_ref();
const $table = hyper_ref();
const hx_users_list_query_props = {
  ...urls.users.$hx_get({ query: {} }),
  "hx-include": hx_include([$table, $search, query_schema.keyof().enum.page]),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
  "hx-trigger": "popstate from:window throttle:1s",
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
    <main class="container mx-auto my-12 px-4">
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
          placeholder="Recherche"
          type="search"
          value={q}
        />
        <button class={button()} title="Rechercher">
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
    <div id={$table}>
      <table class={table()}>
        <thead>
          <tr>
            <th>Prénom</th>
            <th>Nom</th>
            <th>Email</th>
            <th>Date de création</th>
            <th>Dernière connexion</th>
            <th>Email vérifié le</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <Row key={`${user.id}`} user={user} />
          ))}
        </tbody>
        <Foot
          colspan={7}
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
  const href = urls.users[":id"].$url({
    param: { id: user.id },
  }).pathname;

  return (
    <tr
      aria-label={`Utilisateur ${user.given_name} ${user.family_name} (${user.email})`}
      class={row({
        is_clickable: true,
        class:
          "relative focus-within:outline focus-within:outline-2 focus-within:outline-blue-500",
      })}
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
      <td>
        <a
          class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          href={href}
          aria-label={`Utilisateur ${user.given_name} ${user.family_name} (${user.email})`}
        >
          {user.id}
        </a>
      </td>
    </tr>
  );
}
