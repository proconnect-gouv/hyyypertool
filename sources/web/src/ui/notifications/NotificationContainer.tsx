/**
 * Notification Container Component
 *
 * Displays toast notifications using DSFR notice components.
 * Based on DSFR notice design system.
 */

export function NotificationContainer() {
  return (
    <div
      x-data="notificationSystem"
      {...{
        "x-on:notify.window": `addNotification({
          variant: $event.detail.variant,
          title: $event.detail.title,
          message: $event.detail.message,
        })`,
      }}
    >
      <div
        x-on:mouseenter="$dispatch('pause-auto-dismiss')"
        x-on:mouseleave="$dispatch('resume-auto-dismiss')"
        class="pointer-events-none fixed bottom-4 left-4 z-50 flex max-w-full flex-col gap-2 md:max-w-md"
      >
        <template x-for="notification in notifications" x-bind:key="notification.id">
          <div
            x-data="{ isVisible: false, timeout: null }"
            x-cloak
            x-show="isVisible"
            x-bind:class={`'fr-notice pointer-events-auto fr-notice--' + (notification.variant === 'danger' ? 'alert' : notification.variant === 'success' ? 'info' : notification.variant)`}
            role="alert"
            {...{
              "x-on:pause-auto-dismiss.window": "clearTimeout(timeout)",
              "x-on:resume-auto-dismiss.window":
                "timeout = setTimeout(() => {(isVisible = false), removeNotification(notification.id) }, displayDuration)",
            }}
            x-init="$nextTick(() => { isVisible = true }), (timeout = setTimeout(() => { isVisible = false, removeNotification(notification.id)}, displayDuration))"
            x-transition:enter="transition duration-300 ease-out"
            x-transition:enter-end="translate-y-0"
            x-transition:enter-start="-translate-y-8"
            x-transition:leave="transition duration-300 ease-in"
            x-transition:leave-end="translate-x-full opacity-0"
            x-transition:leave-start="translate-x-0 opacity-100"
          >
            <div class="fr-container">
              <div class="fr-notice__body">
                <p>
                  <span class="fr-notice__title" x-text="notification.title"></span>
                  <span class="fr-notice__desc" x-show="notification.message" x-text="notification.message"></span>
                </p>
                <button
                  type="button"
                  class="fr-btn--close fr-btn"
                  title="Masquer le message"
                  x-on:click="(isVisible = false), removeNotification(notification.id)"
                >
                  Masquer le message
                </button>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  );
}
