# language: fr
Fonctionnalité: Connexion d'un utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "auth.agentconnect.gouv.fr"

  Scénario: Connexion de admin@omega.gouv.fr
    Etant donné que je suis sur la page "/"
    Alors je vois "Bonjour Hyyypertool !"
    Quand je me connecte en tant que "admin@omega.gouv.fr"

    Alors je suis redirigé vers "/moderations"
    Et je dois voir le titre de page "Liste des moderations"
    Et je vois "Mon espace"
    Et je vois "Hyyypertool"

    Quand je clique sur "Mon espace"
    Alors je vois "admin"
    Et je vois "Gestion de l'équipe"
    Et je vois "Se deconnecter"

  Scénario: Connexion de moderateur@beta.gouv.fr
    Etant donné que je suis sur la page "/"
    Alors je vois "Bonjour Hyyypertool !"
    Quand je me connecte en tant que "moderateur@beta.gouv.fr"

    Alors je suis redirigé vers "/moderations"
    Et je dois voir le titre de page "Liste des moderations"
    Et je vois "Mon espace"
    Et je vois "Hyyypertool"

    Quand je clique sur "Mon espace"
    Alors je vois "moderator"
    Et je ne vois pas "Gestion de l'équipe"
    Et je vois "Se deconnecter"

    Quand je clique sur "Utilisateurs"
    Alors je suis redirigé vers "/users"
    Et je dois voir le titre de page "Liste des utilisateurs"
    Et je vois "Liste des utilisateurs"

    Quand je clique sur "Organisations"
    Alors je suis redirigé vers "/organizations"
    Et je dois voir le titre de page "Liste des organisations"
    Et je vois "Liste des organisations"

    Quand je clique sur "Moderations"
    Alors je suis redirigé vers "/moderations"
    Et je dois voir le titre de page "Liste des moderations"
    Et je vois "Liste des moderations"

  Scénario: Connexion de jeanbon@yopmail.com
    Etant donné que je suis sur la page "/"
    Alors je vois "Bonjour Hyyypertool !"
    Quand je me connecte en tant que "jeanbon@yopmail.com"

    Alors je suis redirigé vers "/moderations"
    Et je dois voir le titre de page "Liste des moderations"
    Et je vois "Mon espace"

    Quand je clique sur "Mon espace"
    Alors je vois "visitor"
    Et je ne vois pas "Gestion de l'équipe"
    Et je vois "Se deconnecter"

  Scénario: Un utilisateur inconnu ne peut pas accéder à l'application
    Etant donné que je suis sur la page "/"
    Alors je vois "Bonjour Hyyypertool !"
    Quand je me connecte en tant que "unknown@example.com"

    Alors je vois "Accès Non Autorisé"
