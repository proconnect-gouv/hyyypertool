# language: fr
Fonctionnalité: Accès à la gestion de l'équipe

  Contexte:
    Soit une base de données nourrie au grain

  Scénario: Un admin peut accéder à la gestion de l'équipe
    Etant donné que je suis sur la page "/"
    Et je me connecte en tant que "admin@omega.gouv.fr"
    Alors je suis redirigé vers "/moderations"

    Quand je clique sur "Mon espace"
    Et je clique sur "Gestion de l'équipe"
    Alors je suis redirigé vers "/admin/team"
    Et je vois "Gestion de l'equipe"

    Quand je vais à l'intérieur de la rangée nommée "admin@omega.gouv.fr"
    Alors je vois "(vous)"
    Quand je réinitialise le contexte
    Et je vais à l'intérieur de la rangée nommée "moderateur@beta.gouv.fr"
    Alors je vois "moderator"
    Quand je réinitialise le contexte
    Et je vais à l'intérieur de la rangée nommée "jeanbon@yopmail.com"
    Alors je vois "visitor"

  Scénario: Un modérateur ne peut pas accéder à la gestion de l'équipe
    Etant donné que je suis sur la page "/"
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je suis redirigé vers "/moderations"

    Etant donné que je suis sur la page "/admin/team"
    Alors je suis redirigé vers "/moderations"

  Scénario: Un visiteur ne peut pas accéder à la gestion de l'équipe
    Etant donné que je suis sur la page "/"
    Et je me connecte en tant que "jeanbon@yopmail.com"
    Alors je suis redirigé vers "/moderations"

    Etant donné que je suis sur la page "/admin/team"
    Alors je suis redirigé vers "/moderations"
