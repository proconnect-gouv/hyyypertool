//

import { ICON_PATHS } from "./paths";

type IconProps = Record<string, unknown>;

export function IconArrowGoBack(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.arrow_go_back} />
    </svg>
  );
}

export function IconCheck(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.check} />
    </svg>
  );
}

export function IconClipboard(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.clipboard} />
    </svg>
  );
}

export function IconDelete(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.delete} />
    </svg>
  );
}

export function IconEye(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.eye} />
    </svg>
  );
}

export function IconEyeOff(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.eye_off} />
    </svg>
  );
}

export function IconSubtract(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.subtract} />
    </svg>
  );
}

export function IconLogout(props: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      width="1em"
      height="1em"
      {...props}
    >
      <path d={ICON_PATHS.logout} />
    </svg>
  );
}
