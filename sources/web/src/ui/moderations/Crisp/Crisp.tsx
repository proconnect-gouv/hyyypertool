//

import type { CrispConversation } from "#src/lib/moderations";
import { callout } from "#src/ui/callout";
import { OpenInCrisp, short_session_id } from "#src/ui/links";
import { LocalTime } from "#src/ui/time";
import { match } from "ts-pattern";
import { Message } from "../../crisp";

//

export function Crisp({
  crisp,
  describedby,
  limit,
  website_id,
}: {
  crisp: CrispConversation;
  describedby: string;
  limit: number;
  website_id: string;
}) {
  return (
    <section aria-describedby={describedby}>
      <Header crisp={crisp} website_id={website_id} />
      <List crisp={crisp} limit={limit} website_id={website_id} />
    </section>
  );
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

function List({
  crisp: { messages, session_id, show_more },
  limit,
  website_id,
}: {
  crisp: CrispConversation;
  limit: number;
  website_id: string;
}) {
  return (
    <ul class="list-none">
      {show_more ? (
        <li class="my-12 text-center">
          <ShowMoreCallout
            limit={limit}
            session_id={session_id}
            website_id={website_id}
          />
        </li>
      ) : (
        <></>
      )}
      {messages.map((message) => (
        <li id={`${message.fingerprint}`} key={`${message.fingerprint}`}>
          {match(message.type)
            .with("text", () => (
              <>
                <p class="text-center text-sm font-bold">
                  <LocalTime date={new Date(message.timestamp)} />
                </p>
                <Message messsage={message} />
                <hr />
              </>
            ))
            .with("note", "file", () => <>[...]</>)
            .exhaustive()}
        </li>
      ))}
    </ul>
  );
}

function ShowMoreCallout({
  limit,
  session_id,
  website_id,
}: {
  limit: number;
  session_id: string;
  website_id: string;
}) {
  const { base, text, title } = callout({ intent: "warning" });
  return (
    <div class={base()}>
      <p class={title()}>Afficher plus de messages</p>
      <p class={text()}>
        Seul les {limit} derniers messages sont affichés.
        <br />
        Consulter tous les messages sur Crisp{" "}
        <OpenInCrisp session_id={session_id} website_id={website_id}>
          #{short_session_id(session_id)}
        </OpenInCrisp>
      </p>
    </div>
  );
}
