/* @jsxImportSource preact */

import { parsed, update_q } from "./q-signal.client";

export interface HideTypeCheckboxProps extends Record<string, unknown> {
  qualifier: "non_verified_domain" | "organization_join_block";
  label: string;
}

export function HideTypeCheckbox({ qualifier, label }: HideTypeCheckboxProps) {
  const is_checked = parsed.value.exclude_types.includes(qualifier);

  return (
    <label class="fr-tag m-1 bg-blue-france-925 has-checked:bg-(--blue-france-sun-113-625) has-checked:text-white">
      <input
        checked={is_checked}
        hidden
        type="checkbox"
        onChange={(e) => {
          update_q((s) => {
            if (e.currentTarget.checked) {
              if (!s.exclude_types.includes(qualifier))
                s.exclude_types.push(qualifier);
            } else {
              s.exclude_types = s.exclude_types.filter((t) => t !== qualifier);
            }
          }, true);
        }}
      />
      {label}
    </label>
  );
}
