//

import { tv, type VariantProps } from "tailwind-variants";

//

export const badge = tv({
  base: `
    bg-grey-contrast
    text-grey-1000
    inline-flex
    min-h-6
    w-fit
    items-center
    gap-1
    rounded-sm
    px-2
    py-1
    text-xs
    leading-4
    font-bold
    uppercase
    `,
  variants: {
    intent: {
      error: "text-label-error bg-alt-red-marianne",
      info: "text-label-info bg-blue-ecume",
      new: "text-accent-brown-caramel bg-alt-brown-caramel",
      success: "text-label-success bg-alt-green-emeraude",
      warning: "text-label-warning bg-alt-orange-terre-battue",
    },
    size: {
      sm: "min-h-5 gap-0.5 px-1.5 py-0.5 text-[0.625rem] leading-3",
    },
    icon: {
      left: "[&>svg:first-child]:-ml-0.5",
      right: "[&>svg:last-child]:-mr-0.5",
    },
  },
});

export type BadgeVariantProps = VariantProps<typeof badge>;
