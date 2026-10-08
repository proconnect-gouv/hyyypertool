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
      beforeAll(async () => {
        await empty_databases();
        await insert_database(pg);
        await insert_moderateur(hyyyper_pglite);
      });

      I.amOnPage("/moderations");
      I.click("Organisations");
      I.seeInCurrentUrl("/organizations");
      I.click({
        role: "link",
        name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)",
      });
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
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.click("Organisations");
  I.seeInCurrentUrl("/organizations");
  I.click({
    role: "link",
    name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)",
  });
  I.click("1 membre");
  I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
    I.see("✅");
    I.click("Menu");
    I.click("🔄 interne/externe");
    I.see("❌");
  });
});

Scenario("Retirer un membre de l'organisation", ({ I }) => {
  beforeAll(async () => {
    await empty_databases();
    await insert_database(pg);
    await insert_moderateur(hyyyper_pglite);
  });

  I.amOnPage("/moderations");
  I.click("Organisations");
  I.seeInCurrentUrl("/organizations");
  I.click({
    role: "link",
    name: "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)",
  });
  I.click("1 membre");
  I.within("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)", () => {
    I.click("Menu");
    I.click("🚪🚶retirer de l'orga");
  });
  I.dontSeeElement("~Membre Raphael Dubigny (rdubigny@beta.gouv.fr)");
});
