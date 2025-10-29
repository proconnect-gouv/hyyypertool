//

import { callout } from "#src/ui/callout";
import { LocalTime } from "#src/ui/time";
import { OpenInZammad } from "#src/ui/zammad/components";
import { usePageRequestContext } from "./context";
import { Message } from "./Message";

//

export default async function Zammad() {
  const { req } = usePageRequestContext();
  const { describedby } = req.valid("query");

  return (
    <section aria-describedby={describedby}>
      <Header />
      <List />
    </section>
  );
}

//

function Header() {
  const {
    var: { zammad },
  } = usePageRequestContext();
  const { subject, ticket_id } = zammad!;
  return (
    <h5 class="flex flex-row justify-between">
      <span>{subject}</span>
      <OpenInZammad ticket_id={Number(ticket_id)}>#{ticket_id}</OpenInZammad>
    </h5>
  );
}

function List() {
  const {
    var: { zammad },
  } = usePageRequestContext();
  const { articles } = zammad!;
  return (
    <ul class="list-none">
      <ShowMore />
      {articles.map((article) => (
        <li id={`${article.id}`} key={`${article.id}`}>
          <p class="text-center text-sm font-bold">
            <LocalTime date={article.created_at} />
          </p>
          <Message article={article} />
          <hr />
        </li>
      ))}
    </ul>
  );
}

function ShowMore() {
  const {
    var: { zammad },
  } = usePageRequestContext();
  const { show_more, ticket_id } = zammad!;

  if (!show_more) return <></>;

  return (
    <li class="my-12 text-center">
      <ShowMoreCallout zammad_id={Number(ticket_id)} />
    </li>
  );
}

function ShowMoreCallout({ zammad_id }: { zammad_id: number }) {
  const {
    var: { MAX_ARTICLE_COUNT },
  } = usePageRequestContext();
  const { base, text, title } = callout({ intent: "warning" });
  return (
    <div class={base()}>
      <p class={title()}>Afficher plus de messages</p>
      <p class={text()}>
        Seul les {MAX_ARTICLE_COUNT} derniers messages sont affichés.
        <br />
        Consulter tous les messages sur Zammad{" "}
        <OpenInZammad ticket_id={zammad_id}>#{zammad_id}</OpenInZammad>
      </p>
    </div>
  );
}
