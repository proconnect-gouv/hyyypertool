//

import type { AppEnv_Context } from "#src/config";
import { hx_include } from "#src/htmx";
import {
  moderation_type_to_emoji,
  moderation_type_to_title,
} from "#src/lib/moderations";
import { date_to_dom_string, date_to_string } from "#src/time";
import { badge } from "#src/ui";
import { Foot } from "#src/ui/hx_table";
import { row } from "#src/ui/table";
import { tag } from "#src/ui/tag";
import { urls } from "#src/urls";
import type { Pagination } from "@~/core/schema";
import {
  ModerationStatusSchema,
  ModerationTypeSchema,
} from "@~/identite-proconnect/types";
import { createContext, useContext } from "hono/jsx";
import { useRequestContext } from "hono/jsx-renderer";
import { match } from "ts-pattern";
import {
  MODERATION_TABLE_ID,
  MODERATION_TABLE_PAGE_ID,
  query_schema,
  type Search,
} from "./context";
import type { get_moderations_list } from "./get_moderations_list.query";
import { ProcessedCheckboxIsland } from "./ProcessedCheckboxIsland";
import { SearchEmailIsland } from "./SearchEmailIsland";
import { SearchModeratedByIsland } from "./SearchModeratedByIsland";
import { SearchSiretIsland } from "./SearchSiretIsland";

//

type QueryResult = Awaited<ReturnType<typeof get_moderations_list>>;
type Moderation = QueryResult["moderations"][number];

const page_query_keys = query_schema.keyof();

const hx_moderations_query_props = {
  ...urls.moderations.$hx_get(),
  "hx-include": hx_include([
    MODERATION_TABLE_PAGE_ID,
    page_query_keys.enum.day,
    page_query_keys.enum.hide_join_organization,
    page_query_keys.enum.hide_non_verified_domain,
    page_query_keys.enum.processed_requests,
    page_query_keys.enum.search_email,
    page_query_keys.enum.search_moderated_by,
    page_query_keys.enum.search_siret,
  ]),
  "hx-replace-url": true,
  "hx-select": `#${MODERATION_TABLE_ID} > table`,
  "hx-target": `#${MODERATION_TABLE_ID}`,
};
const Moderations_Context = createContext({
  query_result: {} as QueryResult,
  pagination: {} as Pagination,
});

export function ModerationsPage({
  pagination,
  search,
  query_result,
  nonce,
}: {
  pagination: Pagination;
  search: Search;
  query_result: QueryResult;
  nonce?: string;
}) {
  return (
    <Moderations_Context.Provider
      value={{
        pagination,
        query_result,
      }}
    >
      <Main search={search} nonce={nonce} />
    </Moderations_Context.Provider>
  );
}

//

function Main({ search, nonce }: { search: Search; nonce?: string }) {
  return (
    <main
      class="fr-container my-12"
      {...hx_moderations_query_props}
      hx-sync="this:abort"
      hx-trigger={[
        `every 33s [document.visibilityState === 'visible'] throttle:1s`,
        `visibilitychange[document.visibilityState === 'visible'] from:document throttle:1s`,
      ].join(", ")}
    >
      <h1>Liste des moderations</h1>
      <Filter search={search} nonce={nonce} />
      <Table />
    </main>
  );
}

