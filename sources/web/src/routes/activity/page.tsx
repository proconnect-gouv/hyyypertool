//

import { hyper_ref } from "#src/html";
import { hx_include } from "#src/htmx";
import type { ParsedActivityRow } from "#src/lib/activities";
import type { Pagination } from "#src/schema";
import { ActivityLabel, Actor } from "#src/ui/activities";
import { button } from "#src/ui/button";
import { fieldset, input, label } from "#src/ui/form";
import { Foot } from "#src/ui/hx_table";
import { table } from "#src/ui/table";
import { tag } from "#src/ui/tag";
import { LocalTime } from "#src/ui/time";
import { urls } from "#src/urls";
import type { get_activities } from "./get_activities.query";

//

type QueryResult = Awaited<ReturnType<typeof get_activities>>;
type Activity = QueryResult["activities"][number];
type RenderedActivity = Activity & {
  cause:
    (NonNullable<Activity["cause"]> & { parsed: ParsedActivityRow }) | null;
  parsed: ParsedActivityRow;
};

const $filters = hyper_ref();
const $table = hyper_ref();
const hx_activities_props = {
  ...urls.activity.$hx_get({ query: {} }),
  "hx-replace-url": true,
  "hx-select": `#${$table} > table`,
  "hx-target": `#${$table}`,
};
const hx_pagination_props = { "hx-include": hx_include([$filters, $table]) };

//

export function Page({
  activities,
  categories,
  count,
  date,
  live,
  pagination,
  search,
  selected,
}: {
  activities: ReadonlyArray<RenderedActivity>;
  categories: ReadonlyArray<string>;
  count: number;
  date: string | undefined;
  live: number;
  pagination: Pagination;
  search: URLSearchParams;
  selected: ReadonlyArray<string>;
}) {
  return (
    <main class="container mx-auto my-12 px-4">
      <div class="flex items-center justify-between gap-4">
        <h1>Journal d’activité</h1>
        <a
          class={button({ type: "tertiary-no-outline" })}
          href={live_href(live, search)}
        >
          {live > 0 ? "⏸️ Pause" : "▶️ Suivre en direct"}
        </a>
      </div>
      <Filter
        categories={categories}
        date={date}
        live={live}
        selected={selected}
      />
      <Table
        activities={activities}
        count={count}
        live={live}
        pagination={pagination}
      />
    </main>
  );
}

const LIVE_INTERVAL = 5;

function live_href(live: number, query: URLSearchParams) {
  const search = new URLSearchParams(query);
  search.set("live", live > 0 ? "0" : `${LIVE_INTERVAL}`);
  return `${urls.activity.$url().pathname}?${search}`;
}

//

const category_labels: Record<string, string> = {
  domain: "Domaines",
  franceconnect: "FranceConnect",
  member: "Membres",
  moderation: "Modérations",
  organization: "Organisations",
  user: "Utilisateurs",
};

function Filter({
  categories,
  date,
  live,
  selected,
}: {
  categories: ReadonlyArray<string>;
  date: string | undefined;
  live: number;
  selected: ReadonlyArray<string>;
}) {
  const { base, legend } = fieldset({ regular: true });

  return (
    <form
      {...hx_activities_props}
      class="my-4 flex flex-wrap items-center gap-2"
      hx-trigger="change"
      hx-vals={JSON.stringify({ live, page: 1 })}
      id={$filters}
    >
      <fieldset class={base()} role="group">
        <legend class={legend()}>Par catégorie</legend>
        {categories.map((category) => (
          <label class={tag({ class: "m-1" })}>
            <input
              checked={selected.includes(category)}
              class="sr-only"
              name="category"
              type="checkbox"
              value={category}
            />
            {category_labels[category] ?? category}
          </label>
        ))}
      </fieldset>
      {selected.length > 0 || date !== undefined ? (
        <a href={urls.activity.$url().pathname}>Réinitialiser</a>
      ) : null}
      <label class={label({ class: "ml-auto w-52" })}>
        Chercher par date
        <input
          class={input({ class: "mt-2" })}
          name="date"
          type="date"
          value={date ?? ""}
        />
      </label>
    </form>
  );
}

//

function Table({
  activities,
  count,
  live,
  pagination,
}: {
  activities: ReadonlyArray<RenderedActivity>;
  count: number;
  live: number;
  pagination: Pagination;
}) {
  const polling_props =
    live > 0
      ? {
          ...hx_activities_props,
          ...hx_pagination_props,
          "hx-trigger": `every ${live}s [document.visibilityState === 'visible']`,
          "hx-vals": JSON.stringify({ live }),
        }
      : {};

  return (
    <div {...polling_props} id={$table}>
      <table class={table()}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Acteur</th>
            <th>Action</th>
            <th>Cible</th>
          </tr>
        </thead>
        <tbody>
          {activities.length === 0 ? (
            <tr>
              <td colspan={4}>Aucune activité.</td>
            </tr>
          ) : (
            activities.map((activity) => (
              <Row activity={activity} key={`${activity.id}`} />
            ))
          )}
        </tbody>
        <Foot
          colspan={4}
          count={count}
          hx_query_props={{ ...hx_activities_props, ...hx_pagination_props }}
          pagination={pagination}
        />
      </table>
    </div>
  );
}

function Row({ activity }: { activity: RenderedActivity }) {
  return (
    <tr aria-label={`Activité ${activity.parsed.action}`}>
      <td>
        <LocalTime date={activity.created_at} />
      </td>
      <td>
        <Actor actor={activity.actor} />
      </td>
      <td>
        <ActivityLabel parsed={activity.parsed} />
        {activity.cause !== null && (
          <div>
            ↳ Suite à : <ActivityLabel parsed={activity.cause.parsed} /> par{" "}
            <Actor actor={activity.cause.actor} />
          </div>
        )}
      </td>
      <td>{Target(activity)}</td>
    </tr>
  );
}

function Target({ moderation_id, organization, user }: RenderedActivity) {
  const links = [
    organization === null ? null : (
      <a
        href={
          urls.organizations[":id"].$url({
            param: { id: organization.id },
          }).pathname
        }
      >
        {organization.label}
      </a>
    ),
    user === null ? null : (
      <a href={urls.users[":id"].$url({ param: { id: user.id } }).pathname}>
        {user.label ?? `utilisateur #${user.id}`}
      </a>
    ),
    moderation_id === null ? null : (
      <a
        href={
          urls.moderations[":id"].$url({ param: { id: moderation_id } })
            .pathname
        }
      >
        Modération #{moderation_id}
      </a>
    ),
  ].filter((link) => link !== null);

  if (links.length === 0) return "—";

  return links.map((link, index) => (
    <>
      {index === 0 ? null : " · "}
      {link}
    </>
  ));
}
