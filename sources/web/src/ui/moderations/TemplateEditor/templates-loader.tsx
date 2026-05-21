//

import { glob, stat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export interface TemplateMetadata {
  id: number;
  label: string;
  content: string;
  created_at: Date;
  updated_at: Date;
}

export interface LoadedTemplate extends TemplateMetadata {
  render: () => string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const responsesDir = join(__dirname, "../Actions/responses");

let cached: LoadedTemplate[] | null = null;

export async function loadTemplates(): Promise<LoadedTemplate[]> {
  if (cached) return cached;

  const pattern = join(responsesDir, "[!index]*.tsx");
  const files: string[] = [];

  for await (const file of glob(pattern)) {
    if (!file.endsWith(".test.tsx")) {
      files.push(file);
    }
  }

  const templates = await Promise.all(
    files.map(async (file, index) => {
      const id = basename(file, ".tsx");
      const [module, stats] = await Promise.all([
        import(`../Actions/responses/${id}.js`),
        stat(file),
      ]);

      const render = module.default as () => string;

      return {
        id: 100 + index,
        label: module.label as string,
        content: "",
        render,
        created_at: stats.birthtime,
        updated_at: stats.mtime,
      };
    }),
  );

  cached = templates.sort((a: LoadedTemplate, b: LoadedTemplate) =>
    a.label.localeCompare(b.label),
  );
  return cached;
}

export function getTemplatesMetadata(
  templates: LoadedTemplate[],
): TemplateMetadata[] {
  return templates.map(({ id, label, content, created_at, updated_at }) => ({
    id,
    label,
    content,
    created_at,
    updated_at,
  }));
}