function Filter({ search, nonce }: { search: Search; nonce?: string }) {
  const {
    var: { config },
  } = useRequestContext<AppEnv_Context>();

  return (
    <form
      {...hx_moderations_query_props}
      hx-trigger={[
        `input from:#${page_query_keys.enum.day}`,
        `input from:#${page_query_keys.enum.hide_join_organization}`,
        `input from:#${page_query_keys.enum.hide_non_verified_domain}`,
        `input from:#${page_query_keys.enum.processed_requests}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_email}`,
        `change from:#${page_query_keys.enum.search_moderated_by}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_siret}`,
      ].join(", ")}
      hx-vals={JSON.stringify({ page: 1 } as Pagination)}
    >
      <div className="grid grid-cols-2 gap-6">
        <div class="fr-input-group">
          <label class="fr-label" for={page_query_keys.enum.search_email}>
            Email
          </label>
          <SearchEmailIsland
            id={page_query_keys.enum.search_email}
            name={page_query_keys.enum.search_email}
            nonce={nonce}
            placeholder="Recherche par Email"
            initialValue={search.search_email}
          />
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for={page_query_keys.enum.search_siret}>
            Siret
          </label>
          <SearchSiretIsland
            id={page_query_keys.enum.search_siret}
            name={page_query_keys.enum.search_siret}
            nonce={nonce}
            placeholder="Recherche par SIRET"
            initialValue={search.search_siret}
          />
        </div>
      </div>
      <ul class="fr-tags-group">
        <li>
          <ProcessedCheckboxIsland
            nonce={nonce}
            id={page_query_keys.enum.processed_requests}
            name={page_query_keys.enum.processed_requests}
            value="true"
            initialChecked={search.processed_requests}
          />
        </li>
        <li>
          <label class={tag()}>
            <input
              checked={search.hide_non_verified_domain}
              class="peer"
              hidden
              id={page_query_keys.enum.hide_non_verified_domain}
              name={page_query_keys.enum.hide_non_verified_domain}
              type="checkbox"
              value={"true"}
            />
            <span
              class="fr-icon-eye-line fr-icon--sm peer-checked:hidden"
              aria-hidden="true"
            />
            <span
              class="fr-icon-eye-off-line fr-icon--sm hidden peer-checked:inline"
              aria-hidden="true"
            />
            {moderation_type_to_title("non_verified_domain")}
          </label>
        </li>
        <li>
          <label class={tag()}>
            <input
              checked={search.hide_join_organization}
              class="peer"
              hidden
              id={page_query_keys.enum.hide_join_organization}
              name={page_query_keys.enum.hide_join_organization}
              type="checkbox"
              value={"true"}
            />
            <span
              class="fr-icon-eye-line fr-icon--sm peer-checked:hidden"
              aria-hidden="true"
            />
            <span
              class="fr-icon-eye-off-line fr-icon--sm hidden peer-checked:inline"
              aria-hidden="true"
            />
            {moderation_type_to_title("organization_join_block")}
          </label>
        </li>
      </ul>
      <div class="fr-fieldset__element">
        <div class="fr-input-group">
          <label class="fr-label" for={page_query_keys.enum.day}>
            Filtrer par jours
          </label>
          <input
            class="fr-input"
            id={page_query_keys.enum.day}
            max={date_to_dom_string(new Date())}
            name={page_query_keys.enum.day}
            type="date"
            value={date_to_dom_string(search.day)}
          />
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-input-group">
          <label
            class="fr-label"
            for={page_query_keys.enum.search_moderated_by}
          >
            Filtrer par modérateur
          </label>
          <SearchModeratedByIsland
            id={page_query_keys.enum.search_moderated_by}
            name={page_query_keys.enum.search_moderated_by}
            nonce={nonce}
            initialValue={search.search_moderated_by}
            allowedUsers={config.ALLOWED_USERS.split(",").filter(Boolean)}
          />
        </div>
      </div>
    </form>
  );
}

async function Table() {
  const { pagination, query_result } = useContext(Moderations_Context);
  const { count, moderations } = query_result;
  return (
    <div class="fr-table *:table!" id={MODERATION_TABLE_ID}>
      <table>
        <thead>
          <tr>
            <th>Statut</th>
            <th>Date de création</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
            <th>Organisation cible</th>
            <th>ID</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {moderations.map((moderation) => (
            <Row key={`${moderation.id}`} moderation={moderation} />
          ))}
        </tbody>
        <Foot
          count={count}
          hx_query_props={hx_moderations_query_props}
          id={MODERATION_TABLE_PAGE_ID}
          name={page_query_keys.enum.page}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({ key, moderation }: { key?: string; moderation: Moderation }) {
  const { user, organization } = moderation;
  return (
    <tr
      aria-label={`Modération ${moderation_type_to_title(moderation.type).toLowerCase()} de ${user.given_name} ${user.family_name} pour ${organization.siret}`}
      key={key}
      onclick={`window.location = '${
        urls.moderations[":id"].$url({
          param: { id: moderation.id },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      aria-selected="false"
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
      <td>{moderation.id}</td>
      <td>
        {moderation.moderated_at ? (
          <time
            datetime={moderation.moderated_at}
            title={moderation.moderated_at}
          >
            ✅
          </time>
        ) : (
          "➡️"
        )}
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
