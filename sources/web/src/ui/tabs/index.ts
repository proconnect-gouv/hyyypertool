//

import { tv } from "tailwind-variants";

//

export const tabs = tv({
  base: "",
  slots: {
    list: "border-grey-200 m-0 mb-4 flex list-none gap-1 border-b p-0",
    tab: `
      text-grey-625
      hover:border-grey-200
      hover:text-grey-850
      -mb-px
      cursor-pointer
      border-b-2
      border-transparent
      px-4
      py-2
      text-sm
      font-medium
    `,
    panel: "",
  },
  variants: {
    selected: {
      true: {
        tab: "border-blue-france text-blue-france",
        panel: "block",
      },
      false: {
        panel: "hidden",
      },
    },
  },
});
