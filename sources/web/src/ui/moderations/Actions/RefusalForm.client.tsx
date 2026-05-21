/* @jsxImportSource preact */

import { MODERATION_EVENTS } from "#src/lib/moderations/event";
import { reject_form_fields } from "#src/lib/moderations/schema";
import { button } from "#src/ui/button";
import { input, label } from "#src/ui/form";
import { icon } from "#src/ui/icons";
import { AUTO_GO_BACK_EVENT } from "#src/ui/moderations/AutoGoBack";
import { useRef, useState } from "preact/hooks";
import { ResponseMessageSelectorClient } from "./response-message-selector.client";

//

export interface RefusalFormProps extends Record<string, unknown> {
  moderation_id: number;
  user_email: string;
  organization_name: string | null;
  response_templates: { id: number; label: string; end_user_reason: string }[];
}

export function RefusalForm({
  moderation_id,
  user_email,
  organization_name,
  response_templates,
}: RefusalFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [end_user_reason, set_end_user_reason] = useState("");
  const textarea_ref = useRef<HTMLTextAreaElement>(null);

  const subject = `[ProConnect] Demande pour rejoindre « ${organization_name} »`;

  const handleClose = () => {
    document.getElementById("refusalModal")?.classList.add("hidden");
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setSubmitting(true);
    const form = e.currentTarget as HTMLFormElement;
    const body = new FormData(form);

    const res = await fetch(`/moderations/${moderation_id}/rejected`, {
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

  return (
    <div
      id="refusalModal"
      class="border-blue-france bg-surface fixed right-0 bottom-14 z-751 m-2 hidden w-4/6 justify-self-end border-solid px-8 py-6 shadow-lg"
      aria-label="la modale de refus"
    >
      <form onSubmit={handleSubmit}>
        <input
          class="hidden"
          type="text"
          name={reject_form_fields.subject}
          value={subject}
          disabled={submitting}
        />
        <input
          class="hidden"
          type="text"
          name={reject_form_fields.end_user_reason}
          value={end_user_reason}
          disabled={submitting}
        />
        <div class="mb-1 flex items-center justify-between">
          <p class="mb-0 text-lg font-bold">❌ Refuser</p>
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
        <p class="mb-1">
          A propos de{" "}
          <span class="text-blue-france dark:text-blue-france-925 font-bold">
            {user_email}{" "}
          </span>
          pour l'organisation <b>{organization_name}</b>
        </p>
        <p class="mb-1">Motif de refus :</p>
        <ResponseMessageSelectorClient
          moderation_id={moderation_id}
          response_templates={response_templates}
          textarea_ref={textarea_ref}
          onSelect={set_end_user_reason}
        />
        <div class="my-2">
          <label class={label()} for="rejection-message">
            Message
          </label>
          <textarea
            class={input()}
            rows={15}
            id="rejection-message"
            name={reject_form_fields.message}
            ref={textarea_ref}
            disabled={submitting}
          />
        </div>
        <button
          class={`${button()} justify-center`}
          type="submit"
          disabled={submitting}
        >
          Notifier et terminer
        </button>
      </form>
    </div>
  );
}
