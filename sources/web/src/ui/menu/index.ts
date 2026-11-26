//

import { tv } from "tailwind-variants";

//

export const menu_item = tv({
  base: `
    text-blue-france
    dark:text-blue-france-925
    hover:bg-surface
    focus-visible:bg-surface
    block
    w-full
    px-4
    py-2
    text-left
    text-sm
    whitespace-nowrap
  `,
  variants: {
    override: {
      "[href]": "",
    },
  },
});

export const menu_chevron = tv({
  base: "size-4 transition-transform",
  defaultVariants: { placement: "top_end" },
  variants: {
    placement: {
      bottom_start: "group-has-[+:popover-open]:rotate-180",
      top_end: "rotate-180 group-has-[+:popover-open]:rotate-0",
    },
  },
});

export const menu_popover = tv({
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

export function menu_props(id: string) {
  const trigger_id = `${id}_trigger`;
  const popover_id = `${id}_popover`;
  return {
    popover: {
      "aria-labelledby": trigger_id,
      id: popover_id,
      popover: "auto",
      role: "menu",
      style: `position-anchor: --${trigger_id}`,
    },
    trigger: {
      "aria-haspopup": "menu",
      id: trigger_id,
      popovertarget: popover_id,
      style: `anchor-name: --${trigger_id}`,
    },
  } as const;
}
