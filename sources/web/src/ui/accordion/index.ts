//

import { tv } from "tailwind-variants";

//

export const accordion = tv({
  base: "fr-accordion",
  slots: {
    btn: "fr-accordion__btn box-border",
  },
  variants: {
    tag: {
      ul: "[&>li]:!list-none",
    },
  },
});
