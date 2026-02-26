# language: fr
Fonctionnalité: Parcours d'une modération

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Et je clique sur le lien nommé "Modération a traiter de Jean Bon pour 13002526500013"

  Scénario: Le modérateur peut voir les détails de l'utilisateur
    Alors je vois "jeanbon@yopmail.com"

  Scénario: Le modérateur peut voir les organisations de l'utilisateur
    Alors je vois "organisation connu"

  Scénario: Le modérateur peut voir les membres de l'organisation cible
    Alors je vois "membre connu"

  Scénario: Le modérateur peut revenir à la liste
    Quand je clique sur "retour"
    Alors je dois voir le titre de page "Liste des moderations"
