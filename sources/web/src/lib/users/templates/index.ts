//

import { dedent } from "ts-dedent";

//

export function ResetMFAMessage() {
  return dedent`
    Bonjour,

    Nous avons réinitialisé votre mot de passe et vos clés d'accès.
    Votre compte ProConnect n'est plus protégé par la validation en deux étapes.
    Vous serez obligé de définir un nouveau mot de passe ou de vous connecter avec un lien magique à la prochaine connexion.
  `;
}

export function ResetPasswordMessage() {
  return dedent`
    Bonjour,

    Nous avons réinitialisé votre mot de passe.
    Vous serez obligé de définir un nouveau mot de passe ou de vous connecter avec un lien magique à la prochaine connexion.
  `;
}

export function RevokeIdentityMessage() {
  return dedent`
    Bonjour,

    Nous avons réinitialisé la vérification de votre adresse email.
    Il vous sera demandé de confirmer à nouveau votre adresse email.
  `;
}

export function DeleteAccountMessage() {
  return dedent`
    Bonjour,

    Nous avons supprimé votre compte ProConnect.
    Vous pouvez créer un nouveau compte à tout moment avec votre adresse email.
  `;
}
export function RemoveFromOrganizationMessage({
  organization_name,
}: {
  organization_name: string;
}) {
  return dedent`
    Bonjour,

    Nous vous informons que votre rattachement à l'organisation ${organization_name} a été supprimé par l'équipe support ProConnect.

    Pourquoi ce changement ?

    Cette intervention peut avoir plusieurs raisons :

    - Changement de situation professionnelle : votre organisation nous a signalé que vous ne faites plus partie de ses effectifs.

    - Changement d'adresse e-mail professionnelle : votre organisation dispose désormais de son propre nom de domaine. Vous pouvez alors être amené à utiliser une nouvelle adresse e-mail professionnelle pour vous rattacher à celle-ci.

    - Correction d'un rattachement : votre compte était associé à une organisation incorrecte ou un rattachement devait être régularisé.

    - Demande de votre organisation : un représentant habilité de votre organisation a demandé la mise à jour de ses membres.

    Quelles conséquences pour votre compte ?

    Votre compte ProConnect reste actif. En revanche, vous ne pouvez plus utiliser le rattachement supprimé pour accéder aux services qui nécessitent d'appartenir à cette organisation.

    Si vous devez toujours accéder à des services au nom de cette organisation, vous devrez, selon votre situation, demander un nouveau rattachement avec votre adresse e-mail professionnelle actuelle.

    Vous ne comprenez pas cette modification ?

    Si vous pensez qu'il s'agit d'une erreur ou si vous avez besoin d'aide, vous pouvez contacter le support ProConnect à l'adresse mail suivante : support+identite@proconnect.gouv.fr.
  `;
}
