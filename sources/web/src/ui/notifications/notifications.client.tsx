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
  id: string;
  message?: string;
  title?: string;
  variant: NotificationVariant;
}

interface NotificationDetail {
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
  message,
  title,
  variant = "info",
}: NotificationDetail): string {
  const id = `notification-${++notificationCounter}`;
  const notification: Notification = { id, message, title, variant };

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

const VARIANT_STYLES: Record<NotificationVariant, string> = {
  danger: "bg-[#ffe9e9] text-[#ce0500]",
  info: "bg-[#e8edff] text-[#0063cb]",
  success: "bg-[#b8fec9] text-[#18753c]",
  warning: "bg-[#ffe9e6] text-[#b34000]",
};

interface NotificationItemProps {
  notification: Notification;
}

function NotificationItem({ notification }: NotificationItemProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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
      class={`relative py-4 pointer-events-auto ${VARIANT_STYLES[notification.variant]} transition duration-300 ${
        isVisible ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
      }`}
      id={notification.id}
      onMouseEnter={pause}
      onMouseLeave={startDismissTimer}
      role="alert"
    >
      <div class="max-w-7xl mx-auto px-4">
        <div class="relative flex flex-row items-start justify-between">
          <p>
            <span class="relative mr-1 font-bold">{notification.title}</span>
            {notification.message && (
              <span class="text-sm">{notification.message}</span>
            )}
          </p>
          <button
            class="text-sm leading-6 min-h-8 px-3 py-1 ml-auto bg-transparent hover:bg-black/5"
            onClick={close}
            title="Masquer le message"
            type="button"
          >
            Masquer le message
          </button>
        </div>
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
