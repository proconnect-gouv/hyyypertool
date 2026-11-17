//

import { $ } from "bun";

//

const hyyyperbase_up = await Bun.connect({
  hostname: "127.0.0.1",
  port: 5555,
  socket: { data() {} },
}).then(
  (socket) => (socket.end(), true),
  () => false,
);

if (!hyyyperbase_up) {
  console.log("🐘 No database on 127.0.0.1:5555, starting one...\n");
  // db:migrate brings the compose databases up; seeds wipe then reinsert.
  await $`bun run db:migrate`;
  await $`bun run db:seed`;
}

await $.cwd("bin")`bun run dev`;
