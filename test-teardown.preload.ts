//

import { afterAll } from "bun:test";

//

// pglite 0.4.x leaves its Postgres WASM runtime in an unclean state on implicit
// process teardown, which bun surfaces as exit code 100 even when every test
// passes. The pglite testing clients are module-level singletons shared across
// the whole suite, so they must be closed exactly once — after every test file
// has run, not in a per-file afterAll. As a preloaded module, this top-level
// afterAll is a global hook that fires once at the end of the run.
//
// Importing the clients here would boot both Postgres runtimes in every test
// process, including the ones that never touch a database (~2.4s each; 16 at
// once starve the CPU and hang). Each client registers itself instead, so
// only the ones a test file actually imported get closed.
afterAll(async () => {
  const { pglite_clients = [] } = globalThis as {
    pglite_clients?: { close(): Promise<void> }[];
  };
  for (const client of pglite_clients) await client.close();
});
