# language: fr
Fonctionnalité: Pagination de la liste des organisations

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je me connecte en tant que "jeanbon@yopmail.com"

  Scénario: Navigation avant et arrière dans la liste
    Quand je suis sur la page "/organizations?page_size=1&page=3"
    Alors je vois "Yes we hack"
    Quand je clique sur "Suivant"
    Alors je vois "Abracadabra"
    Et je suis redirigé vers "page=4"
    Quand je clique sur "Précédent"
    Alors je vois "Yes we hack"
    Et je suis redirigé vers "page=3"
