import { set_userinfo } from "#src/middleware/auth";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import {
  empty_database as hyyyperbase_empty_database,
  hyyyper_pglite,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import {
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll, beforeEach } from "bun:test";
import { Scenario } from "bun-webview-dsl";
import { Hono } from "hono";
import app from "./index";

//

const MODERATOR = { email: "moderateur@beta.gouv.fr", sub: "oidc-sub-moderateur" };

let server: ReturnType<typeof Bun.serve>;
beforeAll(migrate);
beforeAll(() => {
  const hono = new Hono()
    .onError((e) => {
      throw e;
    })
    .use(set_hyyyper_pg(hyyyper_pglite))
    .use(set_identite_pg(pg))
    .use(set_nonce("nonce"))
    .use(set_userinfo(MODERATOR))
    .route("/moderations", app);
  server = Bun.serve({ fetch: hono.fetch });
});
afterAll(() => server.stop(true));
beforeEach(identite_empty_database);
beforeEach(hyyyperbase_empty_database);
beforeEach(() => insert_database(pg));
beforeEach(() => insert_moderateur(hyyyper_pglite));

//

Scenario(
  "Moderator can search a moderation by email",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.see("Liste des moderations");
    I.see("Richard");
    I.fill("Filtrer les modérations…", "is:pending email:jeanbon");
    I.see("13002526500013");
    I.not_see("Raphael");
  },
);

Scenario(
  "Moderator can search a moderation by SIRET",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.see("Liste des moderations");
    I.see("Richard");
    I.fill("Filtrer les modérations…", "is:pending siret:51935970700022");
    I.see("51935970700022");
    I.not_see("Raphael");
  },
);

Scenario(
  "Moderator can explore a moderation from the list",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.see("Liste des moderations");
    I.see("Richard");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see_in_title("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("jeanbon@yopmail.com");
  },
);
