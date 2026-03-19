/* @jsxImportSource preact */

import { date_to_dom_string } from "#src/time";
import { input } from "#src/ui/form";
import { parsed, update_q } from "./q-signal.client";

export interface SearchDateProps extends Record<string, unknown> {}

export function SearchDate({}: SearchDateProps) {
  return (
    <input
      class={input()}
      max={date_to_dom_string(new Date())}
      type="date"
      value={date_to_dom_string(parsed.value.day)}
      onInput={(e) => {
        const value = e.currentTarget.value;
        update_q((s) => {
          s.day = value ? new Date(value) : undefined;
        }, true);
      }}
    />
  );
}
