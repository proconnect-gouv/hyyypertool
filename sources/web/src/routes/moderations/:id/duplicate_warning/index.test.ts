//

import { set_config } from "#src/middleware/config";
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
        HOST: "http://localhost:6500",
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
    <div class="p-4 mb-4 text-sm bg-[#ffe9e6] text-[#b34000]">
      <h3 class="font-bold mb-1">Attention : demande multiples</h3>
      <p>Il s&#39;agit de la 2e demande pour cette organisation</p>
      <a
        href="http://localhost:6500/#search/adora.pony@unicorn.xyz"
        rel="noopener noreferrer"
        target="_blank"
        >Trouver les echanges pour l&#39;email « adora.pony@unicorn.xyz » dans
        Zammad</a
      >
      <ul>
        <li>
          <a href="/moderations/1">Moderation#1</a>
          <p
            class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#18753c] bg-[#b8fec9]"
          >
            Traité
          </p>
          Pas de ticket
        </li>
        <li>
          <a href="/moderations/2">Moderation#2</a>
          <p
            class="inline-flex items-center w-fit text-sm leading-6 min-h-6 px-2 font-bold uppercase rounded text-[#18753c] bg-[#b8fec9]"
          >
            Traité
          </p>
          Pas de ticket
        </li>
      </ul>
      <form
        _="
          on submit
            wait for htmx:afterSettle
            wait 2s
            go back
          "
        hx-patch="/moderations/2/processed"
        hx-swap="none"
      >
        <fieldset
          class="relative flex flex-row flex-wrap items-baseline m-0 p-0 border-0"
        >
          <div class="flex-[1_1_100%] max-w-full px-2 mb-4 text-right">
            <button
              class="inline-flex items-center w-fit font-medium text-base leading-6 min-h-10 px-4 py-2 text-white hover:bg-blue-france-hover bg-error hover:bg-error-hover!"
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
