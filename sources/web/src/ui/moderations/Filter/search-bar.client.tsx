/* @jsxImportSource preact */

import { effect, signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { flush_change, schedule_change, text } from "./q-signal.client";

//

export interface SearchBarProps extends Record<string, unknown> {
  initialQ: string;
  moderators_list: string[];
  sp_names_list: string[];
}

interface Suggestion {
  label: string;
  hint?: string;
  insert: string;
  /** If true, selecting this just inserts the qualifier prefix and keeps the dropdown open */
  is_category?: boolean;
}

const NO_SERVICE_LABEL = "(sans service)";

//

const dropdown_open = signal(false);
const selected_index = signal(0);

function get_last_token(value: string): string {
  const parts = value.split(" ");
  return parts[parts.length - 1] ?? "";
}

function replace_last_token(value: string, replacement: string): string {
  const parts = value.split(" ");
  parts[parts.length - 1] = replacement;
  return parts.join(" ");
}

//

const CATEGORIES: Suggestion[] = [
  // {
  //   label: "Filtrer par statut",
  //   hint: "is:",
  //   insert: "is:",
  //   is_category: true,
  // },
  // {
  //   label: "Filtrer par email",
  //   hint: "email:",
  //   insert: "email:",
  //   is_category: true,
  // },
  // {
  //   label: "Filtrer par SIRET",
  //   hint: "siret:",
  //   insert: "siret:",
  //   is_category: true,
  // },
  // {
  //   label: "Filtrer par date",
  //   hint: "date:",
  //   insert: "date:",
  //   is_category: true,
  // },
  // { label: "Modéré par", hint: "by:", insert: "by:", is_category: true },
  // {
  //   label: "Exclure un type",
  //   hint: "-type:",
  //   insert: "-type:",
  //   is_category: true,
  // },
  // {
  //   label: "Exclure un service",
  //   hint: "-service:",
  //   insert: "-service:",
  //   is_category: true,
  // },
  // { label: "Demandes en attente", hint: "", insert: "is:pending" },
  // { label: "Demandes traitées", hint: "", insert: "is:processed" },
  // {
  //   label: "Cacher les Non vérifié",
  //   hint: "",
  //   insert: "-type:non_verified_domain",
  // },
  // {
  //   label: "Cacher les A traiter",
  //   hint: "",
  //   insert: "-type:organization_join_block",
  // },
];

function get_suggestions(
  last_token: string,
  moderators_list: string[],
  sp_names_list: string[],
): Suggestion[] {
  if (!last_token) return CATEGORIES;

  const qual_match = /^(-?\w+):(.*)$/.exec(last_token);
  if (qual_match) {
    const qualifier = qual_match[1]! + ":";
    const partial = qual_match[2]!.toLowerCase();
    return get_value_suggestions(
      qualifier,
      partial,
      moderators_list,
      sp_names_list,
    );
  }

  // Fuzzy match on category labels and hints
  const lower = last_token.toLowerCase();
  return CATEGORIES.filter(
    (c) =>
      c.label.toLowerCase().includes(lower) ||
      c.hint?.toLowerCase().includes(lower) ||
      c.insert.toLowerCase().includes(lower),
  );
}

function get_value_suggestions(
  qualifier: string,
  partial: string,
  moderators_list: string[],
  sp_names_list: string[],
): Suggestion[] {
  switch (qualifier) {
    case "is:":
      return [
        { label: "En attente", hint: "pending", insert: "is:pending" },
        { label: "Traitées", hint: "processed", insert: "is:processed" },
      ].filter(
        (s) =>
          s.hint!.includes(partial) || s.label.toLowerCase().includes(partial),
      );

    case "-type:":
      return [
        {
          label: "Non vérifié",
          hint: "non_verified_domain",
          insert: "-type:non_verified_domain",
        },
        {
          label: "A traiter",
          hint: "organization_join_block",
          insert: "-type:organization_join_block",
        },
      ].filter(
        (s) =>
          s.hint!.includes(partial) || s.label.toLowerCase().includes(partial),
      );

    case "by:":
      return moderators_list
        .filter((m) => m.toLowerCase().includes(partial))
        .map((m) => ({ label: m, insert: `by:${m}` }));

    case "-service:":
      return sp_names_list
        .filter((s) => (s || NO_SERVICE_LABEL).toLowerCase().includes(partial))
        .map((s) => ({
          label: s || NO_SERVICE_LABEL,
          insert: `-service:${s || '""'}`,
        }));

    default:
      return [];
  }
}

//

export function SearchBar({
  initialQ,
  moderators_list,
  sp_names_list,
}: SearchBarProps) {
  const input_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    text.value = initialQ;

    // Sync text signal → #q DOM value imperatively.
    // Runs synchronously on every signal change, so the DOM value
    // is always up-to-date before HTMX reads it via hx-include.
    return effect(() => {
      if (input_ref.current) input_ref.current.value = text.value;
    });
  }, []);

  const last_token = get_last_token(text.value);
  const suggestions = get_suggestions(
    last_token,
    moderators_list,
    sp_names_list,
  );

  const accept_suggestion = (suggestion: Suggestion) => {
    text.value = replace_last_token(text.value, suggestion.insert);
    selected_index.value = 0;
    input_ref.current?.focus();

    if (suggestion.is_category) {
      dropdown_open.value = true;
    } else {
      text.value = text.value + " ";
      dropdown_open.value = false;
      schedule_change();
    }
  };

  const on_keydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      dropdown_open.value = false;
      return;
    }

    if (e.key === "ArrowDown" && dropdown_open.value) {
      e.preventDefault();
      selected_index.value = Math.min(
        selected_index.value + 1,
        suggestions.length - 1,
      );
      return;
    }

    if (e.key === "ArrowUp" && dropdown_open.value) {
      e.preventDefault();
      selected_index.value = Math.max(selected_index.value - 1, 0);
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      if (dropdown_open.value && suggestions.length > 0) {
        accept_suggestion(suggestions[selected_index.value]!);
      } else {
        dropdown_open.value = false;
        flush_change();
      }
      return;
    }
  };

  return (
    <div class="fr-input-group">
      <label class="fr-label" for="filter-email">
        Hyyyper Filter
      </label>
      <div class="relative">
        <input
          autocomplete="off"
          class="fr-input w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
          id="q"
          name="q"
          placeholder="Filtrer les modérations…"
          ref={input_ref}
          type="search"
          value={text.value}
          onInput={(e) => {
            text.value = (e.target as HTMLInputElement).value;
            dropdown_open.value = true;
            selected_index.value = 0;
            schedule_change();
          }}
          onFocus={() => {
            dropdown_open.value = true;
            selected_index.value = 0;
          }}
          onBlur={() => {
            setTimeout(() => (dropdown_open.value = false), 200);
          }}
          onKeyDown={on_keydown}
        />

        {dropdown_open.value && suggestions.length > 0 && (
          <ul
            class="absolute top-full left-0 z-10 mt-1 max-h-80 w-full overflow-y-auto rounded border border-gray-300 bg-white py-1 shadow-lg"
            role="listbox"
          >
            {suggestions.map((suggestion, i) => (
              <li
                key={suggestion.insert}
                role="option"
                aria-selected={i === selected_index.value}
                class={`flex cursor-pointer items-center justify-between px-3 py-1.5 text-sm ${
                  i === selected_index.value
                    ? "bg-blue-50 text-blue-900"
                    : "hover:bg-gray-50"
                }`}
                onMouseDown={(e) => {
                  e.preventDefault();
                  accept_suggestion(suggestion);
                }}
              >
                <span>{suggestion.label}</span>
                {suggestion.hint && (
                  <span class="text-xs text-gray-400">{suggestion.hint}</span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
