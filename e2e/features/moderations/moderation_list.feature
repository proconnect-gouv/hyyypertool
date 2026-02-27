# language: fr
Fonctionnalité: Parcours de modération

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Et je vois "Raphael"

  Scénario: Le modérateur peut rechercher une modération par email
    Quand je saisie "jeanbon" dans le champ nommé "Email"
    Alors je vois "13002526500013"
    Et je ne vois pas "Raphael"

  Scénario: Le modérateur peut rechercher une modération par SIRET
    Quand je saisie "51935970700022" dans le champ nommé "Siret"
    Alors je vois "51935970700022"
    Et je ne vois pas "Raphael"

  Scénario: Le modérateur peut explorer une modération depuis la liste
    Quand je clique sur le lien nommé "Modération a traiter de Jean Bon pour 13002526500013"
    Alors je dois voir le titre de page "Modération a traiter de Jean Bon pour 13002526500013"
    Et je vois "jeanbon@yopmail.com"
