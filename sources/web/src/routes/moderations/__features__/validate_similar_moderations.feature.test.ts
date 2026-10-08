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

for (const { add_member, add_domain, cause } of [
  {
    add_member: "EN TANT QU'INTERNE",
    add_domain: "yopmail.com en interne à l'organisation",
    cause: "domaine vérifié",
  },
  {
    add_member: "EN TANT QU'EXTERNE",
    add_domain: "yopmail.com en externe à l'organisation",
    cause: "domaine externe vérifié",
  },
]) {
  Scenario(
    `Validation automatique des modérations similaires avec domaine ${add_domain}`,
    ({ I }) => {
      beforeAll(async () => {
        await empty_databases();
        await insert_database(pg);
        await insert_moderateur(hyyyper_pglite);
      });

      I.amOnPage("/moderations");
      I.seeTitleEquals("Liste des moderations");
      I.see("Liste des moderations");
      I.click("Modération a traiter de Jean Bon pour 51935970700022");
      I.seeTitleEquals("Modération a traiter de Jean Bon pour 51935970700022");

      I.click("✅ Accepter");
      I.see(
        "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra (ABRACADABRA), je valide :",
      );

      I.within("la modale de validation", () => {
        I.checkOption(`Ajouter Jean à l'organisation ${add_member}`);
        I.checkOption(`J'autorise le domaine ${add_domain}`);
        I.click("Terminer");
      });
      I.click("Annuler");

      I.see("Cette modération a été marqué comme traitée le");
      I.see("Validé par moderateur@beta.gouv.fr");

      I.click("Moderations");
      I.seeTitleEquals("Liste des moderations");
      I.fillField("Filtrer les modérations…", "is:processed");
      I.pressKey("Enter");

      I.dontSee("Jean Bon");
      I.dontSee("Jean Dré");

      I.fillField(
        "Filtrer les modérations…",
        "is:processed siret:51935970700022",
      );
      I.pressKey("Enter");
      I.click("Modération a traiter de Jean Dré pour 51935970700022");
      I.seeTitleEquals("Modération a traiter de Jean Dré pour 51935970700022");
      I.see(`Validation automatique - ${cause}`);
    },
  );
}
