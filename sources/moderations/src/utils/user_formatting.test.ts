//

import { expect, test } from "bun:test";
import { build_user_nickname, format_moderated_by } from "./user_formatting";

//

test("build_user_nickname formats name", () => {
  expect(
    build_user_nickname({
      given_name: "Jean",
      usual_name: "Dupont",
    }),
  ).toEqual("Jean Dupont");
});

test("format_moderated_by includes email", () => {
  expect(
    format_moderated_by({
      given_name: "Jean",
      usual_name: "Dupont",
      email: "jean@example.com",
    }),
  ).toEqual("Jean Dupont <jean@example.com>");
});
