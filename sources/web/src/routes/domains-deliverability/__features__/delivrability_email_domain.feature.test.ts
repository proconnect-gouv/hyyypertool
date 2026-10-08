import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Afficher la liste des domaines en whitelist", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.seeTitleEquals("Délivrabilité des domaines");
  I.see("test@ch-lehavre.fr");
  I.see("ch-lehavre.fr");
  I.see("test@ccduserein.fr");
  I.see("ccduserein.fr");
});

Scenario("Ajouter un nouveau domaine à la whitelist", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.fillField("Ajouter un email problématique", "nouveau@example.fr");
  I.click({ role: "button", name: "Ajouter" });
  I.see("nouveau@example.fr");
  I.see("example.fr");
});

Scenario("Supprimer un domaine de la whitelist", ({ I }) => {
  I.amAcceptingPopups();
  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.see("test@ch-lehavre.fr");
  I.click({ role: "button", name: "Supprimer test@ch-lehavre.fr" });
  I.dontSee("test@ch-lehavre.fr");
});

Scenario("Vérifier les informations de vérification", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Délivrabilité des domaines");
  I.seeInCurrentUrl("/domains-deliverability");
  I.see("🧟‍♂️ zombie admin");
  I.see("01/01/2024");
});
