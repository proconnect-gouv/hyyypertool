/* @jsxImportSource preact */

import { button } from "#src/ui/button";
import { input, input_group, label } from "#src/ui/form";
import { effect, signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import {
  dirty,
  flush_change,
  settle,
  submitted,
  text,
} from "./q-signal.client";
import {
  type Suggestion,
  get_suggestions,
  get_token_at_cursor,
  replace_token_at_cursor,
} from "./search-bar";

//

export interface SearchBarProps extends Record<string, unknown> {
  initial_q: string;
  moderators_list: string[];
  sp_names_list: string[];
}

//

const dropdown_open = signal(false);
const selected_index = signal(0);
const cursor_position = signal(0);

//

export function SearchBar({
  initial_q,
  moderators_list,
  sp_names_list,
}: SearchBarProps) {
  const input_ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    text.value = initial_q;
    submitted.value = initial_q;

    // Sync text signal → #q DOM value imperatively.
    // Runs synchronously on every signal change, so the DOM value
    // is always up-to-date before HTMX reads it via hx-include.
    const dispose = effect(() => {
      if (input_ref.current) input_ref.current.value = text.value;
    });

    // Reset dirty state only after HTMX response settles.
    document.addEventListener("htmx:afterSettle", settle);

    return () => {
      dispose();
      document.removeEventListener("htmx:afterSettle", settle);
    };
  }, []);

  const current_token = get_token_at_cursor(
    text.value,
    cursor_position.value,
  ).text;
  const suggestions = get_suggestions(
    current_token,
    moderators_list,
    sp_names_list,
  );

  const accept_suggestion = (suggestion: Suggestion) => {
    const { text: new_text, cursor: new_cursor } = replace_token_at_cursor(
      text.value,
      cursor_position.value,
      suggestion.insert,
    );
    text.value = new_text;
    selected_index.value = 0;

    if (suggestion.is_category) {
      cursor_position.value = new_cursor;
      dropdown_open.value = true;
    } else {
      // Add a trailing space after the inserted token
      const with_space =
        new_text.slice(0, new_cursor) +
        (new_text[new_cursor] === " " ? "" : " ") +
        new_text.slice(new_cursor);
      text.value = with_space;
      cursor_position.value = new_cursor + 1;
      dropdown_open.value = false;
    }

    // Restore focus and set cursor position
    requestAnimationFrame(() => {
      if (input_ref.current) {
        input_ref.current.focus();
        input_ref.current.setSelectionRange(
          cursor_position.value,
          cursor_position.value,
        );
      }
    });
  };

  const submit = () => {
    dropdown_open.value = false;
    flush_change();
  };

  const on_keydown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
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
        const suggestion = suggestions[selected_index.value]!;
        accept_suggestion(suggestion);
        if (!suggestion.is_category) submit();
      } else {
        submit();
      }
      return;
    }
  };

  return (
    <div class={input_group()}>
      <label class={label()} for="q">
        Hyyyper Filter
      </label>
      <div class="relative flex">
        <input
          autocomplete="off"
          class={input({ class: "rounded-r-none" })}
          id="q"
          name="q"
          placeholder="Filtrer les modérations…"
          ref={input_ref}
          type="search"
          value={text.value}
          onInput={(e) => {
            const el = e.target as HTMLInputElement;
            text.value = el.value;
            cursor_position.value = el.selectionStart ?? el.value.length;
            dropdown_open.value = true;
            selected_index.value = 0;
          }}
          onClick={(e) => {
            const el = e.target as HTMLInputElement;
            cursor_position.value = el.selectionStart ?? el.value.length;
            dropdown_open.value = true;
            selected_index.value = 0;
          }}
          onFocus={() => {
            dropdown_open.value = true;
            selected_index.value = 0;
          }}
          onBlur={() => {
            setTimeout(() => (dropdown_open.value = false), 200);
          }}
          onKeyDown={on_keydown}
          spellcheck={false}
        />
        <button
          class={button({
            type: dirty.value ? undefined : "secondary",
            class: "rounded-l-none",
          })}
          type="button"
          title="Rechercher"
          onClick={submit}
        >
          Rechercher
        </button>

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
