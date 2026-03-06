# language: fr
Fonctionnalité: Page organisation - domaine à vérifier

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je vois "Bonjour Hyyypertool !"
    Et je me connecte en tant que "jeanbon@yopmail.com"

  Scénario:
    Quand je clique sur "Domaines à vérifier"
    Alors je suis redirigé sur "/organizations/domains"
    Et je dois voir le titre de page "Liste des domaines à vérifier"
    Et je vois "Liste des domaines à vérifier"

    Alors je dois voir un tableau nommé "Liste des domaines à vérifier" et contenant
      | Domain        | Siret          |
      | 9online.fr    | 21880352600019 |
      | yeswehack.com | 81403721400016 |

    Alors je dois voir un lien nommé "Domaine non vérifié yeswehack.com pour Yes we hack"
    Quand je clique sur le lien nommé "Domaine non vérifié yeswehack.com pour Yes we hack"
    Alors je vois "🏛 A propos de l'organisation"
    Et je vois "« Yes we hack »"
    Et je vois "Dénomination Yes we hack"

    Alors je dois voir un tableau nommé "domaine connu dans l'organisation" et contenant
      | Domain        | Status |
      | yeswehack.com | ❓      |

    Quand je clique sur "👥 2 membres enregistrés"
    Alors je dois voir un tableau nommé "👥 2 membres enregistrés" et contenant
      | Prénom  | Nom     | Type de vérification    |
      | Jean    | Dupont  | domain_not_verified_yet |
      | Raphael | Dubigny | domain_not_verified_yet |

    Quand je clique sur "Menu"
    Et je clique sur "✅ Domaine autorisé"
    Alors je vois "yeswehack.com"
    Et je vois "✅"
    Et je réinitialise le contexte

    Quand je clique sur "👥 2 membres enregistrés"
    Alors je dois voir un tableau nommé "👥 2 membres enregistrés" et contenant
      | Prénom  | Nom     | Type de vérification    |
      | Jean    | Dupont  | domain                  |
      | Raphael | Dubigny | domain_not_verified_yet |

    Quand je clique sur "Domaines à vérifier"
    Et je clique sur "Rafraichir"
    Alors je dois voir un tableau nommé "Liste des domaines à vérifier" et contenant
      | Domain     | Siret          |
      | 9online.fr | 21880352600019 |
