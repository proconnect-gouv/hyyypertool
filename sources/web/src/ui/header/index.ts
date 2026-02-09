//

import { tv } from "tailwind-variants";

//

export const header = tv({
  base: "bg-white shadow-[0_1px_0_0_var(--color-grey-200)]",
  slots: {
    body: "py-4",
    body_row: "flex items-center justify-between",
    brand: "flex items-center gap-4",
    brand_top: "flex items-center",
    container: "max-w-7xl mx-auto px-4",
    logo: "text-sm leading-5 font-bold uppercase",
    menu: "",
    service: "border-l border-grey-200 pl-4",
    service_tagline: "text-xs text-grey-850",
    service_title: "font-bold text-base",
    tools: "flex items-center",
    tools_links: "",
  },
});

export const nav = tv({
  base: "border-t border-grey-200",
  slots: {
    list: "flex list-none p-0 m-0 gap-0",
    item: "",
    link: [
      "inline-flex items-center px-4 py-3",
      "text-sm font-medium text-grey-850",
      "hover:bg-grey-50",
      "aria-[current=true]:shadow-[inset_0_-2px_0_0_var(--color-blue-france)] aria-[current=true]:text-blue-france",
    ].join(" "),
  },
});
