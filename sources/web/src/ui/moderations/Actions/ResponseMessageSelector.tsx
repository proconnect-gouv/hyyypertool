//

import { reject_form_schema } from "#src/lib/moderations";

//

export function ResponseMessageSelector({
  moderation_id,
  response_templates,
}: {
  moderation_id: number;
  response_templates: { label: string }[];
}) {
  return (
    <div>
      <input
        name={reject_form_schema.keyof().enum.reason}
        class="fr-select"
        list="responses-type"
        placeholder="Recherche d'une réponse type"
        autocomplete="off"
        hx-get={`/moderations/${moderation_id}/rejected/message`}
        hx-trigger="change"
        hx-include="this"
        hx-target={`#rejection-message-${moderation_id}`}
        hx-swap="outerHTML"
      />
      <datalist id="responses-type">
        {response_templates.map(({ label }, index) => (
          <option key={index} value={label} />
        ))}
      </datalist>
    </div>
  );
}
