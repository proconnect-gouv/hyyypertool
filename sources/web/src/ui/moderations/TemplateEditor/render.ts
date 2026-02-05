//

export { type VariableKeysType } from "#src/lib/moderations";

//

const VARIABLE_LABELS: Record<VariableKeysType, string> = {
  categorie_juridique: "Categorie juridique",
  domain: "Domaine",
  email: "Email",
  family_name: "Nom",
  given_name: "Prenom",
  organization_name: "Nom organisation",
  siret: "SIRET",
  suggest_emails_associated_to_user: "Emails associés à l'utilisateur",
  suggest_organization_domains: "Domaines de l'organisation",
};

export const AVAILABLE_VARIABLES = Object.entries(VARIABLE_LABELS).map(
  ([key, label]) => ({ key: key as VariableKeysType, label }),
);

export const SAMPLE_DATA: Record<VariableKeysType, string> = {
  categorie_juridique: "Commune",
  domain: "paris.fr",
  email: "jean.dupont@paris.fr",
  family_name: "Dupont",
  given_name: "Jean",
  organization_name: "Mairie de Paris",
  siret: "21750001600019",
  suggest_emails_associated_to_user: "jean.dupont@mairie.paris.fr",
  suggest_organization_domains: "paris.fr",
};
