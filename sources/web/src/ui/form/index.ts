//

import { tv } from "tailwind-variants";

//

/**
 * @example
 * ```tsx
 * function MyFieldset() {
 *   const { base, element, legend } = fieldset();
 *   return (
 *     <fieldset class={base()}>
 *       <legend class={legend()}>Voulez-vous autoriser ce membre ?</legend>
 *       <div class={element({inline: true})}>Oui</div>
 *       <div class={element({inline: true})}>Non</div>
 *     </fieldset>
 *   );
 * }
 * ```
 */
export const fieldset = tv({
  base: "relative flex flex-row flex-wrap items-baseline m-0 p-0 border-0",
  slots: {
    legend: "w-full pb-4 text-base leading-6 font-normal",
    element: "flex-[1_1_100%] max-w-full px-2 mb-4",
  },
  variants: {
    inline: {
      true: {
        element: "flex-[0_0_auto]",
      },
    },
  },
});

export const input = tv({
  base: "block w-full px-4 py-2 border border-grey-200 text-base focus:border-blue-france focus:outline-none",
});

export const label = tv({
  base: "block text-sm font-medium mb-1",
});

export const input_group = tv({
  base: "mb-4",
});

export const tags_group = tv({
  base: "flex flex-wrap list-none p-0 m-0",
});

export const radio_group = tv({
  base: "flex items-center gap-2",
});

export const checkbox_group = tv({
  base: "flex items-center gap-2",
});

export const select = tv({
  base: "block w-full px-4 py-2 border border-grey-200 text-base bg-white focus:border-blue-france focus:outline-none",
});

export const search_bar = tv({
  base: "flex items-stretch",
  slots: {
    input: "flex-1 px-4 py-2 border border-grey-200 text-base focus:border-blue-france focus:outline-none",
    button: [
      "inline-flex items-center",
      "px-4 py-2",
      "bg-blue-france text-white",
      "hover:bg-blue-france-hover",
    ].join(" "),
  },
});
