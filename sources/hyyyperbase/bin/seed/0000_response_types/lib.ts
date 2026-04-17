//

import { schema, type HyyyperPgDatabase } from "#src";
import { glob, stat } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { PLACEHOLDER_VALUES, type Values } from "./context";

//

type ResponseTemplateInsert = Omit<
  typeof schema.response_templates.$inferInsert,
  "id" | "updated_by"
>;

type TemplateModule = {
  label: string;
  default: (values: Values) => string | Promise<string>;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function load_templates(): Promise<ResponseTemplateInsert[]> {
  const pattern = join(__dirname, "responses", "[!index]*.ts");
  const files: ResponseTemplateInsert[] = [];

  for await (const file of glob(pattern)) {
    if (file.endsWith(".test.ts")) continue;

    const [module, stats]: [TemplateModule, Awaited<ReturnType<typeof stat>>] =
      await Promise.all([import(file), stat(file)]);

    files.push({
      label: module.label,
      content: await module.default(PLACEHOLDER_VALUES),
      created_at: stats.birthtime,
      updated_at: stats.mtime,
    });
  }

  return files;
}

export async function seed_response_templates(
  db: HyyyperPgDatabase,
  templates: ResponseTemplateInsert[],
) {
  return db
    .insert(schema.response_templates)
    .values(templates)
    .onConflictDoNothing()
    .returning();
}
