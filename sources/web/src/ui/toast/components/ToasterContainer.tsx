//

import type { Child, PropsWithChildren } from "hono/jsx";
import type { VariantProps } from "tailwind-variants";
import { toast } from "../index";

//

/**
 * @deprecated use @~/web/htmx after app.ui migration
 */
const HTMX_RESPONSE_ERROR = "htmx:responseError";

//

export const DefaultToast = CommonToastFactory(
  <svg
    class="h-4 w-4"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 18 20"
  >
    <path
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="2"
      d="M15.147 15.085a7.159 7.159 0 0 1-6.189 3.307A6.713 6.713 0 0 1 3.1 15.444c-2.679-4.513.287-8.737.888-9.548A4.373 4.373 0 0 0 5 1.608c1.287.953 6.445 3.218 5.537 10.5 1.5-1.122 2.706-3.01 2.853-6.14 1.433 1.049 3.993 5.395 1.757 9.117Z"
    />
  </svg>,
  "Fire icon",
);

export const SuccessToast = CommonToastFactory(
  <svg
    class="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
  </svg>,
  "Check icon",
);

export const ErrorToast = CommonToastFactory(
  <svg
    class="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
  </svg>,
  "Error icon",
);

export const WarningToast = CommonToastFactory(
  <svg
    class="h-5 w-5"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
  </svg>,
  "Warning icon",
);

export function ToasterContainer() {
  return (
    <div class="fixed bottom-4 left-4 z-50 flex flex-col gap-2">
      <template>
        <DefaultToast>DefaultToast</DefaultToast>
      </template>
      <template>
        <SuccessToast variant={{ color: "success" }}>SuccessToast</SuccessToast>
      </template>
      <template
        _={`
          on every ${HTMX_RESPONSE_ERROR} from body
            render me then put it after me
          `}
      >
        <ErrorToast variant={{ color: "danger" }}>
          Une erreur est survenue !
        </ErrorToast>
      </template>
      <template>
        <WarningToast variant={{ color: "warning" }}>WarningToast</WarningToast>
      </template>
    </div>
  );
}

export function CommonToastFactory(iconNode: Child, title: string) {
  return function Toast(props: ToastProps) {
    const { children, variant } = props;
    const { base, body, icon, close_button } = toast(variant);

    return (
      <div class={base()} role="alert">
        <div class={icon()}>
          {iconNode}
          <span class="sr-only">{title}</span>
        </div>
        <div class={body()}>{children}</div>
        <button
          _="on click remove closest <div[role='alert']/> "
          type="button"
          class={close_button()}
          aria-label="Close"
        >
          <span class="sr-only">Close</span>
          <svg
            class="h-3 w-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
        </button>
      </div>
    );
  };
}

type ToastProps = PropsWithChildren<{
  variant?: VariantProps<typeof toast>;
}>;
