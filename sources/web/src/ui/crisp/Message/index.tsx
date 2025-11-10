//

import { quote } from "#src/ui/quote";
import { LocalTime } from "#src/ui/time";
import { create_link } from "#src/lib/crisp";
import type { ConversationMessage } from "#src/lib/crisp";
import { tv } from "tailwind-variants";
import { match } from "ts-pattern";
import { processor } from "../processor";

//

export async function Message({ messsage }: { messsage: ConversationMessage }) {
  return match(messsage.type)
    .with("text", () => <TextMessage messsage={messsage} />)
    .otherwise(() => <>[...]</>);
}

export async function TextMessage({
  messsage,
}: {
  messsage: ConversationMessage;
}) {
  const { author, base, body, caption, source } = message_variants({
    is_family: messsage.from === "operator",
  });
  const html_content = String(await processor.process(messsage.content));
  const link = create_link({
    base_url: "https://app.crisp.chat",
    website_id: messsage.website_id,
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
        <p class={author()}>{messsage.user.nickname}</p>
        <ul class={source()}>
          <li>
            Créé le <LocalTime date={new Date(messsage.timestamp)} />
          </li>
          <li>par {messsage.user.nickname}</li>
          <li>
            <a
              href={link.session(messsage.session_id)}
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
    [&_blockquote]:border-l-(--background-contrast-grey-hover)
    p-6
    pb-0
    [&_blockquote]:ml-5
    [&_blockquote]:border-y-0
    [&_blockquote]:border-l-4
    [&_blockquote]:border-r-0
    [&_blockquote]:border-solid
    [&_blockquote]:p-6
    [&_blockquote_p]:text-base
    [&_blockquote_p]:font-normal
  `,
  extend: quote,
  slots: {
    body: `
      text-base!
      **:bg-transparent!
      break-words
      border-l-4
      border-gray-400
      pb-6
      [&_img]:max-w-full
    `,
    caption: `
      bg-(--background-contrast-grey)
      p-8
    `,
  },
  variants: {
    is_family: {
      true: "bg-(--background-alt-blue-ecume) ml-12 mr-2",
      false: "bg-(--background-alt-grey) ml-2 mr-12",
    },
  },
});
