//

import { describe, expect, setSystemTime, test } from "bun:test";
import { glob } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { load_templates } from "./lib";

const __dirname = dirname(fileURLToPath(import.meta.url));

//

setSystemTime(new Date("2026-04-13T15:04:15.185Z"));
const response_files = await load_templates();

describe("seed:0000_response_types", () => {
  test("loads all response template files", async () => {
    const files = await Array.fromAsync(
      glob(join(__dirname, "responses", "*.ts")),
    );
    const response_files_count = files.filter(
      (f) => !f.endsWith(".test.ts") && !f.endsWith("index.ts"),
    ).length;
    expect(response_files).toHaveLength(response_files_count);
    expect(response_files).toHaveLength(36);
  });

  test("Utilisateur possédant déjà un compte ProConnect", async () => {
    const template = response_files.find(
      (f) => f.label === "Utilisateur possédant déjà un compte ProConnect",
    )!;

    expect(template.content).toMatchInlineSnapshot(`
      "Bonjour,

      Nous avons bien reçu votre demande de rattachement à l'organisation « \${ organization_name } » sur ProConnect (anciennement : AgentConnect, MonComptePro).

      Vous possédez déjà un compte ProConnect associé à l’adresse e-mail professionnelle : « \${ suggest_emails_associated_to_user } ».

      Merci de bien vouloir vous connecter avec le compte déjà existant ou de le supprimer (nous pouvons le faire pour vous si vous répondez à ce message).

      Votre adresse e-mail associée à un nom de domaine gratuit tel que « \${ domain } » ne sera pas autorisée.

      Bien cordialement,
      L’équipe ProConnect."
    `);
  });
});
