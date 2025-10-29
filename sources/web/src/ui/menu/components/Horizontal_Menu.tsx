//

import type { PropsWithChildren } from "hono/jsx";
import { Menu, type MenuProps } from "./Menu";
import { Popover } from "./Popover";
import { Trigger } from "./Trigger";

//

export function Horizontal_Menu({
  children,
  ...menu_props
}: PropsWithChildren<MenuProps>) {
  return (
    <Menu {...menu_props}>
      <Menu.Trigger>
        {({ target_id, ...props }) => (
          <Trigger target_id={target_id} {...props} />
        )}
      </Menu.Trigger>
      <Menu.Popover>
        {(props) => <Popover {...props}>{children}</Popover>}
      </Menu.Popover>
    </Menu>
  );
}
