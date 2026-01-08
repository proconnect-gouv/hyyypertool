//

import { tv, type VariantProps } from "tailwind-variants";

//

export const button = tv({
  base: "fr-btn",
  variants: {
    intent: {
      danger: "bg-(--error-425-625) hover:bg-(--error-425-625-hover)!",
      dark: "bg-(--grey-0-1000) hover:bg-(--grey-200-850)!",
      ghost:
        "bg-transparent text-black hover:bg-(--background-default-grey-hover)!",
      success:
        "bg-(--background-action-high-green-bourgeon) hover:enabled:bg-(--background-action-high-green-bourgeon-hover)!",
      warning:
        "bg-(--background-action-high-warning) hover:bg-(--background-action-high-warning-hover)!",
    },
    size: {
      lg: "fr-btn--lg",
      sm: "fr-btn--sm",
    },
    type: {
      tertiary: "fr-btn--tertiary",
    },
  },
});

export type ButtonVariantProps = VariantProps<typeof button>;
