# language: fr
Fonctionnalité: Retraiter une modération terminée

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Et je clique sur "Voir les demandes traitées"
    Et je clique sur "Filtrer par jours"
    Et je tape "2011-11-12"
    Quand je clique sur le lien nommé "Modération non vérifié de Marie Bon pour 44023386400014"
    Et je dois voir le titre de page "Modération non vérifié de Marie Bon pour 44023386400014"

  Scénario: Marie Bon à rejoindre l'organisation Bosch par erreur
    Alors je vois "Cette modération a été marqué comme traité"
    Et je vois "Marie Bon a rejoint une organisation avec un domain non vérifié « Bosch rexroth d.s.i. »"
    Quand je clique sur "Retraiter"
    Alors je ne vois pas "Cette modération a été marqué comme traité"
    Quand je clique sur "👥 0 membre connu dans l’organisation"
    Alors je dois voir un tableau nommé "👥 0 membre connu dans l’organisation" et contenant
      |  |
