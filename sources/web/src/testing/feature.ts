import {
  hyyyper_pglite,
  empty_database as hyyyperbase_empty_database,
} from "@~/hyyyperbase/testing";
import {
  insert_central_administration_response,
  insert_domain_name_not_found_response,
} from "@~/hyyyperbase/testing/response_templates";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import {
  empty_database as identite_empty_database,
  migrate,
  pg,
} from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { config as buncept } from "buncept";
import { create_testing_router } from "./router";

//

export function setup_scenarios() {
  let server: ReturnType<typeof Bun.serve>;
  beforeAll(migrate);
  beforeAll(() => {
    server = Bun.serve({ fetch: create_testing_router().fetch, port: 0 });
    buncept.url = `http://localhost:${server.port}`;
  });
  afterAll(() => server.stop(true));
  // Once per Scenario: each step is its own test, state carries across them
  buncept.before_scenario = async () => {
    await identite_empty_database();
    await hyyyperbase_empty_database();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
    await insert_central_administration_response(hyyyper_pglite);
    await insert_domain_name_not_found_response(hyyyper_pglite);
  };
}
