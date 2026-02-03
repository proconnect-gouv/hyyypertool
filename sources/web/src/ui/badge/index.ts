//

import { tv } from "tailwind-variants";

//

export const badge = tv({
  base: `fr-badge`,
  variants: {
    intent: {
      error: "fr-badge--error",
      info: "fr-badge--info",
      success: "fr-badge--success",
      warning: "fr-badge--warning",
    },
  },
});
