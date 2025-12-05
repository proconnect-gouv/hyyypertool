/**
 * HTMX Error Handler for Notification System
 *
 * Automatically shows error notifications when HTMX requests fail.
 * Listens to htmx:responseError events and dispatches notify events.
 */

// Listen for HTMX response errors
document.addEventListener('htmx:responseError', (event) => {
  const detail = (event as CustomEvent).detail;

  // Extract error information
  const status = detail.xhr?.status;
  const statusText = detail.xhr?.statusText;

  let title = 'Erreur';
  let message = 'Une erreur est survenue !';

  // Customize message based on status code
  if (status === 404) {
    title = 'Non trouvé';
    message = 'La ressource demandée n\'a pas été trouvée.';
  } else if (status === 403) {
    title = 'Accès refusé';
    message = 'Vous n\'avez pas les permissions nécessaires.';
  } else if (status === 500) {
    title = 'Erreur serveur';
    message = 'Une erreur est survenue sur le serveur.';
  } else if (status >= 400 && status < 500) {
    title = 'Erreur de requête';
    message = statusText || 'La requête n\'a pas pu être traitée.';
  } else if (status >= 500) {
    title = 'Erreur serveur';
    message = 'Le serveur a rencontré une erreur.';
  }

  // Dispatch notify event
  window.dispatchEvent(new CustomEvent('notify', {
    detail: {
      variant: 'danger',
      title,
      message,
    },
  }));
});
