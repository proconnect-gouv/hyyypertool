/* @jsxImportSource preact */
import { GlobalRegistrator } from "@happy-dom/global-registrator";
import { cleanup, render, waitFor } from "@testing-library/preact";
import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  expect,
  test,
} from "bun:test";
import {
  clearNotifications,
  NotificationContainer,
  notify,
  removeNotification,
  resetNotificationCounter,
} from "./notifications.client";

//

beforeAll(() => {
  GlobalRegistrator.register();
});

beforeEach(() => {
  resetNotificationCounter();
});

afterEach(() => {
  cleanup();
  clearNotifications();
});

afterAll(() => {
  GlobalRegistrator.unregister();
});

//

test("NotificationContainer: renders empty container", () => {
  const { container } = render(<NotificationContainer />);

  expect(container.querySelector(".fixed.bottom-4")).not.toBeNull();
  expect(container.querySelectorAll("[role='alert']")).toHaveLength(0);
});

test("notify: adds a notification", async () => {
  const { container } = render(<NotificationContainer />);

  notify({
    message: "Operation completed successfully",
    title: "Success!",
    variant: "success",
  });

  await waitFor(() => {
    expect(container.querySelector("[role='alert']")).not.toBeNull();
  });

  expect(container.textContent).toContain("Success!");
  expect(container.textContent).toContain("Operation completed successfully");
});

test("notify: returns notification ID", async () => {
  const { container } = render(<NotificationContainer />);

  const id1 = notify({ title: "First", variant: "info" });
  const id2 = notify({ title: "Second", variant: "info" });

  expect(id1).toBe("notification-1");
  expect(id2).toBe("notification-2");

  await waitFor(() => {
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(2);
  });
});

test("notify: displays different variants", async () => {
  const { container } = render(<NotificationContainer />);

  notify({ title: "Info", variant: "info" });
  notify({ title: "Success", variant: "success" });
  notify({ title: "Warning", variant: "warning" });
  notify({ title: "Danger", variant: "danger" });

  await waitFor(() => {
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(4);
  });

  // Check variant classes (success maps to "info", danger maps to "alert")
  expect(container.querySelector(".fr-notice--info")).not.toBeNull();
  expect(container.querySelector(".fr-notice--warning")).not.toBeNull();
  expect(container.querySelector(".fr-notice--alert")).not.toBeNull();
});

test("removeNotification: removes a specific notification", async () => {
  const { container } = render(<NotificationContainer />);

  const id1 = notify({ title: "First", variant: "info" });
  notify({ title: "Second", variant: "info" });

  await waitFor(() => {
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(2);
  });

  removeNotification(id1);

  await waitFor(() => {
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(1);
  });

  expect(container.textContent).not.toContain("First");
  expect(container.textContent).toContain("Second");
});

test("clearNotifications: removes all notifications", async () => {
  const { container } = render(<NotificationContainer />);

  notify({ title: "First", variant: "info" });
  notify({ title: "Second", variant: "info" });
  notify({ title: "Third", variant: "info" });

  await waitFor(() => {
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(3);
  });

  clearNotifications();

  await waitFor(() => {
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(0);
  });
});

test("notify: limits to MAX_NOTIFICATIONS (20)", async () => {
  const { container } = render(<NotificationContainer />);

  // Add 25 notifications
  for (let i = 0; i < 25; i++) {
    notify({ title: `Item-${i + 1}-end`, variant: "info" });
  }

  await waitFor(() => {
    expect(container.querySelectorAll("[role='alert']")).toHaveLength(20);
  });

  // First 5 should be removed (items 1-5), items 6-25 should remain
  expect(container.textContent).not.toContain("Item-1-end");
  expect(container.textContent).not.toContain("Item-5-end");
  expect(container.textContent).toContain("Item-6-end");
  expect(container.textContent).toContain("Item-25-end");
});

test("window notify event: triggers notification", async () => {
  const { container } = render(<NotificationContainer />);

  window.dispatchEvent(
    new CustomEvent("notify", {
      detail: {
        message: "Event-based notification",
        title: "Event!",
        variant: "warning",
      },
    }),
  );

  await waitFor(() => {
    expect(container.querySelector("[role='alert']")).not.toBeNull();
  });

  expect(container.textContent).toContain("Event!");
  expect(container.textContent).toContain("Event-based notification");
});

test("notification: displays without message", async () => {
  const { container } = render(<NotificationContainer />);

  notify({ title: "Title only", variant: "info" });

  await waitFor(() => {
    expect(container.querySelector("[role='alert']")).not.toBeNull();
  });

  expect(container.textContent).toContain("Title only");
  // Should not have a description span with content
  const descSpan = container.querySelector(".fr-notice__desc");
  expect(descSpan).toBeNull();
});

test("resetNotificationCounter: resets ID counter", async () => {
  const { container } = render(<NotificationContainer />);

  notify({ title: "First", variant: "info" });

  await waitFor(() => {
    expect(container.querySelector("#notification-1")).not.toBeNull();
  });

  cleanup();
  clearNotifications();
  resetNotificationCounter();

  const { container: container2 } = render(<NotificationContainer />);
  notify({ title: "After reset", variant: "info" });

  await waitFor(() => {
    // After reset, counter starts at 1 again
    expect(container2.querySelector("#notification-1")).not.toBeNull();
  });
});
