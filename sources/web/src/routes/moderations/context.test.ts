//

import { expect, test } from "bun:test";
import { Search_Schema } from "./context";

//

test("Search_Schema > empty object", () => {
  const search = Search_Schema.parse({});

  expect(search).toEqual({
    search_siret: "",
    search_email: "",
    processed_requests: false,
    hide_non_verified_domain: false,
    hide_join_organization: false,
  });
});

test("Search_Schema > day 2011-01-11", () => {
  const search = Search_Schema.parse({ day: "2011-01-11" });

  expect(search).toEqual({
    day: new Date("2011-01-11"),
    search_siret: "",
    search_email: "",
    processed_requests: false,
    hide_non_verified_domain: false,
    hide_join_organization: false,
  });
});
