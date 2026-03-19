//

import { tv, type VariantProps } from "tailwind-variants";

//

export const badge = tv({
  base: [
    "inline-flex items-center w-fit gap-1",
    "text-xs leading-4 min-h-6 px-2 py-1",
    "font-bold uppercase rounded-sm",
    "bg-grey-contrast text-grey-1000",
  ].join(" "),
  variants: {
    intent: {
      error: "text-label-error bg-alt-red-marianne",
      info: "text-label-info bg-blue-ecume",
      new: "text-accent-brown-caramel bg-alt-brown-caramel",
      success: "text-label-success bg-alt-green-emeraude",
      warning: "text-label-warning bg-alt-orange-terre-battue",
    },
    size: {
      sm: "text-[0.625rem] leading-3 min-h-5 px-1.5 py-0.5 gap-0.5",
    },
    icon: {
      left: "[&>svg:first-child]:-ml-0.5",
      right: "[&>svg:last-child]:-mr-0.5",
    },
  },
});

export type BadgeVariantProps = VariantProps<typeof badge>;
