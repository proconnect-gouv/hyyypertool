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

Scenario("Rechercher et trier les membres d'une organisation", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/organizations");
  I.click({
    role: "link",
    name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)",
  });
  I.click("1 membre");
  I.click("Voir tous les membres →");
  I.see("Membres de l’organisation");
  I.seeElement("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)");

  I.fillField("Rechercher par nom, prénom ou email", "personne");
  I.pressKey("Enter");
  I.dontSeeElement("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)");
  I.seeInCurrentUrl("q=personne");

  I.fillField("Rechercher par nom, prénom ou email", "dubigny");
  I.pressKey("Enter");
  I.seeElement("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)");

  I.click({ role: "button", name: "Email" });
  I.seeInCurrentUrl("sort=email");
  I.seeInCurrentUrl("q=dubigny");
  I.seeElement("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)");
});

Scenario(
  "Modifier les membres sélectionnés depuis la barre d'actions",
  ({ I }) => {
    beforeAll(async () => {
      await empty_databases();
      await insert_database(pg);
      await insert_moderateur(hyyyper_pglite);
    });

    I.amOnPage("/organizations");
    I.click({
      role: "link",
      name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)",
    });
    I.click("1 membre");
    I.click("Voir tous les membres →");
    I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
      I.see("✅");
    });
    I.dontSee("🚪🚶 Retirer de l’organisation");

    I.amAcceptingPopups();
    I.checkOption("Sélectionner tous les membres");
    I.click("❌ Externe");
    I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
      I.see("❌");
    });
    I.dontSee("🚪🚶 Retirer de l’organisation");

    I.checkOption("Sélectionner rdubigny@beta.gouv.fr");
    I.click("🔄 Type de vérification");
    I.click("mail officiel");
    I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
      I.see("official_contact_email");
    });
  },
);

Scenario("Retirer les membres sélectionnés de l'organisation", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amAcceptingPopups();
  I.amOnPage("/organizations");
  I.click({
    role: "link",
    name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)",
  });
  I.click("1 membre");
  I.click("Voir tous les membres →");
  I.checkOption("Sélectionner rdubigny@beta.gouv.fr");
  I.click("🚪🚶 Retirer de l’organisation");
  I.dontSeeElement("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)");
});
