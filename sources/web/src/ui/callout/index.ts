//

import { tv } from "tailwind-variants";

//

/**
 * @example
 * ```tsx
 * function MyCallout() {
 *   const { base, text, title } = callout();
 *   return (
 *     <div class={base()}>
 *       <p class={title()}>Coucou</p>
 *       <p class={text()}>
 *         Jean Pierre
 *       </p>
 *     </div>
 *   );
 * }
 * ```
 */
export const callout = tv({
  base: "border-l-grey-200 bg-grey-contrast relative mb-6 border-l-4 p-6",
  slots: {
    title: "mb-2 text-xl leading-7 font-bold",
    text: "text-lg leading-7",
  },
  variants: {
    intent: {
      success: {
        base: "border-l-green-emeraude bg-[#c3fad5]",
      },
      warning: {
        base: "border-l-brown-caramel bg-[#f7ebe5]",
      },
    },
  },
});
