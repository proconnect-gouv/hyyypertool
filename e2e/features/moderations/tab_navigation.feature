# language: fr
Fonctionnalité: Navigation au clavier dans la liste des modérations

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je vois "Liste des moderations"

  Scénario: Naviguer au clavier depuis le haut de la page jusqu'aux rangées du tableau
    Quand j'appuie sur "tab"
    Alors l'élément avec le focus clavier doit être le lien nommé "Aller au contenu principal"
    Quand j'appuie sur "Enter"
    Et je navigue au clavier jusqu'au lien nommé "Modération a traiter de Jean Bon pour 51935970700022"
    Alors l'élément avec le focus clavier doit être le lien nommé "Modération a traiter de Jean Bon pour 51935970700022"
    Quand j'appuie sur "tab"
    Alors l'élément avec le focus clavier doit être le lien nommé "Modération a traiter de Jean Dré pour 51935970700022"

  Scénario: Naviguer vers une modération avec le clavier
    Quand j'appuie sur "tab"
    Alors l'élément avec le focus clavier doit être le lien nommé "Aller au contenu principal"
    Quand j'appuie sur "Enter"
    Et je navigue au clavier jusqu'au lien nommé "Modération a traiter de Jean Bon pour 51935970700022"
    Quand j'appuie sur "Enter"
    Alors je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
