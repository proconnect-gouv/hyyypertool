//

import {
  createContext,
  useContext,
  type JSX,
  type PropsWithChildren,
} from "hono/jsx";
import { tv } from "tailwind-variants";

//

export function Popover({
  children,
  ...other_props
}: PropsWithChildren<JSX.IntrinsicElements["div"]>) {
  const { is_open } = useContext(Popover.Context);
  const base = styles();
  return (
    <div
      aria-orientation="vertical"
      class={base}
      hidden={!is_open}
      role="menu"
      tabindex={-1}
      {...other_props}
    >
      <div class="py-1" role="none">
        {children}
      </div>
    </div>
  );
}

Popover.Context = createContext({ is_open: false });

const styles = tv({
  base: `
    focus:outline-nones
    absolute
    right-0
    z-10
    mt-2
    w-56
    origin-top-right
    divide-y
    divide-gray-100
    rounded-md
    bg-white
    shadow
    `,
  variants: {},
});
