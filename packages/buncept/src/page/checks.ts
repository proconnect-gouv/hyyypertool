import type { Locator } from "../protocol";
import { find } from "./find";

// The functions below run in the page: they are sent as source text, so
// they must only use their arguments and each other through `find`.

export function see_in_page(root: Element | null, text: string) {
  const normalize = (value: string) =>
    value.replace(/\s+/g, " ").replace(/[’‘]/g, "'").trim();
  return (
    !!root &&
    normalize((root as HTMLElement).innerText).includes(normalize(text))
  );
}

export function field_value(root: Element | null, field: Locator) {
  return root
    ? (find("field", field, [], root) as HTMLInputElement | null)?.value
    : undefined;
}

export function element_in_page(root: Element | null, locator: Locator) {
  const element = root
    ? (find("text", locator, [], root) as HTMLElement)
    : null;
  return !!element && (element.offsetWidth > 0 || element.offsetHeight > 0);
}

// true when the focused element is the one `locator` names; otherwise what
// has focus, for the failure message
export function focused_in_page(root: Element | null, locator: Locator) {
  const active = document.activeElement as HTMLElement | null;
  if (root && active && find("click", locator, [], root) === active)
    return true;
  return active
    ? (active.getAttribute("aria-label") ?? active.innerText ?? "")
        .trim()
        .slice(0, 80) || active.tagName
    : null;
}

// true once checked; otherwise clicks the label, like a user, and reports
export function check_in_page(root: Element | null, field: Locator) {
  const input = root
    ? (find("field", field, [], root) as HTMLInputElement | null)
    : null;
  if (!input) return "element not found";
  if (input.checked) return true;
  (input.labels?.[0] ?? input).click();
  return false;
}

export function actionable(element: Element) {
  const style = getComputedStyle(element);
  const box = element as HTMLElement;
  return (
    style.display !== "none" &&
    style.visibility !== "hidden" &&
    box.offsetWidth > 0 &&
    box.offsetHeight > 0 &&
    !element.hasAttribute("disabled") &&
    !element.hasAttribute("readonly")
  );
}

// A pointer lands on whatever is painted at the element's centre; the
// in-page click does not, so check it the way a user's click would miss.
// A hit on the element's own label counts: clicking it activates the input.
export function covering(element: Element) {
  element.scrollIntoView({ block: "center", inline: "center" });
  const { height, left, top, width } = element.getBoundingClientRect();
  const hit = document.elementFromPoint(left + width / 2, top + height / 2);
  if (!hit || element.contains(hit)) return "";
  const labels = Array.from((element as HTMLInputElement).labels ?? []);
  if (labels.some((label) => label.contains(hit))) return "";
  return hit.outerHTML.slice(0, hit.outerHTML.indexOf(">") + 1);
}
