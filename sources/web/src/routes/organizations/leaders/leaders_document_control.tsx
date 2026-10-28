//

import { button } from "#src/ui/button";

import type { LeaderDocumentResult } from "./load_leader_document";

//

export type LeadersDocumentControlView =
  | { readonly kind: "api_error" }
  | { readonly kind: "document"; readonly href: string }
  | { readonly kind: "fetch_error"; readonly retry_get: string }
  | { readonly kind: "invalid_response" }
  | { readonly kind: "no_document" };

//

export function to_leaders_document_control_view({
  document_href,
  result,
  retry_get,
}: {
  document_href: string;
  result: LeaderDocumentResult;
  retry_get: string;
}): LeadersDocumentControlView {
  switch (result.kind) {
    case "api_error":
      return { kind: "api_error" };
    case "invalid_response":
      return { kind: "invalid_response" };
    case "fetch_error":
      return { kind: "fetch_error", retry_get };
    case "document":
      return { kind: "document", href: document_href };
    case "no_document":
      return { kind: "no_document" };
    default:
      return assert_never(result);
  }
}

//

function assert_never(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

//

export function LeadersDocumentControl({
  view,
}: {
  view: LeadersDocumentControlView;
}) {
  switch (view.kind) {
    case "api_error":
      return (
        <button class={button({ size: "sm", type: "tertiary" })} disabled>
          Erreur API — contacter l'équipe tech
        </button>
      );
    case "invalid_response":
      return (
        <button class={button({ size: "sm", type: "tertiary" })} disabled>
          Erreur API — contacter l'équipe tech
        </button>
      );
    case "fetch_error":
      return (
        <button
          class={button({ size: "sm", type: "tertiary" })}
          hx-get={view.retry_get}
          hx-swap="outerHTML"
        >
          Liste dirigeants associations (Réessayer)
        </button>
      );
    case "document":
      return (
        <a
          class={button({
            className: "bg-white",
            size: "sm",
            type: "tertiary",
          })}
          href={view.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          Liste dirigeants associations
        </a>
      );
    case "no_document":
      return (
        <button class={button({ size: "sm", type: "tertiary" })} disabled>
          Pas de liste des dirigeants
        </button>
      );
    default:
      return assert_never(view);
  }
}
