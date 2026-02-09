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
      class="block w-full px-4 py-2 border border-grey-200 text-base focus:border-blue-france focus:outline-none"
      id={id}
      name={name}
      onInput={(e) => (searchSiret.value = e.currentTarget.value)}
      placeholder={placeholder}
      value={searchSiret.value || initialValue}
    />
  );
}
