//

import { set_fetch, type FetchVariables_Context } from "#src/middleware/fetch";
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
    .request("/?siret=12345678901234");

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(
    `
      "<a
        class="fr-btn fr-btn--sm fr-btn--tertiary bg-white"
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

  const response = await new Hono<FetchVariables_Context>()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234");

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(
    `
      "<button
        class="fr-btn fr-btn--sm fr-btn--tertiary"
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

  const response = await new Hono<FetchVariables_Context>()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234&retry=true");

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(`
    "<a
      class="fr-btn fr-btn--sm fr-btn--tertiary bg-white"
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

  const response = await new Hono<FetchVariables_Context>()
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request("/?siret=12345678901234&retry=true");

  expect(response.status).toBe(200);
  expect(await render_html(await response.text())).toMatchInlineSnapshot(`
    "<button
      class="fr-btn fr-btn--sm fr-btn--tertiary"
      hx-get="/organizations/leaders?retry=true&amp;siret=12345678901234"
      hx-swap="outerHTML"
    >
      Liste dirigeants associations (Réessayer)
    </button>
    "
  `);
  expect(mockFetch).toHaveBeenCalledTimes(1);
});
