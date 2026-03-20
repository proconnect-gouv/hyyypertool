//

import { tv } from "tailwind-variants";

//

export const card = tv({
  base: `
    border-grey-200
    relative
    flex
    flex-col
    border
    bg-white
    p-8
    shadow-sm
  `,
  slots: {
    body: "flex h-full flex-1 flex-col",
    title: "mb-0 text-xl leading-7 font-bold",
    desc: "mt-3 mb-0 text-sm leading-6",
  },
});
