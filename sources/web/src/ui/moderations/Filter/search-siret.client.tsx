/* @jsxImportSource preact */

import { input } from "#src/ui/form";
import { parsed, update_q } from "./q-signal.client";

export interface SearchSiretProps extends Record<string, unknown> {
  placeholder?: string;
}

export function SearchSiret({
  placeholder = "Recherche par SIRET",
}: SearchSiretProps) {
  return (
    <input
      class={input()}
      placeholder={placeholder}
      type="text"
      value={parsed.value.search_siret}
      onInput={(e) => {
        update_q((s) => {
          s.search_siret = e.currentTarget.value;
        });
      }}
    />
  );
}
