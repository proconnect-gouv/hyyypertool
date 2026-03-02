🐛 Mise à jour des membres liés lors du changement de type de vérification d'un domaine

Le PATCH d'un domaine utilise désormais `MarkDomainAsVerified` pour mettre à jour les liens `users_organizations` des membres dont l'email correspond au domaine vérifié. Auparavant, seul le champ `verification_type` du domaine était modifié sans impact sur les membres.
