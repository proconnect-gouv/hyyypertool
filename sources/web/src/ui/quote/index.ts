//

import { tv } from "tailwind-variants";

//

export const quote = tv({
  base: "border-grey-200 relative m-0 border-b px-2 py-0 pb-8 md:border-b-0 md:border-l md:pb-0 md:pl-8",
  slots: {
    author: "mb-0 text-base leading-6 font-bold",
    source: "text-text-muted flex flex-row flex-wrap text-xs leading-5",
  },
  variants: {},
});
