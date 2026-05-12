🐛 Correction de l'en-tête Cache-Control sur les assets statiques

L'en-tête `Cache-Control: public, max-age=31536000, immutable` n'était jamais envoyé sur les ressources statiques en production, car le middleware vérifiait à tort `c.finalized` après la réponse de `serveStatic`. Les assets (polices, icônes, scripts) sont désormais correctement mis en cache côté navigateur.
