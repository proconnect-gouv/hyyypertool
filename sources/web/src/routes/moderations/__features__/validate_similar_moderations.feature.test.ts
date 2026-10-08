import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

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
