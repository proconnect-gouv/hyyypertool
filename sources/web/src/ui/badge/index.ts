//

import { tv } from "tailwind-variants";

//

export const badge = tv({
  base: [
    "inline-flex items-center w-fit",
    "text-sm leading-6 min-h-6 px-2",
    "font-bold uppercase rounded",
  ].join(" "),
  variants: {
    intent: {
      error: "text-[#ce0500] bg-[#ffe9e9]",
      info: "text-[#0063cb] bg-[#e8edff]",
      new: "text-[#695240] bg-[#feebd0]",
      success: "text-[#18753c] bg-[#b8fec9]",
      warning: "text-[#b34000] bg-[#ffe9e6]",
    },
  },
});
