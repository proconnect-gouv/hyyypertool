//

import { tv, type VariantProps } from "tailwind-variants";

//

export const button = tv({
  base: [
    "inline-flex items-center w-fit",
    "font-medium text-base leading-6",
    "min-h-10 px-4 py-2",
    "bg-blue-france text-white",
    "hover:bg-blue-france-hover",
  ].join(" "),
  variants: {
    intent: {
      danger: "bg-error hover:bg-error-hover",
      dark: "bg-grey-1000 hover:bg-grey-850",
      ghost: "bg-transparent text-black hover:bg-grey-50",
      success: "bg-green-bourgeon hover:enabled:bg-green-bourgeon-hover",
      warning: "bg-warning hover:bg-warning-hover",
    },
    size: {
      lg: "text-lg leading-7 min-h-12 px-6 py-2",
      sm: "text-sm leading-6 min-h-8 px-3 py-1",
    },
    type: {
      tertiary:
        "bg-transparent text-blue-france shadow-[inset_0_0_0_1px_var(--color-grey-200)] hover:bg-grey-50",
      secondary:
        "bg-transparent text-blue-france shadow-[inset_0_0_0_1px_var(--color-blue-france)] hover:bg-blue-france-975",
      "tertiary-no-outline":
        "bg-transparent text-blue-france shadow-none hover:bg-grey-50",
      close: "text-sm leading-6 min-h-8 px-3 py-1 ml-auto",
    },
  },
});

export type ButtonVariantProps = VariantProps<typeof button>;
