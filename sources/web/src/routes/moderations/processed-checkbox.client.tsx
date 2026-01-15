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
    <div class="fr-checkbox-group">
      <input
        checked={hasSearchValue.value || initialChecked}
        id={id}
        name={name}
        type="checkbox"
        value={value}
      />
      <label class="fr-label" for={id}>
        Voir les demandes traitées
      </label>
    </div>
  );
}
