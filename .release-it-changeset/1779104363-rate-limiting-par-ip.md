🔒 Limitation du débit par adresse IP

Ajout d'un middleware de limitation du débit (rate limiting) basé sur l'adresse IP, afin de bloquer les scanners et scrapers malveillants. Les compteurs sont stockés dans une table PostgreSQL non journalisée (`UNLOGGED`) pour des performances optimales. La fonctionnalité est activée via le flag `FEATURE_RATE_LIMIT_BY_IP`.
