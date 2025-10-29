//

import { tv } from "tailwind-variants";
import { visually_hidden } from "../visually_hidden";

//
export { Loader } from "./Loader";
export const loader = tv({
  base: `
    inline-block
    h-8
    w-8
    animate-spin
    rounded-full
    border-4
    border-solid
    border-current
    border-r-transparent
    align-[-0.125em]
    motion-reduce:animate-[spin_1.5s_linear_infinite]
  `,
  slots: {
    span: visually_hidden(),
  },
  variants: {
    htmx_indicator: {
      true: "htmx-indicator",
    },
  },
});
