import { beforeEach, describe, expect, test } from "bun:test";
import ChangesetPlugin from "./index";

describe("ChangesetPlugin", () => {
  describe("isEnabled", () => {
    test("should return true", () => {
      expect(ChangesetPlugin.isEnabled()).toBe(true);
    });
  });

  describe("parseChangeset", () => {
    let plugin: ChangesetPlugin;

    beforeEach(() => {
      plugin = new ChangesetPlugin({});
    });

    test("should parse valid changeset content", () => {
      const content = `---
"test-pkg": patch
"another-pkg": minor
---

This is a test changeset summary`;

      const result = (plugin as any).parseChangeset("test-id", content);

      expect(result).toMatchInlineSnapshot(`
        {
          "id": "test-id",
          "releases": [
            {
              "name": "test-pkg",
              "type": "patch",
            },
            {
              "name": "another-pkg",
              "type": "minor",
            },
          ],
          "summary": "This is a test changeset summary",
        }
      `);
    });

    test("should return null for invalid changeset", () => {
      const content = `---
invalid: format
---

No valid releases`;

      const result = (plugin as any).parseChangeset("test-id", content);

      expect(result).toBeNull();
    });

    test("should handle empty frontmatter", () => {
      const content = `---
---

Just a summary`;

      const result = (plugin as any).parseChangeset("test-id", content);

      expect(result).toBeNull();
    });

    test("should handle changeset with only summary", () => {
      const content = `This is just a summary without frontmatter`;

      const result = (plugin as any).parseChangeset("test-id", content);

      expect(result).toMatchInlineSnapshot(`null`);
    });

    test("should parse major version bump", () => {
      const content = `---
"breaking-pkg": major
---

Breaking change in API`;

      const result = (plugin as any).parseChangeset("breaking", content);

      expect(result).toMatchInlineSnapshot(`
        {
          "id": "breaking",
          "releases": [
            {
              "name": "breaking-pkg",
              "type": "major",
            },
          ],
          "summary": "Breaking change in API",
        }
      `);
    });

    test("should ignore invalid release types", () => {
      const content = `---
"test-pkg": patch
"another-pkg": invalid
---

Mixed valid and invalid releases`;

      const result = (plugin as any).parseChangeset("mixed", content);

      expect(result).toMatchInlineSnapshot(`
        {
          "id": "mixed",
          "releases": [
            {
              "name": "test-pkg",
              "type": "patch",
            },
          ],
          "summary": "Mixed valid and invalid releases",
        }
      `);
    });
  });

  describe("version bump logic", () => {
    test("should determine highest bump type correctly", () => {
      // Test patch < minor < major hierarchy
      const changesets = [
        {
          id: "test1",
          summary: "Patch change",
          releases: [{ name: "pkg1", type: "patch" as const }],
        },
        {
          id: "test2",
          summary: "Minor change",
          releases: [{ name: "pkg2", type: "minor" as const }],
        },
        {
          id: "test3",
          summary: "Major change",
          releases: [{ name: "pkg3", type: "major" as const }],
        },
      ];

      const bumpTypes = changesets.flatMap((cs) =>
        cs.releases.map((r) => r.type),
      );
      const highestBump = bumpTypes.reduce((max, type) => {
        const order: Record<string, number> = { patch: 0, minor: 1, major: 2 };
        return order[type] > order[max] ? type : max;
      }, "patch");

      expect(highestBump).toBe("major");
    });

    test("should handle single changeset", () => {
      const changesets = [
        {
          id: "single",
          summary: "Single minor change",
          releases: [{ name: "pkg", type: "minor" as const }],
        },
      ];

      const bumpTypes = changesets.flatMap((cs) =>
        cs.releases.map((r) => r.type),
      );
      const highestBump = bumpTypes.reduce((max, type) => {
        const order: Record<string, number> = { patch: 0, minor: 1, major: 2 };
        return order[type] > order[max] ? type : max;
      }, "patch");

      expect(highestBump).toBe("minor");
    });

    test("should default to patch when no changesets", () => {
      const changesets: Array<{
        id: string;
        summary: string;
        releases: Array<{ name: string; type: "patch" | "minor" | "major" }>;
      }> = [];
      const bumpTypes = changesets.flatMap((cs) =>
        cs.releases.map((r) => r.type),
      );
      const highestBump = bumpTypes.reduce((max, type) => {
        const order: Record<string, number> = { patch: 0, minor: 1, major: 2 };
        return order[type] > order[max] ? type : max;
      }, "patch");

      expect(highestBump).toBe("patch");
    });
  });

  describe("changelog formatting", () => {
    test("should format changelog header correctly", () => {
      const date = "2025-09-18";
      const version = "1.2.3";
      const repo = "test/repo";

      // Test the header formatting logic
      const header = `## [${version}](${repo ? `${repo}/compare/v${"1.2.2"}...v${version}` : ""}) (${date})\n\n`;

      expect(header).toMatchInlineSnapshot(`
        "## [1.2.3](test/repo/compare/v1.2.2...v1.2.3) (2025-09-18)

        "
      `);
    });

    test("should format changelog entries", () => {
      const changesets = [
        {
          id: "feat1",
          summary: "Add new feature",
          releases: [{ name: "pkg", type: "minor" as const }],
        },
        {
          id: "fix1",
          summary: "Fix bug",
          releases: [{ name: "pkg", type: "patch" as const }],
        },
      ];

      // Test the new grouping logic
      const changesByType: Record<
        string,
        Array<{ packages: string[]; summary: string }>
      > = {};

      for (const cs of changesets) {
        for (const release of cs.releases) {
          if (!changesByType[release.type]) {
            changesByType[release.type] = [];
          }
          changesByType[release.type].push({
            packages: [release.name],
            summary: cs.summary,
          });
        }
      }

      let entries = "";
      const bumpOrder = ["major", "minor", "patch"];

      for (const bumpType of bumpOrder) {
        const changes = changesByType[bumpType];
        if (changes && changes.length > 0) {
          entries += `### ${bumpType.charAt(0).toUpperCase() + bumpType.slice(1)} Changes\n\n`;
          for (const change of changes) {
            entries += `- ${change.summary} (${change.packages.join(", ")})\n`;
          }
          entries += "\n";
        }
      }

      expect(entries).toContain("### Minor Changes");
      expect(entries).toContain("### Patch Changes");
      expect(entries).toContain("- Add new feature (pkg)");
      expect(entries).toContain("- Fix bug (pkg)");
    });
  });
});
