#language: fr
Fonctionnalité: Gestion de la délivrabilité des domaines email

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"

  Scénario: Afficher la liste des domaines en whitelist
    Quand je clique sur "Délivrabilité des domaines"
    Alors je suis redirigé sur "/domains-deliverability"
    Et je dois voir le titre de page "Délivrabilité des domaines"
    Et je vois "test@ch-lehavre.fr"
    Et je vois "ch-lehavre.fr"
    Et je vois "test@ccduserein.fr"
    Et je vois "ccduserein.fr"

  Scénario: Ajouter un nouveau domaine à la whitelist
    Quand je clique sur "Délivrabilité des domaines"
    Alors je suis redirigé sur "/domains-deliverability"
    Et je saisie "nouveau@example.fr" dans le champ nommé "Ajouter un email problématique"
    Et je clique sur le bouton "Ajouter"
    Alors je vois "nouveau@example.fr"
    Et je vois "example.fr"

  Scénario: Supprimer un domaine de la whitelist
    Quand je clique sur "Délivrabilité des domaines"
    Alors je suis redirigé sur "/domains-deliverability"
    Et je vois "test@ch-lehavre.fr"
    Quand je clique sur l'élément nommé "Supprimer test@ch-lehavre.fr"
    Et je confirme la suppression
    Alors je ne vois pas "test@ch-lehavre.fr" 

  Scénario: Vérifier les informations de vérification
    Quand je clique sur "Délivrabilité des domaines"
    Alors je suis redirigé sur "/domains-deliverability"
    Et je vois "🧟‍♂️ zombie admin"
    Et je vois "01/01/2024"
