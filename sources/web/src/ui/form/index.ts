//

import { tv } from "tailwind-variants";
import { button } from "../button";

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
  base: "relative m-0 flex flex-row flex-wrap items-baseline border-0 p-0",
  slots: {
    legend: "text-grey-850 w-full pb-4 text-base leading-6 font-bold",
    element: "mb-4 max-w-full flex-[1_1_100%] px-2",
  },
  variants: {
    inline: {
      true: {
        element: "flex-[0_0_auto]",
      },
    },
  },
});

// Mirrors DSFR fr-input:
//   - grey background (--background-contrast-grey)
//   - bottom-only box-shadow instead of a full border (inset 0 -2px)
//   - top corners rounded only (rounded-t = 0.25rem 0.25rem 0 0)
//   - italic placeholder in mention-grey (#666)
//   - intent variants for error/valid states (fr-input-group--error / --valid)
export const input = tv({
  base: `
    text-grey-850
    bg-background-contrast-grey
    hover:bg-background-contrast-grey-hover
    focus:outline-blue-france
    disabled:text-grey-425
    placeholder:text-grey-625
    block
    w-full
    rounded-t
    px-4
    py-2
    text-base
    leading-6
    shadow-[inset_0_-2px_0_0_var(--color-grey-950)]
    placeholder:italic
    focus:outline-2
    focus:outline-offset-2
    disabled:shadow-[inset_0_-2px_0_0_var(--color-grey-425)]
  `,
  variants: {
    intent: {
      error: "shadow-[inset_0_-2px_0_0_var(--color-error)]",
      valid: "shadow-[inset_0_-2px_0_0_var(--color-green-bourgeon)]",
    },
  },
});

export const label = tv({
  base: "text-grey-850 mb-2 block text-base leading-6 font-normal",
  variants: {
    intent: {
      error: "text-text-default-error",
      valid: "text-text-default-success",
    },
  },
});

export const input_group = tv({
  base: `
    relative mb-4
    before:pointer-events-none before:absolute before:inset-y-0 before:-right-3 before:-left-3
    before:bg-[size:2px_100%] before:bg-[position:0_0] before:bg-no-repeat
  `,
  variants: {
    intent: {
      error: `
        before:bg-[linear-gradient(0deg,var(--color-error),var(--color-error))]
        before:content-['']
      `,
      valid: `
        before:bg-[linear-gradient(0deg,var(--color-green-bourgeon),var(--color-green-bourgeon))]
        before:content-['']
      `,
    },
  },
});

export const tags_group = tv({
  base: "m-0 flex list-none flex-wrap p-0",
});

export const radio_group = tv({
  base: "flex items-center gap-2",
});

export const checkbox_group = tv({
  base: "flex items-center gap-2",
});

// Extends input — inherits all base styles and variants.
// Adds: appearance-none, right padding for the chevron, and the SVG
// arrow via --select-arrow CSS variable (defined in tailwind.dsfr.css).
export const select = tv({
  extend: input,

  base: `
    appearance-none
    bg-[image:var(--select-arrow)]
    bg-[size:1rem_1rem]
    bg-[position:calc(100%-1rem)_50%] bg-no-repeat pr-10
  `,
});

export const search_bar = tv({
  base: "flex items-stretch",
  slots: {
    input: input(),
    button: button(),
  },
});
