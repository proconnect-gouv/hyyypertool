//

import { renderToReadableStream } from "hono/jsx/dom/server";
import { glob, stat } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { context, type Values } from "../Actions/context";

export interface TemplateMetadata {
  id: string;
  label: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoadedTemplate extends TemplateMetadata {
  render: () => string;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const responsesDir = join(__dirname, "../Actions/responses");

const PLACEHOLDER_CONTEXT: Values = {
  domain: "${ domain }",
  moderation: {
    id: 1,
    moderated_at: null,
    type: "organization_join_block",
    organization: {
      id: 1,
      cached_libelle: "${ organization_name }",
      siret: "${ siret }",
      cached_libelle_categorie_juridique: "${ categorie_juridique }",
    },
    user: {
      id: 1,
      email: "${ email }",
      given_name: "${ given_name }",
      family_name: "${ family_name }",
    },
  },
  $accept: "",
  $decision_form: "",
  $reject: "",
  query_suggest_same_user_emails: async () => [],
  query_is_user_external_member: async () => false,
  query_suggest_organization_domains: async () => [],
};

let cached: LoadedTemplate[] | null = null;

function TemplateWrapper({ Template }: { Template: () => string }) {
  return <>{Template()}</>;
}

async function streamToString(
  stream: ReadableStream<Uint8Array>,
): Promise<string> {
  const reader = stream.getReader();
  const decoder = new TextDecoder();
  let result = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value);
  }
  return result;
}

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
    files.map(async (file) => {
      const id = basename(file, ".tsx");
      const [module, stats] = await Promise.all([
        import(`../Actions/responses/${id}.js`),
        stat(file),
      ]);

      const render = module.default as () => string;
      let content = "";
      try {
        const stream = await renderToReadableStream(
          <context.Provider value={PLACEHOLDER_CONTEXT}>
            <TemplateWrapper Template={render} />
          </context.Provider>,
        );
        content = await streamToString(stream);
      } catch {
        content = "";
      }

      return {
        id,
        label: module.label as string,
        content,
        render,
        createdAt: stats.birthtime.toISOString(),
        updatedAt: stats.mtime.toISOString(),
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
  return templates.map(({ id, label, content, createdAt, updatedAt }) => ({
    id,
    label,
    content,
    createdAt,
    updatedAt,
  }));
}
