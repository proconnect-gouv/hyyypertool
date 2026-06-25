# language: fr
Fonctionnalité: Un visiteur ne peut pas modifier les données

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "jeanbon@yopmail.com"

  Scénario: Le visiteur ne voit pas les actions d'édition des templates de réponse
    Etant donné que je suis sur la page "/response-templates"
    Alors je vois "Templates de réponse"
    Mais je ne vois pas "Nouveau template"
    Et je ne vois pas "Éditer"

  Scénario: Le visiteur ne voit pas le menu d'actions sur les membres d'une organisation
    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    Quand je clique sur le lien nommé "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)"
    Quand je clique sur "1 membre"
    Quand je vais à l'intérieur de la rangée nommée "Membre Raphael Dubigny (rdubigny@beta.gouv.fr)"
    Alors je vois "Raphael"
    Mais je ne vois pas "Menu"
    Et je ne vois pas "retirer de l'orga"
    Et je réinitialise le contexte

  Scénario: Le visiteur ne voit pas la barre d'outils de modération
    Etant donné que je suis sur la page "/moderations"
    Quand je clique sur le lien nommé "Modération a traiter de Jean Bon pour 13002526500013"
    Alors je ne vois pas "✅ Accepter"
    Et je ne vois pas "❌ Refuser"
