//

import { $ } from "bun";

//

await $`docker compose up --wait postgres-identite-proconnect postgres-hyyyperbase`;

await Promise.allSettled([
  $.cwd("sources/identite-proconnect")`bun run migrate`,
  $.cwd("sources/hyyyperbase")`bun run migrate`,
]);
