//

import { button } from "#src/ui/button";
import { Svg } from "#src/ui/icons/components";
import type { PropsWithChildren } from "hono/jsx";
import { visually_hidden } from "../../visually_hidden";
import { Menu } from "./Menu";

//

export function HorizontalMenu({ children }: PropsWithChildren) {
  return (
    <Menu>
      <Menu.Trigger class={button({ intent: "ghost" })}>
        <Svg class="size-5" name="more" />
        <span class={visually_hidden()}>Menu</span>
      </Menu.Trigger>
      <Menu.Popover>{children}</Menu.Popover>
    </Menu>
  );
}
