import { tv, type VariantProps } from "tailwind-variants";

export const icon = tv({
  variants: {
    name: {
      "arrow-go-back": "icon-arrow-go-back",
      check: "icon-check",
      clipboard: "icon-clipboard",
      delete: "icon-delete",
      eye: "icon-eye",
      "eye-off": "icon-eye-off",
      logout: "icon-logout",
      search: "icon-search",
      subtract: "icon-subtract",
    },
  },
});

export type IconVariants = VariantProps<typeof icon>;
