/**
 * PenguinUI-inspired Alpine.js notification system
 *
 * Usage:
 * Trigger notifications by dispatching a 'notify' event:
 *
 * @example
 * ```tsx
 * <button x-on:click="$dispatch('notify', {
 *   variant: 'success',
 *   title: 'Success!',
 *   message: 'Your changes have been saved.'
 * })">
 *   Save
 * </button>
 * ```
 *
 * @example
 * ```javascript
 * // From JavaScript
 * window.dispatchEvent(new CustomEvent('notify', {
 *   detail: {
 *     variant: 'danger',
 *     title: 'Error',
 *     message: 'Something went wrong'
 *   }
 * }))
 * ```
 */

import Alpine from "alpinejs";

type NotificationVariant = "info" | "success" | "warning" | "danger";

interface Notification {
  id: number;
  variant: NotificationVariant;
  title?: string;
  message?: string;
}

interface NotificationDetail {
  variant?: NotificationVariant;
  title?: string;
  message?: string;
}

const notificationSystem = {
  notifications: [] as Notification[],
  displayDuration: 8000,

  addNotification({
    variant = "info",
    title = undefined,
    message = undefined,
  }: NotificationDetail) {
    const id = Date.now();
    const notification: Notification = { id, variant, title, message };

    // Keep only the most recent 20 notifications
    if (this.notifications.length >= 20) {
      this.notifications.splice(0, this.notifications.length - 19);
    }

    // Add the new notification to the notifications stack
    this.notifications.push(notification);
  },

  removeNotification(id: number) {
    setTimeout(() => {
      this.notifications = this.notifications.filter(
        (notification) => notification.id !== id,
      );
    }, 400);
  },
};

// Register with Alpine.js
Alpine.data("notificationSystem", () => notificationSystem);
