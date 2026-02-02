# language: fr
Fonctionnalité: Connexion d'un utilisateur

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "auth.agentconnect.gouv.fr"

  Scénario: Connexion de user@yopmail.com
    Etant donné que je suis sur la page "/"
    Alors je vois "Bonjour Hyyypertool !"
    Quand je clique sur le bouton "ProConnect"

    Alors je suis redirigé vers "/moderations"
    Et je dois voir le titre de page "Liste des moderations"
    Et je vois "Jean User"
    Et je vois "Hyyypertool"

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
