/* @jsxImportSource preact */
/**
 * Moderated By Search Select (Client-side Preact Component)
 */

import { searchModeratedBy } from "./filter-signals.client";

export interface SearchModeratedByProps extends Record<string, unknown> {
  id: string;
  name: string;
  initialValue?: string;
  allowedUsers: string[];
}

export function SearchModeratedBy({
  id,
  name,
  initialValue = "",
  allowedUsers,
}: SearchModeratedByProps) {
  return (
    <select
      class="block w-full px-4 py-2 border border-grey-200 text-base bg-white focus:border-blue-france focus:outline-none"
      id={id}
      name={name}
      onChange={(e) => (searchModeratedBy.value = e.currentTarget.value)}
      value={searchModeratedBy.value || initialValue}
    >
      <option value="">Tous les modérateurs</option>
      {allowedUsers.map((user) => (
        <option key={user} value={user}>
          {user}
        </option>
      ))}
    </select>
  );
}
