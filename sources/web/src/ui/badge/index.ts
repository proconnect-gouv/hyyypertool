//

import { tv } from "tailwind-variants";

//

export const badge = tv({
  base: `fr-badge`,
  variants: {
    intent: {
      error: { base: "fr-badge--error" },
      info: { base: "fr-badge--info" },
      success: { base: "fr-badge--success" },
      warning: { base: "fr-badge--warning" },
    },
  },
});
