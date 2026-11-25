//

import type { CrispMessage } from "#src/lib/crisp";
import type {
  CrispConversation,
  CrispMessagesPage,
} from "#src/lib/moderations";
import { button } from "#src/ui/button";
import { OpenInCrisp, short_session_id } from "#src/ui/links";
import { Time } from "#src/ui/time";
import { Message } from "../../crisp";

//

type HxRequest = Record<string, string>;

export function Crisp({
  crisp,
  describedby,
  older,
  website_id,
}: {
  crisp: CrispConversation;
  describedby: string;
  older: HxRequest | null;
  website_id: string;
}) {
  return (
    <section aria-describedby={describedby}>
      <Header crisp={crisp} website_id={website_id} />
      <div
        aria-label="Messages de la conversation Crisp"
        class="border-border flex max-h-[calc(100dvh-var(--exchange-summary-h)-9rem)] [scrollbar-width:thin] [scrollbar-color:var(--color-grey-425)_transparent] [scrollbar-gutter:stable] flex-col-reverse overflow-y-auto overscroll-contain rounded-sm border p-2 shadow-inner"
        data-keep-scroll
        role="region"
        tabindex={0}
      >
        <ul class="list-none">
          <CrispMessages older={older} page={crisp.page} />
        </ul>
      </div>
    </section>
  );
}

export function CrispMessages({
  next,
  older,
  page,
}: {
  next?: { run: string; timestamp: number };
  older: HxRequest | null;
  page: CrispMessagesPage;
}) {
  const last = page.messages.at(-1);
  const stale_separator_id =
    last && next && day_key(last.timestamp) === day_key(next.timestamp)
      ? day_id(next.timestamp)
      : null;
  const following = [
    ...page.messages.slice(1).map((message) => ({
      run: message_run(message),
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
              ends_run={ends_run(message, following[index])}
              message={message}
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

export function message_run(message: CrispMessage) {
  return message.type === "event"
    ? `event:${message.fingerprint}`
    : `${message.from}:${message.user.nickname}`;
}

function ends_run(
  message: CrispMessage,
  following: { run: string; timestamp: number } | undefined,
) {
  return (
    !following ||
    following.run !== message_run(message) ||
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
  crisp: { session_id, subject },
  website_id,
}: {
  crisp: CrispConversation;
  website_id: string;
}) {
  return (
    <h5 class="flex flex-row justify-between">
      <span>{subject}</span>
      <OpenInCrisp session_id={session_id} website_id={website_id}>
        #{short_session_id(session_id)}
      </OpenInCrisp>
    </h5>
  );
}
