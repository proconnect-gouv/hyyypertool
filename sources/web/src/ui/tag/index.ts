//

import { tv } from "tailwind-variants";

//

export const tag = tv({
  base: `
    fr-tag
    m-1
    bg-(--background-action-low-blue-france)
    has-checked:bg-(--blue-france-sun-113-625)
    has-checked:text-white
  `,
});
