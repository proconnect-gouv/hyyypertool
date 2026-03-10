# language: fr
Fonctionnalité: Page utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je me connecte en tant que "jeanbon@yopmail.com"
    Quand je clique sur "Utilisateurs"

    Et je dois voir le titre de page "Liste des utilisateurs"
    Et je vois "Liste des utilisateurs"
    Quand je clique sur le lien nommé "Utilisateur Raphael Dubigny (rdubigny@beta.gouv.fr)"

    Et je dois voir le titre de page "Utilisateur Raphael Dubigny (rdubigny@beta.gouv.fr)"

  Scénario: La fiche de Raphael Beta
    Alors je vois "👨‍💻 A propos de l'utilisateur"
    Et je vois "« Raphael Dubigny »"
    Et je vois "email rdubigny@beta.gouv.fr"
    Et je vois "prénomRaphael"
    Et je vois "nomDubigny"
    Et je vois "téléphone0123456789"
    Et je vois "Création13/07/2018 17:35:15"
    Et je vois "Dernière modification22/06/2023 16:34:34"
    Et je vois "Email vérifié envoyé le22/06/2023 16:34:34"

    Alors je dois voir un tableau nommé "Liste des organisations de Raphael" et contenant
      | Libellé | Siret          |
      | DINUM   | 13002526500013 |
