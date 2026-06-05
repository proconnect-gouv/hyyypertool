//

import { pglite_client as hyyyperbase_pglite_client } from "@~/hyyyperbase/testing";
import { client as identite_pglite_client } from "@~/identite-proconnect/database/testing";
import { afterAll } from "bun:test";

//

// pglite 0.4.x leaves its Postgres WASM runtime in an unclean state on implicit
// process teardown, which bun surfaces as exit code 100 even when every test
// passes. Both pglite clients are module-level singletons shared across the
// whole suite, so they must be closed exactly once — after every test file has
// run, not in a per-file afterAll. As a preloaded module, this top-level
// afterAll is a global hook that fires once at the end of the run.
afterAll(async () => {
  await hyyyperbase_pglite_client.close();
  await identite_pglite_client.close();
});
