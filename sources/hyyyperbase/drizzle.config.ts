import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dbCredentials: {
    url: "postgresql://hyyypertool:hyyypertool@localhost:5555/hyyyperbase",
  },
  schema: "./src/schema.ts",
  out: "./migrations",
  dialect: "postgresql",
  verbose: true,
  strict: true,
});
