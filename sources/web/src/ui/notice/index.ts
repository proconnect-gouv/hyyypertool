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
  base: "relative py-4 bg-grey-contrast text-grey-850",
  slots: {
    body: "relative flex flex-row items-start justify-between",
    container: "max-w-7xl mx-auto px-4",
    title: "relative mr-1 font-bold",
  },
  variants: {
    type: {
      info: "bg-[#e8edff] text-[#0063cb]",
      warning: "bg-[#ffe9e6] text-[#b34000]",
      alert: "bg-[#ffe9e9] text-[#ce0500]",
    },
  },
});

export const alert = tv({
  base: "p-4 mb-4 text-sm",
  slots: {
    title: "font-bold mb-1",
  },
  variants: {
    intent: {
      warning: "bg-[#ffe9e6] text-[#b34000]",
      error: "bg-[#ffe9e9] text-[#ce0500]",
      info: "bg-[#e8edff] text-[#0063cb]",
      success: "bg-[#b8fec9] text-[#18753c]",
    },
  },
});
