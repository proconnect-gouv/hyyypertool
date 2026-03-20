//

import { tv } from "tailwind-variants";
import { button } from "../button";

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
    btn_close: button({
      type: "close",
      icon: "only",
      intent: "ghost",
      class: `
        -mt-1
        before:inline-block
        before:size-4
        before:bg-current
        before:[mask-image:var(--close-icon)]
        before:mask-size-[100%_100%]
        before:content-['']
      `,
    }),
    container: "px-4",
    title: "relative mr-1 font-bold",
  },
  variants: {
    type: {
      info: "bg-blue-ecume text-label-info",
      warning: "bg-alt-orange-terre-battue text-label-warning",
      alert: "bg-alt-red-marianne text-label-error",
      success: "bg-alt-green-emeraude text-label-success",
    },
  },
});

export const alert = tv({
  base: `
    border-grey-200
    relative
    mb-4
    border
    border-l-[2.5rem]
    py-4
    pr-9
    pl-4
    text-sm
    before:absolute
    before:top-4
    before:-left-8
    before:size-6
    before:bg-white
    before:mask-size-[100%_100%]
    before:content-['']
  `,
  slots: {
    title: "mb-1 text-lg leading-6 font-bold",
  },
  variants: {
    intent: {
      warning:
        "border-l-warning bg-alt-orange-terre-battue text-label-warning before:[mask-image:var(--alert-icon-warning)]",
      error:
        "border-l-error bg-alt-red-marianne text-label-error before:[mask-image:var(--alert-icon-error)]",
      info: "border-l-label-info bg-blue-ecume text-label-info before:[mask-image:var(--alert-icon-info)]",
      success:
        "border-l-label-success bg-alt-green-emeraude text-label-success before:[mask-image:var(--alert-icon-success)]",
    },
  },
});
