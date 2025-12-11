/// <reference types="@~/release-it-plugin-types" />

//

import { execSync } from "node:child_process";
import { readFile, writeFile } from "node:fs/promises";
import path from "path";
import { Plugin } from "release-it";

// Gitmoji group mappings
const GITMOJI_GROUPS: Record<string, { emoji: string[]; label: string }> = {
  added: {
    emoji: ["✨", ":sparkles:", "🎉", ":tada:", "➕", ":heavy_plus_sign:"],
    label: "Ajouté",
  },
  changed: {
    emoji: [
      "♻️",
      ":recycle:",
      "🔧",
      ":wrench:",
      "🎨",
      ":art:",
      "⚡",
      ":zap:",
      "🚚",
      ":truck:",
      "💄",
      ":lipstick:",
      "🏗️",
      ":building_construction:",
    ],
    label: "Modifié",
  },
  fixed: {
    emoji: ["🐛", ":bug:", "🚑", ":ambulance:", "🔒", ":lock:"],
    label: "Corrigé",
  },
  removed: {
    emoji: ["🔥", ":fire:", "➖", ":heavy_minus_sign:", "🗑️", ":wastebasket:"],
    label: "Supprimé",
  },
  dependencies: {
    emoji: [
      "⬆️",
      ":arrow_up:",
      "⬇️",
      ":arrow_down:",
      "📌",
      ":pushpin:",
      ":arrow_upper_right:",
    ],
    label: "Dépendances",
  },
  documentation: {
    emoji: ["📝", ":memo:", "📚", ":books:", "✍️", ":writing_hand:"],
    label: "Documentation",
  },
  ci: {
    emoji: ["👷", ":construction_worker:", "💚", ":green_heart:"],
    label: "CI/CD",
  },
  misc: {
    emoji: ["🔖", ":bookmark:"],
    label: "Divers",
  },
};

interface Commit {
  hash: string;
  shortHash: string;
  subject: string;
  emoji: string | undefined;
  group: string;
}

interface GroupedCommits {
  label: string;
  commits: Commit[];
}

interface PluginOptions {
  cwd?: string;
  infile?: string;
  repositoryUrl?: string;
}

/**
 * Release-it plugin that generates changelog with gitmoji grouping.
 *
 * This plugin parses git commits, groups them by gitmoji type,
 * and generates a French-localized changelog.
 */
export default class GitmojiChangelogPlugin extends Plugin {
  static override isEnabled() {
    return true;
  }

  private commits: Commit[] = [];

  override async getChangelog() {
    // Read the complete CHANGELOG.md which includes both changeset and gitmoji content
    // This plugin is listed first, so it will be the one providing changelog to GitHub
    const cwd = (this.options as PluginOptions).cwd || process.cwd();
    const infile = (this.options as PluginOptions).infile || "CHANGELOG.md";
    const changelogPath = path.join(cwd, infile);

    try {
      const changelog = await readFile(changelogPath, "utf-8");
      return this.extractLatestVersionSection(changelog);
    } catch (error) {
      this.log.warn(`Failed to read ${infile}: ${error}`);
      return "";
    }
  }

  private extractLatestVersionSection(changelog: string): string {
    const lines = changelog.split("\n");
    let inSection = false;
    const content: string[] = [];

    for (const line of lines) {
      if (line.startsWith("## ")) {
        if (inSection) {
          // Found the next version section, stop
          break;
        } else {
          // Found the first version section, start capturing (skip the header)
          inSection = true;
          continue;
        }
      }
      if (inSection) {
        content.push(line);
      }
    }

    return content.join("\n").trim();
  }

  override getInitialOptions(options: PluginOptions) {
    return Object.assign(
      {
        infile: "CHANGELOG.md",
      },
      options,
    );
  }

  override async init() {
    this.log.log("Initializing gitmoji-changelog plugin...");
  }

  override async bump(version: string) {
    const cwd = (this.options as PluginOptions).cwd || process.cwd();
    const infile = (this.options as PluginOptions).infile || "CHANGELOG.md";
    const changelogPath = path.join(cwd, infile);

    this.log.log(`Generating gitmoji changelog for version ${version}...`);

    try {
      // Get the last tag
      const lastTag = this.getLastTag(cwd);
      this.log.log(`Generating changes from ${lastTag || "beginning"} to HEAD`);

      // Get commits since last tag
      this.commits = this.getCommitsSinceTag(cwd, lastTag);

      if (this.commits.length === 0) {
        this.log.log("No commits found for changelog.");
        return;
      }

      this.log.log(`Found ${this.commits.length} commits`);

      // Group commits by emoji type
      const grouped = this.groupCommits(this.commits);

      // Get repository URL for compare links
      const repositoryUrl = this.getRepositoryUrl(cwd);

      // Generate markdown
      const markdown = this.generateMarkdown(
        version,
        grouped,
        lastTag,
        repositoryUrl,
      );

      // Read existing changelog
      let existingChangelog = "";
      try {
        existingChangelog = await readFile(changelogPath, "utf-8");
      } catch {
        // File doesn't exist yet
      }

      // Insert the new version section
      const newChangelog = this.insertVersionSection(
        existingChangelog,
        markdown,
      );
      await writeFile(changelogPath, newChangelog);

      this.log.log(`Updated ${infile} with ${this.commits.length} commits`);

      // Stage the changelog
      await this.exec(`git add ${infile}`);
      this.log.log("Staged changelog changes.");
    } catch (error) {
      this.log.warn(`Failed to generate gitmoji changelog: ${error}`);
      throw error;
    }
  }

