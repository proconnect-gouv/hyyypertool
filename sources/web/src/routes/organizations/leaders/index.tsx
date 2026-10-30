import { MainLayout } from "#src/layouts";
//

import type { AppContext } from "#src/middleware/context";
import { urls } from "#src/urls";
import { zValidator } from "@hono/zod-validator";
import { to } from "await-to-js";
import consola from "consola";
import { Hono } from "hono";
import { jsxRenderer } from "hono/jsx-renderer";
import { z } from "zod";
import {
  DocumentErrorPage,
  to_document_error_view,
  type DocumentErrorView,
} from "./error";
import {
  LeadersDocumentControl,
  to_leaders_document_control_view,
} from "./leaders_document_control";
import { load_leader_document, parse_api_error } from "./load_leader_document";

export default new Hono<AppContext>()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        siret: z.string(),
        retry: z.string().optional(),
      }),
    ),
    async function GET({ html, req, env, var: { fetch } }) {
      const { siret, retry } = req.valid("query");
      const useRetry = retry === "true";
      const retry_get = urls.organizations.leaders.$hx_get({
        query: { retry: "true", siret },
      })["hx-get"];

      const result = await load_leader_document({
        siret,
        fetch,
        useRetry,
        env,
      });

      const document_href = `/organizations/leaders/document?${new URLSearchParams({ siret })}`;

      const view = to_leaders_document_control_view({
        document_href,
        result,
        retry_get,
      });

      return html(<LeadersDocumentControl view={view} />);
    },
  )
  .get(
    "/document",
    zValidator("query", z.object({ siret: z.string() })),
    jsxRenderer(MainLayout),
    async function GET({ req, env, render, status, var: { fetch, sentry } }) {
      const { siret } = req.valid("query");
      const result = await load_leader_document({ siret, fetch, env });

      const render_error = (view: DocumentErrorView) => {
        sentry.setContext("association_leaders_document", view.context);
        sentry.captureMessage(view.sentry_message, view.level);
        status(view.status);
        return render(
          <DocumentErrorPage
            direct_url={view.direct_url}
            message={view.message}
            title={view.title}
          />,
        );
      };

      if (result.kind !== "document") {
        return render_error(to_document_error_view({ ...result, siret }));
      }

      const doc_url = result.url;
      consola.info(`  <<-- ${"GET"} ${doc_url}`);
      const [error, response] = await to(
        fetch(doc_url, {
          signal: AbortSignal.timeout(env.HTTP_CLIENT_TIMEOUT * 5),
        }),
      );

      if (error || !response) {
        consola.error(`Failed to fetch leaders document:`, error);
        return render_error(
          to_document_error_view({
            kind: "download_failed",
            direct_url: doc_url,
            error,
            siret,
          }),
        );
      }

      consola.info(
        `  -->> ${"GET"} ${doc_url} ${response.status} ${response.statusText}`,
      );

      if (!response.ok) {
        const [body_error, body] = await to(response.json());
        const upstream_error = body_error ? undefined : parse_api_error(body);
        return render_error(
          to_document_error_view({
            kind: "download_error",
            direct_url: doc_url,
            http_status: response.status,
            siret,
            upstream_code: upstream_error?.code,
            upstream_message: upstream_error?.message,
          }),
        );
      }

      const headers = new Headers();
      headers.set(
        "Content-Type",
        response.headers.get("Content-Type") ?? "application/pdf",
      );
      headers.set(
        "Content-Disposition",
        'inline; filename="liste-dirigeants-associations.pdf"',
      );

      return new Response(response.body, { status: 200, headers });
    },
  );
