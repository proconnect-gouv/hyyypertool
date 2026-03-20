//

import { tv } from "tailwind-variants";

//

export const tag = tv({
  base: `
    bg-blue-france-925
    text-grey-850
    has-checked:bg-blue-france
    inline-flex
    min-h-8
    w-fit
    min-w-9
    cursor-pointer
    items-center
    justify-center
    rounded-full
    px-3
    py-1
    text-sm
    leading-6
    has-checked:text-white
  `,
  variants: {
    size: {
      sm: `
        min-h-6
        rounded-xl
        px-2
        py-0.5
        text-xs
        leading-5
      `,
    },
    dismiss: {
      true: `
        bg-blue-france
        text-white
      `,
    },
  },
});
