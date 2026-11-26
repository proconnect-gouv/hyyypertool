//

import { Svg } from "#src/ui/icons/components";
import {
  menu_chevron,
  menu_item,
  menu_popover,
  menu_props,
} from "#src/ui/menu";
import { createContext, useContext, useState, type JSX } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";

type Children = { children?: unknown };

type Placement = VariantProps<typeof menu_popover>["placement"];

//

const MenuContext = createContext<
  (ReturnType<typeof menu_props> & { placement: Placement }) | null
>(null);

function use_menu() {
  const menu = useContext(MenuContext);
  if (!menu) throw new Error("Menu parts must be rendered inside <Menu>");
  return menu;
}

//

export function Menu({
  children,
  placement,
}: Children & { placement?: Placement }) {
  const [id] = useState(() => crypto.randomUUID().slice(0, 8));
  return (
    <MenuContext.Provider
      value={{ ...menu_props(`hyyyper_menu_${id}`), placement }}
    >
      <div class="inline-block">{children}</div>
    </MenuContext.Provider>
  );
}

function MenuTrigger({
  children,
  class: className,
  ...props
}: Omit<JSX.IntrinsicElements["button"], "children" | "class"> &
  Children & { class?: string }) {
  return (
    <button
      type="button"
      {...props}
      {...use_menu().trigger}
      class={`group ${className ?? ""}`}
    >
      {children}
    </button>
  );
}

function MenuChevron() {
  return (
    <Svg
      class={menu_chevron({ placement: use_menu().placement })}
      name="arrow-down-s"
    />
  );
}

function MenuItem({
  children,
  class: className,
  ...props
}: Omit<JSX.IntrinsicElements["button"], "children" | "class"> &
  Children & { class?: string }) {
  return (
    <button
      popovertarget={use_menu().popover.id}
      popovertargetaction="hide"
      role="menuitem"
      type="button"
      {...props}
      class={menu_item({ class: className })}
    >
      {children}
    </button>
  );
}

function MenuLink({
  children,
  class: className,
  ...props
}: Omit<JSX.IntrinsicElements["a"], "children" | "class"> &
  Children & { class?: string; href: string }) {
  return (
    <a
      role="menuitem"
      {...props}
      class={menu_item({ class: className, override: "[href]" })}
    >
      {children}
    </a>
  );
}

function MenuPopover({ children }: Children) {
  const { placement, popover } = use_menu();
  return (
    <div
      aria-orientation="vertical"
      class={menu_popover({ placement })}
      tabindex={-1}
      {...popover}
    >
      <div class="divide-border divide-y" role="none">
        {children}
      </div>
    </div>
  );
}

Menu.Chevron = MenuChevron;
Menu.Item = MenuItem;
Menu.Link = MenuLink;
Menu.Popover = MenuPopover;
Menu.Trigger = MenuTrigger;
