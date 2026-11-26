//

import { icon, type IconVariants } from "..";

//

export function Svg({
  class: className,
  name,
}: {
  class?: string;
  name: NonNullable<IconVariants["name"]>;
}) {
  return (
    <svg
      aria-hidden="true"
      class={className}
      fill="currentColor"
      height="1em"
      viewBox="0 0 24 24"
      width="1em"
    >
      <path class={icon({ name })} />
    </svg>
  );
}
