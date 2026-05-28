/* @jsxImportSource preact */

import { parsed, update_q } from "./q-signal.client";

export interface SortHeaderProps extends Record<string, unknown> {
  name: string;
  label: string;
  "aria-sort"?: "ascending" | "descending";
}

export function SortHeader({
  name,
  label,
  "aria-sort": initial_sort,
}: SortHeaderProps) {
  const sort_asc = `${name}-asc`;
  const sort_desc = `${name}-desc`;

  const current = parsed.value.search_sort;
  const is_asc = current ? current === sort_asc : initial_sort === "ascending";
  const is_desc = current
    ? current === sort_desc
    : initial_sort === "descending";

  function handle_click() {
    update_q((s) => {
      s.search_sort = is_asc ? sort_desc : sort_asc;
    }, true);
  }

  return (
    <button
      type="button"
      aria-sort={is_asc ? "ascending" : is_desc ? "descending" : undefined}
      class="flex cursor-pointer items-center gap-1 font-semibold"
      onClick={handle_click}
    >
      {label}
      {is_asc && <span aria-hidden="true">↑</span>}
      {is_desc && <span aria-hidden="true">↓</span>}
    </button>
  );
}
