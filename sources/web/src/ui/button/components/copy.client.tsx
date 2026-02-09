/* @jsxImportSource preact */
/**
 * Preact CopyButton client-side component
 */

import { icon } from "#src/ui/icons";
import { useCallback, useState } from "preact/hooks";

//

interface CopyButtonClientProps {
  children: preact.ComponentChildren;
  className: string;
  text: string;
  title?: string;
  [key: string]: any; // Allow additional button props
}

export function CopyButtonClient({
  children,
  className,
  text,
  title,
  ...otherProps
}: CopyButtonClientProps) {
  const [copied, setCopied] = useState(false);

  const handleClick = useCallback(async () => {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);

      // Dispatch notify event for compatibility
      window.dispatchEvent(
        new CustomEvent("notify", {
          detail: {
            variant: "success",
            title: "Copié !",
            message: text,
          },
        }),
      );
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }, [text]);

  return (
    <button
      type="button"
      class={className}
      title={title}
      onClick={handleClick}
      {...otherProps}
    >
      <svg
        class={`h-4 w-4 ${children ? "mr-2" : ""} ${copied ? "hidden" : "inline-block"}`}
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path class={icon({ name: "clipboard" })} />
      </svg>
      <svg
        class={`h-4 w-4 ${children ? "mr-2" : ""} ${!copied ? "hidden" : "inline-block"}`}
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path class={icon({ name: "check" })} />
      </svg>
      {children}
    </button>
  );
}
