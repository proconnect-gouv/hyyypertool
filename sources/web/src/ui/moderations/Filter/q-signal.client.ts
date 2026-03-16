import { computed, signal } from "@preact/signals";
import {
  type Search,
  parse_q,
  serialize_q,
} from "../../../routes/moderations/parse_q";

//

export const text = signal("");
export const parsed = computed(() => parse_q(text.value));

//

let debounce_timer: ReturnType<typeof setTimeout> | null = null;

export function dispatch_change() {
  const el = document.getElementById("q") as HTMLInputElement | null;
  if (!el) return;
  // Sync signal → DOM before dispatching so HTMX reads the current value.
  el.value = text.value;
  // Reset to page 1 on user-initiated filter changes.
  const page_el = document.getElementById(
    "moderation_table_page",
  ) as HTMLInputElement | null;
  if (page_el) page_el.value = "1";
  el.dispatchEvent(new Event("change", { bubbles: true }));
}

export function schedule_change() {
  if (debounce_timer) clearTimeout(debounce_timer);
  debounce_timer = setTimeout(dispatch_change, 400);
}

export function flush_change() {
  if (debounce_timer) clearTimeout(debounce_timer);
  dispatch_change();
}

//

export function update_q(mutate: (search: Search) => void, immediate = false) {
  const search = parse_q(text.value);
  mutate(search);
  text.value = serialize_q(search);
  if (immediate) dispatch_change();
  else schedule_change();
}
