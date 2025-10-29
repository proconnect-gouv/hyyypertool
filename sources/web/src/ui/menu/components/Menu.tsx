//

import { createSlot } from "hono-slotify";
import type { JSX, PropsWithChildren } from "hono/jsx";
import { createHash } from "node:crypto";
import { Popover } from "./Popover";

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

export interface MenuProps {
  is_open?: boolean;
}

export function Menu({ children, ...props }: PropsWithChildren<MenuProps>) {
  const $trigger = hyper_ref("menu_trigger");
  const $popover = hyper_ref("menu_popover");
  const is_open = props.is_open ?? false;

  return (
    <div class="relative inline-block">
      <Menu.Trigger.Renderer
        aria-controls={$popover}
        aria-expanded={is_open}
        aria-haspopup="menu"
        childs={children}
        id={$trigger}
        role="button"
        target_id={$popover}
      />
      <Popover.Context.Provider value={{ is_open }}>
        <Menu.Popover.Renderer
          aria-hidden={!is_open}
          aria-labelledby={$trigger}
          childs={children}
          id={$popover}
          role="menu"
        />
      </Popover.Context.Provider>
    </div>
  );
}

//

Menu.Trigger = createSlot<
  JSX.IntrinsicElements["div"] & { target_id: string }
>();
Menu.Popover = createSlot<JSX.IntrinsicElements["div"]>();
