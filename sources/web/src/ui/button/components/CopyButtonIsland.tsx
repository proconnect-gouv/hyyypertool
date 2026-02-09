/**
 * CopyButton Island Component (Server-side)
 *
 * Renders a Preact-powered copy button that hydrates on the client
 */

import type { JSX, PropsWithChildren } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { tv } from "tailwind-variants";
import { button } from "..";
import { createIsland } from "../../../lib/create-island";
import { CopyButtonClient } from "./copy.client";

//

type CopyButtonIslandProps = PropsWithChildren<{
  text: string;
  variant?: VariantProps<typeof button>;
  class?: string;
  title?: string;
  nonce?: string;
}> &
  Omit<JSX.IntrinsicElements["button"], "class" | "children">;

const copy_button_style = tv({
  base: "text-text-action-high-blue-france",
  extend: button,
});

// Base Island with import map path (resolves via importmap to versioned path)
const BaseCopyButtonIsland = createIsland({
  component: CopyButtonClient,
  clientPath: "/src/ui/button/components/copy.client.js",
  mode: "render",
  exportName: "CopyButtonClient",
  tagName: "x-copy-button-island",
  rootTagName: "x-copy-button-root",
});

/**
 * CopyButton Island with tailwind-variants styling
 */
export function CopyButtonIsland(props: CopyButtonIslandProps) {
  const {
    children,
    class: className,
    nonce = "",
    text,
    title,
    variant,
    ...buttonProps
  } = props;

  const buttonClass = copy_button_style({
    ...variant,
    className: String(className || ""),
    intent: "ghost",
  });

  // Transform props for client component
  const clientProps = {
    children: typeof children === "string" ? children : "",
    className: buttonClass,
    text,
    title,
    ...buttonProps,
  };

  return <BaseCopyButtonIsland nonce={nonce} {...clientProps} />;
}
