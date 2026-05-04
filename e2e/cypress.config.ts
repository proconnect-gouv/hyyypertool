//

import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { execSync } from "child_process";
import { defineConfig } from "cypress";
import { env } from "node:process";
import { resolve } from "path";

//

export default defineConfig({
  allowCypressEnv: false,
  e2e: {
    baseUrl: "http://localhost:3000",
    reporter:
      require.resolve("@badeball/cypress-cucumber-preprocessor/pretty-reporter"),
    setupNodeEvents,
    specPattern: "**/*.feature",
    supportFile: "cypress/support/e2e.ts",
    video: true,
  },
  env: {
    API_CRISP_CHAT_URL: "http://localhost:6400",
  },
});

//

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  on("task", {
    seed,
  });

  return config;
}

//

async function seed() {
  const rootDir = resolve(__dirname, "..");

  try {
    // Run the root-level db:seed script
    execSync("bun run db:seed", {
      cwd: rootDir,
      stdio: "inherit",
      env: { ...process.env, ...env },
    });
  } catch (e) {
    console.error("Seeding failed:", e);
    throw e;
  }

  return null;
}
