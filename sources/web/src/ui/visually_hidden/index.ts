//

import { tv } from "tailwind-variants";

//
export const visually_hidden = tv({
  base: `
    -m-px!
    h-px!
    w-px!
    overflow-hidden!
    border-0!
    p-0!
    whitespace-nowrap!
    [clip:rect(0,0,0,0)]!
    !absolute
  `,
});
