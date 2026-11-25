//

import { NotFoundError } from "#src/errors";
import type { CrispApi } from "#src/lib/crisp";
import { set_config } from "#src/middleware/config";
import { set_crisp_client } from "#src/middleware/crisp";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";

import { set_userinfo } from "#src/middleware/auth";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect/database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { beforeAll, beforeEach, expect, mock, test } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /moderations/:id/email", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  const moderation_id = await create_adora_pony_moderation(pg, { type: "" });

  //

  const response = await new Hono()
    .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/:id/email", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/email?describedby=🐘`);

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
  expect(await response.text()).toContain('aria-describedby="🐘"');
});

test("GET /moderations/:id/email throws NotFoundError for an unknown moderation", async () => {
  await expect(
    new Hono()
      .use(set_config({ ALLOWED_USERS: "good@captain.yargs" }))
      .use(set_identite_pg(pg))
      .use(set_nonce("nonce"))
      .use(set_userinfo({ email: "good@captain.yargs" }))
      .route("/:id/email", app)
      .onError((error) => {
        throw error;
      })
      .request(`/42/email?describedby=🐘`),
  ).rejects.toThrow(NotFoundError);
});

test("GET /moderations/:id/email shows the Crisp exchange described by its heading", async () => {
  await create_unicorn_organization(pg);
  await create_adora_pony_user(pg);

  const moderation_id = await create_adora_pony_moderation(pg, {
    ticket_id: "  session_test  ",
    type: "",
  });

  const get_conversation = mock<CrispApi["get_conversation"]>(
    async ({ session_id }) => ({
      conversation: {
        created_at: 1_700_000_000_000,
        last_message: "Message 1",
        meta: {
          avatar: "",
          data: {},
          device: {},
          email: "user@example.com",
          ip: "",
          nickname: "User",
          phone: "",
          segments: ["email"],
          subject: "Conversation de test",
        },
      },
      messages: [],
    }),
  );
  const crisp = {
    create_conversation: mock(),
    get_conversation,
    get_user: mock(),
    mark_conversation_as_resolved: mock(),
    send_message: mock(),
  };

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "good@captain.yargs",
        CRISP_WEBSITE_ID: "test",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .use(set_crisp_client(crisp))
    .route("/:id/email", app)
    .onError((error) => {
      throw error;
    })
    .request(`/${moderation_id}/email?describedby=🐘`);

  if (response.status >= 400) throw await response.text();

  const body = await response.text();
  expect(body).toContain('aria-describedby="🐘"');
  expect(body).toContain("Conversation de test");
  expect(get_conversation).toHaveBeenCalledWith({ session_id: "session_test" });
});
