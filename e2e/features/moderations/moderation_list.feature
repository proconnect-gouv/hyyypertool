# language: fr
Fonctionnalité: Parcours de modération

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"

  Scénario: Le modérateur peut rechercher une modération par email
    Quand je tape "jeanbon" dans le champ nommé "search_email"
    Et j'attends 1 seconde
    Alors je vois "13002526500013"
    Et je ne vois pas "51935970700022"

  Scénario: Le modérateur peut rechercher une modération par SIRET
    Quand je tape "51935970700022" dans le champ nommé "search_siret"
    Et j'attends 1 seconde
    Alors je vois "51935970700022"
    Et je ne vois pas "13002526500013"

  Scénario: Le modérateur peut explorer une modération depuis la liste
    Quand je clique sur le lien nommé "Modération a traiter de Jean Bon pour 13002526500013"
    Alors je dois voir le titre de page "Modération a traiter de Jean Bon pour 13002526500013"
    Et je vois "jeanbon@yopmail.com"

  Scénario: Le modérateur peut naviguer entre les pages de la liste
    Quand je tape "2" dans le champ nommé "page"
    Et je clique sur "Suivant"
    Alors je vois "Affiche de 11-20 sur"
