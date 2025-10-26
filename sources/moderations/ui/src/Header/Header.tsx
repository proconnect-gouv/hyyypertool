//

import { MessageInfo } from "#ui/MessageInfo";
import { button } from "@~/app.ui/button";
import { callout } from "@~/app.ui/callout";
import { notice } from "@~/app.ui/notice";
import { LocalTime } from "@~/app.ui/time";
import { hx_urls } from "@~/app.urls";
import { moderation_type_to_emoji } from "@~/moderations.lib/moderation_type.mapper";
import type { GetModerationHeaderOutput } from "@~/moderations.lib/usecase/GetModerationHeader";
import { raw } from "hono/html";
import { createContext, useContext } from "hono/jsx";

//

interface Values {
  moderation: GetModerationHeaderOutput;
}
const context = createContext<Values>({} as any);

//

export async function Header() {
  const { moderation } = useContext(context);
  const hx_get_duplicate_warning = await hx_urls.moderations[
    ":id"
  ].duplicate_warning.$get({
    param: {
      id: moderation.id.toString(),
    },
    query: {
      organization_id: moderation.organization.id.toString(),
      user_id: moderation.user.id.toString(),
    },
  });

  return (
    <header>
      <div class="float-right text-xs">
        Créé le <LocalTime date={moderation.created_at} />
      </div>
      <section class="flex items-baseline space-x-5">
        <h1 className="fr-h2">
          {moderation_type_to_emoji(moderation.type)}{" "}
          {moderation.user.given_name} {moderation.user.family_name}
        </h1>
        <div>
          <State_Badge />
        </div>
      </section>

      <ModerationCallout />

      <Info />

      <hr class="bg-none" />

      <Comments />

      <hr class="bg-none" />

      <div {...hx_get_duplicate_warning} hx-trigger="load">
        Demande multiples ?
      </div>
    </header>
  );
}
Header.Provier = context.Provider;

function State_Badge() {
  const { moderation } = useContext(context);
  const is_treated = moderation.moderated_at !== null;
  if (is_treated) return <p class="fr-badge fr-badge--success">Traité</p>;
  return <p class="fr-badge fr-badge--new">A traiter</p>;
}

function Info() {
  const { moderation } = useContext(context);
  const { base, container, body, title } = notice({ type: "info" });
  return (
    <div class={base()}>
      <div class={container()}>
        <div class={body()}>
          <div class={title()}>
            <MessageInfo moderation={moderation} />
          </div>
        </div>
      </div>
    </div>
  );
}

async function ModerationCallout() {
  const { moderation } = useContext(context);
  if (!moderation.moderated_at) return raw``;

  const { base, text, title } = callout({ intent: "success" });
  const hx_patch_moderation_reprocess = await hx_urls.moderations[
    ":id"
  ].reprocess.$patch({
    param: { id: moderation.id.toString() },
  });

  return (
    <div class={base()}>
      <hr class="bg-none" />

      <h3 class={text()}>Modération traitée</h3>
      <p class={title()}>
        Cette modération a été marqué comme traitée le{" "}
        <b>
          <LocalTime date={moderation.moderated_at} />
        </b>
        {moderation.moderated_by ? (
          <>
            {" "}
            par <b>{moderation.moderated_by}</b>
          </>
        ) : null}
        .
      </p>
      <LastComment />
      <button
        class={button({ size: "sm", type: "tertiary" })}
        {...hx_patch_moderation_reprocess}
        hx-swap="none"
      >
        Retraiter
      </button>
    </div>
  );
}

function LastComment() {
  const { comment } = useContext(context).moderation;
  if (!comment) {
    return null;
  }
  const parsed_comment = parse_comment(comment);
  const last_comment = parsed_comment.at(-1);
  return <p>{last_comment?.value}</p>;
}

function Comments() {
  const { comment } = useContext(context).moderation;
  const parsed_comment = parse_comment(comment);
  return (
    <details>
      <summary>Commentaires</summary>

      <ul class="ml-4">
        {parsed_comment.map(({ created_at, created_by, value }) => (
          <li key={created_at}>
            <b>{created_by}</b>{" "}
            <small>
              <LocalTime date={created_at} />
            </small>
            <br /> {value}
          </li>
        ))}
      </ul>
    </details>
  );
}

function parse_comment(comment: string | null) {
  if (!comment) return [];
  return comment.split("\n").map((line) => {
    const [when_and_by, ...value] = line.split(" | ");
    const [created_at, created_by] = when_and_by.split(" ");
    return {
      created_at: new Date(Number(created_at)),
      created_by,
      value: value.join(" | "),
    };
  });
}
