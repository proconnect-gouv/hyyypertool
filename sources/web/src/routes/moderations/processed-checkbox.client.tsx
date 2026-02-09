/* @jsxImportSource preact */
/**
 * Processed Requests Checkbox (Client-side Preact Component)
 *
 * Auto-checks when user types in search email or siret inputs
 */

import { icon } from "#src/ui/icons";
import { tag } from "#src/ui/tag";
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
    <label class={tag({ class: "cursor-pointer gap-1 px-2" })}>
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
        <path class={icon({ name: "eye-off" })} />
      </svg>
      <svg
        class="hidden h-3.5 w-3.5 peer-checked:inline"
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path class={icon({ name: "eye" })} />
      </svg>
      <span class="text-xs font-medium">Voir les demandes traitées</span>
    </label>
  );
}
