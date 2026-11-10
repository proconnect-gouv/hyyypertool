//

import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { afterAll, beforeAll, expect, test } from "bun:test";

//

beforeAll(async () => {
  GlobalRegistrator.register();
  await import("./htmx.client");
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

function notification_for(xhr: {
  content_type: string;
  responseText: string;
  status: number;
}) {
  let notification: unknown;
  const listener = (event: Event) => {
    notification = (event as CustomEvent).detail;
  };
  window.addEventListener("notify", listener);
  document.body.dispatchEvent(
    new CustomEvent("htmx:responseError", {
      detail: {
        xhr: {
          getResponseHeader: () => xhr.content_type,
          responseText: xhr.responseText,
          status: xhr.status,
        },
      },
    }),
  );
  window.removeEventListener("notify", listener);
  return notification;
}

//

test("shows a plain text error as the notification message", () => {
  expect(
    notification_for({
      content_type: "text/plain; charset=UTF-8",
      responseText: "L'utilisateur n'a pas de données FranceConnect.",
      status: 404,
    }),
  ).toEqual({
    detail: undefined,
    message: "L'utilisateur n'a pas de données FranceConnect.",
    title: "Erreur de requête",
    variant: "danger",
  });
});

test("keeps an html page out of the notification", () => {
  expect(
    notification_for({
      content_type: "text/html; charset=UTF-8",
      responseText: "<!DOCTYPE html><html><body>Oups</body></html>",
      status: 404,
    }),
  ).toEqual({
    detail: undefined,
    message: "La requête a échoué (404)",
    title: "Erreur de requête",
    variant: "danger",
  });
});
