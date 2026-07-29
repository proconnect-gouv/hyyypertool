//

import { set_fetch } from "#src/middleware/fetch";
import { render_html } from "#src/ui/testing";
import {
  empty_database,
  migrate,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, mock, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /organizations/leaders - happy path with document", async () => {
  const mockFetch = mock(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: {
            documents_rna: [
              {
                annee_depot: "2023",
                date_depot: "2023-01-15",
                sous_type: { code: "LDC" },
                url: "https://example.com/leaders-doc.pdf",
              },
            ],
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    ),
  );

  const response = await new Hono()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234", undefined, {
      ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
      ENTREPRISE_API_GOUV_TOKEN: "test-token",
      HTTP_CLIENT_TIMEOUT: 5000,
    });

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(
    `
      "<a
        class="disabled:bg-grey-200 disabled:text-grey-425 dark:disabled:bg-grey-850 dark:disabled:text-grey-625 inline-flex w-fit items-center font-medium no-underline disabled:cursor-not-allowed min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover shadow-[inset_0_0_0_1px_var(--color-border)] dark:bg-transparent bg-white"
        href="/organizations/leaders/document?siret=12345678901234"
        rel="noopener noreferrer"
        target="_blank"
        >Liste dirigeants associations</a
      >
      "
    `,
  );
  expect(mockFetch).toHaveBeenCalled();
});

test("GET /organizations/leaders - timeout error shows retry button", async () => {
  const timeoutError = new DOMException(
    "The operation was aborted due to timeout",
    "TimeoutError",
  );

  const mockFetch = mock(() => Promise.reject(timeoutError));

  const response = await new Hono()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234", undefined, {
      ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
      ENTREPRISE_API_GOUV_TOKEN: "test-token",
      HTTP_CLIENT_TIMEOUT: 5000,
    });

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(
    `
      "<button
        class="disabled:bg-grey-200 disabled:text-grey-425 dark:disabled:bg-grey-850 dark:disabled:text-grey-625 inline-flex w-fit items-center font-medium no-underline disabled:cursor-not-allowed min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover bg-transparent shadow-[inset_0_0_0_1px_var(--color-border)] dark:bg-transparent"
        hx-get="/organizations/leaders?retry=true&amp;siret=12345678901234"
        hx-swap="outerHTML"
      >
        Liste dirigeants associations (Réessayer)
      </button>
      "
    `,
  );
  expect(mockFetch).toHaveBeenCalledTimes(1);
});

test("GET /organizations/leaders - retry succeeds with longer timeout", async () => {
  const mockFetch = mock(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          data: {
            documents_rna: [
              {
                annee_depot: "2023",
                date_depot: "2023-01-15",
                sous_type: { code: "LDC" },
                url: "https://example.com/retry-success.pdf",
              },
            ],
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    ),
  );

  const response = await new Hono()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234&retry=true", undefined, {
      ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
      ENTREPRISE_API_GOUV_TOKEN: "test-token",
      HTTP_CLIENT_TIMEOUT: 5000,
    });

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(`
    "<a
      class="disabled:bg-grey-200 disabled:text-grey-425 dark:disabled:bg-grey-850 dark:disabled:text-grey-625 inline-flex w-fit items-center font-medium no-underline disabled:cursor-not-allowed min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover shadow-[inset_0_0_0_1px_var(--color-border)] dark:bg-transparent bg-white"
      href="/organizations/leaders/document?siret=12345678901234"
      rel="noopener noreferrer"
      target="_blank"
      >Liste dirigeants associations</a
    >
    "
  `);
  expect(mockFetch).toHaveBeenCalledTimes(1);
});

