//
// Live reload client script for development
// Automatically reloads the browser when the server restarts or assets rebuild
//

if (
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1"
) {
  let eventSource = new EventSource("/__dev__/reload");
  let isReloading = false;

  eventSource.onmessage = (event) => {
    if (event.data === "reload" && !isReloading) {
      isReloading = true;
      console.log("[live-reload] Reloading page...");
      window.location.reload();
    }
  };

  // When server restarts, SSE connection drops
  eventSource.onerror = async () => {
    if (isReloading) return;

    console.log("[live-reload] Connection lost, waiting for server...");
    eventSource.close();
    isReloading = true;

    // Wait for server to be ready
    let attempts = 0;
    const maxAttempts = 30;
    while (attempts < maxAttempts) {
      try {
        const response = await fetch("/__dev__/reload", {
          method: "HEAD",
        });
        if (response.ok || response.type === "opaque") {
          console.log("[live-reload] Server ready, reloading...");
          window.location.reload();
          return;
        }
      } catch (e) {
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
