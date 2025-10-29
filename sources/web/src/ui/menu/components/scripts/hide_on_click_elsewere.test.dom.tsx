//

import { expect, test } from "bun:test";
import _hyperscript from "hyperscript.org";
import "hyperscript.org/src/hdb";
import { hide_on_click_elsewere } from "./hide_on_click_elsewere";

//

test("hide on click elsewere", () => {
  document.body.innerHTML = (
    <>
      <div _={hide_on_click_elsewere("#ike")}></div>
      <div id="ike"></div>
    </>
  ).toString();

  _hyperscript.processNode(document.body);

  const ike = document.querySelector("#ike")!;

  expect(ike.hasAttribute("hidden")).toBeFalse();
  document.body.click();

  expect(ike.hasAttribute("hidden")).toBeTrue();
});
