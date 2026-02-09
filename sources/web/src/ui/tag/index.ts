//

import { tv } from "tailwind-variants";

//

export const tag = tv({
  base: [
    "inline-flex items-center",
    "text-sm leading-6 min-h-8 px-3 py-1 rounded-full",
    "m-1",
    "bg-blue-france-925",
    "has-checked:bg-blue-france has-checked:text-white",
  ].join(" "),
});
