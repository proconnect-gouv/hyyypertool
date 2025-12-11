import { describe, expect, setSystemTime, test } from "bun:test";
import GitmojiChangelogPlugin from "./index";

describe("GitmojiChangelogPlugin", () => {
  describe("isEnabled", () => {
    test("should return true", () => {
      expect(GitmojiChangelogPlugin.isEnabled()).toBe(true);
    });
  });

  describe("extractEmoji", () => {
    test("should extract unicode emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const result = plugin.extractEmoji("✨ Add new feature");
      expect(result).toBe("✨");
    });

    test("should extract shortcode emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const result = plugin.extractEmoji(":sparkles: Add new feature");
      expect(result).toBe(":sparkles:");
    });

    test("should extract bug emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const result = plugin.extractEmoji("🐛 Fix login issue");
      expect(result).toBe("🐛");
    });

    test("should extract arrow_upper_right shortcode", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const result = plugin.extractEmoji(
        ":arrow_upper_right: [patch](deps): bump lodash",
      );
      expect(result).toBe(":arrow_upper_right:");
    });

    test("should return undefined for no emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const result = plugin.extractEmoji("chore: update deps");
      expect(result).toBeUndefined();
    });

    test("should return undefined for empty string", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const result = plugin.extractEmoji("");
      expect(result).toBeUndefined();
    });
  });

  describe("getGroupForEmoji", () => {
    test("should return added for sparkles emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      expect(plugin.getGroupForEmoji("✨")).toBe("added");
    });

    test("should return added for sparkles shortcode", () => {
      const plugin = new GitmojiChangelogPlugin({});
      expect(plugin.getGroupForEmoji(":sparkles:")).toBe("added");
    });

    test("should return fixed for bug emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      expect(plugin.getGroupForEmoji("🐛")).toBe("fixed");
    });

    test("should return changed for recycle emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      expect(plugin.getGroupForEmoji("♻️")).toBe("changed");
    });

    test("should return dependencies for arrow_upper_right", () => {
      const plugin = new GitmojiChangelogPlugin({});
      expect(plugin.getGroupForEmoji(":arrow_upper_right:")).toBe(
        "dependencies",
      );
    });

    test("should return misc for null emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      expect(plugin.getGroupForEmoji(undefined)).toBe("misc");
    });

    test("should return misc for unknown emoji", () => {
      const plugin = new GitmojiChangelogPlugin({});
      expect(plugin.getGroupForEmoji("🦄")).toBe("misc");
    });
  });

  describe("groupCommits", () => {
    test("should group commits by type", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const commits = [
        {
          hash: "abc",
          shortHash: "abc",
          subject: "✨ Feature",
          emoji: "✨",
          group: "added",
        },
        {
          hash: "def",
          shortHash: "def",
          subject: "🐛 Bug fix",
          emoji: "🐛",
          group: "fixed",
        },
        {
          hash: "ghi",
          shortHash: "ghi",
          subject: "✨ Another feature",
          emoji: "✨",
          group: "added",
        },
      ];

      const result = plugin.groupCommits(commits);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "commits": [
              {
                "emoji": "✨",
                "group": "added",
                "hash": "abc",
                "shortHash": "abc",
                "subject": "✨ Feature",
              },
              {
                "emoji": "✨",
                "group": "added",
                "hash": "ghi",
                "shortHash": "ghi",
                "subject": "✨ Another feature",
              },
            ],
            "label": "Ajouté",
          },
          {
            "commits": [
              {
                "emoji": "🐛",
                "group": "fixed",
                "hash": "def",
                "shortHash": "def",
                "subject": "🐛 Bug fix",
              },
            ],
            "label": "Corrigé",
          },
        ]
      `);
    });

    test("should maintain group order", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const commits = [
        {
          hash: "a",
          shortHash: "a",
          subject: "🐛 Fix",
          emoji: "🐛",
          group: "fixed",
        },
        {
          hash: "b",
          shortHash: "b",
          subject: "✨ Feature",
          emoji: "✨",
          group: "added",
        },
      ];

      const result = plugin.groupCommits(commits);

      expect(result).toMatchInlineSnapshot(`
        [
          {
            "commits": [
              {
                "emoji": "✨",
                "group": "added",
                "hash": "b",
                "shortHash": "b",
                "subject": "✨ Feature",
              },
            ],
            "label": "Ajouté",
          },
          {
            "commits": [
              {
                "emoji": "🐛",
                "group": "fixed",
                "hash": "a",
                "shortHash": "a",
                "subject": "🐛 Fix",
              },
            ],
            "label": "Corrigé",
          },
        ]
      `);
    });
  });

  describe("generateMarkdown", () => {
    test("should generate markdown with version header (no compare link)", () => {
      setSystemTime(new Date("2222-11-11T00:00:00.000Z"));
      const plugin = new GitmojiChangelogPlugin({});
      const grouped = [
        {
          label: "Ajouté",
          commits: [
            {
              hash: "abc123",
              shortHash: "abc123",
              subject: "✨ Add feature",
              emoji: "✨",
              group: "added",
            },
          ],
        },
      ];

      const result = plugin.generateMarkdown("1.0.0", grouped, null, null);

      expect(result).toMatchInlineSnapshot(`
        "## 1.0.0 (2222-11-11)

        ### Ajouté

        - ✨ Add feature (abc123)

        "
      `);
    });

    test("should generate markdown with compare link when repo URL and last tag provided", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const grouped = [
        {
          label: "Ajouté",
          commits: [
            {
              hash: "abc123",
              shortHash: "abc123",
              subject: "✨ Add feature",
              emoji: "✨",
              group: "added",
            },
          ],
        },
      ];

      const result = plugin.generateMarkdown(
        "2025.12.0",
        grouped,
        "2025.11.2",
        "https://github.com/proconnect-gouv/hyyypertool",
      );

      expect(result).toContain(
        "## [2025.12.0](https://github.com/proconnect-gouv/hyyypertool/compare/2025.11.2...2025.12.0)",
      );
      expect(result).toContain("### Ajouté");
      expect(result).toContain("- ✨ Add feature (abc123)");
    });
  });

  describe("insertVersionSection", () => {
    test("should create new changelog if empty", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const result = plugin.insertVersionSection("", "## 1.0.0\n\nContent\n");

      expect(result).toContain("# Changelog");
      expect(result).toContain("## 1.0.0");
    });

    test("should insert after title", () => {
      const plugin = new GitmojiChangelogPlugin({});
      const existing = "# Changelog\n\n## 0.1.0\n\nOld content\n";
      const result = plugin.insertVersionSection(
        existing,
        "## 1.0.0\n\nNew content\n",
      );

      expect(result.indexOf("## 1.0.0")).toBeLessThan(
        result.indexOf("## 0.1.0"),
      );
    });
  });
});
