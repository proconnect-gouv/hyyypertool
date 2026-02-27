# language: fr
Fonctionnalité: Filtrer les modérations par modérateur

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"

  Scénario: Filtrer par modérateur auto-coche les demandes traitées et filtre la table
    Alors je vois "Filtrer par modérateur"
    Et je ne vois pas "44023386400014"
    Quand je sélectionne "moderateur@beta.gouv.fr" dans la liste déroulante nommée "Filtrer par modérateur"
    Alors je vois "44023386400014"
