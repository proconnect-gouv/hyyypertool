import type { Kind, Locator } from "../protocol";
import { normalize } from "./normalize";

// Resolves a locator inside the `scopes` chain, the way CodeceptJS does for
// click and fillField, plus a last-resort click on any visible text.
// `kind: "text"` with a null locator returns the innermost scope itself.
export function find(
  kind: Kind,
  locator: Locator | null,
  scopes: Locator[],
  start: Element = document.body,
): Element | null {
  const visible = (element: Element) =>
    (element as HTMLElement).offsetWidth > 0 ||
    (element as HTMLElement).offsetHeight > 0;
  const all = (root: Element, selector: string) =>
    Array.from(root.querySelectorAll(selector));
  const innermost = (elements: Element[]) =>
    elements.find(
      (element) =>
        !elements.some((other) => other !== element && element.contains(other)),
    ) ?? null;

  const resolve = (
    root: Element,
    kind: Kind,
    locator: Locator,
  ): Element | null => {
    if (typeof locator !== "string") {
      if ("role" in locator) {
        const implicit_role_selectors: Record<string, string> = {
          button: "button, input[type=button], input[type=submit]",
          checkbox: "input[type=checkbox]",
          combobox: "select",
          dialog: "dialog",
          heading: "h1, h2, h3, h4, h5, h6",
          link: "a[href]",
          radio: "input[type=radio]",
          row: "tr",
          textbox:
            "input:not([type]), input[type=text], input[type=email], textarea",
        };
        const selector = [
          `[role="${locator.role}"]`,
          implicit_role_selectors[locator.role],
        ]
          .filter(Boolean)
          .join(", ");
        const name = (element: Element) =>
          [
            element.getAttribute("aria-label"),
            Array.from((element as HTMLInputElement).labels ?? [])
              .map((label) => label.textContent)
              .join(" "),
            element.textContent,
            element.getAttribute("title"),
            (element as HTMLInputElement).value,
          ]
            .map(normalize)
            .find(Boolean) ?? "";
        return (
          all(root, selector).find(
            (element) =>
              locator.name === undefined ||
              name(element) === normalize(locator.name),
          ) ?? null
        );
      }
      if ("css" in locator) return root.querySelector(locator.css);
      const row = normalize(locator.row);
      return (
        all(root, "tr").find((tr) => normalize(tr.textContent).includes(row)) ??
        null
      );
    }
    // CodeceptJS "~label": the element whose aria-label is exactly label
    if (locator.startsWith("~")) {
      const label = normalize(locator.slice(1));
      return (
        all(root, "[aria-label]").find(
          (element) => normalize(element.getAttribute("aria-label")) === label,
        ) ?? null
      );
    }
    const text = normalize(locator);
    if (kind === "field") {
      const fields = all(root, "input, textarea, select");
      const by = (read: (field: Element) => string | null | undefined) =>
        fields.find((field) => normalize(read(field)) === text);
      return (
        by((field) =>
          Array.from((field as HTMLInputElement).labels ?? [])
            .map((label) => label.textContent)
            .join(" "),
        ) ??
        by((field) => field.getAttribute("placeholder")) ??
        by((field) => field.getAttribute("aria-label")) ??
        by((field) => field.getAttribute("name")) ??
        by((field) => field.getAttribute("title")) ??
        null
      );
    }
    if (kind === "click") {
      const clickables = all(
        root,
        "a, button, [role=button], [role=link], input[type=submit], input[type=button]",
      ).filter(visible);
      const label = (element: Element) =>
        normalize(element.textContent) ||
        normalize((element as HTMLInputElement).value);
      return (
        clickables.find((element) => label(element) === text) ??
        clickables.find((element) => label(element).includes(text)) ??
        all(root, "[aria-label]").find(
          (element) => normalize(element.getAttribute("aria-label")) === text,
        ) ??
        all(root, "[title]").find(
          (element) => normalize(element.getAttribute("title")) === text,
        ) ??
        all(root, "label").find((element) =>
          normalize(element.textContent).includes(text),
        ) ??
        innermost(
          all(root, "*").filter(
            (element) =>
              visible(element) && normalize(element.textContent).includes(text),
          ),
        )
      );
    }
    // A scope: an aria-label, else the innermost element showing the text
    return (
      all(root, "[aria-label]").find((element) =>
        normalize(element.getAttribute("aria-label")).includes(text),
      ) ??
      innermost(
        all(root, "*").filter(
          (element) =>
            visible(element) && normalize(element.textContent).includes(text),
        ),
      )
    );
  };

  let root: Element | null = start;
  for (const scope of scopes) {
    root = resolve(root, "text", scope);
    if (!root) return null;
  }
  return locator === null ? root : resolve(root, kind, locator);
}
