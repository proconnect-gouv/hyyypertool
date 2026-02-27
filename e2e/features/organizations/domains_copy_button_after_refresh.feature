# language: fr
Fonctionnalité: Les boutons copier persistent après un rafraichissement HTMX

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"

  Scénario: Les boutons copier sont toujours visibles après un clic sur Rafraichir
    Quand je clique sur "Domaines à vérifier"
    Alors je vois "Liste des domaines à vérifier"

    Quand je vais à l'intérieur de la rangée nommée "Domaine non vérifié yeswehack.com pour Yes we hack"
    Alors je vois un bouton intitulé "Copier le nom de domaine"
    Et je réinitialise le contexte

    Quand je clique sur "Rafraichir"
    Alors je vois "Liste des domaines à vérifier"

    Quand je vais à l'intérieur de la rangée nommée "Domaine non vérifié yeswehack.com pour Yes we hack"
    Alors je vois un bouton intitulé "Copier le nom de domaine"
