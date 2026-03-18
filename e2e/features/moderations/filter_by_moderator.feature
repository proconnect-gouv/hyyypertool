# language: fr
Fonctionnalité: Filtrer les modérations par modérateur

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je vois "Liste des moderations"

  Scénario: Filtrer par modérateur affiche les modérations traitées par ce modérateur
    Et je ne vois pas "44023386400014"
    Quand je saisie le mot "{selectAll}by:moderateur@beta.gouv.fr{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Alors je vois "44023386400014"

  Scénario: Filtrer par un autre modérateur affiche ses modérations
    Et je ne dois pas voir un élément ayant pour aria-label "Modération non vérifié de Raphael Dubigny pour 13002526500013"
    Quand je saisie le mot "{selectAll}by:admin@beta.gouv.fr{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Alors je dois voir un élément ayant pour aria-label "Modération non vérifié de Raphael Dubigny pour 13002526500013"
