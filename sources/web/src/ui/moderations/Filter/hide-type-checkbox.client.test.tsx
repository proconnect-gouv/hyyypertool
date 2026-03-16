/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, fireEvent, render } from "@testing-library/preact";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
} from "bun:test";
import { HideTypeCheckbox } from "./hide-type-checkbox.client";
import { text } from "./q-signal.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

beforeEach(() => {
  text.value = "";
  const input = document.createElement("input");
  input.id = "q";
  document.body.appendChild(input);
});

afterEach(() => {
  cleanup();
  document.body.innerHTML = "";
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

describe("HideTypeCheckbox — non_verified_domain", () => {
  test("unchecked by default", () => {
    const { container } = render(
      <HideTypeCheckbox qualifier="non_verified_domain" label="Hide NVD" />,
    );
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  test("checked when q has -type:non_verified_domain", () => {
    text.value = "-type:non_verified_domain";
    const { container } = render(
      <HideTypeCheckbox qualifier="non_verified_domain" label="Hide NVD" />,
    );
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("adds token to q when checked", () => {
    const { container } = render(
      <HideTypeCheckbox qualifier="non_verified_domain" label="Hide NVD" />,
    );
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;

    fireEvent.change(checkbox, { target: { checked: true } });
    expect(text.value).toContain("-type:non_verified_domain");
  });

  test("removes token from q when unchecked", () => {
    text.value = "-type:non_verified_domain";
    const { container } = render(
      <HideTypeCheckbox qualifier="non_verified_domain" label="Hide NVD" />,
    );
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;

    fireEvent.change(checkbox, { target: { checked: false } });
    expect(text.value).not.toContain("-type:non_verified_domain");
  });
});

describe("HideTypeCheckbox — organization_join_block", () => {
  test("checked when q has -type:organization_join_block", () => {
    text.value = "-type:organization_join_block";
    const { container } = render(
      <HideTypeCheckbox qualifier="organization_join_block" label="Hide OJB" />,
    );
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test("adds token to q when checked", () => {
    const { container } = render(
      <HideTypeCheckbox qualifier="organization_join_block" label="Hide OJB" />,
    );
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;

    fireEvent.change(checkbox, { target: { checked: true } });
    expect(text.value).toContain("-type:organization_join_block");
  });

  test("does not affect the other qualifier", () => {
    text.value = "-type:non_verified_domain";
    const { container } = render(
      <HideTypeCheckbox qualifier="organization_join_block" label="Hide OJB" />,
    );
    const checkbox = container.querySelector(
      "input[type='checkbox']",
    ) as HTMLInputElement;

    fireEvent.change(checkbox, { target: { checked: true } });
    expect(text.value).toContain("-type:non_verified_domain");
    expect(text.value).toContain("-type:organization_join_block");
  });
});
