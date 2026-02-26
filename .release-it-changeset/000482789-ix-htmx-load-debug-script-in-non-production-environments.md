🐛 Correction du chargement du script de débogage htmx

Le script htmx-ext-debug étaitIncorrectement chargé en préproduction
lorsque la variable d'environnement DEPLOY_ENV était définie à "preview".
Le correctif utilise maintenant NODE_ENV pour charger le script uniquement
en dehors de l'environnement de production.
