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

//

const VariableKeys = z.enum([
  "categorie_juridique",
  "domain",
  "email",
  "family_name",
  "given_name",
  "organization_name",
  "siret",
]);

type VariableKeysType = z.output<typeof VariableKeys>;

//

const VARIABLE_LABELS: Record<VariableKeysType, string> = {
  categorie_juridique: "Categorie juridique",
  domain: "Domaine",
  email: "Email",
  family_name: "Nom",
  given_name: "Prenom",
  organization_name: "Nom organisation",
  siret: "SIRET",
};

export const AVAILABLE_VARIABLES = Object.entries(VARIABLE_LABELS).map(
  ([key, label]) => ({ key: key as VariableKeysType, label }),
);

export const SAMPLE_DATA: Record<VariableKeysType, string> = {
  categorie_juridique: "Commune",
  domain: "paris.fr",
  email: "jean.dupont@paris.fr",
  family_name: "Dupont",
  given_name: "Jean",
  organization_name: "Mairie de Paris",
  siret: "21750001600019",
};

export function decodeHtmlEntities(text: string): string {
  return text.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n));
}
