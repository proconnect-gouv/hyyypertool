//

import { $ } from "bun";

//

await $`docker compose up --build --detach --remove-orphans --wait`;

await $`bun run scripts/migrate.ts`;

await $`bun run scripts/seed.ts`;

const tsc_watch = Bun.spawn(
  ["bun", "run", "build:tsc", "--watch", "--preserveWatchOutput"],
  {
    cwd: process.cwd(),
    stdout: "inherit",
    stderr: "inherit",
  },
);

const tailwind_watch = Bun.spawn(["bun", "run", "dev:tailwind"], {
  cwd: process.cwd(),
  stdout: "inherit",
  stderr: "inherit",
});

const dev_server = Bun.spawn(["bun", "run", "dev"], {
  cwd: process.cwd(),
  stdout: "inherit",
  stderr: "inherit",
});

//

process.on("SIGINT", async () => {
  console.log("\n 🛑 Shutting down servers...");

  tailwind_watch.kill();
  dev_server.kill();
  tsc_watch.kill();

  // Just in case
  await Promise.resolve();

  process.exit(0);
});
