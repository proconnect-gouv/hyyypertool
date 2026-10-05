//

import { dedent } from "ts-dedent";

//

export function ResetMFAMessage() {
  return dedent`
    Bonjour,

    Nous avons réinitialisé votre mot de passe et vos clés d'accès.
    Votre compte ProConnect n'est plus protégé par la validation en deux étapes.
    Vous serez obligé de définir un nouveau mot de passe ou de vous connecter avec un lien magique à la prochaine connexion.

    Excellente journée,
    L'équipe ProConnect.
  `;
}

export function ResetPasswordMessage() {
  return dedent`
    Bonjour,

    Nous avons réinitialisé votre mot de passe.
    Vous serez obligé de définir un nouveau mot de passe ou de vous connecter avec un lien magique à la prochaine connexion.

    Excellente journée,
    L'équipe ProConnect.
  `;
}

export function RevokeIdentityMessage() {
  return dedent`
    Bonjour,

    Nous avons réinitialisé la vérification de votre adresse email.
    Il vous sera demandé de confirmer à nouveau votre adresse email.

    Excellente journée,
    L'équipe ProConnect.
  `;
}

export function DeleteAccountMessage() {
  return dedent`
    Bonjour,

    Nous avons supprimé votre compte ProConnect.
    Vous pouvez créer un nouveau compte à tout moment avec votre adresse email.

    Excellente journée,
    L'équipe ProConnect.
  `;
}
