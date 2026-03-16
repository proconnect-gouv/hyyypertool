/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { dispatch_change, parsed, text, update_q } from "./q-signal.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

beforeEach(() => {
  text.value = "";
  // Create a #q element for dispatch_change to target
  const input = document.createElement("input");
  input.id = "q";
  document.body.appendChild(input);
});

afterEach(() => {
  document.body.innerHTML = "";
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

describe("parsed", () => {
  test("derives from text signal", () => {
    text.value = "email:foo@bar.com";
    expect(parsed.value.search_email).toBe("foo@bar.com");
  });

  test("returns defaults for empty text", () => {
    expect(parsed.value.search_email).toBe("");
    expect(parsed.value.search_siret).toBe("");
    expect(parsed.value.processed_requests).toBeUndefined();
    expect(parsed.value.hide_non_verified_domain).toBe(false);
  });

  test("recomputes when text changes", () => {
    text.value = "siret:12345";
    expect(parsed.value.search_siret).toBe("12345");

    text.value = "email:test@test.com siret:99999";
    expect(parsed.value.search_siret).toBe("99999");
    expect(parsed.value.search_email).toBe("test@test.com");
  });
});

describe("update_q", () => {
  test("mutates and serializes back to text", () => {
    update_q((s) => {
      s.search_email = "test@example.com";
    });

    expect(text.value).toContain("email:test@example.com");
    expect(parsed.value.search_email).toBe("test@example.com");
  });

  test("preserves existing tokens", () => {
    text.value = "is:processed siret:123";

    update_q((s) => {
      s.search_email = "a@b.com";
    });

    expect(parsed.value.search_email).toBe("a@b.com");
    expect(parsed.value.search_siret).toBe("123");
    expect(parsed.value.processed_requests).toBe(true);
  });

  test("clears a field by setting empty string", () => {
    text.value = "email:old@test.com siret:456";

    update_q((s) => {
      s.search_email = "";
    });

    expect(parsed.value.search_email).toBe("");
    expect(parsed.value.search_siret).toBe("456");
    expect(text.value).not.toContain("email:");
  });
});

describe("dispatch_change", () => {
  test("dispatches change event on #q element", () => {
    let fired = false;
    document.getElementById("q")!.addEventListener("change", () => {
      fired = true;
    });

    dispatch_change();
    expect(fired).toBe(true);
  });

  test("does not throw when #q is missing", () => {
    document.body.innerHTML = "";
    expect(() => dispatch_change()).not.toThrow();
  });
});
