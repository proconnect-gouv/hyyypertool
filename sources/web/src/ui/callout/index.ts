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
  base: "relative p-6 mb-6 border-l-4 border-l-grey-200 bg-grey-contrast",
  slots: {
    title: "font-bold text-xl leading-7 mb-2",
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
