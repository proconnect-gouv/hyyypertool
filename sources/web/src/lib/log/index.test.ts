//

import { afterEach, describe, expect, spyOn, test } from "bun:test";
import { createConsola } from "consola";
import { json_reporter } from ".";

//

const stdout = spyOn(console, "log").mockImplementation(() => {});
const stderr = spyOn(console, "error").mockImplementation(() => {});
const logger = createConsola({ level: 3, reporters: [json_reporter] });

const lines = (spy: typeof stdout) =>
  spy.mock.calls.map(([line]) => JSON.parse(String(line)));

afterEach(() => {
  stdout.mockClear();
  stderr.mockClear();
});

//

describe("json_reporter", () => {
  test("maps consola types to pino level names", () => {
    logger.success("seeded");
    logger.fail("lookup failed");

    expect(lines(stdout)).toMatchObject([{ level: "info", msg: "seeded" }]);
    expect(lines(stderr)).toMatchObject([
      { level: "error", msg: "lookup failed" },
    ]);
  });

  test("keeps a multi-line error on a single line", () => {
    logger.error("leaders:", new Error("boom"));

    const [line] = stderr.mock.calls.map(([line]) => String(line));
    expect(line).not.toContain("\n");
    expect(lines(stderr)[0].msg).toMatch(/^leaders: Error: boom\n {4}at /);
  });

  test("adds the exception fields with its cause chain", () => {
    const failure = new Error("Error from INSEE API", {
      cause: new TypeError("fetch failed", { cause: "ENOTFOUND" }),
    });
    logger.error(failure);

    expect(lines(stderr)).toMatchObject([
      {
        "exception.causes": [
          { message: "fetch failed", type: "TypeError" },
          { message: "ENOTFOUND" },
        ],
        "exception.message": "Error from INSEE API",
        "exception.stacktrace": failure.stack,
        "exception.type": "Error",
        level: "error",
      },
    ]);
  });

  test("drops debug lines below the consola level", () => {
    logger.debug("hidden at the info level");

    expect(stdout).not.toHaveBeenCalled();
  });
});
