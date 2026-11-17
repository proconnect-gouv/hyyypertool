//

import { createSlot } from "hono-slotify";
import type { JSX, PropsWithChildren } from "hono/jsx";
import { createHash } from "node:crypto";

//

/**
 * @deprecated use @~/web/html after app.ui migration
 */
function hyper_ref(given_name?: string) {
  const short_sha = createHash("sha1")
    .update(crypto.randomUUID())
    .digest("hex")
    .slice(0, 8);
  return given_name
    ? `hyyyper_${given_name}_${short_sha}`
    : `hyyyper_${short_sha}`;
}

//

export type TriggerProps = JSX.HTMLAttributes & { popovertarget?: string };

export function Menu({ children }: PropsWithChildren) {
  const $trigger = hyper_ref("menu_trigger");
  const $popover = hyper_ref("menu_popover");

  return (
    <div class="inline-block">
      <Menu.Trigger.Renderer
        aria-haspopup="menu"
        childs={children}
        id={$trigger}
        popovertarget={$popover}
        style={`anchor-name: --${$trigger}`}
      />
      <Menu.Popover.Renderer
        aria-labelledby={$trigger}
        childs={children}
        id={$popover}
        popover="auto"
        role="menu"
        style={`position-anchor: --${$trigger}`}
      />
    </div>
  );
}

//

Menu.Trigger = createSlot<TriggerProps>();
Menu.Popover = createSlot<JSX.IntrinsicElements["div"]>();
