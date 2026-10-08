import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario(
  "Autoriser le domaine yeswehack.com depuis la liste des domaines à vérifier",
  ({ I }) => {
    I.amOnPage("/moderations");
    I.click("Domaines à vérifier");
    I.seeInCurrentUrl("/organizations/domains");
    I.seeTitleEquals("Liste des domaines à vérifier");
    I.see("Liste des domaines à vérifier");

    I.within(
      "~Domaine non vérifié pompierre.fr pour Commune de pompierre - Mairie",
      () => {
        I.see("pompierre.fr");
        I.see("21880352600019");
      },
    );
    I.within("~Domaine non vérifié yeswehack.com pour Yes we hack", () => {
      I.see("yeswehack.com");
      I.see("81403721400016");
    });

    I.seeElement("~Domaine non vérifié yeswehack.com pour Yes we hack");
    I.click({
      role: "link",
      name: "Domaine non vérifié yeswehack.com pour Yes we hack",
    });
    I.see("🏛 A propos de l'organisation");
    I.see("« Yes we hack »");
    I.see("DÉNOMINATION Yes we hack");

    I.within("~Domaine yeswehack.com (not_verified_yet)", () => {
      I.see("yeswehack.com");
      I.see("❓");
    });

    I.click("👥 2 membres enregistrés");
    I.within("~Membre Jean Dupont (jean@yeswehack.com)", () => {
      I.see("Jean");
      I.see("Dupont");
      I.see("domain_not_verified_yet");
    });
    I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
      I.see("Raphael");
      I.see("Dubigny");
      I.see("domain_not_verified_yet");
    });

    I.click("Menu");
    I.click("✅ Domaine autorisé");
    I.within("~Domaine yeswehack.com (verified)", () => {
      I.see("yeswehack.com");
      I.see("✅");
    });

    I.within("~Membre Jean Dupont (jean@yeswehack.com)", () => {
      I.see("Jean");
      I.see("Dupont");
      I.see("domain");
      I.dontSee("domain_not_verified_yet");
    });
    I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
      I.see("Raphael");
      I.see("Dubigny");
      I.see("domain_not_verified_yet");
    });

    I.click("Domaines à vérifier");
    I.click("Rafraichir");
    I.within(
      "~Domaine non vérifié pompierre.fr pour Commune de pompierre - Mairie",
      () => {
        I.see("pompierre.fr");
        I.see("21880352600019");
      },
    );
    I.dontSeeElement("~Domaine non vérifié yeswehack.com pour Yes we hack");
    I.dontSee("yeswehack.com");
  },
);
