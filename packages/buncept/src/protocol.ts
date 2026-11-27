// CodeceptJS locators — https://codecept.io/locators/
// A string is matched the way a user reads the page; objects are strict.
export type Locator =
  string | { css: string } | { role: string; name?: string } | { row: string };

export type Kind = "click" | "field" | "text";

export type ActOutcome =
  | "element not found"
  | "element not visible or not enabled"
  | "ok"
  | "page still loading"
  | `element covered by ${string}`;
