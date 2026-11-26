import { tv, type VariantProps } from "tailwind-variants";

export const icon = tv({
  variants: {
    name: {
      "arrow-down-s": "icon-arrow-down-s",
      "arrow-go-back": "icon-arrow-go-back",
      check: "icon-check",
      clipboard: "icon-clipboard",
      delete: "icon-delete",
      error: "icon-error",
      global: "icon-global",
      info: "icon-info",
      logout: "icon-logout",
      more: "icon-more",
      new: "icon-new",
      search: "icon-search",
      shield: "icon-shield",
      subtract: "icon-subtract",
      team: "icon-team",
      warning: "icon-warning",
    },
  },
});

export type IconVariants = VariantProps<typeof icon>;
