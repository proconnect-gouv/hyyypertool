//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import type { Pagination } from "#src/schema";
import { fieldset, input, label, search_bar, select } from "#src/ui";
import { badge } from "#src/ui/badge";
import { button } from "#src/ui/button";
import { Foot } from "#src/ui/hx_table";
import { Svg } from "#src/ui/icons/components";
import { row, table } from "#src/ui/table";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import { roles } from "@~/hyyyperbase";
import { query_schema } from "./context";
import type { get_team_list } from "./get_team_list.query";

//

const $search = hyper_ref();
const $table = hyper_ref();
const hx_team_list_query_props = {
  ...urls.admin.team.$hx_get({ query: {} }),
  "hx-include": hx_include([$table, $search, query_schema.keyof().enum.page]),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
};

//

type QueryResult = Awaited<ReturnType<typeof get_team_list>>;
type Member = QueryResult["members"][number];

export default function Page({
  current_user_id,
  q,
  pagination,
  query_result,
}: {
  current_user_id: number;
  q?: string | string[];
  pagination: Pagination;
  query_result: QueryResult;
}) {
  return (
    <main class="container mx-auto my-12 px-4">
      <h1>Gestion de l'equipe</h1>
      <AddMember />
      <Filter q={q} />
      <Table
        current_user_id={current_user_id}
        pagination={pagination}
        query_result={query_result}
      />
    </main>
  );
}

//

function AddMember() {
  const { base, element } = fieldset({ inline: true });
  return (
    <form
      class="mb-6 flex items-end gap-4 rounded border border-gray-200 bg-gray-50 p-4"
      hx-post={urls.admin.team.$url().pathname}
      hx-swap="none"
    >
      <fieldset class={base()}>
        <div class={element()}>
          <label class={label()} for="new-email">
            Email
          </label>
          <input
            class={input()}
            id="new-email"
            name="email"
            placeholder="email@example.gouv.fr"
            required
            type="email"
          />
        </div>
        <div class={element()}>
          <label class={label()} for="new-role">
            Role
          </label>
          <select class={select()} id="new-role" name="role">
            {roles.options.map((r) => (
              <option value={r} selected={r === "visitor"}>
                {r}
              </option>
            ))}
          </select>
        </div>
        <div class={element()}>
          <button class={button()} type="submit">
            Ajouter
          </button>
        </div>
      </fieldset>
    </form>
  );
}

function Filter({ q }: { q?: string | string[] }) {
  const { base, input: searchInput } = search_bar();
  return (
    <form
      {...hx_team_list_query_props}
      hx-trigger={[
        `keyup changed delay:500ms from:#${$search}`,
        "popstate from:window throttle:1s",
      ].join(", ")}
      hx-vals={JSON.stringify({ page: 1 })}
    >
      <div class={base()} role="search">
        <input
          class={searchInput()}
          id={$search}
          name={query_schema.keyof().enum.q}
          placeholder="Rechercher par email ou role"
          value={q}
          type="search"
        />
        <button class={button()} title="Rechercher" type="submit">
          <Svg name="search" />
        </button>
      </div>
    </form>
  );
}

function Table({
  current_user_id,
  pagination,
  query_result,
}: {
  current_user_id: number;
  pagination: Pagination;
  query_result: QueryResult;
}) {
  const { count, members } = query_result;

  return (
    <div id={$table}>
      <table class={table()}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Role</th>
            <th>Statut</th>
            <th>Derniere mise a jour</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) =>
            member.id === current_user_id ? (
              <SelfRow key={`${member.id}`} member={member} />
            ) : (
              <MemberRow key={`${member.id}`} member={member} />
            ),
          )}
        </tbody>
        <Foot
          colspan={5}
          count={count}
          hx_query_props={hx_team_list_query_props}
          id={$table}
          name={query_schema.keyof().enum.page}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function SelfRow({ key, member }: { key?: string; member: Member }) {
  return (
    <tr aria-label={member.email} class={row()} key={key}>
      <td>
        {member.email}
        <span class="ml-1 text-xs text-gray-400">(vous)</span>
      </td>
      <td>
        <RoleBadge role={member.role} />
      </td>
      <td>
        <span class={badge({ intent: "success" })}>Actif</span>
      </td>
      <td>
        <LocalTime date={member.updated_at} />
      </td>
      <td>
        <span class="text-sm text-gray-400">—</span>
      </td>
    </tr>
  );
}

function MemberRow({ key, member }: { key?: string; member: Member }) {
  const is_disabled = !!member.disabled_at;
  const $role_select = `role-select-${member.id}`;

  return (
    <tr
      aria-label={member.email}
      class={row({ class: is_disabled ? "opacity-50" : "" })}
      key={key}
    >
      <td>{member.email}</td>
      <td>
        <div class="flex items-center gap-2">
          <select
            aria-label="role"
            class={select()}
            id={$role_select}
            name="role"
          >
            {roles.options.map((r) => (
              <option value={r} selected={r === member.role}>
                {r}
              </option>
            ))}
          </select>
          <button
            class={button({ size: "sm" })}
            {...urls.admin.team[":id"].$hx_patch({ param: { id: member.id } })}
            hx-include={`#${$role_select}`}
            hx-swap="none"
          >
            OK
          </button>
        </div>
      </td>
      <td>
        <StatusBadge disabled={is_disabled} />
      </td>
      <td>
        <LocalTime date={member.updated_at} />
      </td>
      <td>
        <ToggleButton id={member.id} disabled={is_disabled} />
      </td>
    </tr>
  );
}

function StatusBadge({ disabled }: { disabled: boolean }) {
  return disabled ? (
    <span class={badge({ intent: "error" })}>Desactive</span>
  ) : (
    <span class={badge({ intent: "success" })}>Actif</span>
  );
}

function ToggleButton({ id, disabled }: { id: number; disabled: boolean }) {
  return disabled ? (
    <button
      class={button({ intent: "success", size: "sm" })}
      {...urls.admin.team[":id"].enable.$hx_patch({ param: { id } })}
      hx-swap="none"
      hx-confirm="Reactiver ce membre ?"
    >
      Reactiver
    </button>
  ) : (
    <button
      class={button({ intent: "warning", size: "sm" })}
      {...urls.admin.team[":id"].disable.$hx_patch({ param: { id } })}
      hx-swap="none"
      hx-confirm="Desactiver ce membre ?"
    >
      Desactiver
    </button>
  );
}

function RoleBadge({ role }: { role: string }) {
  const intent =
    role === "admin" ? "info" : role === "moderator" ? "warning" : undefined;
  return <span class={badge({ intent })}>{role}</span>;
}
