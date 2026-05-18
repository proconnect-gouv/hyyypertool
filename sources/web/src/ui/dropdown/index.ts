//

import { tv } from "tailwind-variants";

//

export const dropdown = tv({
  slots: {
    list: `
      bg-background
      absolute
      top-full
      left-0
      z-10
      mt-1
      max-h-80
      w-full
      overflow-y-auto
      rounded
      border
      border-(--color-border)
      py-1
      shadow-lg
    `,
    item: `
      text-text-default
      hover:bg-surface-hover
      flex
      cursor-pointer
      items-center
      justify-between
      px-3
      py-1.5
      text-sm
    `,
    hint: `
      text-text-muted
      text-xs
    `,
  },
  variants: {
    selected: {
      true: {
        item: `
          bg-blue-ecume
          dark:bg-blue-ecume
          text-blue-france
          dark:text-blue-france-925
          hover:bg-blue-ecume
          dark:hover:bg-blue-ecume
        `,
      },
    },
  },
});
