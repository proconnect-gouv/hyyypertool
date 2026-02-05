//
// Run once locally to bake git timestamps into each response template file.
// bun bin/seed/0000_response_types/stamp-timestamps.ts

import { glob, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const pattern = join(__dirname, "responses", "[!index]*.ts");

function git_iso(args: string[], file: string): string | undefined {
  const r = Bun.spawnSync([...args, "--", file]);
  return r.stdout.toString().trim().split("\n")[0];
}

for await (const file of glob(pattern)) {
  if (file.endsWith(".test.ts")) continue;

  const created_at = git_iso(
    ["git", "log", "--follow", "--diff-filter=A", "--format=%aI"],
    file,
  );
  const updated_at = git_iso(
    ["git", "log", "--follow", "-1", "--format=%aI"],
    file,
  );

  if (!created_at || !updated_at) {
    console.warn(`⚠ skipping ${file}: git returned no date`);
    continue;
  }

  let src = await readFile(file, "utf8");

  // Remove previous stamp block if present
  src = src.replace(
    /\n\/\/ @timestamps[^\n]*\nexport const created_at[^\n]*\nexport const updated_at[^\n]*\n/,
    "",
  );

  src +=
    `\n// @timestamps\n` +
    `export const created_at = new Date("${created_at}");\n` +
    `export const updated_at = new Date("${updated_at}");\n`;

  await writeFile(file, src);
  console.log(`✓ ${file.split("/").pop()}`);
}
