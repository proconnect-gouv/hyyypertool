//

import type { JSX, PropsWithChildren } from "hono/jsx";
import { tv, type VariantProps } from "tailwind-variants";

//

export function Popover({
  children,
  placement,
  ...other_props
}: PropsWithChildren<
  JSX.IntrinsicElements["div"] & VariantProps<typeof styles>
>) {
  return (
    <div
      aria-orientation="vertical"
      class={styles({ placement })}
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

const styles = tv({
  base: `
    bg-background
    absolute
    z-50
    m-0
    w-max
    min-w-56
    rounded-md
    border-0
    p-0
    text-inherit
    shadow-[0_2px_6px_rgba(0,0,18,.16)]
    `,
  defaultVariants: { placement: "top_end" },
  variants: {
    placement: {
      bottom_start: "mt-1 origin-top-left [position-area:bottom_span-right]",
      top_end: "mb-1 origin-bottom-right [position-area:top_span-left]",
    },
  },
});
