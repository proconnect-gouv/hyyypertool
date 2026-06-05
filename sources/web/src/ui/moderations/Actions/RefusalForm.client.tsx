/* @jsxImportSource preact */

import { MODERATION_EVENTS } from "#src/lib/moderations/event";
import {
  reject_form_fields,
  reject_form_schema,
} from "#src/lib/moderations/schema";
import { button } from "#src/ui/button";
import { input, input_group, label } from "#src/ui/form";
import { icon } from "#src/ui/icons";
import { AUTO_GO_BACK_EVENT } from "#src/ui/moderations/AutoGoBack";
import { useRef, useState } from "preact/hooks";
import type { ResponseTemplateDto } from "../../../routes/response-templates/get_response_templates.query";
import { ResponseMessageSelectorClient } from "./response-message-selector.client";
import { toolbar_open } from "./toolbar-modal.signal";

//

const notify_danger = (message: string) =>
  window.dispatchEvent(
    new CustomEvent("notify", {
      detail: { variant: "danger", title: "Erreur", message },
    }),
  );

//

export interface RefusalFormProps {
  moderation_id: number;
  user_email: string;
  organization_name: string | null;
  response_templates: ResponseTemplateDto[];
}

export function RefusalForm({
  moderation_id,
  user_email,
  organization_name,
  response_templates,
}: RefusalFormProps) {
  const [submitting, setSubmitting] = useState(false);
  const [selection, set_selection] = useState<{
    end_user_reason: string;
    allow_editing: boolean;
  } | null>(null);
  const [field_errors, set_field_errors] = useState<
    Partial<Record<"end_user_reason" | "message", string>>
  >({});
  const textarea_ref = useRef<HTMLTextAreaElement>(null);

  const subject = `[ProConnect] Demande pour rejoindre « ${organization_name} »`;
  const { end_user_reason = "", allow_editing = false } = selection ?? {};

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const body = new FormData(form);

    const parsed = reject_form_schema.safeParse(Object.fromEntries(body));
    if (!parsed.success) {
      const errors: Partial<Record<string, string>> = {};
      for (const issue of parsed.error.issues) {
        const field = String(issue.path[0]);
        if (!errors[field]) errors[field] = issue.message;
      }
      set_field_errors(errors);
      return;
    }
    set_field_errors({});
    setSubmitting(true);

    try {
      const res = await fetch(`/moderations/${moderation_id}/rejected`, {
        method: "PATCH",
        body,
      });

      if (res.ok) {
        toolbar_open.value = null;
        document.body.dispatchEvent(
          new CustomEvent(MODERATION_EVENTS.enum.MODERATION_UPDATED),
        );
        document
          .getElementById("auto_go_back")
          ?.dispatchEvent(new CustomEvent(AUTO_GO_BACK_EVENT));
      } else {
        notify_danger(`Échec du refus (${res.status})`);
      }
    } catch {
      notify_danger("Une erreur inattendue est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      class={`border-blue-france bg-surface fixed right-0 bottom-14 z-751 m-2 w-4/6 justify-self-end border-solid px-8 py-6 shadow-lg ${toolbar_open.value === "refusal" ? "" : "hidden"}`}
      aria-label="la modale de refus"
    >
      <form onSubmit={handleSubmit}>
        <input
          type="hidden"
          name={reject_form_fields.subject}
          value={subject}
        />
        <input
          type="hidden"
          name={reject_form_fields.end_user_reason}
          value={end_user_reason}
        />
        <input
          type="hidden"
          name={reject_form_fields.allow_editing}
          value={String(allow_editing)}
        />
        <div class="mb-1 flex items-center justify-between">
          <p class="mb-0 text-lg font-bold">❌ Refuser</p>
          <button
            class={button({ icon: "only", intent: "ghost" })}
            type="button"
            disabled={submitting}
            onClick={() => (toolbar_open.value = null)}
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
        <div
          class={input_group({
            intent: field_errors.end_user_reason ? "error" : undefined,
          })}
        >
          <ResponseMessageSelectorClient
            moderation_id={moderation_id}
            response_templates={response_templates}
            onContent={(content) => {
              textarea_ref.current!.value = content;
              textarea_ref.current?.focus();
            }}
            onSelect={(reason, editing) =>
              set_selection({ end_user_reason: reason, allow_editing: editing })
            }
          />
          {field_errors.end_user_reason && (
            <p class="mt-1 text-sm text-red-600" role="alert">
              Veuillez sélectionner un motif de refus.
            </p>
          )}
          {allow_editing && (
            <p class="mt-1 text-sm text-amber-600" role="alert">
              ⚠️ Attention, cette réponse type autorise l'utilisateur à éditer
              ses informations personnelles.
            </p>
          )}
        </div>
        <div class="my-2">
          <label
            class={label({
              intent: field_errors.message ? "error" : undefined,
            })}
            for="rejection-message"
          >
            Message
          </label>
          <textarea
            class={input({
              intent: field_errors.message ? "error" : undefined,
            })}
            rows={15}
            id="rejection-message"
            name={reject_form_fields.message}
            ref={textarea_ref}
            disabled={submitting}
          />
          {field_errors.message && (
            <p class="mt-1 text-sm text-red-600" role="alert">
              Le message est obligatoire.
            </p>
          )}
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
