//

import type { DOMAttributes } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { loader } from ".";

//

export function Loader(props: DOMAttributes & VariantProps<typeof loader>) {
  const { class: className, htmx_indicator, ...other_props } = props;
  const { base, span } = loader({ htmx_indicator });
  return (
    <div
      class={base({ className: String(className) })}
      role="status"
      {...other_props}
    >
      <span class={span()}>Loading...</span>
    </div>
  );
}
