# language: fr
Fonctionnalité: Gérer un domaine externe lors de la modération

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je vois "Liste des moderations"
    Quand je clique sur le lien nommé "Modération a traiter de Jean Bon pour 51935970700022"
    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
    Et je clique sur "🌐 1 domaine connu dans l’organisation"

  Scénario: Domaine externe
    Quand je vais à l'intérieur de l'élément nommé "🌐 1 domaine connu dans l’organisation"
    Alors je vois "yopmail.com"
    Et je réinitialise le contexte
    Quand je clique sur "Menu"
    Et je clique sur le bouton "❎ Domaine externe"
    Quand je vais à l'intérieur de l'élément nommé "🌐 1 domaine connu dans l’organisation"
    Alors je vois "❎"
