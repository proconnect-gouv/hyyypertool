/* @jsxImportSource preact */

import { button } from "#src/ui/button";
import { callout } from "#src/ui/callout";
import { useEffect, useRef, useState } from "preact/hooks";

//

export const AUTO_GO_BACK_EVENT = "AUTO_GO_BACK_EVENT";

export function AutoGoBack() {
  const [visible, set_visible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const go_back_soon = () => {
      clearTimeout(timer.current);
      set_visible(true);
      timer.current = setTimeout(() => history.back(), 2_000);
    };
    document.body.addEventListener(AUTO_GO_BACK_EVENT, go_back_soon);
    return () => {
      document.body.removeEventListener(AUTO_GO_BACK_EVENT, go_back_soon);
      clearTimeout(timer.current);
    };
  }, []);

  const cancel = () => {
    clearTimeout(timer.current);
    set_visible(false);
  };

  if (!visible) return null;

  const { base, text } = callout({ intent: "warning" });
  return (
    <section>
      <div class={`${base()} mt-2`}>
        <p class={text()}>
          Retour automatique à la page précédente dans 2 secondes
        </p>
        <button
          class={button()}
          onClick={() => {
            cancel();
            history.back();
          }}
          type="button"
        >
          Retour immédiat
        </button>{" "}
        <button
          class={button({ type: "tertiary" })}
          onClick={cancel}
          type="button"
        >
          Annuler
        </button>
      </div>
    </section>
  );
}
