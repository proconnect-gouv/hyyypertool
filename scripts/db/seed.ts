//

import { $ } from "bun";

//

$.env({
  ...process.env,
  // LOCK(douglasduteil): this is a lock to prevent production database seeding
  DATABASE_URL: "postgresql://postgres:postgres@localhost:5432/postgres",
});

const c = {
  blue: (t: string) => `\x1b[34m${t}\x1b[0m`,
  yellow: (t: string) => `\x1b[33m${t}\x1b[0m`,
  green: (t: string) => `\x1b[32m${t}\x1b[0m`,
};

//

console.log(`[${c.blue("docker")}] Starting database...`);
await $`docker compose up --wait postgres-identite-proconnect`.quiet();

console.log(`[${c.yellow("migrate")}] Running...`);
await $`bun run --cwd sources/identite-proconnect migration`;

console.log(`[${c.green("seed")}] Running...`);
await $`bun run --cwd sources/identite-proconnect seed`;
