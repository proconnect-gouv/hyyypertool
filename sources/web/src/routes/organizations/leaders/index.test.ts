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
        class="inline-flex w-fit items-center font-medium no-underline min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france hover:bg-grey-50 shadow-[inset_0_0_0_1px_var(--color-grey-200)] bg-white"
        href="https://example.com/leaders-doc.pdf"
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
        class="inline-flex w-fit items-center font-medium no-underline min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france hover:bg-grey-50 bg-transparent shadow-[inset_0_0_0_1px_var(--color-grey-200)]"
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
      class="inline-flex w-fit items-center font-medium no-underline min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france hover:bg-grey-50 shadow-[inset_0_0_0_1px_var(--color-grey-200)] bg-white"
      href="https://example.com/retry-success.pdf"
      rel="noopener noreferrer"
      target="_blank"
      >Liste dirigeants associations</a
    >
    "
  `);
  expect(mockFetch).toHaveBeenCalledTimes(1);
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
      class="inline-flex w-fit items-center font-medium no-underline min-h-8 gap-1 px-3 py-1 text-sm leading-6 text-blue-france hover:bg-grey-50 bg-transparent shadow-[inset_0_0_0_1px_var(--color-grey-200)]"
      hx-get="/organizations/leaders?retry=true&amp;siret=12345678901234"
      hx-swap="outerHTML"
    >
      Liste dirigeants associations (Réessayer)
    </button>
    "
  `);
  expect(mockFetch).toHaveBeenCalledTimes(1);
});
