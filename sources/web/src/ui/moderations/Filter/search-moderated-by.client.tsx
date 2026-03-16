/* @jsxImportSource preact */

import { parsed, update_q } from "./q-signal.client";

export interface SearchModeratedByProps extends Record<string, unknown> {
  moderators_list: string[];
}

export function SearchModeratedBy({ moderators_list }: SearchModeratedByProps) {
  return (
    <select
      class="fr-select"
      value={parsed.value.search_moderated_by}
      onChange={(e) => {
        update_q((s) => {
          s.search_moderated_by = e.currentTarget.value;
        }, true);
      }}
    >
      <option value="">Tous les modérateurs</option>
      {moderators_list.map((user) => (
        <option key={user} value={user}>
          {user}
        </option>
      ))}
    </select>
  );
}
