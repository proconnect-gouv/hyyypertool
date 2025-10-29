//

import { tv } from "tailwind-variants";

//

export const toast = tv({
  base: `
    animated
    bounceIn
    flex
    w-full
    max-w-xs
    items-center
    rounded-lg
    border
    border-solid
    border-gray-300
    bg-white
    p-4
    text-gray-500
    shadow-sm
  `,
  slots: {
    close_button: `
      -mx-1.5
      -my-1.5
      ms-auto
      inline-flex
      h-8
      w-8
      items-center
      justify-center
      rounded-lg
      bg-white
      p-1.5
      text-gray-400
      hover:bg-gray-100
      hover:text-gray-900
      focus:ring-2
      focus:ring-gray-300
    `,
    icon: `
      inline-flex
      h-8
      w-8
      shrink-0
      items-center
      justify-center
      rounded-lg
      bg-blue-100
      text-blue-500
    `,
    body: `
      ms-3
      text-sm
      font-normal
    `,
  },
  variants: {
    color: {
      danger: {
        icon: `bg-red-100 text-red-500`,
      },
      success: {
        icon: `bg-green-100 text-green-500`,
      },
      warning: {
        icon: `bg-orange-100 text-orange-500`,
      },
    },
  },
});
