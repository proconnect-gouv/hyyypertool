import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario("Page organisation", ({ I }) => {
  I.amOnPage("/moderations");
  I.click("Organisations");
  I.seeInCurrentUrl("/organizations");
  I.seeTitleEquals("Liste des organisations");
  I.see("Liste des organisations");
  I.seeElement({
    css: 'a[aria-label="Organisation Direction interministerielle du numerique (DINUM) (13002526500013)"]',
  });
  I.click({
    css: 'a[aria-label="Organisation Direction interministerielle du numerique (DINUM) (13002526500013)"]',
  });
  I.see("🏛 A propos de l'organisation");
  I.see("« Direction interministerielle du numerique (DINUM) »");
  I.see("DÉNOMINATION Direction interministerielle du numerique (DINUM)");
  I.see("SIRET 13002526500013 Fiche annuaire");
  I.see("NAF/APE 84.11Z - Administration publique générale");
  I.see("ADRESSE 20 avenue de segur, 75007 Paris");
  I.see("NATURE JURIDIQUE Service central d'un ministère (7120)");
  I.see("TRANCHE D'EFFECTIF 250 à 499 salariés, en 2023 (code : 32)");
  I.see("TRANCHE D'EFFECTIF DE L'UNITÉ LÉGALE 250 à 499 salariés (code : 32)");
  I.see(
    "SERVICE PUBLIC ADMINISTRATION D'ÉTAT DIFFUSIBLE EN ACTIVITÉ SIÈGE SOCIAL",
  );

  I.see("🌐 3 domaines connu dans l'organisation");
  I.within("~Domaine beta.gouv.fr (verified)", () => {
    I.see("✅");
  });
  I.within("~Domaine modernisation.gouv.fr (verified)", () => {
    I.see("✅");
  });
  I.within("~Domaine prestataire.modernisation.gouv.fr (external)", () => {
    I.see("❎");
  });

  I.see("1 membre");
  I.click("1 membre");
  I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
    I.see("Raphael");
    I.see("Dubigny");
    I.see("✅");
    I.see("Chef");
  });
});
