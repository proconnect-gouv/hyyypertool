//

import { tv, type VariantProps } from "tailwind-variants";

//

export const button = tv({
  base: `
    bg-blue-france
    hover:bg-blue-france-hover
    disabled:bg-grey-200
    disabled:text-grey-425
    inline-flex
    min-h-10
    w-fit
    items-center
    gap-2
    px-4
    py-2
    text-base
    leading-6
    font-medium
    text-white
    no-underline
    disabled:cursor-not-allowed
  `,
  variants: {
    intent: {
      danger: "bg-error hover:bg-error-hover",
      dark: "bg-grey-1000 hover:bg-grey-850",
      ghost: "bg-transparent text-current hover:bg-current/10",
      success: "bg-green-bourgeon hover:enabled:bg-green-bourgeon-hover",
      warning: "bg-warning hover:bg-warning-hover",
    },
    size: {
      lg: "min-h-12 px-6 py-2 text-lg leading-7",
      sm: "min-h-8 gap-1 px-3 py-1 text-sm leading-6",
    },
    type: {
      tertiary:
        "text-blue-france hover:bg-grey-50 bg-transparent shadow-[inset_0_0_0_1px_var(--color-grey-200)]",
      secondary:
        "text-blue-france hover:bg-blue-france-975 bg-transparent shadow-[inset_0_0_0_1px_var(--color-blue-france)]",
      "tertiary-no-outline":
        "text-blue-france hover:bg-grey-50 bg-transparent shadow-none",
      close: "ml-auto min-h-8 px-3 py-1 text-sm leading-6",
    },
    icon: {
      left: "[&>svg:first-child]:-ml-0.5",
      right: "[&>svg:last-child]:-mr-0.5",
      only: "aspect-square justify-center p-0",
    },
  },
});

export type ButtonVariantProps = VariantProps<typeof button>;
