/* @jsxImportSource preact */

import { parsed, update_q } from "./q-signal.client";

export interface ProcessedCheckboxProps extends Record<string, unknown> {}

export function ProcessedCheckbox({}: ProcessedCheckboxProps) {
  const { search_email, search_moderated_by, search_siret } = parsed.value;
  const has_search = !!search_email || !!search_moderated_by || !!search_siret;
  const is_checked =
    parsed.value.processed_requests === undefined || has_search;

  return (
    <label class="fr-tag m-1 bg-blue-france-925 has-checked:bg-(--blue-france-sun-113-625) has-checked:text-white">
      <input
        checked={is_checked}
        hidden
        type="checkbox"
        onChange={(e) => {
          update_q((s) => {
            // Checked = remove is:pending filter (show all including processed)
            // Unchecked = restore is:pending (only pending)
            s.processed_requests = e.currentTarget.checked ? undefined : false;
          }, true);
        }}
      />
      Voir les demandes traitées
    </label>
  );
}
