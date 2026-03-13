# language: fr
Fonctionnalité: Filtrer les modérations par fournisseur de service

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je vois "Liste des moderations"

  Scénario: Exclure un fournisseur de service masque les modérations associées
    Alors je dois voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"
    Quand je clique sur le bouton "Fournisseur de service"
    Et je clique sur l'élément nommé "Exclure Annuaire des entreprises"
    Quand je clique sur le bouton "Fournisseur de service"
    Alors je ne dois pas voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"

  Scénario: Retirer un filtre réaffiche les modérations exclues
    Quand je clique sur le bouton "Fournisseur de service"
    Et je clique sur l'élément nommé "Exclure Annuaire des entreprises"
    Quand je clique sur le bouton "Fournisseur de service"
    Alors je ne dois pas voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"
    Quand je clique sur l'élément nommé "Retirer Annuaire des entreprises"
    Alors je dois voir un élément ayant pour aria-label "Modération a traiter de Jean Bon pour 13002526500013"

  Scénario: Exclure les modérations sans fournisseur de service
    Quand je clique sur le bouton "Fournisseur de service"
    Et je clique sur l'élément nommé "Exclure Sans service"
    Quand je clique sur le bouton "Fournisseur de service"
    Alors je vois "Annuaire des entreprises"
