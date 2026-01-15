/* @jsxImportSource preact */
/**
 * Moderated By Search Input (Client-side Preact Component)
 */

import { searchModeratedBy } from "./filter-signals.client";

export interface SearchModeratedByProps extends Record<string, unknown> {
  id: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
}

export function SearchModeratedBy({
  id,
  name,
  placeholder = "Recherche par email du modérateur",
  initialValue = "",
}: SearchModeratedByProps) {
  return (
    <input
      class="fr-input"
      id={id}
      name={name}
      onInput={(e) => (searchModeratedBy.value = e.currentTarget.value)}
      placeholder={placeholder}
      value={searchModeratedBy.value || initialValue}
    />
  );
}
