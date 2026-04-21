# language: fr
Fonctionnalité: Page utilisateur avec MFA

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je me connecte en tant que "jeanbon@yopmail.com"
    Quand je clique sur "Utilisateurs"

    Et je dois voir le titre de page "Liste des utilisateurs"
    Et je vois "Liste des utilisateurs"
    Quand je clique sur le lien nommé "Utilisateur Raphael Dubigny (rdubigny@alpha.gouv.fr)"

    Et je dois voir le titre de page "Utilisateur Raphael Dubigny (rdubigny@alpha.gouv.fr)"

  Scénario: La fiche de Raphael Alpha
    Alors je vois "👨‍💻 A propos de l'utilisateur"
    Et je vois "« Raphael Dubigny »"
    Et je vois "email rdubigny@alpha.gouv.fr"
    Et je vois "prénomRaphael"
    Et je vois "nomDubigny"
    Et je vois "téléphone0123456789"
    Et je vois "Création13/07/2018 17:35:15"
    Et je vois "Dernière modification22/06/2023 16:34:34"
    Et je vois "Email vérifié envoyé le22/06/2023 16:34:34"

    Alors je dois voir un tableau nommé "Liste des modérations de Raphael" et contenant
      | Type           |
      | 🔓 Non vérifié |
    Et je réinitialise le contexte

    Sachant que je vais à l'intérieur de l'élément nommé "🔓 MFA"
    Alors je vois "TOTP"
    Alors je vois "Passkey - 1Password"
    Alors je vois "Passkey - NordPass"

    Sachant que je vais à l'intérieur de l'élément nommé "TOTP"
    Alors je vois "TOTP enrôlé le : 22/06/2023 16:34:34"
    Alors je vois "Force la 2FA sur tous les sites : ✅"
    Et je réinitialise le contexte

    Sachant que je vais à l'intérieur de l'élément nommé "Passkey - 1Password"
    Alors je vois "Création : 23/06/2023 03:33:33"
    Alors je vois "Dernière utilisation : 24/06/2023 04:44:44"
    Alors je vois "Nombre d'utilisation : 5"
    Et je réinitialise le contexte

    Sachant que je vais à l'intérieur de l'élément nommé "Passkey - NordPass"
    Alors je vois "Création : 23/06/2023 13:33:33"
    Alors je vois "Dernière utilisation : 24/06/2023 14:44:44"
    Alors je vois "Nombre d'utilisation : 87"
    Et je réinitialise le contexte

    Sachant que je vais à l'intérieur de l'élément nommé "🪪 FranceConnect"
    Alors je vois "subfc-sub-raphael-alpha-1234567890abcdef"
    Alors je vois "prénomRaphael"
    Alors je vois "nomDubigny"
    Alors je vois "genremale"
    Alors je vois "pseudordubigny"
    Et je réinitialise le contexte
