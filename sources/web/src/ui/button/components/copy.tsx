import type { JSX, PropsWithChildren } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import { button } from "..";

//

export function CopyButton(
  props: JSX.IntrinsicElements["button"] &
    PropsWithChildren<{
      text: string;
      variant?: VariantProps<typeof button>;
    }>,
) {
  const { children, class: className, text, variant, ...other_props } = props;

  return (
    <button
      x-data="{ copied: false }"
      x-on:click="
        if (!$el.dataset.text) return;
        navigator.clipboard.writeText($el.dataset.text);
        copied = true;
        setTimeout(function() { copied = false }, 1000);
        $dispatch('notify', { variant: 'success', title: 'Copié !', message: $el.dataset.text })
      "
      class={copy_button_style({
        ...variant,
        className: String(className),
        intent: "ghost",
      })}
      data-text={text}
      {...other_props}
    >
      <span
        class="fr-icon-clipboard-line"
        aria-hidden="true"
        x-show="!copied"
        x-transition:enter="animated bounceIn"
      ></span>
      <span
        class="fr-icon-check-line"
        aria-hidden="true"
        x-show="copied"
        x-transition:enter="animated bounceIn"
      ></span>
      {children}
    </button>
  );
}

//

const copy_button_style = tv({
  base: "text-(--text-action-high-blue-france)",
  extend: button,
});
