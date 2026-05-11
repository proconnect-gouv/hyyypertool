/* @jsxImportSource preact */

import { select } from "#src/ui/form";

//

export function ResponseMessageSelectorClient({
  moderation_id,
  response_templates,
}: {
  moderation_id: number;
  response_templates: { id: number; label: string }[];
}) {
  const datalist_id = `responses-type-${moderation_id}`;
  const textarea_id = `rejection-message-${moderation_id}`;

  const handleChange = async (e: Event) => {
    const value = (e.currentTarget as HTMLInputElement).value.trim();
    if (!value) return;

    const datalist = document.getElementById(datalist_id);
    const option = datalist?.querySelector(`option[value="${value}"]`);
    const template_id = (option as HTMLOptionElement | null)?.dataset.id;
    if (!template_id) return;

    const url = `/moderations/${moderation_id}/rejected/reason/${template_id}`;
    const res = await fetch(url);
    const content = await res.text();

    const textarea_message = document.getElementById(textarea_id);
    if (!(textarea_message instanceof HTMLTextAreaElement)) return;

    textarea_message.value = content;
    textarea_message.focus();
    textarea_message.select();
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
        onChange={handleChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") e.preventDefault();
        }}
      />
      <datalist id={datalist_id}>
        {response_templates.map(({ id, label }) => (
          <option key={id} value={label.trim()} data-id={id} />
        ))}
      </datalist>
    </>
  );
}
