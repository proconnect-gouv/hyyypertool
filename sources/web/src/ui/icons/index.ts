import { tv, type VariantProps } from "tailwind-variants";

export const icon = tv({
  variants: {
    name: {
      "arrow-go-back": "icon-arrow-go-back",
      check: "icon-check",
      clipboard: "icon-clipboard",
      delete: "icon-delete",
      error: "icon-error",
      info: "icon-info",
      logout: "icon-logout",
      search: "icon-search",
      subtract: "icon-subtract",
      warning: "icon-warning",
    },
  },
});

export type IconVariants = VariantProps<typeof icon>;
