# language: fr
Fonctionnalité: Gestion de l'équipe par un admin

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "admin@omega.gouv.fr"
    Et je suis sur la page "/admin/team"
    Alors je vois "Gestion de l'equipe"

  Scénario: L'admin voit la liste des membres
    Quand je vais à l'intérieur de la rangée nommée "admin@omega.gouv.fr"
    Alors je vois "(vous)"
    Et je vois "admin"
    Et je vois "Actif"

    Quand je réinitialise le contexte
    Et je vais à l'intérieur de la rangée nommée "moderateur@beta.gouv.fr"
    Alors je vois "moderator"
    Et je vois "Actif"

    Quand je réinitialise le contexte
    Et je vais à l'intérieur de la rangée nommée "jeanbon@yopmail.com"
    Alors je vois "visitor"
    Et je vois "Actif"

  Scénario: L'admin peut ajouter un nouveau membre
    Quand je saisie "unknown@example.com" dans le champ nommé "Email"
    Et je sélectionne "visitor" dans la liste déroulante nommée "Role"
    Et je clique sur "Ajouter"
    Alors je vois "unknown@example.com"

    Quand je clique sur "Mon espace"
    Et je clique sur "Se deconnecter"
    Alors je vois "Bonjour Hyyypertool !"

    Quand je me connecte en tant que "unknown@example.com"
    Alors je suis redirigé vers "/moderations"
    Et je vois "Mon espace"

  Scénario: L'admin peut changer le rôle d'un autre membre
    Quand je vais à l'intérieur de la rangée nommée "jeanbon@yopmail.com"
    Et je sélectionne "moderator" dans la liste déroulante nommée "role"
    Et je clique sur "OK"
    Alors je réinitialise le contexte
    Et je vois "jeanbon@yopmail.com"

  Scénario: L'admin peut désactiver un autre membre et celui-ci ne peut plus se connecter
    Quand je confirme la suppression
    Et je vais à l'intérieur de la rangée nommée "jeanbon@yopmail.com"
    Et je clique sur "Désactiver"
    Alors je réinitialise le contexte
    Et je vois "Desactive"

    Quand je clique sur "Mon espace"
    Et je clique sur "Se deconnecter"
    Alors je vois "Bonjour Hyyypertool !"

    Quand je me connecte en tant que "jeanbon@yopmail.com"
    Alors je vois "Accès Non Autorisé"

  Scénario: L'admin peut réactiver un membre désactivé et celui-ci peut se reconnecter
    Quand je confirme la suppression
    Et je vais à l'intérieur de la rangée nommée "jeanbon@yopmail.com"
    Et je clique sur "Désactiver"
    Alors je réinitialise le contexte
    Et je vois "Desactive"

    Quand je confirme la suppression
    Et je vais à l'intérieur de la rangée nommée "jeanbon@yopmail.com"
    Et je clique sur "Reactiver"
    Alors je réinitialise le contexte
    Et je vois "Actif"

    Quand je clique sur "Mon espace"
    Et je clique sur "Se deconnecter"
    Alors je vois "Bonjour Hyyypertool !"

    Quand je me connecte en tant que "jeanbon@yopmail.com"
    Alors je suis redirigé vers "/moderations"
    Et je vois "Mon espace"

  Scénario: L'admin ne peut pas modifier son propre rôle
    Et je vois "(vous)"
    Et je vais à l'intérieur de la rangée nommée "admin@omega.gouv.fr"
    Alors je ne vois pas "OK"
    Et je vois "admin"

  Scénario: L'admin ne peut pas se désactiver lui-même
    Et je vais à l'intérieur de la rangée nommée "admin@omega.gouv.fr"
    Alors je ne vois pas "Désactiver"
    Et je vois "—"
