import {
  empty_database as hyyyperbase_empty_database,
  pglite_client as hyyyperbase_client,
} from "@~/hyyyperbase/testing";
import {
  client as identite_client,
  empty_database as identite_empty_database,
  migrate,
} from "@~/identite-proconnect/database/testing";
import { config as buncept } from "buncept";
import { create_testing_router } from "./router";

//

let server: ReturnType<typeof Bun.serve>;

export async function start_app() {
  await migrate();
  server = Bun.serve({ fetch: create_testing_router().fetch, port: 0 });
  buncept.url = `http://localhost:${server.port}`;
}

export async function stop_app() {
  server.stop(true);
  await Promise.all([hyyyperbase_client.close(), identite_client.close()]);
}

export async function empty_databases() {
  await identite_empty_database();
  await hyyyperbase_empty_database();
}
