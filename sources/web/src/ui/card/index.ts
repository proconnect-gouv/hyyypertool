//

import { tv } from "tailwind-variants";

//

export const card = tv({
  base: `
    border-border
    bg-background
    relative
    flex
    flex-col
    border
    p-8
    shadow-sm
  `,
  slots: {
    body: "flex h-full flex-1 flex-col",
    title: "mb-0 text-xl leading-7 font-bold",
    desc: "mt-3 mb-0 text-sm leading-6",
  },
});
