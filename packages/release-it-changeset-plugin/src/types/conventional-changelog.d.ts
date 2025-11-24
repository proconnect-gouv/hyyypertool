declare module "@release-it/conventional-changelog" {
  interface ConventionalChangelogOptions {
    preset?: string;
    infile?: string;
    outfile?: string | null;
  }

  interface ChangelogContext {
    version: string;
    previousTag: string;
    currentTag: string;
    repoUrl?: string;
  }

  interface ConventionalChangelogPlugin {
    getChangelog(context: ChangelogContext): Promise<string>;
  }

  function conventionalChangelogPlugin(
    options?: ConventionalChangelogOptions,
  ): ConventionalChangelogPlugin;

  export = conventionalChangelogPlugin;
}
