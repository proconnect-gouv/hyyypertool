# language: fr
Fonctionnalité: Gérer un domaine externe lors de la modération

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 51935970700022"
    Et je clique sur "➡️"
    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
    Et je réinitialise le contexte
    Et je clique sur "🌐 1 domaine connu dans l’organisation"

  Scénario: Domaine externe
    Quand je vais à l'intérieur de l'élément nommé "🌐 1 domaine connu dans l’organisation"
    Alors je vois "yopmail.com"
    Et je réinitialise le contexte
    Quand je clique sur "Menu"
    Et je clique sur le bouton "❎ Domaine externe"
    Quand je vais à l'intérieur de l'élément nommé "🌐 1 domaine connu dans l’organisation"
    Alors je vois "❎"
