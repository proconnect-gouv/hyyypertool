//

import { set_userinfo } from "#src/middleware/auth";
import { set_config } from "#src/middleware/config";
import { set_crisp_client } from "#src/middleware/crisp";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import {
  set_identite_pg,
  set_identite_pg_client,
} from "#src/middleware/identite-pg";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  client,
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import {
  empty_database as empty_hyyyperbase,
  hyyyper_pglite,
} from "@~/hyyyperbase/testing";
import { insert_central_administration_response } from "@~/hyyyperbase/testing/response_templates";
import {
  beforeAll,
  beforeEach,
  expect,
  mock,
  setSystemTime,
  test,
} from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);
beforeEach(empty_hyyyperbase);

//

test("PATCH /moderations/:id/rejected rejects moderation via new crisp conversation", async () => {
  setSystemTime(new Date("2222-11-10T00:00:00.000Z"));
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "💼",
  });

  const mock_crisp = {
    create_conversation: mock().mockResolvedValue({
      session_id: "crisp-new-session",
    }),
    get_user: mock().mockResolvedValue({
      user_id: "operator-123",
      nickname: "Anaïs T.",
    }),
    send_message: mock().mockResolvedValue(undefined),
    mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  };

  setSystemTime(new Date("2222-11-11T00:00:00.000Z"));
  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "admin@example.com",
        API_AUTH_URL: "http://crisp.localhost",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client as any))
    .use(set_crisp_client(mock_crisp as any))
    .use(
      set_userinfo({
        email: "admin@example.com",
        given_name: "Anaïs",
        usual_name: "Tartempion",
      }),
    )
    .route("/:id/rejected", app)
    .request(`/${moderation_id}/rejected`, {
      method: "PATCH",
      body: new URLSearchParams({
        message: "Your request has been rejected.",
        reason: "Not eligible",
        subject: "[ProConnect] Rejected",
      }),
    });

  expect(response.status).toBe(200);

  expect(mock_crisp.get_user).toHaveBeenCalledWith({
    email: "admin@example.com",
  });
  expect(mock_crisp.create_conversation).toHaveBeenCalledWith({
    email: "adora.pony@unicorn.xyz",
    subject: "[ProConnect] Rejected",
    nickname: "adora.pony@unicorn.xyz",
  });
  expect(mock_crisp.send_message).toHaveBeenCalledWith({
    session_id: "crisp-new-session",
    content: expect.stringContaining("Your request has been rejected."),
    user: { user_id: "operator-123", nickname: "Anaïs T." },
  });
  expect(mock_crisp.mark_conversation_as_resolved).toHaveBeenCalledWith({
    session_id: "crisp-new-session",
  });

  const moderation = await pg.query.moderations.findFirst({
    where: (table, { eq }) => eq(table.id, moderation_id),
  });

  expect(moderation).toMatchObject({
    status: "rejected",
    ticket_id: "crisp-new-session",
  });
});

test("PATCH /moderations/:id/rejected rejects moderation via existing crisp conversation", async () => {
  setSystemTime(new Date("2222-11-10T00:00:00.000Z"));
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "💼",
    ticket_id: "session_existing-123",
  });

  const mock_crisp = {
    get_user: mock().mockResolvedValue({
      user_id: "operator-456",
      nickname: "Anaïs T.",
    }),
    send_message: mock().mockResolvedValue(undefined),
    mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  };

  setSystemTime(new Date("2222-11-11T00:00:00.000Z"));
  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "admin@example.com",
        API_AUTH_URL: "http://crisp.localhost",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client as any))
    .use(set_crisp_client(mock_crisp as any))
    .use(
      set_userinfo({
        email: "admin@example.com",
        given_name: "Anaïs",
        usual_name: "Tartempion",
      }),
    )
    .route("/:id/rejected", app)
    .request(`/${moderation_id}/rejected`, {
      method: "PATCH",
      body: new URLSearchParams({
        message: "Your request has been rejected.",
        reason: "Not eligible",
        subject: "[ProConnect] Rejected",
      }),
    });

  expect(response.status).toBe(200);

  expect(mock_crisp.get_user).toHaveBeenCalledWith({
    email: "admin@example.com",
  });
  expect(mock_crisp.send_message).toHaveBeenCalledWith({
    session_id: "session_existing-123",
    content: expect.stringContaining("Your request has been rejected."),
    user: { user_id: "operator-456", nickname: "Anaïs T." },
  });
  expect(mock_crisp.mark_conversation_as_resolved).toHaveBeenCalledWith({
    session_id: "session_existing-123",
  });
});

test("PATCH /moderations/:id/rejected falls back to nickname when get_user fails", async () => {
  setSystemTime(new Date("2222-11-10T00:00:00.000Z"));
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, {
    type: "💼",
  });

  const mock_crisp = {
    create_conversation: mock().mockResolvedValue({
      session_id: "crisp-fallback",
    }),
    get_user: mock().mockRejectedValue(new Error("Operator not found")),
    send_message: mock().mockResolvedValue(undefined),
    mark_conversation_as_resolved: mock().mockResolvedValue(undefined),
  };

  setSystemTime(new Date("2222-11-11T00:00:00.000Z"));
  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "admin@example.com",
        API_AUTH_URL: "http://crisp.localhost",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_identite_pg_client(client as any))
    .use(set_crisp_client(mock_crisp as any))
    .use(
      set_userinfo({
        email: "admin@example.com",
        given_name: "Anaïs",
        usual_name: "Tartempion",
      }),
    )
    .route("/:id/rejected", app)
    .request(`/${moderation_id}/rejected`, {
      method: "PATCH",
      body: new URLSearchParams({
        message: "Your request has been rejected.",
        reason: "Not eligible",
        subject: "[ProConnect] Rejected",
      }),
    });

  expect(response.status).toBe(200);

  expect(mock_crisp.send_message).toHaveBeenCalledWith({
    session_id: "crisp-fallback",
    content: expect.stringContaining("Your request has been rejected."),
    user: { nickname: "Anaïs Tartempion" },
  });
});

test("GET /message returns textarea with rendered template", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "💼" });
  const template = await insert_central_administration_response(hyyyper_pglite);

  const response = await new Hono()
    .use(set_identite_pg(pg))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_userinfo({ email: "admin@example.com" }))
    .route("/:id/rejected", app)
    .request(`/${moderation_id}/rejected/message?reason=${encodeURIComponent(template.label)}`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain(`id="rejection-message-${moderation_id}"`);
  expect(html).toContain("adora.pony@unicorn.xyz");
});

test("GET /message returns empty textarea when label not found", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);
  const moderation_id = await create_adora_pony_moderation(pg, { type: "💼" });

  const response = await new Hono()
    .use(set_identite_pg(pg))
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_userinfo({ email: "admin@example.com" }))
    .route("/:id/rejected", app)
    .request(`/${moderation_id}/rejected/message?reason=unknown-label`);

  expect(response.status).toBe(200);
  const html = await response.text();
  expect(html).toContain(`id="rejection-message-${moderation_id}"`);
});
