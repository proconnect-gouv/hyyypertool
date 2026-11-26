//

import { crisp_message_author, type CrispMessage } from "#src/lib/crisp";
import type {
  CrispConversation,
  CrispMessagesPage,
} from "#src/lib/moderations";
import { button } from "#src/ui/button";
import { Svg } from "#src/ui/icons/components";
import { OpenInCrisp, short_session_id } from "#src/ui/links";
import { Time } from "#src/ui/time";
import { Message } from "../../crisp";
import type { ReplyFormProps } from "./ReplyForm.client";
import { ReplyFormIsland } from "./ReplyFormIsland";

//

type HxRequest = Record<string, string>;

export type ConversationStateView =
  | { kind: "resolved"; reopen: HxRequest }
  | { kind: "unresolved"; resolve: HxRequest };

export function Crisp({
  crisp,
  describedby,
  older,
  plugin_urn,
  reply,
  state,
  website_id,
}: {
  crisp: CrispConversation;
  describedby: string;
  older: HxRequest | null;
  plugin_urn: string;
  reply: ReplyFormProps;
  state: ConversationStateView;
  website_id: string;
}) {
  return (
    <section aria-describedby={describedby}>
      <Header
        session_id={crisp.session_id}
        state={state}
        subject={crisp.subject}
        website_id={website_id}
      />
      <div class="border-border rounded-sm border shadow-inner">
        <div
          aria-label="Messages de la conversation Crisp"
          class="flex max-h-[calc(100dvh-var(--exchange-summary-h)-17rem)] [scrollbar-width:thin] [scrollbar-color:var(--color-grey-425)_transparent] [scrollbar-gutter:stable] flex-col-reverse overflow-y-auto overscroll-contain p-2"
          data-keep-scroll
          role="region"
          tabindex={0}
        >
          <ul class="list-none">
            <CrispMessages
              older={older}
              page={crisp.page}
              plugin_urn={plugin_urn}
            />
          </ul>
        </div>
        <ReplyFormIsland {...reply} />
      </div>
    </section>
  );
}

export function CrispMessages({
  next,
  older,
  page,
  plugin_urn,
}: {
  next?: { run: string; timestamp: number };
  older: HxRequest | null;
  page: CrispMessagesPage;
  plugin_urn: string;
}) {
  const last = page.messages.at(-1);
  const stale_separator_id =
    last && next && day_key(last.timestamp) === day_key(next.timestamp)
      ? day_id(next.timestamp)
      : null;
  const following = [
    ...page.messages.slice(1).map((message) => ({
      run: message_run(message, plugin_urn),
      timestamp: message.timestamp,
    })),
    next,
  ];

  return (
    <>
      {older ? (
        <li class="my-4 text-center">
          <button
            type="button"
            {...older}
            class={button({ size: "sm", type: "tertiary" })}
            hx-disabled-elt="this"
            hx-swap="outerHTML"
            hx-target="closest li"
          >
            Afficher les messages précédents
          </button>
        </li>
      ) : null}
      {page.messages.map((message, index) => (
        <>
          {day_key(message.timestamp) ===
          day_key(page.messages[index - 1]?.timestamp) ? null : (
            <DaySeparator timestamp={message.timestamp} />
          )}
          <li
            data-keep-scroll-anchor
            id={`${message.fingerprint}`}
            key={`${message.fingerprint}`}
          >
            <Message
              ends_run={ends_run(message, following[index], plugin_urn)}
              message={message}
              plugin_urn={plugin_urn}
            />
          </li>
        </>
      ))}
      {stale_separator_id ? (
        <li hx-swap-oob="delete" id={stale_separator_id} />
      ) : null}
    </>
  );
}

export function message_run(message: CrispMessage, plugin_urn: string) {
  return message.type === "event"
    ? `event:${message.fingerprint}`
    : `${crisp_message_author(message, plugin_urn)}:${message.user.nickname}`;
}

function ends_run(
  message: CrispMessage,
  following: { run: string; timestamp: number } | undefined,
  plugin_urn: string,
) {
  return (
    !following ||
    following.run !== message_run(message, plugin_urn) ||
    day_key(following.timestamp) !== day_key(message.timestamp)
  );
}

function DaySeparator({ timestamp }: { timestamp: number }) {
  const date = new Date(timestamp);
  return (
    <li
      class="text-text-muted my-4 flex items-center gap-3 text-sm"
      id={day_id(timestamp)}
      role="separator"
    >
      <span class="border-border flex-1 border-t" />
      <Time date={date}>
        <span class="border-border rounded-full border px-3 py-0.5">
          {day_format.format(date)}
        </span>
      </Time>
      <span class="border-border flex-1 border-t" />
    </li>
  );
}

const day_format = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  timeZone: "Europe/Paris",
  year: "numeric",
});

const day_key_format = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Paris",
});

function day_key(timestamp: number | undefined) {
  return timestamp === undefined
    ? undefined
    : day_key_format.format(new Date(timestamp));
}

function day_id(timestamp: number) {
  return `crisp-day-${day_key(timestamp)}`;
}

//

function Header({
  session_id,
  state,
  subject,
  website_id,
}: {
  session_id: CrispConversation["session_id"];
  state: ConversationStateView;
  subject: CrispConversation["subject"];
  website_id: string;
}) {
  return (
    <div class="mb-2 flex flex-row items-center gap-4">
      <h5 class="m-0 flex flex-1 flex-row justify-between">
        <span>{subject}</span>
        <OpenInCrisp session_id={session_id} website_id={website_id}>
          #{short_session_id(session_id)}
        </OpenInCrisp>
      </h5>
      {state.kind === "resolved" ? (
        <ResolvedButton reopen={state.reopen} />
      ) : (
        <UnresolvedButton resolve={state.resolve} />
      )}
    </div>
  );
}

function ResolvedButton({ reopen }: { reopen: HxRequest }) {
  return (
    <button
      {...reopen}
      class={button({ intent: "success", size: "sm" })}
      hx-disabled-elt="this"
      hx-swap="none"
      title="Rouvrir cette conversation"
      type="button"
    >
      <Svg name="check" /> Résolue
    </button>
  );
}

function UnresolvedButton({ resolve }: { resolve: HxRequest }) {
  return (
    <button
      {...resolve}
      class={button({ intent: "warning", size: "sm" })}
      hx-disabled-elt="this"
      hx-swap="none"
      title="Marquer cette conversation comme résolue"
      type="button"
    >
      <Svg name="arrow-right" /> Non résolue
    </button>
  );
}
