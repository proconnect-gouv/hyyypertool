/* @jsxImportSource preact */
/**
 * Preact notification system (client-side)
 *
 * Usage:
 * @example
 * ```tsx
 * // Mount the component
 * import { render } from "preact";
 * import { NotificationContainer, notify } from "./notifications.client";
 *
 * render(<NotificationContainer />, document.getElementById("notifications")!);
 *
 * // Trigger notifications from anywhere
 * notify({ variant: "success", title: "Saved!", message: "Your changes have been saved." });
 * ```
 *
 * @example
 * ```javascript
 * // Or via window event (for compatibility with server-rendered code)
 * window.dispatchEvent(new CustomEvent('notify', {
 *   detail: {
 *     variant: 'danger',
 *     title: 'Error',
 *     message: 'Something went wrong'
 *   }
 * }))
 * ```
 */

import { signal } from "@preact/signals";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

//

type NotificationVariant = "danger" | "info" | "success" | "warning";

interface Notification {
  detail?: string;
  id: string;
  message?: string;
  title?: string;
  variant: NotificationVariant;
}

interface NotificationDetail {
  detail?: string;
  message?: string;
  title?: string;
  variant?: NotificationVariant;
}

//

const DISPLAY_DURATION = 8000;
const MAX_NOTIFICATIONS = 20;

let notificationCounter = 0;

// Global signal for notifications state
const notifications = signal<Notification[]>([]);

/**
 * Add a notification programmatically
 */
export function notify({
  detail,
  message,
  title,
  variant = "info",
}: NotificationDetail): string {
  const id = `notification-${++notificationCounter}`;
  const notification: Notification = { detail, id, message, title, variant };

  // Keep only the most recent notifications
  if (notifications.value.length >= MAX_NOTIFICATIONS) {
    notifications.value = [
      ...notifications.value.slice(-(MAX_NOTIFICATIONS - 1)),
      notification,
    ];
  } else {
    notifications.value = [...notifications.value, notification];
  }

  return id;
}

/**
 * Remove a notification by ID
 */
export function removeNotification(id: string): void {
  notifications.value = notifications.value.filter((n) => n.id !== id);
}

/**
 * Clear all notifications
 */
export function clearNotifications(): void {
  notifications.value = [];
}

/**
 * Reset notification counter (useful for tests)
 */
export function resetNotificationCounter(): void {
  notificationCounter = 0;
  notifications.value = [];
}

//

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const variantClass =
    notification.variant === "danger"
      ? "alert"
      : notification.variant === "success"
        ? "info"
        : notification.variant;

  const startDismissTimer = useCallback(() => {
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => removeNotification(notification.id), 300);
    }, DISPLAY_DURATION);
  }, [notification.id]);

  const pause = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const close = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => removeNotification(notification.id), 300);
  }, [notification.id]);

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true));
    startDismissTimer();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [startDismissTimer]);

  return (
    <div
      class={`fr-notice pointer-events-auto fr-notice--${variantClass} transition duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
      }`}
      id={notification.id}
      onMouseEnter={pause}
      role="alert"
    >
      <div class="fr-container">
        <div class="fr-notice__body">
          <p>
            <span class="fr-notice__title">{notification.title}</span>
            {notification.message && (
              <span class="fr-notice__desc">{notification.message}</span>
            )}
          </p>
          <button
            class="fr-btn--close fr-btn"
            onClick={close}
            title="Masquer le message"
            type="button"
          >
            Masquer le message
          </button>
        </div>
        {notification.detail && (
          <div class="fr-notice__body">
            <details class="mt-2 text-sm opacity-80">
              <summary class="cursor-pointer">Détails</summary>
              <pre class="mt-1 overflow-auto text-xs whitespace-pre-wrap">
                {notification.detail}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

//

/**
 * Container component that displays all notifications
 */
export function NotificationContainer() {
  // Listen for window 'notify' events for compatibility
  useEffect(() => {
    const handleNotify = (event: CustomEvent<NotificationDetail>) => {
      notify(event.detail);
    };

    window.addEventListener("notify", handleNotify as EventListener);
    return () => {
      window.removeEventListener("notify", handleNotify as EventListener);
    };
  }, []);

  return (
    <div class="pointer-events-none fixed bottom-4 left-4 z-50 flex max-w-full flex-col gap-2 md:max-w-md">
      {notifications.value.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
