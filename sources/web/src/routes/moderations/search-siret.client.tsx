/* @jsxImportSource preact */
/**
 * SIRET Search Input (Client-side Preact Component)
 */

import { searchSiret } from "./filter-signals.client";

export interface SearchSiretProps extends Record<string, unknown> {
  id: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
}

export function SearchSiret({
  id,
  name,
  placeholder = "Recherche par SIRET",
  initialValue = "",
}: SearchSiretProps) {
  return (
    <input
      class="fr-input"
      id={id}
      name={name}
      onInput={(e) => (searchSiret.value = e.currentTarget.value)}
      placeholder={placeholder}
      value={searchSiret.value || initialValue}
    />
  );
}
