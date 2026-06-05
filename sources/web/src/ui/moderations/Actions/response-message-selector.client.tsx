/* @jsxImportSource preact */

import { select } from "#src/ui/form";

//

export function ResponseMessageSelectorClient({
  moderation_id,
  response_templates,
  onContent,
  onSelect,
}: {
  moderation_id: number;
  response_templates: {
    id: number;
    label: string;
    end_user_reason: string;
    allow_editing: boolean;
  }[];
  onContent?: (content: string) => void;
  onSelect?: (end_user_reason: string, allow_editing: boolean) => void;
}) {
  const datalist_id = `responses-type-${moderation_id}`;

  const handleChange = async (e: Event) => {
    const value = (e.currentTarget as HTMLInputElement).value.trim();
    if (!value) return;

    const datalist = document.getElementById(datalist_id);
    const option = datalist?.querySelector(`option[value="${value}"]`);
    const template_id = (option as HTMLOptionElement | null)?.dataset.id;
    const end_user_reason = (option as HTMLOptionElement | null)?.dataset
      .endUserReason;
    const allow_editing =
      (option as HTMLOptionElement | null)?.dataset.allowEditing === "true";
    if (!template_id) return;

    const url = `/moderations/${moderation_id}/rejected/reason/${template_id}`;
    const res = await fetch(url);
    if (!res.ok) return;
    const content = await res.text();

    onContent?.(content);
    onSelect?.(end_user_reason ?? "", allow_editing);
  };

  return (
    <>
      <input
        type="search"
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
