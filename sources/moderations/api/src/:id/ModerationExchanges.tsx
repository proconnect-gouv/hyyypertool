//

import { hyper_ref } from "@~/app.core/html";
import { hx_trigger_from_body } from "@~/app.core/htmx";
import { Loader } from "@~/app.ui/loader";
import { hx_urls } from "@~/app.urls";
import { MODERATION_EVENTS } from "@~/moderations.lib/event";
import { usePageRequestContext } from "./context";

//

export async function ModerationExchanges() {
  const $describedby = hyper_ref();
  const {
    var: { moderation },
  } = usePageRequestContext();

  const hx_query_moderation_emails = await hx_urls.moderations[
    ":id"
  ].email.$get({
    param: { id: moderation.id.toString() },
    query: { describedby: $describedby },
  });

  return (
    <section id="exchange_moderation">
      <details id="exchange_details">
        <summary>
          <h2 class="inline-block" id={$describedby}>
            📥️ Échanges entre {moderation.user.given_name} et nous :{" "}
          </h2>
        </summary>

        <div
          {...hx_query_moderation_emails}
          hx-trigger={[
            "load",
            hx_trigger_from_body([
              MODERATION_EVENTS.enum.MODERATION_EMAIL_UPDATED,
            ]),
          ].join(", ")}
        >
          <div class="my-24 flex flex-col items-center justify-center">
            Chargement des échanges avec {moderation.user.given_name}
            <br />
            <Loader />
          </div>
        </div>
      </details>
    </section>
  );
}
