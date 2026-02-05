//

import { $ } from "bun";

//

const c = {
  cyan: (t: string) => `\x1b[36m${t}\x1b[0m`,
};

const fix = Bun.argv.includes("--fix");

if (fix) {
  console.log(`[${c.cyan("format")}] Fixing...`);
  await $`bun x prettier --list-different --write .`;
} else {
  console.log(`[${c.cyan("format")}] Checking...`);
  await $`bun x prettier --check .`;
}
