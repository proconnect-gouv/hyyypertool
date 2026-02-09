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
      error: "text-text-default-error bg-background-alt-red-marianne",
      info: "text-text-default-info bg-background-alt-blue-ecume",
      new: "text-text-accent-brown-caramel bg-background-alt-brown-caramel",
      success: "text-text-default-success bg-background-alt-green-emeraude",
      warning: "text-text-default-warning bg-background-alt-orange-terre-battue",
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
