/**
 * CopyButton Island Component (Server-side)
 *
 * Renders a Preact-powered copy button that hydrates on the client
 */

import config from "#src/config";
import type { JSX, PropsWithChildren } from "hono/jsx";
import { randomUUID } from "node:crypto";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import { button } from "..";

//

export function CopyButtonIsland(
  props: PropsWithChildren<{
    text: string;
    variant?: VariantProps<typeof button>;
    class?: string;
    title?: string;
    nonce?: string;
  }> &
    Omit<JSX.IntrinsicElements["button"], "class" | "children">,
) {
  const {
    children,
    class: className,
    nonce = "",
    text,
    title,
    variant,
    ...buttonProps
  } = props;
  const root_id = randomUUID();
  const clientPath = `${config.PUBLIC_ASSETS_PATH}/ui/button/components/copy.client.js`;

  const buttonClass = copy_button_style({
    ...variant,
    className: String(className || ""),
    intent: "ghost",
  });

  // Serialize props for client
  const clientProps = {
    children: typeof children === "string" ? children : "",
    className: buttonClass,
    text,
    title,
    ...buttonProps,
  };

  return (
    <x-copy-button-island>
      <x-copy-button-root id={root_id} />
      <script
        dangerouslySetInnerHTML={{
          __html: `
import { render, h } from "preact";
import { CopyButtonClient } from "${clientPath}";
document.addEventListener('DOMContentLoaded', () => {
  const props = ${JSON.stringify(clientProps)};
  render(h(CopyButtonClient, props), document.getElementById("${root_id}"));
});
`,
        }}
        defer
        nonce={nonce}
        type="module"
      />
    </x-copy-button-island>
  );
}

//

const copy_button_style = tv({
  base: "text-(--text-action-high-blue-france)",
  extend: button,
});
