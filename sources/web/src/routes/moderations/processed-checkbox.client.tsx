/* @jsxImportSource preact */
/**
 * Processed Requests Checkbox (Client-side Preact Component)
 *
 * Auto-checks when user types in search email or siret inputs
 */

import { computed } from "@preact/signals";
import { ICON_PATHS } from "#src/ui/icons";
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
    <label class="inline-flex cursor-pointer items-center gap-1 rounded-full border border-grey-200 px-2 py-0.5 text-xs font-medium m-1 bg-(--background-action-low-blue-france) has-checked:bg-(--blue-france-sun-113-625) has-checked:text-white">
      <input
        checked={hasSearchValue.value || initialChecked}
        class="peer"
        hidden
        id={id}
        name={name}
        type="checkbox"
        value={value}
      />
      <svg
        class="inline h-3.5 w-3.5 peer-checked:hidden"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d={ICON_PATHS.eye_off} />
      </svg>
      <svg
        class="hidden h-3.5 w-3.5 peer-checked:inline"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d={ICON_PATHS.eye} />
      </svg>
      Voir les demandes traitées
    </label>
  );
}
