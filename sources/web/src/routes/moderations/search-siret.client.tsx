/* @jsxImportSource preact */
/**
 * SIRET Search Input (Client-side Preact Component)
 */

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
      placeholder={placeholder}
      defaultValue={initialValue}
    />
  );
}
