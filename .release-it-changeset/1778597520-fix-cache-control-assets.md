🐛 Correction de l'en-tête Cache-Control sur les assets statiques

L'en-tête `Cache-Control: public, max-age=31536000, immutable` n'était jamais envoyé sur les ressources statiques en production. Le middleware `cache_immutable` vérifiait `c.finalized` après `serveStatic`, ce qui court-circuitait systématiquement l'ajout de l'en-tête. La note de version associée a été perdue lors d'une manipulation de l'historique git, d'où cette nouvelle release.
