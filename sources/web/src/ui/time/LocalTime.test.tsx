//

import { expect, test } from "bun:test";
import { LocalTime } from "./LocalTime";

//

test("LocalTime > 1970", () => {
  expect((<LocalTime date={new Date(0)} />).toString()).toBe(
    (
      <time
        datetime="1970-01-01T00:00:00.000Z"
        title="Thu Jan 01 1970 01:00:00 GMT+0100 (Central European Standard Time)"
      >
        01/01/1970 01:00:00{" "}
      </time>
    ).toString(),
  );
});

test.each([[undefined], [null], [""]])(
  "LocalTime > %p",
  (date_like: Date | null | undefined | string) => {
    expect((<LocalTime date={date_like} />).toString()).toBe("");
  },
);
