//

import { tv } from "tailwind-variants";

//

export const quote = tv({
  base: "relative m-0 py-0 px-2 pb-8 border-b border-grey-200 md:pl-8 md:pb-0 md:border-b-0 md:border-l",
  slots: {
    author: "font-bold text-base leading-6",
    source: "flex flex-row flex-wrap text-xs leading-5 text-grey-850",
  },
  variants: {},
});
