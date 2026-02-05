//

import { tv } from "tailwind-variants";

//

export const tabs = tv({
  base: "fr-tabs",
  slots: {
    list: "fr-tabs__list",
    tab: "fr-tabs__tab",
    panel: "fr-tabs__panel",
  },
  variants: {
    selected: {
      true: {
        tab: "fr-tabs__tab--selected",
        panel: "fr-tabs__panel--selected block! translate-x-0! opacity-100!",
      },
      false: {
        panel: "hidden!",
      },
    },
  },
});
