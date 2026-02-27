#

# language: fr
Fonctionnalité: Gérer les demandes de modération en double

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Quand je clique sur le lien nommé "Modération a traiter de Richard Bon pour 38514019900014"
    Et je dois voir le titre de page "Modération a traiter de Richard Bon pour 38514019900014"

  Scénario: Richard Bon veut rejoindre l'organisation Dengi - Leclerc
    Alors je vois "Richard Bon veut rejoindre l'organisation « Dengi - Leclerc »"
    Et je vois "Attention : demande multiples"
    Et je vois "Il s'agit de la 2e demande pour cette organisation"
    Et je vois "Moderation#5 Accepté Pas de ticket"
    Et je vois "Moderation#6 A traiter Pas de ticket"
