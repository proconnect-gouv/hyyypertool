/// <reference types="@~/release-it-plugin-types" />

//

import { readdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "path";
import { Plugin } from "release-it";

interface Changeset {
  id: string;
  content: string;
}

/**
 * Simple release-it plugin that prepends user-facing change descriptions
 * from `.release-it-changeset/*.md` files to the changelog.
 *
 * This plugin only handles the "Changements" section.
 * Commit grouping should be handled by @release-it/conventional-changelog
 * with a gitmoji preset.
 */
export default class ChangesetPlugin extends Plugin {
  static override isEnabled() {
    return true;
  }

  private changesets: Changeset[] = [];

  override async init() {
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

  override async bump(_version: string) {
    const cwd = this.options.cwd || process.cwd();

    if (this.changesets.length === 0) {
      return;
    }

    this.log.log(
      `Processing ${this.changesets.length} changesets for changelog.`,
    );

    await this.prependToChangelog(cwd);

    // Delete changeset files after processing them
    for (const cs of this.changesets) {
      const filePath = path.join(cwd, ".release-it-changeset", `${cs.id}.md`);
      try {
        await unlink(filePath);
        this.log.log(`Removed changeset ${cs.id}.md`);
      } catch (error) {
        this.log.warn(`Failed to remove ${cs.id}.md: ${error}`);
      }
    }

    // Format CHANGELOG.md with prettier
    await this.exec("bunx prettier --write CHANGELOG.md");

    // Stage the changelog and the deleted changeset files
    await this.exec("git add CHANGELOG.md .release-it-changeset/");
    this.log.log("Staged changelog changes and removed changesets.");
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

  parseChangeset(id: string, content: string): Changeset | null {
    const trimmed = content.trim();
    if (!trimmed) return null;
    return { id, content: trimmed };
  }

  private async prependToChangelog(cwd: string) {
    const changelogPath = path.join(cwd, "CHANGELOG.md");
    let changelog = "";
    try {
      changelog = await readFile(changelogPath, "utf-8");
    } catch {}

    // Build the Changements section
    let changementsSection = "### Changements\n\n";
    for (const cs of this.changesets) {
      changementsSection += `- ${cs.content}\n`;
    }
    changementsSection += "\n";

    // Find where to insert (after the first ## header line)
    const lines = changelog.split("\n");
    let insertIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      if (lines[i]?.startsWith("## ")) {
        // Find the next empty line after the header
        insertIndex = i + 1;
        while (
          insertIndex < lines.length &&
          lines[insertIndex]?.trim() === ""
        ) {
          insertIndex++;
        }
        break;
      }
    }

    // Insert the Changements section
    if (insertIndex > 0) {
      lines.splice(insertIndex, 0, changementsSection);
      await writeFile(changelogPath, lines.join("\n"));
    } else {
      // No header found, prepend at the beginning
      await writeFile(changelogPath, changementsSection + changelog);
    }

    this.log.log(`Prepended ${this.changesets.length} changesets to changelog`);
  }
}
