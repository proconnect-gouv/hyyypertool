//

import { hx_include } from "#src/htmx";
import {
  moderation_type_to_emoji,
  moderation_type_to_title,
} from "#src/lib/moderations";
import { date_to_dom_string, date_to_string } from "#src/time";
import { Foot } from "#src/ui/hx_table";
import { row } from "#src/ui/table";
import { hx_urls, urls } from "#src/urls";
import type { Pagination } from "@~/core/schema";
import { createContext, useContext } from "hono/jsx";
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
  ...(await hx_urls.moderations.$get()),
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
      <ModerationList_Table />
    </main>
  );
}

function Filter({ search, nonce }: { search: Search; nonce?: string }) {
  return (
    <form
      {...hx_moderations_query_props}
      hx-trigger={[
        `input from:#${page_query_keys.enum.day}`,
        `input from:#${page_query_keys.enum.hide_join_organization}`,
        `input from:#${page_query_keys.enum.hide_non_verified_domain}`,
        `input from:#${page_query_keys.enum.processed_requests}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_email}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_moderated_by}`,
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
      <div class="fr-fieldset__element">
        <ProcessedCheckboxIsland
          nonce={nonce}
          id={page_query_keys.enum.processed_requests}
          name={page_query_keys.enum.processed_requests}
          value="true"
          initialChecked={search.processed_requests}
        />
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            id={page_query_keys.enum.hide_non_verified_domain}
            name={page_query_keys.enum.hide_non_verified_domain}
            value={"true"}
            checked={search.hide_non_verified_domain}
            type="checkbox"
          />
          <label
            class="fr-label"
            for={page_query_keys.enum.hide_non_verified_domain}
          >
            Cacher les {moderation_type_to_emoji("non_verified_domain")}{" "}
            {moderation_type_to_title("non_verified_domain")}
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            id={page_query_keys.enum.hide_join_organization}
            name={page_query_keys.enum.hide_join_organization}
            value={"true"}
            checked={search.hide_join_organization}
            type="checkbox"
          />
          <label
            class="fr-label"
            for={page_query_keys.enum.hide_join_organization}
          >
            Cacher les
            {moderation_type_to_emoji("organization_join_block")}{" "}
            {moderation_type_to_title("organization_join_block")}
          </label>
        </div>
      </div>
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
            placeholder="Recherche par email du modérateur"
            initialValue={search.search_moderated_by}
          />
        </div>
      </div>
    </form>
  );
}

async function ModerationList_Table() {
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
          param: { id: moderation.id.toString() },
        }).pathname
      }'`}
      class={row({ is_clickable: true })}
      aria-selected="false"
      style={text_color(new Date(moderation.created_at))}
    >
      <td title={moderation.type}>
        {moderation_type_to_emoji(moderation.type)}
        {moderation_type_to_title(moderation.type)}
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
