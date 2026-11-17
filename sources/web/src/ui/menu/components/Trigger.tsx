//

import { button } from "#src/ui/button";
import { visually_hidden } from "../../visually_hidden";
import type { TriggerProps } from "./Menu";

export function Trigger(props: TriggerProps) {
  return (
    <button class={button({ intent: "ghost" })} type="button" {...props}>
      <svg
        aria-hidden="true"
        class="h-5 w-5"
        fill="currentColor"
        focusable="false"
        viewBox="0 0 16 3"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z" />
      </svg>

      <span class={visually_hidden()}>Menu</span>
    </button>
  );
}
