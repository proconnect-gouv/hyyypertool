//

import { tv } from "tailwind-variants";
import { badge } from "../badge";

//

export const badge_description_list = tv({
  base: `grid grid-cols-2 items-center gap-4`,
  slots: {
    dd: `p-0`,
    dt: badge(),
  },
});

export const description_list = tv({
  base: `
  grid
  grid-cols-[222px_1fr]
  gap-x-3
  ps-0
  [&_dd]:p-0
  [&_dd]:py-1
  [&_dd]:font-semibold
  [&_dt]:border-0
  [&_dt]:border-r
  [&_dt]:border-solid
  [&_dt]:border-gray-300
  [&_dt]:p-0
  [&_dt]:py-1
  [&_dt]:uppercase
`,
});
