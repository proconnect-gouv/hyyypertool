//

import { authorized, set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_crisp_client } from "#src/middleware/crisp";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_identite_runtime } from "#src/middleware/identite-runtime";
import { set_nonce } from "#src/middleware/nonce";
import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import {
  insert_jeanbon,
  insert_moderateur,
} from "@~/hyyyperbase/testing/users";
import { schema } from "@~/identite-proconnect/database";
import {
  create_adora_pony_user,
  create_pink_diamond_user,
  create_red_diamond_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { VerificationTypeSchema } from "@~/identite-proconnect/types";
import { beforeAll, beforeEach, expect, mock, test } from "bun:test";
import { eq } from "drizzle-orm";
import { Hono } from "hono";
import app from "./index";
import { error_handler } from "../../../error";

//

beforeAll(migrate);
beforeEach(empty_database);
beforeEach(hyyyperbase_empty_database);

//

function make_crisp_mock() {
  return {
    create_conversation: mock().mockResolvedValue({ session_id: "session" }),
    get_user: mock().mockResolvedValue({ nickname: "Test User" }),
    mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
    send_message: mock().mockResolvedValue(undefined),
  };
}

async function make_app({
  user = insert_moderateur(hyyyper_pglite),
}: { user?: ReturnType<typeof insert_moderateur> } = {}) {
  const { email, sub } = await user;
  return new Hono()
    .onError(error_handler)
    .use(set_config({ CRISP_RESOLVE_DELAY: 0 }))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_crisp_client(make_crisp_mock()))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email, sub: sub! }))
    .use(set_identite_runtime())
    .use(authorized())
    .route("/:id/members", app);
}

async function seed_members() {
  const organization_id = await create_unicorn_organization(pg);
  const adora = await create_adora_pony_user(pg);
  const pink = await create_pink_diamond_user(pg);
  const red = await create_red_diamond_user(pg);
  await pg.insert(schema.users_organizations).values(
    [adora, pink, red].map((user_id) => ({
      is_external: false,
      organization_id,
      user_id,
      verification_type: VerificationTypeSchema.enum.domain,
    })),
  );
  return { adora, organization_id, pink, red };
}

function members_of(organization_id: number) {
  return pg.query.users_organizations.findMany({
    columns: { is_external: true, user_id: true, verification_type: true },
    orderBy: (table, { asc }) => asc(table.user_id),
    where: (table, { eq }) => eq(table.organization_id, organization_id),
  });
}

function form(entries: ReadonlyArray<readonly [string, string | number]>) {
  return {
    body: new URLSearchParams(entries.map(([k, v]) => [k, String(v)])),
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "HX-Request": "true",
    },
  };
}

//

test("GET /organizations/:id/members renders the members page", async () => {
  const { organization_id } = await seed_members();

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("<html");
  expect(html).toContain("Membres de l’organisation");
  expect(html).toContain("adora.pony@unicorn.xyz");
  expect(html).toContain("Actions sur les membres sélectionnés");
  expect(html).toContain('name="user_id"');
  expect(html).toMatch(/name="page_size"[^>]*value="50"/);
});

test("GET /organizations/:id/members/export downloads every member as CSV", async () => {
  const { organization_id } = await seed_members();

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members/export`);

  expect(response.status).toBe(200);
  expect(response.headers.get("Content-Type")).toBe("text/csv; charset=utf-8");
  expect(response.headers.get("Content-Disposition")).toBe(
    `attachment; filename="organisation-${organization_id}-membres.csv"`,
  );
  const [header, ...rows] = (await response.text()).split("\r\n");
  expect(header).toBe(
    "Prénom,Nom,Email,Fonction,Interne,Type de vérification,Ajouté le,Modifié le",
  );
  expect(rows.map((row) => row.split(",")[2]).sort()).toEqual([
    "adora.pony@unicorn.xyz",
    "pink.diamond@unicorn.xyz",
    "red.diamond@unicorn.xyz",
  ]);
});

test("GET /organizations/:id/members/export?user_id= keeps only the selected members", async () => {
  const { organization_id, pink, red } = await seed_members();

  const response = await (
    await make_app()
  ).request(
    `/${organization_id}/members/export?user_id=${pink}&user_id=${red}`,
  );

  const [, ...rows] = (await response.text()).split("\r\n");
  expect(rows.map((row) => row.split(",")[2]).sort()).toEqual([
    "pink.diamond@unicorn.xyz",
    "red.diamond@unicorn.xyz",
  ]);
});

test("GET /organizations/:id/members/export defuses spreadsheet formulas and quotes commas", async () => {
  const { adora, organization_id } = await seed_members();
  await pg
    .update(schema.users)
    .set({ job: '=HYPERLINK("x"), boss' })
    .where(eq(schema.users.id, adora));

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members/export?user_id=${adora}`);

  expect(await response.text()).toContain(`,"'=HYPERLINK(""x""), boss",`);
});

test("GET /organizations/:id/members hides member and bulk actions for visitors", async () => {
  const { organization_id } = await seed_members();

  const response = await (
    await make_app({ user: insert_jeanbon(hyyyper_pglite) })
  ).request(`/${organization_id}/members`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain("adora.pony@unicorn.xyz");
  expect(html).not.toContain("retirer de l'orga");
  expect(html).not.toContain("Actions sur les membres sélectionnés");
  expect(html).not.toContain('name="user_id"');
});

test("GET /organizations/:id/members embedded over htmx drops bulk selection and pages by 10", async () => {
  const { organization_id } = await seed_members();

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members`, {
    headers: {
      "HX-Current-URL": `http://localhost/organizations/${organization_id}`,
      "HX-Request": "true",
    },
  });

  const html = await response.text();
  expect(html).toContain("adora.pony@unicorn.xyz");
  expect(html).not.toContain("Actions sur les membres sélectionnés");
  expect(html).not.toContain('name="user_id"');
  expect(html).toMatch(/name="page_size"[^>]*value="10"/);
});

