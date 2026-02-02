# language: fr
Fonctionnalité: Page organisation - domaine à vérifier

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je clique sur le bouton "ProConnect"

  Scénario:
    Quand je clique sur "Domaines à vérifier"
    Alors je suis redirigé sur "/organizations/domains"
    Et je dois voir le titre de page "Liste des domaines à vérifier"
    Et je vois "Liste des domaines à vérifier"

    Alors je dois voir un tableau nommé "Liste des domaines à vérifier" et contenant
      | Domain        | Siret          |
      | 9online.fr    | 21880352600019 |
      | yeswehack.com | 81403721400016 |

    Quand je vais à l'intérieur de la rangée nommée "Domaine non vérifié yeswehack.com pour Yes we hack"
    Alors je vois "Yes we hack"
    Et je clique sur "➡️"
    Et je réinitialise le contexte
    Alors je vois "🏛 A propos de l'organisation"
    Et je vois "« Yes we hack »"
    Et je vois "Dénomination Yes we hack"

    Alors je dois voir un tableau nommé "domaine connu dans l'organisation" et contenant
      | Domain        | Status |
      | yeswehack.com | ❓      |

    Quand je clique sur "Menu"
    Et je clique sur "✅ Domaine autorisé"
    Alors je vois "yeswehack.com"
    Et je vois "✅"
    Et je réinitialise le contexte

    Quand je clique sur "Domaines à vérifier"
    Et je clique sur "Rafraichir"
    Alors je dois voir un tableau nommé "Liste des domaines à vérifier" et contenant
      | Domain     | Siret          |
      | 9online.fr | 21880352600019 |
