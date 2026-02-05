//

import { $ } from "bun";

//

const e2e_dirname = new URL("../../e2e", import.meta.url).pathname;

const c = {
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
  magenta: (t: string) => `\x1b[35m${t}\x1b[0m`,
};

//

console.log(`[${c.cyan("deps")}] Installing...`);
await $`bun install`.cwd(e2e_dirname).quiet();

console.log(`[${c.magenta("studio")}] Opening...`);
await $`bun run studio`.cwd(e2e_dirname);
