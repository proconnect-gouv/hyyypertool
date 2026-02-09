//

import { hx_include } from "#src/htmx";
import {
  moderation_type_to_emoji,
  moderation_type_to_title,
} from "#src/lib/moderations";
import type { Pagination } from "#src/schema";
import { date_to_string } from "#src/time";
import { badge } from "#src/ui";
import { button } from "#src/ui/button";
import { fieldset, input_group, label, tags_group } from "#src/ui/form";
import { Foot } from "#src/ui/hx_table";
import {
  HideTypeCheckboxIsland,
  ProcessedCheckboxIsland,
  SearchBarIsland,
  SearchDateIsland,
  SearchEmailIsland,
  SearchModeratedByIsland,
  SearchSiretIsland,
} from "#src/ui/moderations/Filter";
import { row, table } from "#src/ui/table";
import { urls } from "#src/urls";
import {
  ModerationStatusSchema,
  ModerationTypeSchema,
} from "@~/identite-proconnect/types";
import { createContext, useContext } from "hono/jsx";
import { match } from "ts-pattern";
import {
  MODERATION_TABLE_ID,
  MODERATION_TABLE_PAGE_ID,
  type Search,
} from "./context";
import type { get_moderations_list } from "./get_moderations_list.query";
import { serialize_q } from "./parse_q";

//

type QueryResult = Awaited<ReturnType<typeof get_moderations_list>>;
type Moderation = QueryResult["moderations"][number];

// Base HTMX props shared by poll (main) and user actions (form).
// Only the form gets hx-replace-url — the poll must NOT update the URL
// because it can race with user actions and clobber the URL with a stale q.
const hx_moderations_base_props = {
  ...urls.moderations.$hx_get(),
  "hx-include": hx_include([MODERATION_TABLE_PAGE_ID, "q"]),
  "hx-select": `#${MODERATION_TABLE_ID} > table`,
  "hx-target": `#${MODERATION_TABLE_ID}`,
};
const Moderations_Context = createContext({
  moderators_list: [] as string[],
  sp_names_list: [] as string[],
  query_result: {} as QueryResult,
  pagination: {} as Pagination,
});

export function ModerationsPage({
  moderators_list,
  pagination,
  poll_interval,
  search,
  sp_names_list,
  query_result,
  nonce,
}: {
  moderators_list: string[];
  pagination: Pagination;
  poll_interval: number;
  search: Search;
  sp_names_list: string[];
  query_result: QueryResult;
  nonce?: string;
}) {
  return (
    <Moderations_Context.Provider
      value={{
        moderators_list,
        sp_names_list,
        pagination,
        query_result,
      }}
    >
      <Main search={search} nonce={nonce} poll_interval={poll_interval} />
    </Moderations_Context.Provider>
  );
}

//

function Main({
  search,
  nonce,
  poll_interval,
}: {
  search: Search;
  nonce?: string;
  poll_interval: number;
}) {
  return (
    <main class="max-w-7xl mx-auto px-4 my-12">
      <h1>Liste des moderations</h1>
      <Filter search={search} nonce={nonce} poll_interval={poll_interval} />
      <Table />
    </main>
  );
}

function Filter({
  search,
  nonce,
  poll_interval,
}: {
  search: Search;
  nonce?: string;
  poll_interval: number;
}) {
  const { moderators_list, sp_names_list } = useContext(Moderations_Context);
  return (
    <form
      {...hx_moderations_base_props}
      hx-replace-url="true"
      hx-sync="this:abort"
      hx-trigger={[
        "change from:#q",
        `every ${poll_interval}s [document.visibilityState === 'visible'] throttle:1s`,
        `visibilitychange[document.visibilityState === 'visible'] from:document throttle:1s`,
        `popstate from:window throttle:1s`,
      ].join(", ")}
    >
      <SearchBarIsland
        nonce={nonce}
        initial_q={serialize_q(search)}
        moderators_list={moderators_list}
        sp_names_list={sp_names_list}
      />
      <div class="mt-4 grid grid-cols-2 gap-6">
        <div class={input_group()}>
          <label class={label()} for="filter-email">
            Email
          </label>
          <SearchEmailIsland nonce={nonce} placeholder="Recherche par Email" />
        </div>
        <div class={input_group()}>
          <label class={label()} for="filter-siret">
            Siret
          </label>
          <SearchSiretIsland nonce={nonce} placeholder="Recherche par SIRET" />
        </div>
      </div>
      <ul class={tags_group()}>
        <li>
          <ProcessedCheckboxIsland nonce={nonce} />
        </li>
        <li>
          <HideTypeCheckboxIsland
            nonce={nonce}
            qualifier="non_verified_domain"
            label={`Cacher les ${moderation_type_to_emoji("non_verified_domain")}${moderation_type_to_title("non_verified_domain")}`}
          />
        </li>
        <li>
          <HideTypeCheckboxIsland
            nonce={nonce}
            qualifier="organization_join_block"
            label={`Cacher les ${moderation_type_to_emoji("organization_join_block")}${moderation_type_to_title("organization_join_block")}`}
          />
        </li>
      </ul>

      <div class={fieldset().element()}>
        <div class={input_group()}>
          <label class={label()} for="filter-moderated-by">
            Filtrer par jours
          </label>
          <SearchDateIsland nonce={nonce} />
        </div>
      </div>

      <div class={fieldset().element()}>
        <div class={input_group()}>
          <label class={label()} for="filter-moderated-by">
            Filtrer par modérateur
          </label>
          <SearchModeratedByIsland
            nonce={nonce}
            moderators_list={moderators_list}
          />
        </div>
      </div>

      <div class={fieldset().element()}>
        <a class={button()} href={urls.moderations.$url().pathname}>
          Réinitialiser la recherche, les filtres et les tris
        </a>
      </div>
    </form>
  );
}

