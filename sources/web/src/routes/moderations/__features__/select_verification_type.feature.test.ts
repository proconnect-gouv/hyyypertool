import { setup_scenarios } from "#src/testing";
import { Scenario } from "buncept";

//

setup_scenarios();

//

Scenario(
  "Sélectionner différents types de vérification : Mail officiel",
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
      I.click("Mail officiel");
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
      I.see("official_contact_email");
    });
  },
);

Scenario(
  "Sélectionner différents types de vérification : Liste des dirigeants RNA",
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
      I.click("Liste des dirigeants RNA");
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
      I.see("in_liste_dirigeants_rna");
    });
  },
);

Scenario(
  "Sélectionner différents types de vérification : Liste des dirigeants RNE",
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
      I.click("Liste des dirigeants RNE");
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
      I.see("in_liste_dirigeants_rne");
    });
  },
);

Scenario(
  "Sélectionner différents types de vérification : Justificatif transmis",
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
      I.click("Justificatif transmis");
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
      I.see("proof_received");
    });
  },
);

Scenario(
  "Sélectionner différents types de vérification : Domaine d'ordre professionnel",
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
      I.click("Domaine d'ordre professionnel");
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
      I.see("ordre_professionnel_domain");
    });
  },
);
