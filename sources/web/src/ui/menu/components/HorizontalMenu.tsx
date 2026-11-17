//

import type { PropsWithChildren } from "hono/jsx";
import { Menu } from "./Menu";
import { Popover } from "./Popover";
import { Trigger } from "./Trigger";

//

export function HorizontalMenu({ children }: PropsWithChildren) {
  return (
    <Menu>
      <Menu.Trigger>{(props) => <Trigger {...props} />}</Menu.Trigger>
      <Menu.Popover>
        {(props) => <Popover {...props}>{children}</Popover>}
      </Menu.Popover>
    </Menu>
  );
}
