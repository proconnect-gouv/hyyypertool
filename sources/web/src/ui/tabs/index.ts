//

import { tv } from "tailwind-variants";

//

export const tabs = tv({
  base: "",
  slots: {
    list: "border-grey-200 m-0 mb-4 flex list-none gap-1 border-b p-0",
    tab: `
      text-text-muted
      hover:border-grey-200
      hover:text-text-default
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
        tab: "border-blue-france dark:border-blue-france-925 text-blue-france dark:text-blue-france-925",
        panel: "block",
      },
      false: {
        panel: "hidden",
      },
    },
  },
});
