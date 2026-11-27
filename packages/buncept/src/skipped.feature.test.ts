import { expect, test } from "bun:test";

//

test("steps after a failed step are skipped", async () => {
  // A failing Scenario can't pass here, so it runs in its own `bun test`
  const run = Bun.spawn(
    [process.execPath, "test", `${import.meta.dir}/skipped.fixture.ts`],
    { stderr: "pipe" },
  );
  const output = await new Response(run.stderr).text();
  expect(await run.exited).toBe(1);
  expect(output).toContain(`skipped: step "I am on page "/"" failed`);
}, 30_000);
