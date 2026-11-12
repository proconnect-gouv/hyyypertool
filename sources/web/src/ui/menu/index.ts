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
