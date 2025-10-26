//

import { NotFoundError } from "@~/app.core/error";
import { Htmx_Events } from "@~/app.core/htmx";
import { button } from "@~/app.ui/button";
import { fieldset } from "@~/app.ui/form";
import { OpenInZammad, SearchInZammad } from "@~/app.ui/zammad/components";
import { hx_urls, urls } from "@~/app.urls";
import {
  schema,
  type IdentiteProconnect_PgDatabase,
} from "@~/identite-proconnect.database";
import {
  GetDuplicateModerations,
  type GetDuplicateModerationsDto,
} from "@~/moderations.repository";
import { GetUserById } from "@~/users.repository";
import { get_zammad_mail } from "@~/zammad.lib/get_zammad_mail";
import { to } from "await-to-js";
import { and, asc, eq, ilike, not, or } from "drizzle-orm";
import { raw } from "hono/html";
import { createContext, useContext } from "hono/jsx";
import { usePageRequestContext } from "./context";

//

export async function DuplicateWarning() {
  return (
    <>
      <Alert_Duplicate_Moderation />
      <Alert_Duplicate_User />
    </>
  );
}

async function createDuplicateWarningContextValues(
  pg: IdentiteProconnect_PgDatabase,
  {
    organization_id,
    user_id,
    moderation_id,
  }: { organization_id: number; user_id: number; moderation_id: number },
) {
  const get_duplicate_moderations = GetDuplicateModerations(pg);

  const get_user_by_id = GetUserById(pg, {
    columns: {
      id: true,
      email: true,
      given_name: true,
      family_name: true,
    },
  });

  return {
    moderation_id,
    moderations: await get_duplicate_moderations({
      organization_id,
      user_id,
    }),
    user: await get_user_by_id(user_id),
  };
}

DuplicateWarning.queryContextValues = createDuplicateWarningContextValues;
DuplicateWarning.Context = createContext(
  {} as Awaited<ReturnType<typeof DuplicateWarning.queryContextValues>>,
);

//

async function Alert_Duplicate_User() {
  const { moderation_id } = useContext(DuplicateWarning.Context);
  const duplicate_users = await get_duplicate_users(moderation_id);

  const duplicate_users_count = duplicate_users.length;

  if (duplicate_users_count === 0) return raw``;

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">
        Attention : {duplicate_users_count > 1 ? duplicate_users_count : "un"}{" "}
        utilisateur
        {duplicate_users_count > 1 ? "s" : ""}{" "}
        {duplicate_users_count > 1 ? "ont" : "a"} ce nom de famille au sein de
        cette organisation.
      </h3>

      <ul>
        {duplicate_users.map(
          ({
            user_id,
            email,
            family_name,
            given_name,
          }: {
            user_id: number;
            email: string | null;
            family_name: string | null;
            given_name: string | null;
          }) => (
            <li key={user_id}>
              <a
                href={
                  urls.users[":id"].$url({ param: { id: user_id.toString() } })
                    .pathname
                }
              >
                {given_name} {family_name} {`<${email}>`}
              </a>
            </li>
          ),
        )}
      </ul>
    </div>
  );
}
async function Alert_Duplicate_Moderation() {
  const { moderations, user } = useContext(DuplicateWarning.Context);
  const moderation_count = moderations.length;

  if (moderation_count <= 1) return raw``;

  const moderation_tickets = await get_moderation_tickets(moderations);

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s'agit de la {moderation_count}e demande pour cette organisation</p>
      <SearchInZammad search={user.email}>
        Trouver les echanges pour l'email « {user.email} » dans Zammad
      </SearchInZammad>
      <ul>
        {moderation_tickets.map(({ moderation, zammad_ticket }) => (
          <li key={moderation.id.toString()}>
            <a
              href={
                urls.moderations[":id"].$url({
                  param: { id: moderation.id.toString() },
                }).pathname
              }
            >
              Moderation#{moderation.id}
            </a>{" "}
            {moderation.moderated_at ? "✔️" : "❌"}:{" "}
            {moderation.ticket_id && zammad_ticket ? (
              <OpenInZammad ticket_id={Number(moderation.ticket_id)}>
                Ouvrir Ticket#{moderation.ticket_id} dans Zammad
              </OpenInZammad>
            ) : (
              "Pas de ticket"
            )}
          </li>
        ))}
      </ul>

      <MarkModerationAsProcessed />
    </div>
  );
}

async function MarkModerationAsProcessed() {
  const { moderation_id } = useContext(Duplicate_Warning.Context);
  const { base, element } = fieldset();
  const moderation = await get_moderation(moderation_id);

  if (moderation.moderated_at) return raw``;

  return (
    <form
      _={`
      on submit
        wait for ${Htmx_Events.enum.afterSettle}
        wait 2s
        go back
      `}
      {...await hx_urls.moderations[":id"].$procedures.processed.$patch({
        param: { id: moderation_id.toString() },
      })}
      hx-swap="none"
    >
      <fieldset class={base()}>
        <div class={element({ class: "text-right" })}>
          <button class={button({ intent: "danger" })} type="submit">
            Marquer la modération comme traité
          </button>
        </div>
      </fieldset>
    </form>
  );
}

//

function get_moderation_tickets(moderations: GetDuplicateModerationsDto) {
  return Promise.all(
    moderations.map(async (moderation) => {
      if (!moderation.ticket_id) return { moderation };
      const ticket_id = Number(moderation.ticket_id);
      const [, zammad_ticket] = await to(get_zammad_mail({ ticket_id }));
      return { moderation, zammad_ticket };
    }),
  );
}

//

async function get_moderation(moderation_id: number) {
  const {
    var: { identite_pg },
  } = usePageRequestContext();

  const moderation = await identite_pg.query.moderations.findFirst({
    columns: { moderated_at: true },
    where: eq(schema.moderations.id, moderation_id),
  });
  if (!moderation) throw new NotFoundError("Moderation not found.");
  return moderation;
}

async function get_duplicate_users(moderation_id: number) {
  const {
    var: { identite_pg },
  } = usePageRequestContext();

  const moderation = await identite_pg.query.moderations.findFirst({
    columns: { organization_id: true },
    with: {
      user: { columns: { id: true, given_name: true, family_name: true } },
    },
    where: eq(schema.moderations.id, moderation_id),
  });

  if (!moderation) throw new NotFoundError("Moderation not found.");

  const {
    organization_id,
    user: { family_name, id: user_id },
  } = moderation;

  return await identite_pg
    .select({
      email: schema.users.email,
      family_name: schema.users.family_name,
      given_name: schema.users.given_name,
      user_id: schema.users_organizations.user_id,
    })
    .from(schema.users_organizations)
    .leftJoin(
      schema.users,
      eq(schema.users_organizations.user_id, schema.users.id),
    )
    .where(
      and(
        or(ilike(schema.users.family_name, family_name ?? "")),
        not(eq(schema.users.id, user_id)),
        eq(schema.users_organizations.organization_id, organization_id),
      ),
    )
    .orderBy(asc(schema.users.created_at));
}
