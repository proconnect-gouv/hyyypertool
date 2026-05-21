/* @jsxImportSource preact */

import { MODERATION_EVENTS } from "#src/lib/moderations/event";
import { validate_form_fields } from "#src/lib/moderations/schema";
import { button } from "#src/ui/button";
import { checkbox_group, input } from "#src/ui/form";
import { icon } from "#src/ui/icons";
import { AUTO_GO_BACK_EVENT } from "#src/ui/moderations/AutoGoBack";
import { useState } from "preact/hooks";
import { MemberAndDomainPicker } from "./MemberAndDomainPicker.client";
import { TagInput } from "./TagInput";

//

export interface AcceptFormProps extends Record<string, unknown> {
  moderation_id: number;
  domain: string;
  given_name: string;
  user_email: string;
  organization_name: string | null;
  moderation_type: string;
}

export function AcceptForm({
  moderation_id,
  domain,
  given_name,
  user_email,
  organization_name,
  moderation_type,
}: AcceptFormProps) {
  const [submitting, setSubmitting] = useState(false);

  const send_notification_default = moderation_type !== "non_verified_domain";

  const handleClose = () => {
    document.getElementById("acceptModal")?.classList.add("hidden");
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget as HTMLFormElement;
    const body = new FormData(form);

    const res = await fetch(`/moderations/${moderation_id}/validate`, {
      method: "PATCH",
      body,
    });

    if (res.ok) {
      document.body.dispatchEvent(
        new CustomEvent(MODERATION_EVENTS.enum.MODERATION_UPDATED),
      );
      document
        .getElementById("auto_go_back")
        ?.dispatchEvent(new CustomEvent(AUTO_GO_BACK_EVENT));
    }

    setSubmitting(false);
  };

  const { base, label: checkbox_label } = checkbox_group();

  return (
    <div
      id="acceptModal"
      class="border-blue-france bg-surface fixed right-0 bottom-14 z-[calc(var(--ground)+777)] m-2 hidden justify-self-end border-solid px-8 py-4 shadow-lg"
      aria-label="la modale de validation"
    >
      <div class="mb-4 flex items-center justify-between">
        <p class="mb-0 text-lg font-bold">✅ Accepter</p>
        <button
          class={button({ icon: "only", intent: "ghost" })}
          type="button"
          disabled={submitting}
          onClick={handleClose}
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            width="1em"
            height="1em"
            aria-hidden="true"
          >
            <path class={icon({ name: "subtract" })} />
          </svg>
          <span class="sr-only">Fermer la modale</span>
        </button>
      </div>
      <p>
        A propos de{" "}
        <span class="text-blue-france dark:text-blue-france-925 font-bold">
          {user_email}{" "}
        </span>
        pour l'organisation <b>{organization_name}</b>, je valide :
      </p>
      <form onSubmit={handleSubmit}>
        <MemberAndDomainPicker domain={domain} given_name={given_name} />
        <div class="mb-5">
          <TagInput />
        </div>
        <div class="mb-5">
          <div class={base()}>
            <input
              class={input()}
              id="send_notification_checkbox"
              name={validate_form_fields.send_notification}
              type="checkbox"
              value="true"
              checked={send_notification_default}
              disabled={submitting}
            />
            <label
              class={checkbox_label({ class: "flex-row!" })}
              for="send_notification_checkbox"
            >
              Notifier <b class="mx-1">{user_email}</b> du traitement de la
              modération.
            </label>
          </div>
        </div>
        <div>
          <button class={button()} type="submit" disabled={submitting}>
            Terminer
          </button>
        </div>
      </form>
    </div>
  );
}
