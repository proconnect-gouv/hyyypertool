//

import { tv } from "tailwind-variants";

//

export const table = tv({
  base: `
    [&_td]:border-border
    [&_th]:bg-surface
    relative
    mt-4
    mb-10
    w-full
    [&_caption]:mb-4
    [&_caption]:text-left
    [&_caption]:text-xl
    [&_caption]:leading-7
    [&_caption]:font-bold
    [&_td]:border-b
    [&_td]:px-4
    [&_td]:py-2
    [&_td]:text-left
    [&_td]:align-middle
    [&_td]:text-sm
    [&_td]:leading-6
    [&_th]:px-4
    [&_th]:py-2
    [&_th]:text-left
    [&_th]:align-middle
    [&_th]:text-sm
    [&_th]:leading-6
    [&_th]:font-bold
 `,
});

export const row = tv({
  variants: {
    is_active: { true: "bg-green-300" },
    is_clickable: { true: "hover:bg-surface-hover! cursor-pointer" },
  },
});
