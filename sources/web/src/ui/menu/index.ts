//

import { tv } from "tailwind-variants";

//

export const menu_item = tv({
  base: `
    hover:bg-grey-50
    block
    w-full
    px-4
    py-2
    text-left
    text-sm
    text-gray-700
  `,
  variants: {
    override: {
      "[href]": "",
    },
  },
});
