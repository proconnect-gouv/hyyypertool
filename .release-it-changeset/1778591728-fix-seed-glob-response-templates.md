🐛 Correction du seed des modèles de réponse

Le pattern glob `[!index]*.ts` était interprété comme une classe de caractères et excluait silencieusement 6 modèles de réponse du seed. Ces 6 templates manquants sont désormais correctement chargés et insérés en base de données.
