//

import { expect, test } from "bun:test";
import { GetBanaticUrl } from "./GetBanaticUrl";

//

//

test("should return default banatic url", async () => {
  const get_banatic_url = GetBanaticUrl({ http_timout: 3_000 });
  const url = await get_banatic_url("123456789");

  expect(url).toEqual({
    url: "https://www.banatic.interieur.gouv.fr/consultation/intercommunalite?siren=123456789&page=1",
  });
});

test("should return specific banatic url", async () => {
  const get_banatic_url = GetBanaticUrl({ http_timout: 3000 });

  const url = await get_banatic_url("200099711");

  expect(url).toEqual({
    url: "https://www.banatic.interieur.gouv.fr/intercommunalite/200099711",
  });
});

test("should return default error on timeout", async () => {
  const get_banatic_url = GetBanaticUrl({ http_timout: 0 });

  const url = await get_banatic_url("200099711");

  expect(url).toMatchInlineSnapshot(`
    {
      "error": DOMException DOMException {
        "stack": "",
      },
      "url": "https://www.banatic.interieur.gouv.fr/consultation/intercommunalite?siren=200099711&page=1",
    }
  `);
});
