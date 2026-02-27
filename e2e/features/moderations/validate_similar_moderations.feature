# language: fr
Fonctionnalité: Validation automatique des modérations similaires

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"

    Alors je dois voir le titre de page "Liste des moderations"
    Alors je vois "Liste des moderations"
    Quand je clique sur le lien nommé "Modération a traiter de Jean Bon pour 51935970700022"
    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"

  Plan du Scénario: Validation automatique des modérations similaires avec domaine yopmail.com
    Quand je clique sur "✅ Accepter"
    Alors je vois "A propos de jeanbon@yopmail.com pour l'organisation Abracadabra, je valide :"

    Soit je vais à l'intérieur du dialogue nommé "la modale de validation"
    Quand je clique sur "<add_member>"
    Quand je clique sur "J'autorise le domaine <add_domain>"
    Quand je clique sur "Terminer"
    Et je réinitialise le contexte
    Quand je clique sur "Annuler"

    Alors je vois "Cette modération a été marqué comme traitée le"
    Et je vois "Validé par user@yopmail.com"

    Quand je clique sur "Moderations"
    Alors je dois voir le titre de page "Liste des moderations"
    Et je clique sur "Voir les demandes traitées"

    Et je ne vois pas "Jean Bon"
    Et je ne vois pas "Jean Dré"

    Quand je clique sur "Siret"
    Et je tape "51935970700022"
    Quand je clique sur le lien nommé "Modération a traiter de Jean Dré pour 51935970700022"
    Alors je dois voir le titre de page "Modération a traiter de Jean Dré pour 51935970700022"
    Alors je vois "Validation automatique - <cause>"

    Exemples:
      | add_member         | add_domain                              | cause                   |
      | EN TANT QU'INTERNE | yopmail.com en interne à l'organisation | domaine vérifié         |
      | EN TANT QU'EXTERNE | yopmail.com en externe à l'organisation | domaine externe vérifié |
