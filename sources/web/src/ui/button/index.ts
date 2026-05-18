//

import { tv, type VariantProps } from "tailwind-variants";

//

export const button = tv({
  base: `
    bg-blue-france
    hover:bg-blue-france-hover
    dark:bg-blue-france-925
    dark:text-blue-france
    disabled:bg-grey-200
    disabled:text-grey-425
    dark:disabled:bg-grey-850
    dark:disabled:text-grey-625
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
    dark:hover:bg-white
  `,
  variants: {
    intent: {
      danger:
        "bg-error hover:bg-error-hover dark:bg-error dark:hover:bg-error-hover dark:text-white",
      dark: "bg-grey-1000 hover:bg-grey-850 dark:bg-grey-850 dark:hover:bg-grey-625 dark:text-white",
      ghost:
        "bg-transparent text-current hover:bg-current/10 dark:bg-transparent dark:text-current dark:hover:bg-current/10",
      success:
        "bg-green-bourgeon hover:enabled:bg-green-bourgeon-hover dark:bg-green-bourgeon dark:hover:bg-green-bourgeon-hover dark:text-white",
      warning:
        "bg-warning hover:bg-warning-hover dark:bg-warning dark:hover:bg-warning-hover dark:text-white",
    },
    size: {
      lg: "min-h-12 px-6 py-2 text-lg leading-7",
      sm: "min-h-8 gap-1 px-3 py-1 text-sm leading-6",
    },
    type: {
      tertiary:
        "text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover bg-transparent shadow-[inset_0_0_0_1px_var(--color-border)] dark:bg-transparent",
      secondary:
        "text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover bg-transparent shadow-[inset_0_0_0_1px_var(--color-blue-france-925)] dark:bg-transparent dark:shadow-[inset_0_0_0_1px_var(--color-blue-france-925)]",
      "tertiary-no-outline":
        "text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover bg-transparent shadow-none dark:bg-transparent",
      close:
        "ml-auto min-h-8 bg-transparent px-3 py-1 text-sm leading-6 text-current hover:bg-current/10 dark:bg-transparent dark:text-current dark:hover:bg-current/10",
    },
    icon: {
      left: "[&>svg:first-child]:-ml-0.5",
      right: "[&>svg:last-child]:-mr-0.5",
      only: "aspect-square justify-center p-0",
    },
  },
});

export type ButtonVariantProps = VariantProps<typeof button>;
