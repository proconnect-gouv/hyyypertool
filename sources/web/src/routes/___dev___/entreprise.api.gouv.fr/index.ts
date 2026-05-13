//

import type { AppContext } from "#src/middleware/context";
import { Hono } from "hono";

//

export default new Hono<AppContext>()
  .get("/readyz", (c) => c.text("readyz check passed"))

  .get("/v4/djepva/api-association/associations/:siren_or_rna", (c) => {
    const { siren_or_rna } = c.req.param();
    if (siren_or_rna !== "817972664") return c.json({});
    return c.json({
      data: {
        documents_rna: [
          {
            id: "95cc74a2-7520-49e1-9091-c1b3446a2e94",
            type: "Pièce",
            sous_type: { code: "LDC", libelle: "Liste dirigeants" },
            date_depot: "2016-01-12T14:16:17.000+01:00",
            annee_depot: "2016",
            url: "http://localhost:3000/___dev___/entreprise.api.gouv.fr/proxy/files/la_liste_des_dirigeants_2016_01_12",
          },
          {
            id: "2cb54fa6-f229-4869-aa72-60aacd5c953f",
            type: "Pièce",
            sous_type: { code: "LDC", libelle: "Liste dirigeants" },
            date_depot: "2019-04-05T11:30:19.000+02:00",
            annee_depot: "2019",
            url: "http://localhost:3000/___dev___/entreprise.api.gouv.fr/proxy/files/la_liste_des_dirigeants_2019_04_05",
          },
          {
            id: "53dbf5fb-e408-40ff-906c-3ce575d79304",
            type: "Pièce",
            sous_type: { code: "LDC", libelle: "Liste dirigeants" },
            date_depot: "2019-11-07T10:51:18.000+01:00",
            annee_depot: "2019",
            url: "http://localhost:3000/___dev___/entreprise.api.gouv.fr/proxy/files/la_liste_des_dirigeants_2019_11_07",
          },
        ],
      },
    });
  })

  .get("/proxy/files/:id", (c) => {
    const { id } = c.req.param();
    return c.text(`${id} - Requested GET on /proxy/files/${id}`);
  });
