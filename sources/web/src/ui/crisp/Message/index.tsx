//

import type { ConversationMessage } from "#src/lib/crisp";
import { CRISP_APP_BASE_URL, create_link } from "#src/lib/crisp";
import { quote } from "#src/ui/quote";
import { LocalTime } from "#src/ui/time";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import { processor } from "../processor";

//

export async function Message({ message }: { message: ConversationMessage }) {
  return match(message.type)
    .with("text", () => <TextMessage message={message} />)
    .otherwise(() => <>[...]</>);
}

export async function TextMessage({
  message,
}: {
  message: ConversationMessage;
}) {
  const { author, base, body, caption, source } = message_variants({
    is_family: message.from === "operator",
  });
  const html_content = String(await processor.process(message.content));
  const link = create_link({
    base_url: CRISP_APP_BASE_URL,
    website_id: message.website_id,
  });

  return (
    <figure class={base()}>
      <article
        class={body()}
        dangerouslySetInnerHTML={{
          __html: html_content,
        }}
      />
      <figcaption class={caption()}>
        <p class={author()}>{message.user.nickname}</p>
        <ul class={source()}>
          <li>
            Créé le <LocalTime date={new Date(message.timestamp)} />
          </li>
          <li> par {message.user.nickname} </li>
          <li>
            <a
              href={link.session(message.session_id)}
              rel="noopener noreferrer"
              target="_blank"
              title="Ouvrir la conversation dans Crisp - nouvelle fenêtre"
            >
              Ouvrir
            </a>
          </li>
        </ul>
      </figcaption>
    </figure>
  );
}

//

const message_variants = tv({
  base: `
    [&_blockquote]:border-l-border
    mb-4
    p-6!
    [&_blockquote]:ml-5
    [&_blockquote]:border-l-4
    [&_blockquote]:p-6
    [&_blockquote_p]:text-base
    [&_blockquote_p]:font-normal
  `,
  extend: quote,
  slots: {
    body: `
      border-l-4
      border-gray-400
      pl-2
      text-base!
      break-words
      **:bg-transparent!
      [&_img]:max-w-full
    `,
    caption: `
      bg-surface-muted
      p-2
    `,
  },
  variants: {
    is_family: {
      true: "bg-blue-ecume mr-2 ml-12",
      false: "bg-surface mr-12 ml-2",
    },
  },
});
