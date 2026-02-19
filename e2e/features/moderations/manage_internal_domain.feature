# language: fr
Fonctionnalité: Gérer un domaine interne lors de la modération

  Contexte:
    Soit une base de données nourrie au grain
    Et un faux serveur "identite.proconnect.gouv.fr"
    Quand je navigue sur la page
    Et je clique sur le bouton "ProConnect"
    Alors je vois "Liste des moderations"
    Quand je vais à l'intérieur de la rangée nommée "Modération a traiter de Jean Bon pour 51935970700022"
    Et je clique sur "➡️"
    Et je dois voir le titre de page "Modération a traiter de Jean Bon pour 51935970700022"
    Et je réinitialise le contexte
    Et je clique sur "🌐 1 domaine connu dans l’organisation"

  Scénario: Domaine interne
    Alors je dois voir un tableau nommé "🌐 1 domaine connu dans l’organisation" et contenant
      | Domain      | Status | Type             |
      | yopmail.com | ❓      | not_verified_yet |

    Quand je vais à l'intérieur de la rangée nommée "Domaine yopmail.com (not_verified_yet)"
    Quand je clique sur "Menu"
    Et je clique sur "✅ Domaine autorisé"
    Et je réinitialise le contexte
    Alors je dois voir un tableau nommé "🌐 1 domaine connu dans l’organisation" et contenant
      | Domain      | Status | Type     |
      | yopmail.com | ✅      | verified |

    Quand je vais à l'intérieur de la rangée nommée "Domaine yopmail.com (verified)"
    Quand je clique sur "Menu"
    Et je clique sur le bouton "🚫 Domaine refusé"
    Et je réinitialise le contexte
    Alors je dois voir un tableau nommé "🌐 1 domaine connu dans l’organisation" et contenant
      | Domain      | Status | Type    |
      | yopmail.com | 🚫     | refused |
    Et je réinitialise le contexte

    Quand je clique sur "Ajouter un domain"
    Et je tape "poymail.com{enter}"

    # TODO(douglasduteil): We should update the title when adding a domain
    Et je vois "poymail.com"
    Alors je dois voir un tableau nommé "🌐 1 domaine connu dans l’organisation" et contenant
      | Domain      | Status | Type     |
      | poymail.com | ✅      | verified |
