/**
 * Alpine.js initialization
 *
 * Note: Alpine.js is no longer used for notifications (replaced by Preact islands).
 * Keeping Alpine.js for potential future use, but only loading HTMX error handler.
 */

import Alpine from "alpinejs";

// Import HTMX error handler (dispatches notify events for Preact NotificationContainer)
import "./htmx-notifications.client";

// Old Alpine.js notification system removed - replaced by Preact NotificationContainer
// import "./notifications.client";

// see https://alpinejs.dev/essentials/installation#as-a-module
Alpine.start();
