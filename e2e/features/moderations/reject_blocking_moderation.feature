# language: fr
Fonctionnalité: Refuser une modération bloquante

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "api.crisp.chat"
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je vois "Liste des moderations"
    Quand je saisie le mot "{selectAll}is:pending date:2011-11-11{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Quand je clique sur le lien nommé "Modération a traiter de Jean Bon pour 13002526500013"
    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 13002526500013"

  Scénario: Le modérateur le refuse avec la barre d'outils
    Quand je clique sur "❌ Refuser"
    Alors je vois "Motif de refus :"

    Soit je vais à l'intérieur du dialogue nommé "la modale de refus"
    Quand je saisie le mot "Nom de domaine introuvable{enter}" dans la boîte à texte nommée "Recherche d'une réponse type"
    Et je clique sur "Notifier et terminer"
    Et je réinitialise le contexte

    Quand je clique sur "Annuler"
    Et je vois "Modération rejetée"
    Alors je vois "Cette modération a été marqué comme traitée le"

    Quand je clique sur "Moderations"
    Et je dois voir le titre de page "Liste des moderations"
    Alors je vois "Liste des moderations"
    Alors je ne vois pas "13002526500013"
