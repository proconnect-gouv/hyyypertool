//

import { tv } from "tailwind-variants";

//

export const row = tv({
  variants: {
    is_active: { true: "bg-green-300" },
    is_clickable: {
      true: "hover:bg-(--background-alt-grey-hover)! cursor-pointer",
    },
  },
});
