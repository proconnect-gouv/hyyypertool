/* @jsxImportSource preact */
/**
 * Email Search Input (Client-side Preact Component)
 */

import { searchEmail } from "./filter-signals.client";

export interface SearchEmailProps extends Record<string, unknown> {
  id: string;
  name: string;
  placeholder?: string;
  initialValue?: string;
}

export function SearchEmail({
  id,
  name,
  placeholder = "Recherche par Email",
  initialValue = "",
}: SearchEmailProps) {
  return (
    <input
      class="fr-input"
      id={id}
      name={name}
      onInput={(e) => (searchEmail.value = e.currentTarget.value)}
      placeholder={placeholder}
      value={searchEmail.value || initialValue}
    />
  );
}
