# language: fr
Fonctionnalité: Actions sur les membres d'une organisation

  Contexte:
    Soit une base de données nourrie au grain
    Quand je navigue sur la page
    Et je me connecte en tant que "jeanbon@yopmail.com"
    Et je clique sur "Organisations"
    Alors je suis redirigé sur "/organizations"
    Quand je clique sur le lien nommé "Organisation DINUM (13002526500013)"
    Quand je clique sur "1 membre"
    Quand je vais à l'intérieur de la rangée nommée "Membre Raphael Dubigny (rdubigny@beta.gouv.fr)"

  Plan du Scénario: Changer le type de vérification d'un membre
    Et je vois "domain"
    Quand je clique sur "Menu"
    Et je clique sur "<action>"
    Alors je vois "<verification_resultat>"

    Exemples:
      | action                                         | verification_resultat                |
      | 🔄 vérif: liste dirigeants                     | in_liste_dirigeants_rna              |
      | 🔄 vérif: domaine email                        | domain                               |
      | 🔄 vérif: mail officiel                        | official_contact_email               |
      | 🔄 vérif: no validation means available        | no_validation_means_available        |
      | 🔄 vérif: verified by coop mediation numerique | verified_by_coop_mediation_numerique |
      | 🚫 non vérifié                                 | domain_not_verified_yet              |

  Plan du Scénario: Basculer un membre entre interne et externe
    Et je vois "<etat_initial>"
    Quand je clique sur "Menu"
    Et je clique sur "🔄 interne/externe"
    Alors je vois "<etat_resultat>"

    Exemples:
      | etat_initial | etat_resultat |
      | ✅            | ❌             |

  Scénario: Retirer un membre de l'organisation
    Quand je clique sur "Menu"
    Et je clique sur "🚪🚶retirer de l'orga"
    Et je réinitialise le contexte
    Alors je ne vois pas "Membre Raphael Dubigny"
