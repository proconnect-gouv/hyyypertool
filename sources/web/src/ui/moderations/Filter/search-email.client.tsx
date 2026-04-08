/* @jsxImportSource preact */

import { input } from "#src/ui/form";
import { parsed, update_q } from "./q-signal.client";

export interface SearchEmailProps extends Record<string, unknown> {
  placeholder?: string;
}

export function SearchEmail({
  placeholder = "Recherche par Email",
}: SearchEmailProps) {
  return (
    <input
      class={input()}
      placeholder={placeholder}
      type="text"
      value={parsed.value.search_email}
      onInput={(e) => {
        update_q((s) => {
          s.search_email = e.currentTarget.value;
          s.processed_requests = undefined;
          s.search_type = "";
          s.exclude_types = [];
        });
      }}
    />
  );
}
