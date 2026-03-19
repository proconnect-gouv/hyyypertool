//

import { icon, type IconVariants } from "..";

//

export function Svg({ name }: { name: NonNullable<IconVariants["name"]> }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
    >
      <path class={icon({ name })} />
    </svg>
  );
}
