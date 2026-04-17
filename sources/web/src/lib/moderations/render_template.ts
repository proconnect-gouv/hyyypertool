//

import z from "zod";

export interface RenderResult {
  result: string;
  missing: string[];
  ok: boolean;
}

export function render(
  template: string,
  data: Record<string, string>,
): RenderResult {
  const missing: string[] = [];
  const result = template.replace(
    /\$\{\s*(\w+)\s*\}/g,
    (match, key: string) => {
      if (Object.hasOwn(data, key)) return data[key] as string;
      missing.push(key);
      return match;
    },
  );
  return {
    result: decodeHtmlEntities(result),
    missing,
    ok: missing.length === 0,
  };
}

export function decodeHtmlEntities(text: string): string {
  return text.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}

export const VariableKeys = z.enum([
  "categorie_juridique",
  "domain",
  "email",
  "family_name",
  "given_name",
  "organization_name",
  "siret",
  "suggest_emails_associated_to_user",
  "suggest_organization_domains",
]);

export type VariableKeysType = z.output<typeof VariableKeys>;
