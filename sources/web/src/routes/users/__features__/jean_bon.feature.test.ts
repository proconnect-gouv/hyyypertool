import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("La fiche de Jean Bon", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Utilisateurs");
  I.seeTitleEquals("Liste des utilisateurs");
  I.see("Liste des utilisateurs");
  I.click({
    role: "link",
    name: "Utilisateur Jean Bon (jeanbon@yopmail.com)",
  });
  I.seeTitleEquals("Utilisateur Jean Bon (jeanbon@yopmail.com)");

  I.see("👨‍💻 A propos de l'utilisateur");
  I.see("« Jean Bon »");
  I.see("EMAIL jeanbon@yopmail.com");
  I.see("PRÉNOM Jean");
  I.see("NOM Bon");
  I.see("TÉLÉPHONE 0123456789");
  I.see("CRÉATION 13/07/2018 17:35:15");
  I.see("DERNIÈRE MODIFICATION 22/06/2023 16:34:34");
  I.see("EMAIL VÉRIFIÉ ENVOYÉ LE 22/06/2023 16:34:34");

  I.click("🛂 2 modérations de Jean");
  I.see("Type");
  I.within({ row: "🕵️ A traiter" }, () => {
    I.see("🕵️ A traiter");
  });

  I.see("L'utilisateur n'a pas de MFA configurée.");
});
