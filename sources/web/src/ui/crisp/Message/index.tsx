//

import {
  crisp_message_author,
  type CrispMessage,
  type CrispMessageAuthor,
} from "#src/lib/crisp";
import { Time } from "#src/ui/time";
import { tv } from "tailwind-variants";
import { processor } from "../processor";

//

export async function Message({
  ends_run = true,
  message,
  plugin_urn,
}: {
  ends_run?: boolean;
  message: CrispMessage;
  plugin_urn: string;
}) {
  if (message.type === "event") return <EventMessage message={message} />;

  const author = crisp_message_author(message, plugin_urn);
  const author_label = AUTHOR_LABELS[author];
  const message_label =
    message.type === "note"
      ? `Note privée ${author_label}`
      : `Message ${author_label}`;
  const { avatar, badge, base, bubble, column, meta } = message_variants({
    ends_run,
    kind: message.type === "note" ? "note" : author,
  });

  return (
    <figure class={base()}>
      <span class="sr-only">{message_label}</span>
      <span
        aria-hidden="true"
        class={avatar({
          class:
            author === "system"
              ? undefined
              : avatar_color(message.user.nickname),
        })}
      >
        {author === "system" ? "🤖" : initials(message.user.nickname)}
      </span>
      <div class={column()}>
        <div class={bubble()}>
          {message.type === "note" ? (
            <span aria-hidden="true" class={badge()}>
              🔖
            </span>
          ) : null}
          <MessageBody message={message} />
        </div>
        <figcaption class={meta()}>
          <Signature message={message} />
        </figcaption>
      </div>
    </figure>
  );
}

function EventMessage({
  message,
}: {
  message: Extract<CrispMessage, { type: "event" }>;
}) {
  const { namespace } = message.content;
  return (
    <figure class="my-4 flex flex-col items-center gap-1">
      <p class="border-border bg-surface-muted rounded-full border px-4 py-1.5 text-sm font-bold">
        {EVENT_LABELS[namespace] ?? `Événement « ${namespace} »`}
      </p>
      <figcaption class="text-text-muted text-xs">
        <Signature message={message} />
      </figcaption>
    </figure>
  );
}

function Signature({ message }: { message: CrispMessage }) {
  const date = new Date(message.timestamp);
  return (
    <>
      {message.user.nickname} ·{" "}
      <Time date={date}>{time_format.format(date)}</Time>
    </>
  );
}

async function MessageBody({
  message,
}: {
  message: Exclude<CrispMessage, { type: "event" }>;
}) {
  switch (message.type) {
    case "file":
      return (
        <p>
          📎{" "}
          <a
            href={message.content.url}
            rel="noopener noreferrer"
            target="_blank"
          >
            {message.content.name}
          </a>
        </p>
      );
    case "note":
      return (
        <>
          <p class="mb-2 font-bold underline">
            {message.user.nickname} a écrit cette note privée :
          </p>
          <Markdown content={message.content} />
        </>
      );
    case "text":
      return <Markdown content={message.content} />;
    case "unsupported":
      return (
        <p class="italic">
          Message de type « {message.original_type} » non affiché.
        </p>
      );
  }
}

async function Markdown({ content }: { content: string }) {
  const html = String(await processor.process(content));
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

//

const AVATAR_COLORS = [
  "bg-alt-orange-terre-battue",
  "bg-blue-ecume",
  "bg-brown-caramel",
  "bg-green-emeraude",
  "bg-grey-425",
  "bg-red-marianne",
];

const AUTHOR_LABELS: Record<CrispMessageAuthor, string> = {
  operator: "d'un opérateur",
  system: "du système",
  user: "de l'usager",
};

const EVENT_LABELS: Record<string, string> = {
  "state:resolved": "✅ A résolu la conversation",
};

const time_format = new Intl.DateTimeFormat("fr-FR", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "Europe/Paris",
});

function avatar_color(nickname: string) {
  const hash = [...nickname].reduce(
    (sum, character) => (sum * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function initials(nickname: string) {
  return nickname
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");
}

const message_variants = tv({
  slots: {
    avatar: `
      flex
      size-8
      shrink-0
      items-center
      justify-center
      rounded-full
      text-xs
      font-bold
      text-white
    `,
    badge: `
      ring-surface
      absolute
      top-3
      -left-3
      flex
      size-7
      items-center
      justify-center
      rounded-full
      bg-amber-300
      text-sm
      ring-2
    `,
    base: "flex max-w-[85%] items-end gap-2",
    bubble: `
      relative
      rounded-2xl
      px-4
      py-3
      break-words
      [&_a]:underline
      [&_img]:max-w-full
      [&_p:not(:last-child)]:mb-2
    `,
    column: "flex min-w-0 flex-col gap-1",
    meta: "text-text-muted px-2 text-xs",
  },
  variants: {
    ends_run: {
      false: { avatar: "invisible", base: "mb-1", meta: "sr-only" },
      true: { base: "mb-4" },
    },
    kind: {
      note: {
        base: "ml-auto flex-row-reverse",
        bubble: "text-grey-1000 bg-amber-100 pl-6",
        column: "items-end",
      },
      operator: {
        base: "ml-auto flex-row-reverse",
        bubble: "bg-blue-france text-white",
        column: "items-end",
      },
      system: {
        avatar: "bg-grey-425 text-xl",
        base: "mx-auto",
        bubble: "border-border bg-surface-muted border",
        column: "items-center",
        meta: "text-center",
      },
      user: {
        base: "mr-auto",
        bubble: "bg-surface-muted",
        column: "items-start",
      },
    },
  },
});
