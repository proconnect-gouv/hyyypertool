//

import { tv } from "tailwind-variants";

//

/**
 * Notice component variant
 *
 * @example
 * ```html
 * <div class={base()}>
 *   <div class={container()}>
 *     <div class={body()}>
 *       <p class={title()}>
 *         Coucou
 *       </p>
 *    </div>
 * </div>
 * ```
 */
export const notice = tv({
  base: "fr-notice",
  slots: {
    body: "fr-notice__body",
    container: "fr-container",
    title: "fr-notice__title",
  },
  variants: {
    type: {
      info: "fr-notice--info",
    },
  },
});
