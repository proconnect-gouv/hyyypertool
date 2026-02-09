//

import { tv } from "tailwind-variants";

//

export const table = tv({
  base: [
    "relative w-full mb-10 mt-4",
    "[&_th]:py-2 [&_th]:px-4 [&_th]:text-sm [&_th]:leading-6 [&_th]:text-left [&_th]:align-middle [&_th]:font-bold [&_th]:bg-grey-50",
    "[&_td]:py-2 [&_td]:px-4 [&_td]:text-sm [&_td]:leading-6 [&_td]:text-left [&_td]:align-middle [&_td]:border-b [&_td]:border-grey-200",
    "[&_caption]:text-left [&_caption]:text-xl [&_caption]:leading-7 [&_caption]:font-bold [&_caption]:mb-4",
  ].join(" "),
});

export const row = tv({
  variants: {
    is_active: { true: "bg-green-300" },
    is_clickable: {
      true: "cursor-pointer hover:bg-grey-hover!",
    },
  },
});
