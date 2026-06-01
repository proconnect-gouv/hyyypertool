/* @jsxImportSource preact */

import { select } from "#src/ui/form";

//

export function ResponseMessageSelectorClient({
  moderation_id,
  response_templates,
}: {
  moderation_id: number;
  response_templates: {
    id: number;
    label: string;
    end_user_reason: string;
    allow_editing: boolean;
  }[];
}) {
  const datalist_id = `responses-type-${moderation_id}`;
  const textarea_id = `rejection-message-${moderation_id}`;

  const handleChange = async (e: Event) => {
    const value = (e.currentTarget as HTMLInputElement).value.trim();
    if (!value) return;

    const datalist = document.getElementById(datalist_id);
    const option = datalist?.querySelector(`option[value="${value}"]`);
    const template_id = (option as HTMLOptionElement | null)?.dataset.id;
    const end_user_reason = (option as HTMLOptionElement | null)?.dataset
      .endUserReason;
    const allow_editing = (option as HTMLOptionElement | null)?.dataset
      .allowEditing;
    if (!template_id) return;

    const url = `/moderations/${moderation_id}/rejected/reason/${template_id}`;
    const res = await fetch(url);
    const content = await res.text();

    const textarea_message = document.getElementById(textarea_id);
    if (!(textarea_message instanceof HTMLTextAreaElement)) return;

    textarea_message.value = content;
    textarea_message.focus();
    textarea_message.select();

    const end_user_reason_input = document.getElementById(
      `end-user-reason-${moderation_id}`,
    );
    if (end_user_reason_input instanceof HTMLInputElement) {
      end_user_reason_input.value = String(end_user_reason);
    }

    const allow_editing_input = document.getElementById(
      `allow-editing-${moderation_id}`,
    );
    if (allow_editing_input instanceof HTMLInputElement) {
      allow_editing_input.value = String(allow_editing === "true");
    }
    const warning = document.getElementById(
      `allow-editing-warning-${moderation_id}`,
    );
    if (warning instanceof HTMLElement) {
      warning.classList.toggle("hidden", allow_editing !== "true");
    }
  };

  return (
    <>
      <input
        type="search"
        name="reason"
        class={select()}
        list={datalist_id}
        placeholder="Recherche d'une réponse type"
        autocomplete="off"
        onInput={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      />
      <datalist id={datalist_id}>
        {response_templates.map(
          ({ id, label, end_user_reason, allow_editing }) => (
            <option
              key={id}
              value={label.trim()}
              data-id={id}
              data-end-user-reason={end_user_reason}
              data-allow-editing={String(allow_editing)}
            />
          ),
        )}
      </datalist>
    </>
  );
}
