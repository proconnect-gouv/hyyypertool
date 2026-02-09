/* @jsxImportSource preact */
import { icon } from "#src/ui/icons";
import { search_bar } from "../index";

/**
 * SearchBar Component
 * Combines an input and a search button with the standard DSFR icon.
 */
export function SearchBar(props: {
  id?: string;
  name?: string;
  placeholder?: string;
  value?: string;
  onInput?: (e: any) => void;
  label?: string;
}) {
  const { base, input: input_slot, button: button_slot } = search_bar();
  return (
    <div class={base()}>
      {props.label && <label class="sr-only" for={props.id}>{props.label}</label>}
      <input
        class={input_slot()}
        id={props.id}
        name={props.name}
        onInput={props.onInput}
        placeholder={props.placeholder}
        type="search"
        value={props.value}
      />
      <button class={button_slot()} title="Rechercher" type="submit">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path class={icon({ name: "search" })} />
        </svg>
      </button>
    </div>
  );
}
