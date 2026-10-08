import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
beforeAll(async () => {
  await empty_databases();
  await insert_database(pg);
  await insert_moderateur(hyyyper_pglite);
});
afterAll(stop_app);

//

Scenario("La fiche de Raphael Alpha", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Utilisateurs");
  I.seeTitleEquals("Liste des utilisateurs");
  I.see("Liste des utilisateurs");
  I.click({
    role: "link",
    name: "Utilisateur Raphael Dubigny (rdubigny@alpha.gouv.fr)",
  });
  I.seeTitleEquals("Utilisateur Raphael Dubigny (rdubigny@alpha.gouv.fr)");

  I.see("👨‍💻 A propos de l'utilisateur");
  I.see("« Raphael Dubigny »");
  I.see("EMAIL rdubigny@alpha.gouv.fr");
  I.see("PRÉNOM Raphael");
  I.see("NOM Dubigny");
  I.see("TÉLÉPHONE 0123456789");
  I.see("CRÉATION 13/07/2018 17:35:15");
  I.see("DERNIÈRE MODIFICATION 22/06/2023 16:34:34");
  I.see("EMAIL VÉRIFIÉ ENVOYÉ LE 22/06/2023 16:34:34");

  I.click("🛂 2 modérations de Raphael");
  I.within({ row: "🔓 Non vérifié" }, () => {
    I.see("🔓 Non vérifié");
  });

  I.within({ css: '[aria-describedby="mfa"]' }, () => {
    I.see("TOTP");
    I.see("Passkey - 1Password");
    I.see("Passkey - NordPass");
  });

  I.within({ css: '[aria-describedby="totp"]' }, () => {
    I.see("TOTP enrôlé le : 22/06/2023 16:34:34");
    I.see("Force la 2FA sur tous les sites : ✅");
  });

  I.within({ css: '[aria-describedby="passkey-1"]' }, () => {
    I.see("Création : 23/06/2023 03:33:33");
    I.see("Dernière utilisation : 24/06/2023 04:44:44");
    I.see("Nombre d'utilisation : 5");
  });

  I.within({ css: '[aria-describedby="passkey-2"]' }, () => {
    I.see("Création : 23/06/2023 13:33:33");
    I.see("Dernière utilisation : 24/06/2023 14:44:44");
    I.see("Nombre d'utilisation : 87");
  });

  I.within({ css: '[aria-describedby="franceconnect"]' }, () => {
    I.see("SUB fc-sub-raphael-alpha-1234567890abcdef");
    I.see("PRÉNOM Raphael");
    I.see("NOM Dubigny");
    I.see("GENRE male");
    I.see("PSEUDO rdubigny");
  });
});
