# language: fr
Fonctionnalité: Page organisation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"

  # Et je me connecte en tant que user@yopmail.com sur dev-agentconnect.fr
  Scénario:
    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    Et je dois voir le titre de page "Liste des organisations"
    Et je vois "Liste des organisations"
    Alors je dois voir un lien nommé "Organisation DINUM (13002526500013)"
    Quand je clique sur le lien nommé "Organisation DINUM (13002526500013)"
    Alors je vois "🏛 A propos de l'organisation"
    Et je vois "« DINUM »"
    Et je vois "Dénomination DINUM"
    Et je vois "Siret 13002526500013 Fiche annuaire"
    Et je vois "NAF/APE 84.11Z - Administration publique générale"
    Et je vois "Adresse 20 avenue de segur, 75007 Paris"
    Et je vois "Nature juridique SA nationale à conseil d'administration (Service central d'un ministère)"
    Et je vois "Tranche d'effectif 100 à 199 salariés, en 2021 (code : 22) (liste code effectif INSEE)"

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
