# language: fr
Fonctionnalité: Accepter une modération bloquante avec la barre d'outils

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"

    Alors je dois voir le titre de page "Liste des moderations"
    Alors je vois "Liste des moderations"
    Quand je clique sur le lien nommé "Modération a traiter de Jean Bon pour 13002526500013"

    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 13002526500013"

  Scénario: Le modérateur le valide avec la barre d'outils
    Quand je clique sur "✅ Accepter"
    Alors je vois "A propos de jeanbon@yopmail.com pour l'organisation DINUM, je valide :"

    Soit je vais à l'intérieur du dialogue nommé "la modale de validation"
    Quand je clique sur "Terminer"
    Et je réinitialise le contexte
    Quand je clique sur "Annuler"

    Et je vois "Modération acceptée"
    Et je vois "Cette modération a été marqué comme traitée le"
    Et je vois "Validé par user@yopmail.com"

    Quand je clique sur "Moderations"
    Alors je vois "Liste des moderations"
    Alors je ne vois pas "13002526500013"

    Alors une notification mail est envoyée
