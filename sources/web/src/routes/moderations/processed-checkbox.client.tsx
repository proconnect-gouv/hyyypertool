/* @jsxImportSource preact */
/**
 * Processed Requests Checkbox (Client-side Preact Component)
 *
 * Auto-checks when user types in search email or siret inputs
 */

import { computed } from "@preact/signals";
import {
  searchEmail,
  searchModeratedBy,
  searchSiret,
} from "./filter-signals.client";

export interface ProcessedCheckboxProps extends Record<string, unknown> {
  id: string;
  name: string;
  value: string;
  initialChecked?: boolean;
}

const hasSearchValue = computed(
  () => !!searchEmail.value || !!searchModeratedBy.value || !!searchSiret.value,
);

export function ProcessedCheckbox({
  id,
  name,
  value,
  initialChecked = false,
}: ProcessedCheckboxProps) {
  return (
    <label class="fr-tag m-1 bg-(--background-action-low-blue-france) has-checked:bg-(--blue-france-sun-113-625) has-checked:text-white">
      <input
        checked={hasSearchValue.value || initialChecked}
        hidden
        id={id}
        name={name}
        type="checkbox"
        value={value}
      />
      Voir les demandes traitées
    </label>
  );
}
