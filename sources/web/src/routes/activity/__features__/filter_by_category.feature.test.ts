import { empty_databases, start_app, stop_app } from "#src/testing";
import { hyyyper_pglite } from "@~/hyyyperbase/testing";
import { insert_moderateur } from "@~/hyyyperbase/testing/users";
import { insert_database } from "@~/identite-proconnect/database/seed/insert";
import { pg } from "@~/identite-proconnect/database/testing";
import { afterAll, beforeAll } from "bun:test";
import { Scenario } from "buncept";

//

beforeAll(start_app);
afterAll(stop_app);

//

Scenario(
  "Le modérateur filtre le journal d'activité par catégorie d'action",
  ({ I }) => {
    beforeAll(async () => {
      await empty_databases();
      await insert_database(pg);
      await insert_moderateur(hyyyper_pglite);
    });

    I.amOnPage("/activity");
    I.see("Journal d’activité");
    I.see("Par catégorie");
    I.see("Domaines");
    I.see("FranceConnect");
    I.see("Membres");
    I.see("Modérations");
    I.see("Utilisateurs");

    I.see("Domaine beta.gouv.fr vérifié (verified)");
    I.see("Domaine abracadabra.com refusé");
    I.see("Domaine scapartois.fr supprimé (verified)");
    I.see("Membre ajouté (domain_not_verified_yet, interne)");
    I.see("Membre promu (domain_not_verified_yet → domain)");
    I.see("Membre supprimé (domain_not_verified_yet, interne)");
    I.see("Membre modifié (domain_not_verified_yet → domain)");
    I.see(
      "Modération ouverte (organization_join_block · Annuaire des entreprises)",
    );
    I.see("Utilisateur supprime@yopmail.com supprimé");
    I.see("Double authentification réinitialisée");
    I.see("FranceConnect lié");
    I.see("FranceConnect délié");

    I.amOnPage("/organizations/domains");
    I.click({
      role: "link",
      name: "Domaine non vérifié yeswehack.com pour Yes we hack",
    });
    I.click("Menu");
    I.click("✅ Domaine autorisé");

    I.amOnPage("/activity");
    I.see("Domaine yeswehack.com vérifié (verified)");
    I.see("Membre promu (domain_not_verified_yet → domain)");

    I.checkOption("Domaines");
    I.see("Domaine yeswehack.com vérifié (verified)");
    I.see("Domaine beta.gouv.fr vérifié (verified)");
    I.dontSee("Membre modifié (domain_not_verified_yet → domain)");
    I.dontSee("FranceConnect lié");

    I.click({ role: "checkbox", name: "Domaines" });
    I.checkOption("FranceConnect");
    I.see("FranceConnect lié");
    I.see("FranceConnect délié");
    I.dontSee("Domaine yeswehack.com vérifié (verified)");

    I.click({ role: "checkbox", name: "FranceConnect" });
    I.checkOption("Membres");
    I.see("Membre modifié (domain_not_verified_yet → domain)");
    I.dontSee("FranceConnect lié");

    I.click({ role: "checkbox", name: "Membres" });
    I.checkOption("Modérations");
    I.see(
      "Modération ouverte (organization_join_block · Annuaire des entreprises)",
    );
    I.dontSee("Membre modifié (domain_not_verified_yet → domain)");

    I.click({ role: "checkbox", name: "Modérations" });
    I.checkOption("Utilisateurs");
    I.see("Double authentification réinitialisée");
    I.see("Utilisateur supprime@yopmail.com supprimé");
    I.dontSee(
      "Modération ouverte (organization_join_block · Annuaire des entreprises)",
    );
  },
);
