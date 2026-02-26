🐛 Correction des erreurs htmx liées aux extensions

Suppression de l'extension `chunked-transfer` qui provoquait des `SyntaxError`
en production lors du swap de réponses HTML contenant des scripts d'îlots Preact
tronqués. Correction de l'ordre de chargement du script `htmx-ext-debug` pour
éviter les erreurs « htmx is not defined » dans les tests Cypress.