test("GET /organizations/:id/members?q= keeps only matching names and emails", async () => {
  const { organization_id } = await seed_members();

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members?q=diamond`);

  const html = await response.text();
  expect(html).toContain("pink.diamond@unicorn.xyz");
  expect(html).toContain("red.diamond@unicorn.xyz");
  expect(html).not.toContain("adora.pony@unicorn.xyz");
});

test("GET /organizations/:id/members sorts by the requested column and order", async () => {
  const { organization_id } = await seed_members();
  const testing_app = await make_app();

  const emails_in = async (query: string) => {
    const html = await (
      await testing_app.request(`/${organization_id}/members?${query}`)
    ).text();
    return [...html.matchAll(/>([a-z.]+@unicorn\.xyz)</g)].map(([, e]) => e);
  };

  expect(await emails_in("sort=given-name&order=asc")).toEqual([
    "adora.pony@unicorn.xyz",
    "pink.diamond@unicorn.xyz",
    "red.diamond@unicorn.xyz",
  ]);
  expect(await emails_in("sort=given-name&order=desc")).toEqual([
    "red.diamond@unicorn.xyz",
    "pink.diamond@unicorn.xyz",
    "adora.pony@unicorn.xyz",
  ]);
});

test("GET /organizations/:id/members redirects an invalid sort to the plain page", async () => {
  const { organization_id } = await seed_members();

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members?sort=password`);

  expect(response.status).toBe(302);
  expect(response.headers.get("Location")).toBe(
    `/organizations/${organization_id}/members`,
  );
});

test("POST /organizations/:id/members applies a verification type to the selected members only", async () => {
  const { adora, organization_id, pink, red } = await seed_members();

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members`, {
    method: "POST",
    ...form([
      ["action", VerificationTypeSchema.enum.official_contact_email],
      ["user_id", adora],
      ["user_id", red],
    ]),
  });

  expect(response.status).toBe(200);
  expect(response.headers.get("HX-Trigger")).toBe("MEMBERS_UPDATED");
  expect(await members_of(organization_id)).toEqual([
    {
      is_external: false,
      user_id: adora,
      verification_type: VerificationTypeSchema.enum.official_contact_email,
    },
    {
      is_external: false,
      user_id: pink,
      verification_type: VerificationTypeSchema.enum.domain,
    },
    {
      is_external: false,
      user_id: red,
      verification_type: VerificationTypeSchema.enum.official_contact_email,
    },
  ]);
});

test("POST /organizations/:id/members action=external marks the selected members external", async () => {
  const { adora, organization_id, pink, red } = await seed_members();

  await (
    await make_app()
  ).request(`/${organization_id}/members`, {
    method: "POST",
    ...form([
      ["action", "external"],
      ["user_id", adora],
    ]),
  });

  expect(
    (await members_of(organization_id)).map(({ is_external, user_id }) => ({
      is_external,
      user_id,
    })),
  ).toEqual([
    { is_external: true, user_id: adora },
    { is_external: false, user_id: pink },
    { is_external: false, user_id: red },
  ]);
});

for (const [title, entries] of [
  ["without selection", [["action", "external"]]],
  ["without action", [["user_id", 1]]],
  [
    "with an unknown action",
    [
      ["action", "drop_table"],
      ["user_id", 1],
    ],
  ],
] as const) {
  test(`POST /organizations/:id/members ${title} answers 400`, async () => {
    const { organization_id } = await seed_members();

    const response = await (
      await make_app()
    ).request(`/${organization_id}/members`, {
      method: "POST",
      ...form(entries),
    });

    expect(response.status).toBe(400);
    expect(await response.text()).toBe(
      "Sélectionnez au moins un membre et une action.",
    );
  });
}

test("POST /organizations/:id/members is forbidden to visitors", async () => {
  const { adora, organization_id } = await seed_members();

  const response = await (
    await make_app({ user: insert_jeanbon(hyyyper_pglite) })
  ).request(`/${organization_id}/members`, {
    method: "POST",
    ...form([
      ["action", "external"],
      ["user_id", adora],
    ]),
  });

  expect(response.status).toBe(403);
  expect((await members_of(organization_id))[0]?.is_external).toBe(false);
});

test("POST /organizations/:id/members action=remove removes the members it can and reports the others", async () => {
  const { adora, organization_id, pink, red } = await seed_members();
  const outsider = 999_999;

  const response = await (
    await make_app()
  ).request(`/${organization_id}/members`, {
    method: "POST",
    ...form([
      ["action", "remove"],
      ["user_id", adora],
      ["user_id", outsider],
      ["user_id", red],
    ]),
  });

  expect(response.status).toBe(404);
  expect(response.headers.get("HX-Trigger")).toBe("MEMBERS_UPDATED");
  expect(await response.text()).toStartWith(
    "1 membre(s) sur 3 non traité(s) : ",
  );
  expect(await members_of(organization_id)).toEqual([
    {
      is_external: false,
      user_id: pink,
      verification_type: VerificationTypeSchema.enum.domain,
    },
  ]);
});
