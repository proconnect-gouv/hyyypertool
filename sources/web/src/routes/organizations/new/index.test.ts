//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_fetch } from "#src/middleware/fetch";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import {
  set_identite_pg,
  set_identite_pg_client,
} from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import { render_html } from "#src/ui/testing";
import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import {
  MaireClamart,
  NintendoOfEuropeSe,
  OctoTechnology,
} from "@proconnect-gouv/proconnect.api_entreprise/testing/seed/v3-insee-sirene-etablissements-siret";
import { schema } from "@~/identite-proconnect/database";
import {
  client,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { ok } from "node:assert/strict";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);
beforeEach(hyyyperbase_empty_database);

//

const env = {
  ENTREPRISE_API_GOUV_URL: "https://api.entreprise.example.com",
  ENTREPRISE_API_GOUV_TOKEN: "test-token",
  HTTP_CLIENT_TIMEOUT: 5000,
};

function mock_siret_fetch(route: Record<string, unknown>) {
  return (input: string | URL | Request, _init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    const match = Object.entries(route).find(([siret]) => url.includes(siret));
    return match
      ? Promise.resolve(
          new Response(JSON.stringify({ data: match[1] }), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        )
      : Promise.reject(new Error("network error"));
  };
}

function middlewares(moderator: { email: string; sub: string | null }) {
  return new Hono()
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client as any))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: moderator.email, sub: moderator.sub! }))
    .use(authorized());
}

//

test("GET /organizations/new?siret prefills the textarea and fetches the preview", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const mockFetch = mock_siret_fetch({
    [NintendoOfEuropeSe.siret]: NintendoOfEuropeSe,
  });

  const response = await middlewares(moderator)
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request(`/?siret=${NintendoOfEuropeSe.siret}`, undefined, env);

  expect(response.status).toBe(200);
  const html = await render_html(await response.text());
  expect(html).toContain('name="sirets"');
  expect(html).toContain(NintendoOfEuropeSe.siret);
  expect(html).toContain("Nintendo of europe se");
  expect(html).toContain('action="/organizations/new/confirm"');
});

test("GET /organizations/new?created ne montre pas de récapitulatif si aucune organisation n'est trouvée", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);

  const response = await middlewares(moderator)
    .route("/", app)
    .request("/?created=999999", undefined, env);

  expect(response.status).toBe(200);
  const html = await render_html(await response.text());
  expect(html).not.toContain("organisations créées");
  expect(html).not.toContain("organisation créée");
});

