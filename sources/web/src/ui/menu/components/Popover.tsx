//

import {
  createContext,
  useContext,
  type JSX,
  type PropsWithChildren,
} from "hono/jsx";
import { tv, type VariantProps } from "tailwind-variants";

//

export function Popover({
  children,
  placement,
  ...other_props
}: PropsWithChildren<
  JSX.IntrinsicElements["div"] & VariantProps<typeof styles>
>) {
  const { is_open } = useContext(Popover.Context);
  return (
    <div
      aria-orientation="vertical"
      class={styles({ placement })}
      hidden={!is_open}
      role="menu"
      tabindex={-1}
      {...other_props}
    >
      <div class="divide-border divide-y" role="none">
        {children}
      </div>
    </div>
  );
}

Popover.Context = createContext({ is_open: false });

const styles = tv({
  base: `
    bg-background
    absolute
    z-50
    w-max
    min-w-56
    rounded-md
    shadow-[0_2px_6px_rgba(0,0,18,.16)]
    `,
  defaultVariants: { placement: "top_end" },
  variants: {
    placement: {
      bottom_start: "top-full left-0 mt-1 origin-top-left",
      top_end: "right-0 bottom-full mb-1 origin-bottom-right",
    },
  },
});
