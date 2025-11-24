//

import conventionalChangelogPlugin from "@release-it/conventional-changelog";
import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "path";
import { Plugin } from "release-it";

interface Changeset {
  id: string;
  summary: string;
  releases: Array<{ name: string; type: "patch" | "minor" | "major" }>;
}

export default class ChangesetPlugin extends Plugin {
  static isEnabled() {
    return true;
  }

  private changesets: Changeset[] = [];

  async init() {
    const cwd = this.options.cwd || process.cwd();
    this.changesets = await this.readChangesets(cwd);
    if (this.changesets.length === 0) {
      this.log.log(
        "No unreleased changesets found. Skipping changeset plugin.",
      );
      return false;
    }
    this.log.log(`Found ${this.changesets.length} unreleased changesets.`);
  }

  async bump(version: string) {
    const cwd = this.options.cwd || process.cwd();
    this.log.log(
      `Processing ${this.changesets.length} unreleased changesets for changelog.`,
    );

    // Generate changelog - don't bump versions, let calver handle that
    await this.updateChangelog(cwd, version);

    // Stage only changelog and changeset files
    await this.shell.exec("git add CHANGELOG.md .release-it-changeset/", {
      cwd,
    });
    this.log.log("Staged changelog changes.");
  }

  async release() {
    const cwd = this.options.cwd || process.cwd();
    // Remove consumed changesets
    for (const cs of this.changesets) {
      const filePath = path.join(cwd, ".release-it-changeset", `${cs.id}.md`);
      try {
        await unlink(filePath);
        this.log.log(`Removed changeset ${cs.id}.md`);
      } catch (error) {
        this.log.warn(`Failed to remove ${cs.id}.md: ${error}`);
      }
    }
    this.log.log("Changeset plugin release complete.");
  }

  private async readChangesets(cwd: string): Promise<Changeset[]> {
    const changesetDir = path.join(cwd, ".release-it-changeset");
    try {
      const files = await readdir(changesetDir);
      const changesets: Changeset[] = [];
      for (const file of files) {
        if (file.endsWith(".md")) {
          const content = await readFile(
            path.join(changesetDir, file),
            "utf-8",
          );
          const changeset = this.parseChangeset(
            file.replace(".md", ""),
            content,
          );
          if (changeset) changesets.push(changeset);
        }
      }
      return changesets;
    } catch {
      return [];
    }
  }

  private parseChangeset(id: string, content: string): Changeset | null {
    const lines = content.split("\n");
    let inFrontmatter = false;
    const frontmatter: string[] = [];
    let summary = "";
    let foundClosingMarker = false;

    for (const line of lines) {
      if (line.trim() === "---") {
        inFrontmatter = !inFrontmatter;
        if (!inFrontmatter) {
          foundClosingMarker = true;
          continue;
        }
      } else if (inFrontmatter) {
        frontmatter.push(line);
      } else if (foundClosingMarker && line.trim() && !summary) {
        summary = line.trim();
        break; // Found the summary, can stop parsing
      }
    }

    const releases: Changeset["releases"] = [];
    for (const line of frontmatter) {
      const match = line.match(/"([^"]+)":\s*(\w+)/);
      if (match) {
        const [, name, type] = match;
        if (type === "patch" || type === "minor" || type === "major") {
          releases.push({ name, type });
        }
      }
    }

    return releases.length > 0 ? { id, summary, releases } : null;
  }

  private async updateChangelog(cwd: string, version: string) {
    const changelogPath = path.join(cwd, "CHANGELOG.md");
    let changelog = "";
    try {
      changelog = await readFile(changelogPath, "utf-8");
    } catch {}

    const date = new Date().toISOString().split("T")[0];

    // Get repo URL dynamically from git remote, with fallback
    let repoUrl =
      this.options.git?.repo || (this.options as any).repository?.url;
    if (!repoUrl) {
      try {
        const { stdout } = await this.shell.exec(
          "git config --get remote.origin.url",
          {
            cwd,
          },
        );
        repoUrl = stdout.trim();
        // Convert SSH URLs to HTTPS
        if (repoUrl.startsWith("git@")) {
          repoUrl = repoUrl
            .replace(/^git@(.+?):(.+?)\/(.+?)(\.git)?$/, "https://$1/$2/$3")
            .replace(/\.git$/, "");
        }
      } catch {
        repoUrl = "https://github.com/proconnect-gouv/hyyypertool";
      }
    }

    // Get previous version from git tags instead of semver calculation
    let prevVersion = "0.0.0";
    try {
      const { stdout } = await this.shell.exec(
        "git tag --sort=-version:refname --list 'v*.*.*'",
        {
          cwd,
        },
      );
      const tags = stdout.trim().split("\n").filter(Boolean);
      if (tags.length > 0) {
        prevVersion = tags[0].replace(/^v/, "");
      }
    } catch {
      // Fallback to a default version
      prevVersion = "0.0.0";
    }

    const header = `## [${version}](${repoUrl}/compare/v${prevVersion}...v${version}) (${date})\n\n`;

    // Group changesets by bump type
    const changesByType: Record<
      string,
      Array<{ packages: string[]; summary: string }>
    > = {};

    this.log.log(
      `Processing ${this.changesets.length} changesets for changelog`,
    );

    for (const cs of this.changesets) {
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

    // Generate conventional changelog section with commit details
    let conventionalChangelogSection = "";
    try {
      // Create a temporary conventional-changelog plugin instance
      const convPlugin = conventionalChangelogPlugin({
        preset: "angular",
        infile: changelogPath,
        outfile: null, // We'll capture the output
      });

      // Get the conventional changelog content for commits
      const conventionalContent = await convPlugin.getChangelog({
        version,
        previousTag: `v${prevVersion}`,
        currentTag: `v${version}`,
        repoUrl,
      });

      if (conventionalContent) {
        conventionalChangelogSection = `\n### Commits\n\n${conventionalContent}\n\n`;
      }
    } catch (error) {
      this.log.warn(`Failed to generate conventional changelog: ${error}`);
    }

    // Ensure proper formatting - add newline between sections if needed
    const separator = changelog && !changelog.startsWith("\n") ? "\n" : "";
    const newChangelog =
      header + entries + conventionalChangelogSection + separator + changelog;

    await writeFile(changelogPath, newChangelog);
    this.log.log(
      `Updated changelog with ${this.changesets.length} changesets and commit details`,
    );
  }
}
