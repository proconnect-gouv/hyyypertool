/**
 * Alpine.js clipboard utilities
 * Provides methods for copying values and text content to clipboard
 */

export const clipboard = {
  /**
   * Copies the value of an input element to the clipboard
   * @param selector - CSS selector for the input element
   */
  copyValue(selector: string) {
    const el = document.querySelector(selector) as HTMLInputElement;
    if (el?.value) {
      navigator.clipboard.writeText(el.value);
    }
  },

  /**
   * Copies the text content of an element to the clipboard
   * @param selector - CSS selector for the element
   */
  copyText(selector: string) {
    const el = document.querySelector(selector);
    const text = el?.textContent?.trim() ?? "";
    if (text) {
      navigator.clipboard.writeText(text);
    }
  },
};
