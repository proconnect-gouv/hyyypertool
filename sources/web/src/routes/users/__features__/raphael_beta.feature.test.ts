import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("La fiche de Raphael Beta", ({ I }) => {
  I.amOnPage("/moderations");
  I.click({ role: "link", name: "Utilisateurs" });
  I.seeTitleEquals("Liste des utilisateurs");
  I.see("Liste des utilisateurs");
  I.click({
    role: "link",
    name: "Utilisateur Raphael Dubigny (rdubigny@beta.gouv.fr)",
  });
  I.seeTitleEquals("Utilisateur Raphael Dubigny (rdubigny@beta.gouv.fr)");

  I.see("👨‍💻 A propos de l'utilisateur");
  I.see("« Raphael Dubigny »");
  I.see("EMAIL rdubigny@beta.gouv.fr");
  I.see("PRÉNOM Raphael");
  I.see("NOM Dubigny");
  I.see("TÉLÉPHONE 0123456789");
  I.see("CRÉATION 13/07/2018 17:35:15");
  I.see("DERNIÈRE MODIFICATION 22/06/2023 16:34:34");
  I.see("EMAIL VÉRIFIÉ ENVOYÉ LE 22/06/2023 16:34:34");

  I.see("🏢 2 organisations de Raphael");
  I.click("🏢 2 organisations de Raphael");
  I.within({ row: "Libellé" }, () => {
    I.see("Siret");
    I.see("Interne");
  });
  I.within({ row: "Direction interministerielle du numerique (DINUM)" }, () => {
    I.see("13002526500013");
    I.see("✅");
  });
});
