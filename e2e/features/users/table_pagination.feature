# language: fr
Fonctionnalité: Pagination de la liste des utilisateurs

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je me connecte en tant que "jeanbon@yopmail.com"

  Scénario: Navigation avant et arrière dans la liste
    Quand je suis sur la page "/users?page_size=1&page=7"
    Quand je clique sur "Suivant"
    Alors je vois "marie.bon@fr.bosch.com"
    Et je suis redirigé vers "page=8"
    Quand je clique sur "Précédent"
    Alors je ne vois pas "marie.bon@fr.bosch.com"
    Et je suis redirigé vers "page=7"
