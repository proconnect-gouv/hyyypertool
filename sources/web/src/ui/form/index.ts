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
  base: "fr-fieldset",
  slots: {
    legend: "fr-fieldset__legend font-normal",
    element: "fr-fieldset__element",
  },
  variants: {
    inline: {
      true: {
        element: "fr-fieldset__element--inline",
      },
    },
  },
});
