//

import { button } from "#src/ui/button";

//

type DocumentFailure =
  | {
      readonly kind: "api_error";
      readonly http_status: number;
      readonly siret: string;
    }
  | {
      readonly direct_url: string;
      readonly http_status: number;
      readonly kind: "download_error";
      readonly siret: string;
      readonly upstream_code?: string;
      readonly upstream_message?: string;
    }
  | {
      readonly direct_url: string;
      readonly error: Error | null;
      readonly kind: "download_failed";
      readonly siret: string;
    }
  | {
      readonly error: Error;
      readonly kind: "fetch_error";
      readonly siret: string;
    }
  | {
      readonly kind: "invalid_response";
      readonly siret: string;
    }
  | {
      readonly kind: "no_document";
      readonly siret: string;
    };

export function to_document_error_view(failure: DocumentFailure) {
  switch (failure.kind) {
    case "api_error":
      return {
        context: { http_status: failure.http_status, siret: failure.siret },
        level: "warning",
        message: "Le service API entreprise a renvoyé une erreur. Réessayez.",
        sentry_message: "Association leaders API error",
        status: 502,
        title: "Liste des dirigeants indisponible",
      } as const;
    case "download_error":
      return {
        context: {
          error_code: failure.upstream_code,
          error_message: failure.upstream_message,
          http_status: failure.http_status,
          siret: failure.siret,
        },
        direct_url: failure.direct_url,
        level: "warning",
        message:
          failure.upstream_message ??
          "Impossible de récupérer la liste des dirigeants. Réessayez.",
        sentry_message:
          "Association leaders document download returned an error",
        status: 502,
        title: "Liste des dirigeants indisponible",
      } as const;
    case "download_failed":
      return {
        context: {
          error_message: failure.error?.message,
          error_name: failure.error?.name,
          siret: failure.siret,
        },
        direct_url: failure.direct_url,
        level: "warning",
        message: "Impossible de récupérer la liste des dirigeants. Réessayez.",
        sentry_message: "Association leaders document download failed",
        status: 502,
        title: "Liste des dirigeants indisponible",
      } as const;
    case "fetch_error":
      return {
        context: {
          error_message: failure.error.message,
          error_name: failure.error.name,
          siret: failure.siret,
        },
        level: "warning",
        message: "Impossible de joindre le service API entreprise. Réessayez.",
        sentry_message: "Association leaders API request failed",
        status: 502,
        title: "Liste des dirigeants indisponible",
      } as const;
    case "invalid_response":
      return {
        context: { siret: failure.siret },
        level: "warning",
        message:
          "Le service API entreprise a renvoyé une réponse inattendue. Contactez l'équipe technique.",
        sentry_message: "Association leaders API response invalid",
        status: 502,
        title: "Liste des dirigeants indisponible",
      } as const;
    case "no_document":
      return {
        context: { siret: failure.siret },
        level: "info",
        message: "Cette association ne possède pas de liste des dirigeants.",
        sentry_message: "Association leaders document not found",
        status: 404,
        title: "Liste des dirigeants introuvable",
      } as const;
    default:
      return assert_never(failure);
  }
}

export type DocumentErrorView = ReturnType<typeof to_document_error_view>;

//

function assert_never(value: never): never {
  throw new Error(`Unhandled case: ${JSON.stringify(value)}`);
}

//

export function DocumentErrorPage({
  direct_url,
  message,
  title,
}: {
  direct_url?: string;
  message: string;
  title: string;
}) {
  return (
    <main class="bg-surface flex min-h-full flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 class="text-xl font-bold">{title}</h1>
      <p class="text-lg">{message}</p>
      {direct_url ? (
        <a
          class={button()}
          href={direct_url}
          rel="noopener noreferrer"
          target="_blank"
        >
          Ouvrir le document directement
        </a>
      ) : null}
      <a href="/" class={button()}>
        {" "}
        Retour à l'accueil{" "}
      </a>
    </main>
  );
}
