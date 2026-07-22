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

  Scénario: Le visiteur ne voit pas le bouton "Retraiter" sur une modération traitée
    Etant donné que je suis sur la page "/moderations"
    Quand je saisie le mot "{selectAll}is:processed{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Quand je clique sur le lien nommé "Modération a traiter de Richard Bon pour 38514019900014"
    Alors je vois "Modération acceptée"
    Mais je ne vois pas "Retraiter"

  Scénario: Le visiteur ne voit pas les actions sur un utilisateur
    Etant donné que je suis sur la page "/users"
    Quand je clique sur le lien nommé "Utilisateur Jean Bon (jeanbon@yopmail.com)"
    Alors je ne vois pas "révoquer l’identité"
    Et je ne vois pas "supprimer définitivement ce compte"

  Scénario: Le visiteur ne voit pas les actions sur les domaines d'une organisation
    Quand je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    Quand je clique sur le lien nommé "Organisation Direction interministerielle du numerique (DINUM) (13002526500013)"
    Alors je ne vois pas "Ajouter"
    Et je ne vois pas "Supprimer"

  Scénario: Le visiteur ne voit pas les actions sur la délivrabilité des domaines
    Etant donné que je suis sur la page "/domains-deliverability"
    Alors je vois "Délivrabilité des domaines"
    Mais je ne vois pas "Ajouter un email problématique"
    Et je ne vois pas "Supprimer test@ch-lehavre.fr"
