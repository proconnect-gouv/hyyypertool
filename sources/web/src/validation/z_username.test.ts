//

import { expect, test } from "bun:test";
import { z_username } from "./z_username";

//

test("transform userinfo to username", () => {
  expect(
    z_username.parse({
      given_name: "Jean",
      usual_name: "Mich",
    }),
  ).toEqual("Jean Mich");
});
