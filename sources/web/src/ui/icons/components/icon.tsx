import { icon, type IconVariants } from "../index";

interface IconProps extends IconVariants {
  [key: string]: unknown;
}

export function Icon({ name, class: className, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width="1em"
      height="1em"
      aria-hidden="true"
      class={className as string}
      {...props}
    >
      <path class={icon({ name })} />
    </svg>
  );
}
