♻️ Suppression de l'intégration Zammad

Zammad n'est plus utilisé par l'équipe. Suppression de l'ensemble du code lié à Zammad : client API, composants UI, routes (assets, health check), variables d'environnement et logique de ticket dans le flux de rejet des modérations. Les anciennes modérations avec un ticket Zammad sont désormais traitées comme sans ticket, et une nouvelle conversation Crisp est créée à la place.
