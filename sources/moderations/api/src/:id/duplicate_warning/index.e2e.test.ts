//

import { set_config } from "@~/app.middleware/set_config";
import { set_identite_pg } from "@~/app.middleware/set_identite_pg";
import { set_nonce } from "@~/app.middleware/set_nonce";
import { set_userinfo } from "@~/app.middleware/set_userinfo";
import {
  create_adora_pony_moderation,
  create_adora_pony_user,
  create_unicorn_organization,
} from "@~/identite-proconnect.database/seed/unicorn";
import {
  empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect.database/testing";
import { beforeAll, beforeEach, expect, test } from "bun:test";
import { Hono } from "hono";
import { format } from "prettier";
import app from "./index";

//

beforeAll(migrate);
beforeEach(empty_database);

//

test("GET /moderations/:id/duplicate_warning", async () => {
  const organization_id = await create_unicorn_organization(pg);
  const user_id = await create_adora_pony_user(pg);

  await create_adora_pony_moderation(pg, { type: "0️⃣" });
  const moderation_id = await create_adora_pony_moderation(pg, { type: "1️⃣" });
  const query_params = new URLSearchParams({
    organization_id: organization_id.toString(),
    user_id: user_id.toString(),
  });
  //

  const response = await new Hono()
    .use(
      set_config({
        ALLOWED_USERS: "good@captain.yargs",
        ZAMMAD_URL: "http://localhost:6500",
      }),
    )
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo({ email: "good@captain.yargs" }))
    .route("/:id/duplicate_warning", app)
    .onError((error) => {
      throw error;
    })
    .request(
      `/${moderation_id}/duplicate_warning?${query_params.toString()}`,
      {},
    );

  if (response.status >= 400) throw await response.text();

  expect(response.status).toBe(200);
  expect(format(await response.text(), { parser: "html" })).resolves
    .toMatchInlineSnapshot(`
    "<!DOCTYPE html>
    <div class="fr-alert fr-alert--warning">
      <h3 class="fr-alert__title">Attention : demande multiples</h3>
      <p>Il s&#39;agit de la 2e demande pour cette organisation</p>
      <a
        href="http://localhost:6500/#search/adora.pony@unicorn.xyz"
        rel="noopener noreferrer"
        target="_blank"
        >Trouver les echanges pour l&#39;email « adora.pony@unicorn.xyz » dans
        Zammad</a
      >
      <ul>
        <li><a href="/moderations/1">Moderation#1</a> ❌: Pas de ticket</li>
        <li><a href="/moderations/2">Moderation#2</a> ❌: Pas de ticket</li>
      </ul>
      <form
        _="
          on submit
            wait for htmx:afterSettle
            wait 2s
            go back
          "
        hx-patch="/moderations/2/$procedures/processed"
        hx-swap="none"
      >
        <fieldset class="fr-fieldset">
          <div class="fr-fieldset__element text-right">
            <button
              class="fr-btn bg-(--error-425-625) hover:bg-(--error-425-625-hover)!"
              type="submit"
            >
              Marquer la modération comme traité
            </button>
          </div>
        </fieldset>
      </form>
    </div>
    "
  `);
});