test("GET /organizations/leaders/document - serves PDF inline", async () => {
  const pdfBytes = new Uint8Array([0x25, 0x50, 0x44, 0x46]); // %PDF
  const mockFetch = mock()
    .mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          data: {
            documents_rna: [
              {
                annee_depot: "2023",
                date_depot: "2023-01-15",
                sous_type: { code: "LDC" },
                url: "https://example.com/leaders-doc.pdf",
              },
            ],
          },
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        },
      ),
    )
    .mockResolvedValueOnce(
      new Response(pdfBytes, {
        status: 200,
        headers: {
          "content-type": "application/pdf",
          "content-disposition": 'attachment; filename="leaders-doc.pdf"',
        },
      }),
    );

  const response = await new Hono()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/document?siret=12345678901234", undefined, {
      ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
      ENTREPRISE_API_GOUV_TOKEN: "test-token",
      HTTP_CLIENT_TIMEOUT: 5000,
    });

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("application/pdf");
  expect(response.headers.get("Content-Disposition")).toBe(
    'inline; filename="liste-dirigeants-associations.pdf"',
  );
  expect(new Uint8Array(await response.arrayBuffer())).toEqual(pdfBytes);
  expect(mockFetch).toHaveBeenCalledTimes(2);
});

test("GET /organizations/leaders/document - missing document returns 404", async () => {
  const mockFetch = mock(() =>
    Promise.resolve(
      new Response(JSON.stringify({ data: { documents_rna: [] } }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    ),
  );

  const response = await new Hono()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/document?siret=12345678901234", undefined, {
      ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
      ENTREPRISE_API_GOUV_TOKEN: "test-token",
      HTTP_CLIENT_TIMEOUT: 5000,
    });

  expect(response.status).toBe(404);
  expect(await response.text()).toBe("Document introuvable");
});

test("GET /organizations/leaders - retry fails, button still shown for further retries", async () => {
  const timeoutError = new DOMException(
    "The operation was aborted due to timeout",
    "TimeoutError",
  );

  const mockFetch = mock(() => Promise.reject(timeoutError));

  const response = await new Hono()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234&retry=true", undefined, {
      ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
      ENTREPRISE_API_GOUV_TOKEN: "test-token",
      HTTP_CLIENT_TIMEOUT: 5000,
    });

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(`
    "<button
      class="disabled:bg-grey-200 disabled:text-grey-425 dark:disabled:bg-grey-850 dark:disabled:text-grey-625 inline-flex w-fit items-center font-medium no-underline disabled:cursor-not-allowed min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover bg-transparent shadow-[inset_0_0_0_1px_var(--color-border)] dark:bg-transparent"
      hx-get="/organizations/leaders?retry=true&amp;siret=12345678901234"
      hx-swap="outerHTML"
    >
      Liste dirigeants associations (Réessayer)
    </button>
    "
  `);
  expect(mockFetch).toHaveBeenCalledTimes(1);
});

test("GET /organizations/leaders - expired token shows error message", async () => {
  const mockFetch = mock(() =>
    Promise.resolve(
      new Response(
        JSON.stringify({
          errors: [
            {
              code: "00103",
              title: "Jeton expiré",
              detail: "Votre token est expiré.",
            },
          ],
        }),
        {
          status: 401,
          headers: { "content-type": "application/json" },
        },
      ),
    ),
  );

  const response = await new Hono()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234", undefined, {
      ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
      ENTREPRISE_API_GOUV_TOKEN: "test-token",
      HTTP_CLIENT_TIMEOUT: 5000,
    });

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(
    `
      "<button
        class="disabled:bg-grey-200 disabled:text-grey-425 dark:disabled:bg-grey-850 dark:disabled:text-grey-625 inline-flex w-fit items-center font-medium no-underline disabled:cursor-not-allowed min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france dark:text-blue-france-925 hover:bg-surface-hover dark:hover:bg-surface-hover bg-transparent shadow-[inset_0_0_0_1px_var(--color-border)] dark:bg-transparent"
        disabled=""
      >
        Erreur API — contacter l&#39;équipe tech
      </button>
      "
    `,
  );
  expect(mockFetch).toHaveBeenCalledTimes(1);
});
