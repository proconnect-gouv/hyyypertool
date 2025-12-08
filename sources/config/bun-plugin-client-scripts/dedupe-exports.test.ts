//

import { describe, expect, test } from "bun:test";
import {
  buildImportFixMap,
  dedupeExports,
  fixChunkImports,
} from "./dedupe-exports";

//

describe("buildImportFixMap", () => {
  test("maps buggy export names to correct ones for same variable", async () => {
    // Bun generates: 1st export (correct) + 2nd export (buggy internal)
    const files = [
      {
        content: `var gX=1,_X=2;export{gX as searchSiret,_X as searchEmail};export{D as a,gX as b}`,
        path: "/out/filter-signals.client.js",
      },
    ];

    const map = await buildImportFixMap(files);

    // Should map: b -> searchSiret (because gX appears in both exports)
    expect(map.get("filter-signals.client.js")).toEqual(
      new Map([["b", "searchSiret"]]),
    );
  });

  test("ignores files with single export statement", async () => {
    const files = [
      {
        content: `var a=1;export{a as searchEmail}`,
        path: "/out/filter-signals.client.js",
      },
    ];

    const map = await buildImportFixMap(files);

    expect(map.get("filter-signals.client.js")).toBeUndefined();
  });

  test("handles multiple buggy exports for same variable", async () => {
    const files = [
      {
        content: `var gX=1,_X=2;export{gX as searchSiret,_X as searchEmail};export{gX as b,_X as a}`,
        path: "/out/filter-signals.client.js",
      },
    ];

    const map = await buildImportFixMap(files);

    expect(map.get("filter-signals.client.js")).toEqual(
      new Map([
        ["a", "searchEmail"],
        ["b", "searchSiret"],
      ]),
    );
  });

  test("ignores variables only in second export (no mapping needed)", async () => {
    const files = [
      {
        content: `var gX=1,_X=2,D=3;export{gX as searchSiret,_X as searchEmail};export{D as a}`,
        path: "/out/filter-signals.client.js",
      },
    ];

    const map = await buildImportFixMap(files);

    // D is only in second export with no matching first export variable
    expect(map.get("filter-signals.client.js")).toBeUndefined();
  });
});

describe("fixChunkImports", () => {
  test("fixes import using buggy name to use correct name", () => {
    const importFixMap = new Map([
      ["filter-signals.client.js", new Map([["b", "searchSiret"]])],
    ]);

    const input = `import{b as e}from"./filter-signals.client.js";e.value="test"`;
    const result = fixChunkImports(input, importFixMap);

    expect(result).toBe(
      `import{searchSiret as e}from"./filter-signals.client.js";e.value="test"`,
    );
  });

  test("fixes multiple imports in same statement", () => {
    const importFixMap = new Map([
      [
        "filter-signals.client.js",
        new Map([
          ["a", "searchEmail"],
          ["b", "searchSiret"],
        ]),
      ],
    ]);

    const input = `import{a as e,b as t}from"./filter-signals.client.js"`;
    const result = fixChunkImports(input, importFixMap);

    expect(result).toBe(
      `import{searchEmail as e,searchSiret as t}from"./filter-signals.client.js"`,
    );
  });

  test("handles import without alias", () => {
    const importFixMap = new Map([
      ["filter-signals.client.js", new Map([["b", "searchSiret"]])],
    ]);

    const input = `import{b}from"./filter-signals.client.js"`;
    const result = fixChunkImports(input, importFixMap);

    expect(result).toBe(`import{searchSiret}from"./filter-signals.client.js"`);
  });

  test("leaves correct imports unchanged (not in fix map)", () => {
    const importFixMap = new Map([
      ["filter-signals.client.js", new Map([["b", "searchSiret"]])],
    ]);

    const input = `import{searchEmail}from"./filter-signals.client.js"`;
    const result = fixChunkImports(input, importFixMap);

    expect(result).toBe(`import{searchEmail}from"./filter-signals.client.js"`);
  });

  test("leaves unknown files unchanged", () => {
    const importFixMap = new Map<string, Map<string, string>>();

    const input = `import{a}from"./unknown.client.js"`;
    const result = fixChunkImports(input, importFixMap);

    expect(result).toBe(`import{a}from"./unknown.client.js"`);
  });
});

describe("dedupeExports", () => {
  test("removes duplicate export statements, keeps first", async () => {
    const input = `var a=1,b=2;export{a as searchEmail};export{b as searchSiret}`;
    const result = await dedupeExports(input, "test.js");

    expect(result).toBe(`var a=1,b=2;export{a as searchEmail};`);
  });

  test("leaves single export unchanged", async () => {
    const input = `var a=1;export{a as searchEmail}`;
    const result = await dedupeExports(input, "test.js");

    expect(result).toBe(`var a=1;export{a as searchEmail}`);
  });

  test("leaves code without exports unchanged", async () => {
    const input = `var a=1;console.log(a)`;
    const result = await dedupeExports(input, "test.js");

    expect(result).toBe(`var a=1;console.log(a)`);
  });

  test("handles re-exports (should NOT be deduped)", async () => {
    const input = `export{signal}from"./preact.js";export{effect}from"./preact.js"`;
    const result = await dedupeExports(input, "test.js");

    expect(result).toBe(input);
  });
});

describe("integration: buildImportFixMap + fixChunkImports + dedupeExports", () => {
  test("end-to-end fix of Bun's buggy minified output", async () => {
    // Simulates Bun's actual buggy output with duplicate exports
    const buildOutputs = [
      {
        content: `var _X=signal(""),gX=signal("");export{gX as searchSiret,_X as searchEmail};export{D as a,gX as b}`,
        path: "/out/filter-signals.client.js",
      },
      {
        content: `import{a as v,b as P}from"./filter-signals.client.js";console.log(P.value)`,
        path: "/out/search-email.client.js",
      },
      {
        content: `import{b as e}from"./filter-signals.client.js";console.log(e.value)`,
        path: "/out/search-siret.client.js",
      },
    ];

    // Step 1: Build import fix map from ORIGINAL files (before deduping)
    const importFixMap = await buildImportFixMap(buildOutputs);

    expect(importFixMap.get("filter-signals.client.js")).toEqual(
      new Map([["b", "searchSiret"]]),
    );

    // Step 2: Process each file - dedupe exports + fix imports
    const results = await Promise.all(
      buildOutputs.map(async (file) => {
        let content = await dedupeExports(file.content, file.path);
        content = fixChunkImports(content, importFixMap);
        return { content, path: file.path };
      }),
    );

    // filter-signals should have duplicate export removed
    expect(results[0].content).toBe(
      `var _X=signal(""),gX=signal("");export{gX as searchSiret,_X as searchEmail};`,
    );

    // search-email: 'b' should be fixed to 'searchSiret'
    expect(results[1].content).toBe(
      `import{a as v,searchSiret as P}from"./filter-signals.client.js";console.log(P.value)`,
    );

    // search-siret: 'b' should be fixed to 'searchSiret'
    expect(results[2].content).toBe(
      `import{searchSiret as e}from"./filter-signals.client.js";console.log(e.value)`,
    );
  });
});
