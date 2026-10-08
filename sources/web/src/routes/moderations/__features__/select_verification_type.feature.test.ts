import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

for (const { type_verification, verification_enum } of [
  {
    type_verification: "Mail officiel",
    verification_enum: "official_contact_email",
  },
  {
    type_verification: "Liste des dirigeants RNA",
    verification_enum: "in_liste_dirigeants_rna",
  },
  {
    type_verification: "Liste des dirigeants RNE",
    verification_enum: "in_liste_dirigeants_rne",
  },
  {
    type_verification: "Justificatif transmis",
    verification_enum: "proof_received",
  },
  {
    type_verification: "Domaine d'ordre professionnel",
    verification_enum: "ordre_professionnel_domain",
  },
]) {
  Scenario(
    `Sélectionner différents types de vérification : ${type_verification}`,
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
        I.click(type_verification);
        I.click("Terminer");
      });
      I.click("Annuler");
      I.see("Cette modération a été marqué comme traitée le");
      I.see("Validé par moderateur@beta.gouv.fr");
      I.click("Moderations");
      I.seeTitleEquals("Liste des moderations");
      I.see("Liste des moderations");
      I.fillField("Filtrer les modérations…", "is:processed");
      I.pressKey("Enter");
      I.click("Modération a traiter de Jean Bon pour 51935970700022");
      // Open already: the members list unfolds for 1 to 3 members
      I.see("👥 1 membre connu dans l’organisation");
      I.within({ row: "Jean" }, () => {
        I.see("Bon");
        I.see(verification_enum);
      });
    },
  );
}