  private getLastTag(cwd: string): string | null {
    try {
      const result = execSync("git describe --tags --abbrev=0 2>/dev/null", {
        cwd,
        encoding: "utf-8",
      });
      return result.trim();
    } catch {
      return null;
    }
  }

  private getRepositoryUrl(cwd: string): string | null {
    // First check if configured in options
    const configuredUrl = (this.options as PluginOptions).repositoryUrl;
    if (configuredUrl) return configuredUrl;

    // Try to get from git remote
    try {
      const result = execSync("git remote get-url origin 2>/dev/null", {
        cwd,
        encoding: "utf-8",
      });
      const url = result.trim();

      // Convert SSH URL to HTTPS if needed
      // git@github.com:org/repo.git -> https://github.com/org/repo
      if (url.startsWith("git@")) {
        const match = url.match(/git@([^:]+):(.+?)(?:\.git)?$/);
        if (match) {
          return `https://${match[1]}/${match[2]}`;
        }
      }

      // Remove .git suffix if present
      return url.replace(/\.git$/, "");
    } catch {
      return null;
    }
  }

  private getCommitsSinceTag(cwd: string, tag: string | null): Commit[] {
    const range = tag ? `${tag}..HEAD` : "HEAD";
    const format = "%H|%h|%s";

    try {
      const result = execSync(
        `git log ${range} --pretty=format:"${format}" --no-merges`,
        {
          cwd,
          encoding: "utf-8",
        },
      );

      if (!result.trim()) {
        return [];
      }

      return result
        .trim()
        .split("\n")
        .map((line) => {
          const [hash, shortHash, subject] = line.split("|");
          const emoji = this.extractEmoji(subject ?? "");
          const group = this.getGroupForEmoji(emoji);

          return {
            hash: hash ?? "",
            shortHash: shortHash ?? "",
            subject: subject ?? "",
            emoji,
            group,
          } satisfies Commit;
        })
        .filter((c) => c.hash && c.subject);
    } catch {
      return [];
    }
  }

  extractEmoji(subject: string) {
    // Match emoji at the start of the subject
    // Unicode emoji pattern or :shortcode:
    const emojiMatch = subject.match(
      /^(\p{Emoji_Presentation}|\p{Emoji}\uFE0F?|:[a-z_]+:)/u,
    );
    return emojiMatch?.at(1);
  }

  getGroupForEmoji(emoji: string | undefined): string {
    if (!emoji) return "misc";

    for (const [group, config] of Object.entries(GITMOJI_GROUPS)) {
      if (config.emoji.includes(emoji)) {
        return group;
      }
    }

    return "misc";
  }

  groupCommits(commits: Commit[]): GroupedCommits[] {
    const groups: Map<string, Commit[]> = new Map();

    for (const commit of commits) {
      const existing = groups.get(commit.group) || [];
      existing.push(commit);
      groups.set(commit.group, existing);
    }

    // Order groups in a sensible way
    const order = [
      "added",
      "changed",
      "fixed",
      "removed",
      "dependencies",
      "documentation",
      "ci",
      "misc",
    ];

    return order
      .filter((g) => groups.has(g))
      .map((g) => ({
        label: GITMOJI_GROUPS[g]?.label ?? "Divers",
        commits: groups.get(g) ?? [],
      }));
  }

  generateMarkdown(
    version: string,
    grouped: GroupedCommits[],
    lastTag: string | null,
    repositoryUrl: string | null,
  ): string {
    const date = new Date().toISOString().split("T")[0];

    // Generate header with compare link if we have repository URL and last tag
    let header: string;
    if (repositoryUrl && lastTag) {
      header = `## [${version}](${repositoryUrl}/compare/${lastTag}...${version}) (${date})`;
    } else {
      header = `## ${version} (${date})`;
    }

    let md = `${header}\n\n`;

    for (const group of grouped) {
      md += `### ${group.label}\n\n`;
      for (const commit of group.commits) {
        md += `- ${commit.subject} (${commit.shortHash})\n`;
      }
      md += "\n";
    }

    return md;
  }

  insertVersionSection(existingChangelog: string, newSection: string): string {
    if (!existingChangelog.trim()) {
      return `# Changelog\n\n${newSection}`;
    }

    // Find where to insert (after the title/header)
    const lines = existingChangelog.split("\n");
    let insertIndex = 0;

    // Look for first ## header (version header) or # header (title)
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line?.startsWith("# ") && i === 0) {
        // Skip the main title
        insertIndex = i + 1;
        // Skip empty lines after title
        while (
          insertIndex < lines.length &&
          lines[insertIndex]?.trim() === ""
        ) {
          insertIndex++;
        }
        break;
      }
      if (line?.startsWith("## ")) {
        // Insert before first version section
        insertIndex = i;
        break;
      }
    }

    // Insert the new content
    lines.splice(insertIndex, 0, newSection);
    return lines.join("\n");
  }
}