async function Table() {
  const { pagination, query_result } = useContext(Moderations_Context);
  const { count, moderations } = query_result;
  return (
    <div class={table()} id={MODERATION_TABLE_ID}>
      <table>
        <thead>
          <tr>
            <th>Statut</th>
            <th>Date de création</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Organisation cible</th>
            <th>Service</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {moderations.map((moderation) => (
            <Row key={`${moderation.id}`} moderation={moderation} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={{
            ...hx_moderations_base_props,
            "hx-replace-url": true,
          }}
          id={MODERATION_TABLE_PAGE_ID}
          name="page"
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({ key, moderation }: { key?: string; moderation: Moderation }) {
  const { user, organization } = moderation;
  const href = urls.moderations[":id"].$url({
    param: { id: moderation.id },
  }).pathname;

  return (
    <tr
      key={key}
      class={row({
        is_clickable: true,
        class:
          "relative focus-within:outline focus-within:outline-2 focus-within:outline-blue-500",
      })}
      style={text_color(new Date(moderation.created_at))}
    >
      <td title={moderation.type}>
        <StatusCell
          moderation_status={moderation.status}
          moderation_type={moderation.type}
        />
      </td>
      <td>{date_to_string(new Date(moderation.created_at))}</td>
      <td
        class="max-w-32 overflow-hidden text-ellipsis"
        title={user.family_name ?? ""}
      >
        {user.family_name}
      </td>
      <td class="break-words">{user.given_name}</td>
      <td class="max-w-48 overflow-hidden text-ellipsis" title={user.email}>
        {user.email}
      </td>
      <td class="break-words">{organization.siret}</td>
      <td class="break-words">{moderation.sp_name}</td>
      <td>
        <a
          class="after:absolute after:inset-0 after:content-[''] focus:outline-none"
          href={href}
          aria-label={`Modération ${moderation_type_to_title(moderation.type).toLowerCase()} de ${user.given_name} ${user.family_name} pour ${organization.siret}`}
        >
          {moderation.id}
        </a>
      </td>
    </tr>
  );
}

function StatusCell({
  moderation_status,
  moderation_type,
}: {
  moderation_status: string;
  moderation_type: string;
}) {
  const { data: type } = ModerationTypeSchema.safeParse(moderation_type);
  const { data: status } = ModerationStatusSchema.safeParse(moderation_status);
  if (type === undefined || status === undefined || status === "unknown")
    return (
      <>
        {moderation_type_to_emoji(moderation_type)}
        {moderation_type_to_title(moderation_type)}
      </>
    );

  return match({ status })
    .with({ status: "accepted" }, () => (
      <span class={badge({ intent: "success" })}>Accepté</span>
    ))
    .with({ status: "pending" }, () => (
      <span class={badge()}>
        {moderation_type_to_emoji(type)}
        {moderation_type_to_title(type)}
      </span>
    ))
    .with({ status: "rejected" }, () => (
      <span class={badge({ intent: "error" })}>Rejeté</span>
    ))
    .with({ status: "reopened" }, () => (
      <span class={badge({ intent: "warning" })}>Ré-ouvert</span>
    ))
    .exhaustive();
}

// \from https://youmightnotneed.com/date-fns#getDayOfYear
// Might want to use https://date-fns.org/v3.3.1/docs/getDayOfYear
const DAY_IN_MS = 1000 * 60 * 60 * 24;
const getDayOfYear = (date: Date) =>
  (Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) -
    Date.UTC(date.getFullYear(), 0, 0)) /
  DAY_IN_MS;

function text_color(date: Date) {
  const diff = getDayOfYear(new Date()) - getDayOfYear(date);
  const hue = Math.floor(diff * 111).toString(10);
  const saturation = "75%";
  const lightness = "33%";
  return `color : hsl(${hue},${saturation},${lightness});`;
}
