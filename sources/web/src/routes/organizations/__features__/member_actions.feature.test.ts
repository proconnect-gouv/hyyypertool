import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

for (const { action, verification_resultat } of [
  {
    action: "🔄 vérif: liste dirigeants",
    verification_resultat: "in_liste_dirigeants_rna",
  },
  { action: "🔄 vérif: domaine email", verification_resultat: "domain" },
  {
    action: "🔄 vérif: mail officiel",
    verification_resultat: "official_contact_email",
  },
  {
    action: "🔄 vérif: no validation means available",
    verification_resultat: "no_validation_means_available",
  },
  {
    action: "🔄 vérif: verified by coop mediation numerique",
    verification_resultat: "verified_by_coop_mediation_numerique",
  },
  {
    action: "🚫 non vérifié",
    verification_resultat: "domain_not_verified_yet",
  },
]) {
  Scenario(
    `Changer le type de vérification d'un membre : ${action}`,
    ({ I }) => {
      I.amOnPage("/moderations");
      I.click("Organisations");
      I.seeInCurrentUrl("/organizations");
      I.click({ role: "link", name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)" });
      I.click("1 membre");
      I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
        I.see("domain");
        I.click("Menu");
        I.click(action);
        I.see(verification_resultat);
      });
    },
  );
}

Scenario("Basculer un membre entre interne et externe : ✅", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Organisations");
  I.seeInCurrentUrl("/organizations");
  I.click({ role: "link", name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)" });
  I.click("1 membre");
  I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
    I.see("✅");
    I.click("Menu");
    I.click("🔄 interne/externe");
    I.see("❌");
  });
});

Scenario("Retirer un membre de l'organisation", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Organisations");
  I.seeInCurrentUrl("/organizations");
  I.click({ role: "link", name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)" });
  I.click("1 membre");
  I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
    I.click("Menu");
    I.click("🚪🚶retirer de l'orga");
  });
  I.dontSeeElement("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)");
});
