//

import { expect, test } from "bun:test";
import { GetBanaticUrl } from "./GetBanaticUrl";

//

//

const BASE_URL = "https://www.banatic.interieur.gouv.fr";

test("should return specific banatic url", async () => {
  const get_banatic_url = GetBanaticUrl({
    banatic_base_url: BASE_URL,
    fetch: async () => new Response(null, { status: 200 }),
    http_timout: 3_000,
  });

  const url = await get_banatic_url("200099711");

  expect(url).toEqual({
    url: "https://www.banatic.interieur.gouv.fr/intercommunalite/200099711",
  });
});

test("should return default banatic url on non-ok response", async () => {
  const get_banatic_url = GetBanaticUrl({
    banatic_base_url: BASE_URL,
    fetch: async () => new Response(null, { status: 404 }),
    http_timout: 3_000,
  });

  const url = await get_banatic_url("123456789");

  expect(url).toEqual({
    url: "https://www.banatic.interieur.gouv.fr/consultation/intercommunalite?siren=123456789&page=1",
  });
});

test("should return default error on timeout", async () => {
  const get_banatic_url = GetBanaticUrl({
    banatic_base_url: BASE_URL,
    fetch: async () => {
      throw new DOMException("The operation was aborted.", "TimeoutError");
    },
    http_timout: 0,
  });

  const url = await get_banatic_url("200099711");

  expect(url.url).toBe(
    "https://www.banatic.interieur.gouv.fr/consultation/intercommunalite?siren=200099711&page=1",
  );
  expect("error" in url).toBe(true);
});
