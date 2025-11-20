//

import { Htmx_Events } from "#src/htmx";
import { button } from "#src/ui/button";
import { fieldset } from "#src/ui/form";
import { formattedPlural } from "#src/ui/plurial";
import { OpenInZammad, SearchInZammad } from "#src/ui/zammad/components";
import { hx_urls, urls } from "#src/urls";
import { MODERATION_STATUS } from "@~/identite-proconnect/types";
import { raw } from "hono/html";
import { match } from "ts-pattern";
import type { find_duplicate_users } from "./find_duplicate_users.query";
import type { get_duplicate_moderations } from "./get_duplicate_moderations.query";
import type { get_moderation } from "./get_moderation.query";
import type { get_moderation_tickets } from "./get_moderation_tickets.query";
import type { get_user_by_id } from "./get_user_by_id.query";

//

type User = Awaited<ReturnType<typeof get_user_by_id>>;

type DuplicateUsers = Awaited<ReturnType<typeof find_duplicate_users>>;

type Moderation = Awaited<ReturnType<typeof get_moderation>>;
type ModerationTickets = Awaited<ReturnType<typeof get_moderation_tickets>>;
type DuplicateModerations = Awaited<
  ReturnType<typeof get_duplicate_moderations>
>;
type DuplicateWarningProps = {
  moderation_id: number;
  moderations: DuplicateModerations;
  user: User;
  duplicate_users: DuplicateUsers;
  moderation: Moderation;
  moderation_tickets: ModerationTickets;
};

//

export async function DuplicateWarning({
  moderations,
  user,
  duplicate_users,
  moderation,
  moderation_tickets,
  moderation_id,
}: DuplicateWarningProps) {
  return (
    <>
      <Alert_Duplicate_Moderation
        moderations={moderations}
        user={user}
        moderation_tickets={moderation_tickets}
        moderation_id={moderation_id}
        moderation={moderation}
      />
      <Alert_Duplicate_User duplicate_users={duplicate_users} />
    </>
  );
}

//

async function Alert_Duplicate_User({
  duplicate_users,
}: {
  duplicate_users: DuplicateUsers;
}) {
  const duplicate_users_count = duplicate_users.length;

  if (duplicate_users_count === 0) return raw``;

  return (
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">
        Attention :{" "}
        {formattedPlural(duplicate_users_count, {
          one: "un",
          other: duplicate_users_count.toString(),
        })}{" "}
        {formattedPlural(duplicate_users_count, {
          one: "utilisateur",
          other: "utilisateurs",
        })}{" "}
        {formattedPlural(duplicate_users_count, {
          one: "a",
          other: "ont",
        })}{" "}
        ce nom de famille au sein de cette organisation.
      </h3>

      <ul>
        {duplicate_users.map(
          ({
            user_id,
            email,
            family_name,
            given_name,
          }: DuplicateUsers[number]) => (
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

async function Alert_Duplicate_Moderation({
  moderations,
  user,
  moderation_tickets,
  moderation_id,
  moderation,
}: {
  moderations: DuplicateModerations;
  user: User;
  moderation_tickets: ModerationTickets;
  moderation_id: number;
  moderation: Moderation;
}) {
  const moderation_count = moderations.length;

  if (moderation_count <= 1) return raw``;

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
            <ModerationStatusIndicator status={moderation.status} />{" "}
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

      <MarkModerationAsProcessed
        moderation_id={moderation_id}
        moderation={moderation}
      />
    </div>
  );
}

function ModerationStatusIndicator({
  status: raw_status,
}: {
  status: ModerationTickets[number]["moderation"]["status"];
}) {
  const { data: status, error } = MODERATION_STATUS.safeParse(raw_status);
  if (error) return <p class="fr-badge fr-badge--warning">Inconnu</p>;
  return match(status)
    .with("accepted", () => <p class="fr-badge fr-badge--success">Accepté</p>)
    .with("rejected", () => <p class="fr-badge fr-badge--error">Rejeté</p>)
    .with("pending", () => <p class="fr-badge fr-badge--new">A traiter</p>)
    .otherwise(() => <p class="fr-badge fr-badge--success">Traité</p>);
}

async function MarkModerationAsProcessed({
  moderation_id,
  moderation,
}: {
  moderation_id: number;
  moderation: Moderation;
}) {
  if (moderation.moderated_at) return raw``;

  const { base, element } = fieldset();

  return (
    <form
      _={`
      on submit
        wait for ${Htmx_Events.enum.afterSettle}
        wait 2s
        go back
      `}
      {...await hx_urls.moderations[":id"].processed.$patch({
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
