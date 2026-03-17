# language: fr
Fonctionnalité: Filtrer les modérations par fournisseur de service

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je vois "Liste des moderations"

  Scénario: Exclure un fournisseur de service masque les modérations associées
    Alors je dois voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"
    Quand je saisie le mot "{selectAll}is:pending -service:\"Annuaire des entreprises\"{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Alors je ne dois pas voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"

  Scénario: Retirer un filtre réaffiche les modérations exclues
    Quand je saisie le mot "{selectAll}is:pending -service:\"Annuaire des entreprises\"{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Alors je ne dois pas voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"
    Quand je saisie le mot "{selectAll}is:pending{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Alors je dois voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"
