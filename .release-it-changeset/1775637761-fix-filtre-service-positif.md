🐛 Correction du filtre `service:` positif dans la liste des modérations

Le filtre `service:NomApp` était silencieusement ignoré par la requête : `parse_q` renseignait bien `sp_names` mais la couche SQL ne le lisait pas. La liste affichait toutes les modérations au lieu de celles du service demandé.
