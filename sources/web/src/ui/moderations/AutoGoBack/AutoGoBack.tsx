//

import { button } from "#src/ui/button";
import { callout } from "#src/ui/callout";
import type { JSX } from "hono/jsx";

export const AUTO_GO_BACK_EVENT = "AUTO_GO_BACK_EVENT";

const on_auto_go_back_event = `
on ${AUTO_GO_BACK_EVENT}
  toggle .hidden
  remove @data-dry-run
  wait 2s
  toggle .hidden
  if @data-dry-run is "dry-run"
    exit
  end
  go back

on stop
  set @data-dry-run to "dry-run"
`;

export async function AutoGoBack({ ...html_props }: JSX.HTMLAttributes) {
  const { base, text } = callout({ intent: "warning" });
  return (
    <section class="hidden" _={on_auto_go_back_event} {...html_props}>
      <div class={base()}>
        <p class={text()}>
          Retour automatique à la page précédente dans 2 secondes
        </p>
        <button
          _={"on click send stop to closest parent <section/> then go back"}
          class={button()}
        >
          Retour immédiat
        </button>{" "}
        <button
          _={"on click send stop to closest parent <section/>"}
          class={button({ type: "tertiary" })}
        >
          Annuler
        </button>
      </div>
    </section>
  );
}
