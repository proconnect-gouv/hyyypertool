//

import { tv } from "tailwind-variants";

//

export const accordion = tv({
  base: "group border-grey-200 border-b",
  slots: {
    btn: `
      box-border
      flex
      w-full
      cursor-pointer
      items-center
      py-3
      text-left
      font-medium
      marker:hidden
      after:ml-auto
      after:shrink-0
      after:text-xs
      after:transition-transform
      after:content-['▶']
      group-open:after:rotate-90
      [&::-webkit-details-marker]:hidden
    `,
  },
  variants: {
    tag: {
      ul: "[&>li]:!list-none",
    },
  },
});
