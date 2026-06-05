/* @jsxImportSource preact */

import { MODERATION_EVENTS } from "#src/lib/moderations/event";
import {
  validate_form_fields,
  validate_form_schema,
} from "#src/lib/moderations/schema";
import { button } from "#src/ui/button";
import { checkbox_group, input, input_group } from "#src/ui/form";
import { icon } from "#src/ui/icons";
import { AUTO_GO_BACK_EVENT } from "#src/ui/moderations/AutoGoBack";
import { useState } from "preact/hooks";
import { MemberAndDomainPicker } from "./MemberAndDomainPicker.client";
import { TagInput } from "./TagInput";
import { toolbar_open } from "./toolbar-modal.signal";

//

const notify_danger = (message: string) =>
  window.dispatchEvent(
    new CustomEvent("notify", {
      detail: { variant: "danger", title: "Erreur", message },
    }),
  );

export interface AcceptFormProps {
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
  const [field_errors, set_field_errors] = useState<
    Partial<Record<"add_member", string>>
  >({});

  const send_notification_default = moderation_type !== "non_verified_domain";

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const body = new FormData(form);

    const parsed = validate_form_schema.safeParse(Object.fromEntries(body));
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
      const res = await fetch(`/moderations/${moderation_id}/validate`, {
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
        notify_danger(`Échec de la validation (${res.status})`);
      }
    } catch {
      notify_danger("Une erreur inattendue est survenue.");
    } finally {
      setSubmitting(false);
    }
  };

  const { base, label: checkbox_label } = checkbox_group();

  return (
    <div
      class={`border-blue-france bg-surface fixed right-0 bottom-14 z-[calc(var(--ground)+777)] m-2 justify-self-end border-solid px-8 py-4 shadow-lg ${toolbar_open.value === "accept" ? "" : "hidden"}`}
      aria-label="la modale de validation"
    >
      <div class="mb-4 flex items-center justify-between">
        <p class="mb-0 text-lg font-bold">✅ Accepter</p>
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
      <p>
        A propos de{" "}
        <span class="text-blue-france dark:text-blue-france-925 font-bold">
          {user_email}{" "}
        </span>
        pour l'organisation <b>{organization_name}</b>, je valide :
      </p>
      <form onSubmit={handleSubmit}>
        <div
          class={input_group({
            intent: field_errors.add_member ? "error" : undefined,
          })}
        >
          <MemberAndDomainPicker domain={domain} given_name={given_name} />
          {field_errors.add_member && (
            <p class="mt-1 text-sm text-red-600" role="alert">
              Veuillez sélectionner un type de membre.
            </p>
          )}
        </div>
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
              defaultChecked={send_notification_default}
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
