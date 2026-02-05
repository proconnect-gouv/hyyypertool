//

export type Values = {
  domain: string;
  moderation: {
    id: number;
    moderated_at: string | null;
    type: string;
    organization: {
      id: number;
      cached_libelle: string | null;
      siret: string;
      cached_libelle_categorie_juridique: string | null;
    };
    user: {
      id: number;
      email: string;
      given_name: string | null;
      family_name: string | null;
    };
  };
  query_suggest_same_user_emails: (params: {
    family_name: string;
    organization_id: number;
  }) => Promise<string[]>;
  query_suggest_organization_domains: (id: number) => Promise<string[]>;
};

//

export const PLACEHOLDER_VALUES: Values = {
  domain: "${ domain }",
  moderation: {
    id: 1,
    moderated_at: null,
    type: "organization_join_block",
    organization: {
      id: 1,
      cached_libelle: "${ organization_name }",
      siret: "${ siret }",
      cached_libelle_categorie_juridique: "${ categorie_juridique }",
    },
    user: {
      id: 1,
      email: "${ email }",
      given_name: "${ given_name }",
      family_name: "${ family_name }",
    },
  },
  query_suggest_same_user_emails: async () => [
    "${ suggest_emails_associated_to_user }",
  ],
  query_suggest_organization_domains: async () => [
    "${ suggest_organization_domains }",
  ],
};
