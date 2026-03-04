//

import { $ } from "bun";

//

await Promise.allSettled([
  $.cwd("sources/identite-proconnect")`bun run seed`,
  $.cwd("sources/hyyyperbase")`bun run seed`,
]);
