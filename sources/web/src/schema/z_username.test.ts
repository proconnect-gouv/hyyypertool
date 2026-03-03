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

test("handles null given_name", () => {
  expect(
    z_username.parse({
      given_name: null,
      usual_name: "Mich",
    }),
  ).toEqual("Mich");
});

test("handles null usual_name", () => {
  expect(
    z_username.parse({
      given_name: "Jean",
      usual_name: null,
    }),
  ).toEqual("Jean");
});

test("handles both null values", () => {
  expect(
    z_username.parse({
      given_name: null,
      usual_name: null,
    }),
  ).toEqual("");
});
