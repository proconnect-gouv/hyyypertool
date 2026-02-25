#

# language: fr
Fonctionnalité: Gérer une modération pour une grande organisation

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Quand je clique sur le lien nommé "Modération big organisation de Pierre Bon pour 81797266400038"
    Et je dois voir le titre de page "Modération big organisation de Pierre Bon pour 81797266400038"

  Scénario: Pierre Bon veut rejoindre l'association ALDP
    Alors je vois "Pierre Bon a rejoint l'organisation de plus de 50 employés « ALDP »"
    Et je vois "Liste dirigeants - Annuaire entreprise API"