test("POST /organizations/new sépare les SIRET existants, nouveaux et invalides", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await pg.insert(schema.organizations).values({
    siret: MaireClamart.siret,
    cached_libelle: "Mairie de Clamart",
  });
  const mockFetch = mock_siret_fetch({
    [NintendoOfEuropeSe.siret]: NintendoOfEuropeSe,
  });

  const response = await middlewares(moderator)
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request(
      "/",
      {
        method: "POST",
        body: new URLSearchParams({
          sirets: `${MaireClamart.siret}\n${NintendoOfEuropeSe.siret}\n123456\n0123456789012`,
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
      env,
    );

  expect(response.status).toBe(200);
  const html = await render_html(await response.text());
  expect(html).toContain("déjà en base");
  expect(html).toContain("Mairie de Clamart");
  expect(html).toContain("Nintendo of europe se");
  expect(html).toContain("2 SIRETs invalides");
  expect(html).toContain("123456");
  expect(html).toContain("0123456789012");
  expect(html).toContain("Un zéro de tête a peut-être été supprimé");
  expect(html).toContain('action="/organizations/new/confirm"');
  expect(html).toContain(`value="${NintendoOfEuropeSe.siret}"`);
});

test("POST /organizations/new demande de remplir le champ quand il est vide", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);

  const response = await middlewares(moderator)
    .route("/", app)
    .request(
      "/",
      {
        method: "POST",
        body: new URLSearchParams({ sirets: "   " }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
      env,
    );

  expect(response.status).toBe(200);
  const html = await render_html(await response.text());
  expect(html).toContain("Veuillez saisir au moins un SIRET.");
  expect(html).toContain('name="sirets"');
});

test("POST /organizations/new explique qu'un SIRET est non diffusible", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const mockFetch = mock_siret_fetch({
    [NintendoOfEuropeSe.siret]: {
      ...NintendoOfEuropeSe,
      status_diffusion: "non_diffusible",
    },
  });

  const response = await middlewares(moderator)
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request(
      "/",
      {
        method: "POST",
        body: new URLSearchParams({ sirets: NintendoOfEuropeSe.siret }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
      env,
    );

  expect(response.status).toBe(200);
  const html = await render_html(await response.text());
  expect(html).toContain("non diffusible dans la base SIRENE");
});

test("POST /organizations/new affiche un récapitulatif groupé quand entreprise.api.gouv.fr est injoignable", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const mockFetch = mock_siret_fetch({});

  const response = await middlewares(moderator)
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request(
      "/",
      {
        method: "POST",
        body: new URLSearchParams({
          sirets: `${NintendoOfEuropeSe.siret}\n${OctoTechnology.siret}`,
        }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
      env,
    );

  expect(response.status).toBe(200);
  const html = await render_html(await response.text());
  expect(html).toContain("pas pu être vérifiés");
  expect(html).toContain(NintendoOfEuropeSe.siret);
  expect(html).toContain(OctoTechnology.siret);
});

test("POST /organizations/new/confirm ne crée que les SIRET encore absents", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  await pg.insert(schema.organizations).values({
    siret: MaireClamart.siret,
    cached_libelle: "Mairie de Clamart",
  });
  const mockFetch = mock_siret_fetch({
    [NintendoOfEuropeSe.siret]: NintendoOfEuropeSe,
  });

  const body = new URLSearchParams();
  body.append("sirets[]", NintendoOfEuropeSe.siret);
  body.append("sirets[]", MaireClamart.siret);

  const response = await middlewares(moderator)
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request(
      "/confirm",
      {
        method: "POST",
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        redirect: "manual",
      },
      env,
    );

  expect(response.status).toBe(303);

  const nintendo = await pg.query.organizations.findFirst({
    where: eq(schema.organizations.siret, NintendoOfEuropeSe.siret),
  });
  ok(nintendo);
  expect(nintendo.cached_nom_complet).toBe("Nintendo of europe se");

  const clamart_organizations = await pg.query.organizations.findMany({
    where: eq(schema.organizations.siret, MaireClamart.siret),
  });
  expect(clamart_organizations).toHaveLength(1);

  expect(response.headers.get("location")).toBe(
    `/organizations/new?created=${nintendo.id}&skipped=1`,
  );
});

test("POST /organizations/new/confirm crée une organisation depuis un seul SIRET", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const mockFetch = mock_siret_fetch({
    [NintendoOfEuropeSe.siret]: NintendoOfEuropeSe,
  });

  const response = await middlewares(moderator)
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request(
      "/confirm",
      {
        method: "POST",
        body: new URLSearchParams({ "sirets[]": NintendoOfEuropeSe.siret }),
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        redirect: "manual",
      },
      env,
    );

  expect(response.status).toBe(303);

  const created = await pg.query.organizations.findMany({});
  expect(created).toHaveLength(1);
  ok(created[0]);
  expect(created[0].siret).toBe(NintendoOfEuropeSe.siret);

  expect(response.headers.get("location")).toBe(
    `/organizations/new?created=${created[0].id}`,
  );
});

test("POST /organizations/new/confirm crée N organisations et le récapitulatif pointe vers chacune", async () => {
  const moderator = await insert_moderateur(hyyyper_pglite);
  const mockFetch = mock_siret_fetch({
    [NintendoOfEuropeSe.siret]: NintendoOfEuropeSe,
    [OctoTechnology.siret]: OctoTechnology,
  });

  const body = new URLSearchParams();
  body.append("sirets[]", NintendoOfEuropeSe.siret);
  body.append("sirets[]", OctoTechnology.siret);

  const response = await middlewares(moderator)
    .use(set_fetch(mockFetch))
    .route("/", app)
    .request(
      "/confirm",
      {
        method: "POST",
        body,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        redirect: "manual",
      },
      env,
    );

  expect(response.status).toBe(303);

  const created = await pg.query.organizations.findMany({});
  expect(created).toHaveLength(2);
  const ids = created.map((organization) => organization.id).sort();

  expect(response.headers.get("location")).toBe(
    `/organizations/new?created=${ids.join(",")}`,
  );

  const summary_response = await middlewares(moderator)
    .route("/", app)
    .request(`/?created=${ids.join(",")}`, undefined, env);

  expect(summary_response.status).toBe(200);
  const html = await render_html(await summary_response.text());
  expect(html).toContain("2 organisations créées");
  expect(html).toContain(`href="/organizations/${ids[0]}"`);
  expect(html).toContain(`href="/organizations/${ids[1]}"`);
});
