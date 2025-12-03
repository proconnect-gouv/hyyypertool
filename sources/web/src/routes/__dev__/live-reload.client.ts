//
// Live reload client script for development
// Automatically reloads the browser when the server restarts or assets rebuild
//

let eventSource: EventSource | null = null;
let isReloading = false;

function connect() {
  if (eventSource) {
    eventSource.close();
  }

  eventSource = new EventSource("/__dev__/reload");

  eventSource.onmessage = (event) => {
    if (event.data === "reload" && !isReloading) {
      isReloading = true;
      console.log("[live-reload] Reloading page...");
      window.location.reload();
    }
  };

  // When server restarts, SSE connection drops
  // Use fetch to check if server is actually down vs just HTMX navigation
  eventSource.onerror = async () => {
    if (isReloading) return;
    eventSource?.close();

    // Quick check: is the server actually down?
    try {
      const response = await fetch("/__dev__/reload", { method: "HEAD" });
      if (response.ok) {
        // Server is up, just reconnect (likely HTMX navigation interrupted SSE)
        console.log("[live-reload] Reconnecting...");
        connect();
        return;
      }
    } catch {
      // Server is actually down, wait for it
    }

    console.log("[live-reload] Connection lost, waiting for server...");
    isReloading = true;

    // Wait for server to be ready
    let attempts = 0;
    const maxAttempts = 30;
    while (attempts < maxAttempts) {
      try {
        const response = await fetch("/__dev__/reload", { method: "HEAD" });
        if (response.ok || response.type === "opaque") {
          console.log("[live-reload] Server ready, reloading...");
          window.location.reload();
          return;
        }
      } catch {
        // Server not ready yet
      }
      await new Promise((resolve) => setTimeout(resolve, 200));
      attempts++;
    }
    console.error(
      "[live-reload] Server did not come back up, please refresh manually",
    );
  };
}

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  connect();
}
