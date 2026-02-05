import { HtmxEvents, hx_disabled_form_elements } from "#src/htmx";
import { reject_form_schema } from "#src/lib/moderations";
import { button } from "#src/ui/button";
import { input, label } from "#src/ui/form";
import { Svg } from "#src/ui/icons/components";
import { urls } from "#src/urls";
import { useContext } from "hono/jsx";
import { AUTO_GO_BACK_EVENT } from "../AutoGoBack";
import { context } from "./context";
import { ResponseMessageSelector } from "./ResponseMessageSelector";

export async function RefusalModal({
  userEmail,
  response_templates,
}: {
  userEmail: string;
  response_templates: { label: string }[];
}) {
  const { moderation } = useContext(context);
  const textarea_id = `rejection-message-${moderation.id}`;

  return (
    <div
      class="border-blue-france bg-blue-france-975 fixed right-0 bottom-14 z-751 m-2 hidden w-4/6 justify-self-end border-solid px-8 py-6 shadow-lg"
      id="refusalModal"
      aria-label="la modale de refus"
    >
      <form
        {...urls.moderations[":id"].rejected.$hx_patch({
          param: { id: moderation.id },
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
            class="hidden"
            type="text"
            name={reject_form_schema.keyof().enum.subject}
            value={`[ProConnect] Demande pour rejoindre « ${moderation.organization.cached_libelle} »`}
          />
          <p class="mb-0 text-lg font-bold">❌ Refuser</p>
          <button
            class={button({ icon: "only", intent: "ghost" })}
            type="button"
            _={`
              on click
                add .hidden to #refusalModal
            `}
          >
            <Svg name="subtract" />
            <span class="sr-only">Fermer la modale</span>
          </button>
        </div>
        <p class="mb-1">
          A propos de{" "}
          <span class="text-blue-france font-bold">{userEmail} </span>
          pour l'organisation <b>{moderation.organization.cached_libelle}</b>
        </p>
        <p class="mb-1">Motif de refus :</p>
        <ResponseMessageSelector
          moderation_id={moderation.id}
          response_templates={response_templates}
        />
        <div class="my-2">
          <label class={label()} for={textarea_id}>
            Message
          </label>
          <textarea
            class={input()}
            rows={15}
            id={textarea_id}
            name={reject_form_schema.keyof().enum.message}
          />
        </div>
        <button class={`${button()} justify-center`} type="submit">
          Notifier et terminer
        </button>
      </form>
    </div>
  );
}
