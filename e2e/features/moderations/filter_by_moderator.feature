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
