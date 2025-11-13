//

import { callout } from "#src/ui/callout";
import { LocalTime } from "#src/ui/time";
import { OpenInZammad } from "#src/ui/zammad/components";
import { Message } from "./Message";

//

type ZammadProps = {
  describedby?: string;
  zammad: any;
  max_article_count: number;
};

//

export default function Zammad({
  describedby,
  zammad,
  max_article_count,
}: ZammadProps) {
  return (
    <section aria-describedby={describedby}>
      <Header zammad={zammad} />
      <List zammad={zammad} max_article_count={max_article_count} />
    </section>
  );
}

//

function Header({ zammad }: { zammad: any }) {
  const { subject, ticket_id } = zammad;
  return (
    <h5 class="flex flex-row justify-between">
      <span>{subject}</span>
      <OpenInZammad ticket_id={Number(ticket_id)}>#{ticket_id}</OpenInZammad>
    </h5>
  );
}

function List({
  zammad,
  max_article_count,
}: {
  zammad: any;
  max_article_count: number;
}) {
  const { articles, ticket_id } = zammad;
  return (
    <ul class="list-none">
      <ShowMore zammad={zammad} max_article_count={max_article_count} />
      {articles.map((article: any) => (
        <li id={`${article.id}`} key={`${article.id}`}>
          <p class="text-center text-sm font-bold">
            <LocalTime date={article.created_at} />
          </p>
          <Message article={article} ticket_id={ticket_id} />
          <hr />
        </li>
      ))}
    </ul>
  );
}

function ShowMore({
  zammad,
  max_article_count,
}: {
  zammad: any;
  max_article_count: number;
}) {
  const { show_more, ticket_id } = zammad;

  if (!show_more) return <></>;

  return (
    <li class="my-12 text-center">
      <ShowMoreCallout
        zammad_id={Number(ticket_id)}
        max_article_count={max_article_count}
      />
    </li>
  );
}

function ShowMoreCallout({
  zammad_id,
  max_article_count,
}: {
  zammad_id: number;
  max_article_count: number;
}) {
  const { base, text, title } = callout({ intent: "warning" });
  return (
    <div class={base()}>
      <p class={title()}>Afficher plus de messages</p>
      <p class={text()}>
        Seul les {max_article_count} derniers messages sont affichés.
        <br />
        Consulter tous les messages sur Zammad{" "}
        <OpenInZammad ticket_id={zammad_id}>#{zammad_id}</OpenInZammad>
      </p>
    </div>
  );
}
