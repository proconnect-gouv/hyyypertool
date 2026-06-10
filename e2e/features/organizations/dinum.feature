# language: fr
Fonctionnalité: Page organisation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je me connecte en tant que "jeanbon@yopmail.com"

  Scénario:
    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    Et je dois voir le titre de page "Liste des organisations"
    Et je vois "Liste des organisations"
    Alors je dois voir un lien nommé "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)"
    Quand je clique sur le lien nommé "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)"
    Alors je vois "🏛 A propos de l'organisation"
    Et je vois "« Direction interministerielle du numerique (DINUM) »"
    Et je vois "Dénomination Direction interministerielle du numerique (DINUM)"
    Et je vois "Siret 13002526500013 Fiche annuaire"
    Et je vois "NAF/APE 84.11Z - Administration publique générale"
    Et je vois "Adresse 20 avenue de segur, 75007 Paris"
    Et je vois "Nature juridique Service central d'un ministère (7120)"
    Et je vois "Tranche d'effectif 250 à 499 salariés, en 2023 (code : 32)"
    Et je vois "Tranche d'effectif de l'unité légale 250 à 499 salariés (code : 32)"
    Et je vois "Service public Administration d'État Diffusible En activité Siège social"

    # Scénario: domaine connu dans l'organisation DINUM
    Alors je dois voir un tableau nommé "🌐 3 domaines connu dans l'organisation" et contenant
      | Status | Domain                            | Type     |
      | ✅      | beta.gouv.fr                      | verified |
      | ✅      | modernisation.gouv.fr             | verified |
      | ❎      | prestataire.modernisation.gouv.fr | external |

    # Scénario: Membres de DINUM
    Et je vois "1 membre"
    Quand je clique sur "1 membre"
    Quand je vais à l'intérieur de la rangée nommée "Membre Raphael Dubigny (rdubigny@beta.gouv.fr)"
    Alors je vois "Raphael"
    Et je vois "Dubigny"
    Et je vois "✅"
    Et je vois "Chef"
    Et je réinitialise le contexte
