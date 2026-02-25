/**
 * HTMX Event Handlers for Notification System
 *
 * This module sets up event listeners for HTMX errors and dispatches
 * notifications to the Preact NotificationContainer.
 *
 * The NotificationContainer listens for 'notify' custom events on the window.
 */

/**
 * Dispatch a notification event that the Preact NotificationContainer will handle
 */
function dispatchNotification({
  detail,
  variant = "info",
  title,
  message,
}: {
  detail?: string;
  variant?: "info" | "success" | "warning" | "danger";
  title?: string;
  message?: string;
}) {
  window.dispatchEvent(
    new CustomEvent("notify", {
      detail: { detail, variant, title, message },
    }),
  );
}

/**
 * Handle HTMX response errors (4xx, 5xx status codes)
 */
document.body.addEventListener("htmx:responseError", (event) => {
  const customEvent = event as CustomEvent;
  const xhr = customEvent.detail?.xhr as XMLHttpRequest | undefined;
  const status = xhr?.status;
  const responseText = xhr?.responseText;

  let title = "Une erreur est survenue !";
  let message: string | undefined;
  let detail: string | undefined;

  if (status) {
    if (status >= 500) {
      title = "Erreur serveur";
      message = `Le serveur a rencontré une erreur (${status})`;
    } else if (status >= 400) {
      title = "Erreur de requête";
      message = `La requête a échoué (${status})`;
    }
  }

  if (responseText) {
    try {
      const parsed = JSON.parse(responseText);
      detail = parsed.error?.message ?? JSON.stringify(parsed, null, 2);
    } catch {
      detail = responseText;
    }
  }

  dispatchNotification({
    detail,
    variant: "danger",
    title,
    message,
  });
});

/**
 * Handle HTMX network/send errors
 */
document.body.addEventListener("htmx:sendError", () => {
  dispatchNotification({
    variant: "danger",
    title: "Erreur de connexion",
    message: "Impossible de contacter le serveur. Vérifiez votre connexion.",
  });
});

/**
 * Handle HTMX timeout errors
 */
document.body.addEventListener("htmx:timeout", () => {
  dispatchNotification({
    variant: "warning",
    title: "Délai d'attente dépassé",
    message: "La requête a pris trop de temps.",
  });
});
