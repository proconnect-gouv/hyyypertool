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
    regular: {
      true: {
        legend: "font-normal",
      },
    },
  },
});

// Mirrors DSFR fr-input:
//   - grey background (--grey-contrast)
//   - bottom-only box-shadow instead of a full border (inset 0 -2px)
//   - top corners rounded only (rounded-t = 0.25rem 0.25rem 0 0)
//   - italic placeholder in mention-grey (#666)
//   - intent variants for error/valid states (fr-input-group--error / --valid)
export const input = tv({
  base: `
    text-grey-850
    bg-grey-contrast
    hover:bg-grey-contrast-hover
    focus:outline-blue-france
    disabled:text-grey-425
    placeholder:text-grey-625
    [[type=radio]]:border-blue-france
    [[type=radio]]:checked:bg-blue-france
    [[type=radio]]:checked:hover:bg-blue-france
    [[type=radio]]:focus:outline-blue-france
    [[type=checkbox]]:border-blue-france
    [[type=checkbox]]:checked:bg-blue-france
    [[type=checkbox]]:checked:hover:bg-blue-france
    [[type=checkbox]]:checked:border-blue-france
    [[type=checkbox]]:focus:outline-blue-france
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
    [[type=checkbox]]:size-6
    [[type=checkbox]]:shrink-0
    [[type=checkbox]]:cursor-pointer
    [[type=checkbox]]:appearance-none
    [[type=checkbox]]:rounded
    [[type=checkbox]]:border-[1.5px]
    [[type=checkbox]]:bg-transparent
    [[type=checkbox]]:p-0
    [[type=checkbox]]:shadow-none
    [[type=checkbox]]:checked:bg-(image:--checkbox-checkmark)
    [[type=checkbox]]:checked:bg-size-[1.25rem]
    [[type=checkbox]]:checked:bg-center
    [[type=checkbox]]:checked:bg-no-repeat
    [[type=checkbox]]:hover:bg-transparent
    [[type=checkbox]]:focus:outline-2
    [[type=checkbox]]:focus:outline-offset-2
    [[type=radio]]:size-6
    [[type=radio]]:shrink-0
    [[type=radio]]:cursor-pointer
    [[type=radio]]:appearance-none
    [[type=radio]]:rounded-full
    [[type=radio]]:border-[1.5px]
    [[type=radio]]:bg-transparent
    [[type=radio]]:p-0
    [[type=radio]]:shadow-none
    [[type=radio]]:checked:shadow-[inset_0_0_0_3px_white]
    [[type=radio]]:hover:bg-transparent
    [[type=radio]]:focus:outline-2
    [[type=radio]]:focus:outline-offset-2
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
      error: "text-label-error",
      valid: "text-label-success",
    },
  },
});

export const input_group = tv({
  base: `
    relative mb-4
    before:pointer-events-none before:absolute before:inset-y-0 before:-right-3 before:-left-3
    before:bg-size-[2px_100%] before:bg-position-[0_0] before:bg-no-repeat
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
  base: "m-0 flex list-none flex-wrap gap-2 p-0",
});

export const radio_group = tv({
  base: "flex items-center gap-2",
  slots: {
    label: label({ class: "mb-0" }),
  },
});

export const checkbox_group = tv({
  base: "flex items-center gap-2",
  slots: {
    label: label({ class: "mb-0" }),
  },
});

// Extends input — inherits all base styles and variants.
// Adds: appearance-none, right padding for the chevron, and the SVG
// arrow via --select-arrow CSS variable (defined in tailwind.dsfr.css).
export const select = tv({
  extend: input,
  base: `
    appearance-none
    bg-(image:--select-arrow)
    bg-size-[1rem_1rem]
    bg-position-[calc(100%-1rem)_50%]
    bg-no-repeat
    pr-10
  `,
});

export const search_bar = tv({
  base: "flex items-stretch",
  slots: {
    input: input(),
    button: button({ class: "transition-colors" }),
  },
});
