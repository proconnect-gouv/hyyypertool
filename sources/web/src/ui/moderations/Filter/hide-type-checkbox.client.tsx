/* @jsxImportSource preact */

import { parsed, update_q } from "./q-signal.client";

export interface HideTypeCheckboxProps extends Record<string, unknown> {
  qualifier: "non_verified_domain" | "organization_join_block";
  label: string;
}

export function HideTypeCheckbox({ qualifier, label }: HideTypeCheckboxProps) {
  const is_checked =
    qualifier === "non_verified_domain"
      ? parsed.value.hide_non_verified_domain
      : parsed.value.hide_join_organization;

  return (
    <label class="fr-tag m-1 bg-(--background-action-low-blue-france) has-checked:bg-(--blue-france-sun-113-625) has-checked:text-white">
      <input
        checked={is_checked}
        hidden
        type="checkbox"
        onChange={(e) => {
          update_q((s) => {
            if (qualifier === "non_verified_domain") {
              s.hide_non_verified_domain = e.currentTarget.checked;
            } else {
              s.hide_join_organization = e.currentTarget.checked;
            }
          }, true);
        }}
      />
      {label}
    </label>
  );
}
