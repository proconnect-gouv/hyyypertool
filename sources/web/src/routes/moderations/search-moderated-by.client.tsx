/* @jsxImportSource preact */
/**
 * Moderated By Search Select (Client-side Preact Component)
 */

import { searchModeratedBy } from "./filter-signals.client";

export interface SearchModeratedByProps extends Record<string, unknown> {
  id: string;
  name: string;
  initialValue?: string;
  moderations_list: string[];
}

export function SearchModeratedBy({
  id,
  name,
  initialValue = "",
  moderations_list,
}: SearchModeratedByProps) {
  return (
    <select
      class="fr-select"
      id={id}
      name={name}
      onChange={(e) => (searchModeratedBy.value = e.currentTarget.value)}
      value={searchModeratedBy.value || initialValue}
    >
      <option value="">Tous les modérateurs</option>
      {moderations_list.map((user) => (
        <option key={user} value={user}>
          {user}
        </option>
      ))}
    </select>
  );
}
