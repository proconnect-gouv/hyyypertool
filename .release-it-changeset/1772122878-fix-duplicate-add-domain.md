🐛 Correction du doublon add_domain dans le formulaire de validation

Remplacement des composants serveur (radio + checkbox) par un island Preact dans la modale d'acceptation de modération. Cela corrige un bug où deux champs `add_domain` étaient envoyés simultanément, provoquant une erreur de validation Zod.
