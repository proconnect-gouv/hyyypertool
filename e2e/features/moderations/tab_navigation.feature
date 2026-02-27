# language: fr
Fonctionnalité: Navigation au clavier dans la liste des modérations

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"

  Scénario: Naviguer au clavier depuis le filtre modérateur jusqu'aux rangées du tableau
    Quand je clique sur "Filtrer par modérateur"
    Et j'appuie sur "tab"
    Alors l'élément avec le focus clavier doit être le lien nommé "Modération a traiter de Jean Bon pour 51935970700022"
    Quand j'appuie sur "tab"
    Alors l'élément avec le focus clavier doit être le lien nommé "Modération a traiter de Jean Dré pour 51935970700022"

  Scénario: Naviguer vers une modération avec le clavier
    Quand je clique sur "Filtrer par modérateur"
    Et j'appuie sur "tab"
    Alors l'élément avec le focus clavier doit être le lien nommé "Modération a traiter de Jean Bon pour 51935970700022"
    Quand j'appuie sur "Enter"
    Alors je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
