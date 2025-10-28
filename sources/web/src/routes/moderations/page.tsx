//

import { date_to_dom_string, date_to_string } from "#src/time";
import { hx_include } from "#src/htmx";
import type { Pagination } from "@~/app.core/schema";
import { Foot } from "@~/app.ui/hx_table";
import { row } from "@~/app.ui/table";
import { hx_urls, urls } from "#src/urls";
import {
  moderation_type_to_emoji,
  moderation_type_to_title,
} from "@~/moderations.lib/moderation_type.mapper";
import { GetModerationsList } from "@~/moderations.repository";
import { useContext } from "hono/jsx";
import Moderations_Context, {
  MODERATION_TABLE_ID,
  MODERATION_TABLE_PAGE_ID,
  Page_Query,
  usePageRequestContext,
  type GetModerationsListDTO,
  type Search,
} from "./context";

//

const page_query_keys = Page_Query.keyof();

const hx_moderations_query_props = {
  ...(await hx_urls.moderations.$get()),
  "hx-include": hx_include([
    MODERATION_TABLE_PAGE_ID,
    page_query_keys.enum.day,
    page_query_keys.enum.hide_join_organization,
    page_query_keys.enum.hide_non_verified_domain,
    page_query_keys.enum.processed_requests,
    page_query_keys.enum.search_email,
    page_query_keys.enum.search_siret,
  ]),
  "hx-replace-url": true,
  "hx-select": `#${MODERATION_TABLE_ID} > table`,
  "hx-target": `#${MODERATION_TABLE_ID}`,
};

export function ModerationsPage({
  pagination,
  search,
}: {
  pagination: Pagination;
  search: Search;
}) {
  const {
    var: { identite_pg },
  } = usePageRequestContext();
  const { page, page_size } = pagination;
  const {
    day: date,
    hide_join_organization,
    hide_non_verified_domain,
    processed_requests,
    search_email,
    search_siret,
  } = search;
  const get_moderations_list = GetModerationsList(identite_pg);
  const query_moderations_list = get_moderations_list({
    search: {
      created_at: date,
      email: search_email,
      siret: search_siret,
      show_archived: processed_requests,
      hide_non_verified_domain,
      hide_join_organization,
    },
    pagination: { page: page - 1, take: page_size },
  });
  return (
    <Moderations_Context.Provider
      value={{
        pagination,
        query_moderations_list,
      }}
    >
      <main
        class="fr-container my-12"
        {...hx_moderations_query_props}
        hx-sync="this"
        hx-trigger={[
          `every 33s [document.visibilityState === 'visible']`,
          `visibilitychange[document.visibilityState === 'visible'] from:document`,
        ].join(", ")}
      >
        <h1>Liste des moderations</h1>
        <Filter search={search} />
        <ModerationList_Table />
      </main>
    </Moderations_Context.Provider>
  );
}

//

function Filter({ search }: { search: Search }) {
  const on_search_show_processed_requests = `
  on keyup
    if no my value
      return false
    end

    set #${page_query_keys.enum.processed_requests}.checked to "checked"
    set #${page_query_keys.enum.processed_requests}.value to "true"
  `;
  return (
    <form
      {...hx_moderations_query_props}
      hx-trigger={[
        `input from:#${page_query_keys.enum.day}`,
        `input from:#${page_query_keys.enum.hide_join_organization}`,
        `input from:#${page_query_keys.enum.hide_non_verified_domain}`,
        `input from:#${page_query_keys.enum.processed_requests}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_email}`,
        `keyup changed delay:500ms from:#${page_query_keys.enum.search_siret}`,
      ].join(", ")}
      hx-vals={JSON.stringify({ page: 1 } as Pagination)}
    >
      <div className="grid grid-cols-2 gap-6">
        <div class="fr-input-group">
          <label class="fr-label" for={page_query_keys.enum.search_email}>
            Email
          </label>
          <input
            _={on_search_show_processed_requests}
            class="fr-input"
            id={page_query_keys.enum.search_email}
            name={page_query_keys.enum.search_email}
            placeholder="Recherche par Email"
            value={search.search_email}
          />
        </div>
        <div class="fr-input-group">
          <label class="fr-label" for={page_query_keys.enum.search_siret}>
            Siret
          </label>
          <input
            _={on_search_show_processed_requests}
            class="fr-input"
            id={page_query_keys.enum.search_siret}
            name={page_query_keys.enum.search_siret}
            placeholder="Recherche par SIRET"
            value={search.search_siret}
          />
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            _="on click set @value to my checked"
            id={page_query_keys.enum.processed_requests}
            name={page_query_keys.enum.processed_requests}
            value={search.processed_requests ? "true" : "false"}
            checked={search.processed_requests}
            type="checkbox"
          />
          <label class="fr-label" for={page_query_keys.enum.processed_requests}>
            Voir les demandes traitées
          </label>
        </div>
      </div>
      <div class="fr-fieldset__element">
        <div class="fr-checkbox-group">
          <input
            _="on click set @value to my checked"
            id={page_query_keys.enum.hide_non_verified_domain}
            name={page_query_keys.enum.hide_non_verified_domain}
            value={search.hide_non_verified_domain ? "true" : "false"}
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
            _="on click set @value to my checked"
            id={page_query_keys.enum.hide_join_organization}
            name={page_query_keys.enum.hide_join_organization}
            value={search.hide_join_organization ? "true" : "false"}
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
    </form>
  );
}

async function ModerationList_Table() {
  const { pagination, query_moderations_list } =
    useContext(Moderations_Context);
  const { count, moderations } = await query_moderations_list;
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

function Row({
  key,
  moderation,
}: {
  key?: string;
  moderation: GetModerationsListDTO["moderations"][number];
}) {
  const { user, organization } = moderation;
  return (
    <tr
      aria-label={`Modération ${moderation_type_to_title(moderation.type).toLowerCase()} de ${user.given_name} ${user.family_name} pour ${organization.siret}`}
      key={key}
      _={`on click set the window's location to '${
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
