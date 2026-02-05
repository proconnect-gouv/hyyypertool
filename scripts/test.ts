//

import { $ } from "bun";

//

const c = {
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
  yellow: (t: string) => `\x1b[33m${t}\x1b[0m`,
  magenta: (t: string) => `\x1b[35m${t}\x1b[0m`,
};

//

console.log(`[${c.cyan("format")}] Checking...`);
await $`bun x prettier --check .`;

console.log(`[${c.yellow("types")}] Checking...`);
await $`bun x tsc --build`;

console.log(`[${c.magenta("test")}] Running...`);
await $`bun test`;
