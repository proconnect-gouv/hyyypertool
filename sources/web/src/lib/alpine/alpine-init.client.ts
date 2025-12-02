/**
 * Alpine.js initialization
 *
 * Starts Alpine if not already started.
 * This should be loaded once in the root layout.
 */

import Alpine from "alpinejs";

// Start Alpine (only if not already started)
if (!Alpine.version) {
  Alpine.start();
}
