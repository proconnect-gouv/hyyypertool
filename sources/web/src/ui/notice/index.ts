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
  base: "bg-grey-contrast text-grey-850 relative py-4",
  slots: {
    body: "relative flex flex-row items-start justify-between",
    container: "px-4",
    title: "relative mr-1 font-bold",
  },
  variants: {
    type: {
      info: "text-label-info bg-blue-ecume",
      warning: "bg-alt-orange-terre-battue text-label-warning",
      alert: "bg-alt-red-marianne text-label-error",
    },
  },
});

export const alert = tv({
  base: "mb-4 p-4 text-sm",
  slots: {
    title: "mb-1 font-bold",
  },
  variants: {
    intent: {
      warning: "bg-alt-orange-terre-battue text-label-warning",
      error: "bg-alt-red-marianne text-label-error",
      info: "text-label-info bg-blue-ecume",
      success: "bg-alt-green-emeraude text-label-success",
    },
  },
});
