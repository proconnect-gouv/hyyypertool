//

import { afterAll, beforeAll, expect, test } from "bun:test";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { hono_jsx_to_preact } from "./hono_jsx_to_preact";

//

let dir: string;

beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), "hono-jsx-to-preact-"));
  await writeFile(
    join(dir, "tsconfig.json"),
    JSON.stringify({
      compilerOptions: { jsx: "react-jsx", jsxImportSource: "hono/jsx" },
    }),
  );
  // A shared template: no pragma, hono hooks, as in `sources/web/src/ui`
  await writeFile(
    join(dir, "Menu.tsx"),
    `import { createContext, useContext, useState } from "hono/jsx";
    const Ids = createContext("");
    function Trigger() { return <button id={useContext(Ids)}>Menu</button>; }
    export function Menu() {
      const [id] = useState(() => "menu");
      return <Ids.Provider value={id}><Trigger /></Ids.Provider>;
    }`,
  );
});

afterAll(() => rm(dir, { force: true, recursive: true }));

test("a shared template bundles against preact, without hono", async () => {
  const { outputs, success } = await Bun.build({
    entrypoints: [join(dir, "Menu.tsx")],
    external: ["preact", "preact/*"],
    plugins: [hono_jsx_to_preact],
  });

  expect(success).toBe(true);
  const code = await outputs[0]!.text();
  expect(code).toMatch(/from\s*"preact\/jsx-(dev-)?runtime"/);
  expect(code).toMatch(/from\s*"preact\/hooks"/);
  expect(code).not.toMatch(/from\s*"hono/);
});
