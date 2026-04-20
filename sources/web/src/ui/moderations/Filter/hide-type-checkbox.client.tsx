/* @jsxImportSource preact */

import { tag } from "#src/ui/tag";
import { parsed, update_q } from "./q-signal.client";

export interface HideTypeCheckboxProps extends Record<string, unknown> {
  qualifier: "non_verified_domain" | "organization_join_block";
  label_on: string;
  label_off: string;
}

export function HideTypeCheckbox({
  qualifier,
  label_on,
  label_off,
}: HideTypeCheckboxProps) {
  const is_checked = parsed.value.exclude_types.includes(qualifier);

  return (
    <label class={tag({ class: "m-1" })}>
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
      {is_checked ? label_on : label_off}
    </label>
  );
}
