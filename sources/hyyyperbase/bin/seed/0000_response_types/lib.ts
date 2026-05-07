//

import { schema, type HyyyperPgDatabase } from "#src";
import { glob } from "node:fs/promises";
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
  created_at: Date;
  updated_at: Date;
  default: (values: Values) => string | Promise<string>;
};

const __dirname = dirname(fileURLToPath(import.meta.url));

export async function load_templates(): Promise<ResponseTemplateInsert[]> {
  const pattern = join(__dirname, "responses", "[!index]*.ts");
  const files: ResponseTemplateInsert[] = [];

  for await (const file of glob(pattern)) {
    if (file.endsWith(".test.ts")) continue;

    const module: TemplateModule = await import(file);

    files.push({
      label: module.label,
      content: await module.default(PLACEHOLDER_VALUES),
      created_at: module.created_at,
      updated_at: module.updated_at,
    });
  }

  return files.sort((a, b) => a.label.localeCompare(b.label));
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
