import { set_userinfo } from "#src/middleware/auth";
import { set_hyyyper_pg } from "#src/middleware/hyyyperbase";
import { set_identite_pg } from "#src/middleware/identite-pg";
import { set_nonce } from "#src/middleware/nonce";
import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import {
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { Scenario } from "bun-webview-dsl";
import { afterAll, beforeAll, beforeEach } from "bun:test";
import { Hono } from "hono";
import app from "./index";

//

const MODERATOR = {
  email: "moderateur@beta.gouv.fr",
  sub: "oidc-sub-moderateur",
};

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
  "Moderator can see the user details",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.see("Liste des moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("jeanbon@yopmail.com");
  },
);

Scenario(
  "Moderator can see the user's organizations",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("organisation connu");
  },
);

Scenario(
  "Moderator can see the target organization's members",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("membre connu");
  },
);

Scenario(
  "Moderator can go back to the list",
  () => `http://localhost:${server.port}`,
  ({ I }) => {
    I.navigate("/moderations");
    I.click_link("Modération a traiter de Jean Bon pour 13002526500013");
    I.see("jeanbon@yopmail.com");
    I.click("retour");
    I.see_in_title("Liste des moderations");
  },
);
