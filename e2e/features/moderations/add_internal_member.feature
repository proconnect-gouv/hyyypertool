# language: fr
Fonctionnalité: Ajouter un membre interne lors de la modération

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "api.crisp.chat"
    Quand je navigue sur la page
    Et je me connecte en tant que "moderateur@beta.gouv.fr"
    Alors je vois "Liste des moderations"
    Quand je clique sur "Voir les 🔓 Non vérifié"

  Scénario: Marie est un membre interne de l'organization.
    Quand je clique sur le lien nommé "Modération non vérifié de Marie Bon pour 57206768400017"
    Et je dois voir le titre de page "Modération non vérifié de Marie Bon pour 57206768400017"

    Quand je clique sur "👥 0 membre connu dans l’organisation"
    Alors je dois voir un tableau nommé "👥 0 membre connu dans l’organisation" et contenant
      |  |
    Quand je clique sur "✅ Accepter"
    Soit je vais à l'intérieur du dialogue nommé "la modale de validation"
    Et je clique sur "Ajouter Marie à l'organisation EN TANT QU'INTERNE"
    Quand je clique sur "Terminer"
    Et je réinitialise le contexte

    Alors une notification mail n'est pas envoyée

    Alors je vois "Liste des moderations"
    Et je saisie le mot "{selectAll}is:processed{enter}" dans la boîte à texte nommée "Filtrer les modérations…"
    Quand je clique sur le lien nommé "Modération non vérifié de Marie Bon pour 57206768400017"

    Quand je clique sur "👥 1 membre connu dans l’organisation"
    Alors je dois voir un tableau nommé "👥 1 membre connu dans l’organisation" et contenant
      | Prénom | Nom |
      | Marie  | Bon |

  Scénario: Raphael est déjà membre de l'organisation mais sa modération peut être validée.
    Quand je clique sur le lien nommé "Modération non vérifié de Raphael Dubigny pour 81403721400016"

    Quand je clique sur "✅ Accepter"
    Soit je vais à l'intérieur du dialogue nommé "la modale de validation"
    Et je clique sur "Ajouter Raphael à l'organisation EN TANT QU'INTERNE"
    Quand je clique sur "Terminer"
    Et je réinitialise le contexte

    Alors je vois "Liste des moderations"
