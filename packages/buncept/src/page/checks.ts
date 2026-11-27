import type { ActOutcome, Kind, Locator } from "../protocol";
import { find } from "./find";
import { loaded } from "./loaded";
import { normalize } from "./normalize";

export function see(scopes: Locator[], text: string) {
  const root = find("text", null, scopes);
  return (
    !!root &&
    normalize((root as HTMLElement).innerText).includes(normalize(text))
  );
}

export function field_value(scopes: Locator[], field: Locator) {
  return (find("field", field, scopes) as HTMLInputElement | null)?.value;
}

export function see_element(scopes: Locator[], locator: Locator) {
  const element = find("text", locator, scopes) as HTMLElement | null;
  return !!element && (element.offsetWidth > 0 || element.offsetHeight > 0);
}

// true when the focused element is the one `locator` names; otherwise what
// has focus, for the failure message
export function focused(scopes: Locator[], locator: Locator) {
  const active = document.activeElement as HTMLElement | null;
  if (active && find("click", locator, scopes) === active) return true;
  return active
    ? (active.getAttribute("aria-label") ?? active.innerText ?? "")
        .trim()
        .slice(0, 80) || active.tagName
    : null;
}

// true once checked; otherwise clicks the label, like a user, and reports
export function check(scopes: Locator[], field: Locator) {
  const input = find("field", field, scopes) as HTMLInputElement | null;
  if (!input) return "element not found";
  if (input.checked) return true;
  (input.labels?.[0] ?? input).click();
  return false;
}

const actions = {
  click: {
    kind: "click",
    run: (element: Element) => (element as HTMLElement).click(),
  },
  select_field: {
    kind: "field",
    run: (element: Element) => {
      const input = element as HTMLInputElement;
      input.focus();
      input.click();
      input.select?.();
    },
  },
} as const satisfies Record<
  string,
  { kind: Kind; run: (element: Element) => void }
>;

export type Action = keyof typeof actions;

export function act(
  action: Action,
  scopes: Locator[],
  locator: Locator,
): ActOutcome {
  const { kind, run } = actions[action];
  const element = target(kind, locator, scopes);
  if (typeof element === "string") return element;
  run(element);
  return "ok";
}

function target(
  kind: Kind,
  locator: Locator,
  scopes: Locator[],
): Element | Exclude<ActOutcome, "ok"> {
  if (!loaded()) return "page still loading";
  const element = find(kind, locator, scopes);
  if (!element) return "element not found";
  if (!actionable(element)) return "element not visible or not enabled";
  if (kind === "click") {
    const cover = covering(element);
    if (cover) return `element covered by ${cover}`;
  }
  return element;
}

function actionable(element: Element) {
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
function covering(element: Element) {
  element.scrollIntoView({ block: "center", inline: "center" });
  const { height, left, top, width } = element.getBoundingClientRect();
  const hit = document.elementFromPoint(left + width / 2, top + height / 2);
  if (!hit || element.contains(hit)) return "";
  const labels = Array.from((element as HTMLInputElement).labels ?? []);
  if (labels.some((label) => label.contains(hit))) return "";
  return hit.outerHTML.slice(0, hit.outerHTML.indexOf(">") + 1);
}
