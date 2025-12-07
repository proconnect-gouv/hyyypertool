/* @jsxImportSource preact */
/**
 * Email Search Input (Client-side Preact Component)
 */

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
      placeholder={placeholder}
      defaultValue={initialValue}
    />
  );
}
