import { HtmxEvents, hx_disabled_form_elements } from "#src/htmx";
import { button } from "#src/ui/button";
import { hx_urls } from "#src/urls";
import { reject_form_schema } from "#src/lib/moderations";
import { useContext } from "hono/jsx";
import { AUTO_GO_BACK_EVENT } from "../AutoGoBack";
import { context, reject_context } from "./context";
import { ResponseMessageSelector } from "./ResponseMessageSelector";

export async function RefusalModal({ userEmail }: { userEmail: string }) {
  const { moderation } = useContext(context);
  const { $modal_message } = useContext(reject_context);

  return (
    <div
      class="z-751 border-(--text-action-high-blue-france) bg-(--blue-france-975-75) fixed bottom-14 right-0 m-2 hidden w-4/6 justify-self-end border-solid px-4 py-2"
      id="refusalModal"
      aria-label="la modale de refus"
    >
      <form
        {...await hx_urls.moderations[":id"].rejected.$patch({
          param: { id: moderation.id.toString() },
        })}
        {...hx_disabled_form_elements}
        hx-swap="none"
        _={`
          on submit
            wait for ${HtmxEvents.enum.afterSettle}
            add .hidden to #refusalModal
            go to the top of body smoothly
            trigger ${AUTO_GO_BACK_EVENT}(type: 'success', message: 'Modération refusé !') on #auto_go_back
          `}
      >
        <div class="mb-1 flex items-center justify-between">
          <input
            class="fr-input hidden"
            type="text"
            name={reject_form_schema.keyof().enum.subject}
            value={`[ProConnect] Demande pour rejoindre « ${moderation.organization.cached_libelle} »`}
          />
          <p class="mb-0 text-lg font-bold">❌ Refuser</p>
          <button
            class="fr-btn fr-icon-subtract-line fr-btn--tertiary-no-outline"
            type="button"
            _={`
              on click
                add .hidden to #refusalModal
            `}
          >
            Label bouton
          </button>
        </div>
        <p class="mb-1">
          A propos de{" "}
          <span class="font-bold text-[--text-action-high-blue-france]">
            {userEmail}{" "}
          </span>
          pour l'organisation <b>{moderation.organization.cached_libelle}</b>
        </p>
        <p class="mb-1">Motif de refus :</p>
        <ResponseMessageSelector $message={$modal_message} />
        <div class="my-2">
          <label class="fr-label" for={$modal_message}>
            Message
          </label>
          <textarea
            class="fr-input"
            rows={15}
            id={$modal_message}
            name={reject_form_schema.keyof().enum.message}
            _={`
                on change set ${$modal_message} to my value
              `}
          />
        </div>
        <button class={`${button()} justify-center`} type="submit">
          Notifier et terminer
        </button>
      </form>
    </div>
  );
}
