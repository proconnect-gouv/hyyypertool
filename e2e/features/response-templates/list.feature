# language: fr
Fonctionnalité: Liste des templates de réponse

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Et je suis sur la page "/response-templates"

  Scénario: Le modérateur voit le titre de la page
    Alors je vois "Templates de réponse"

  Scénario: Le modérateur voit le lien pour créer un nouveau template
    Alors je dois voir un lien nommé "Nouveau template"

  Scénario: Le modérateur peut naviguer vers la création d'un template
    Quand je clique sur le lien nommé "Nouveau template"
    Alors je dois voir le titre de page "Nouveau template"
