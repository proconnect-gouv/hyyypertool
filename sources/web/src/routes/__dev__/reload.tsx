//
// Live reload SSE endpoint for development
// Only active in development mode
//

import type { App_Context } from "#src/middleware/context";
import { Hono } from "hono";
import { streamSSE } from "hono/streaming";

//

type SSEStreamContext = { write: (message: string) => Promise<void> };
const clients = new Set<SSEStreamContext>();

export function notifyReload() {
  console.log(
    `[live-reload] Sending reload signal to ${clients.size} connected clients`,
  );

  for (const client of clients) {
    try {
      client.write("reload");
    } catch (error) {
      // Client disconnected
      clients.delete(client);
    }
  }
}

export default new Hono<App_Context>().get("/reload", (c) => {
  return streamSSE(c, async (stream) => {
    const client = {
      write: async (message: string) => {
        await stream.writeSSE({ data: message });
      },
    };

    clients.add(client);
    console.log(`[live-reload] Client connected (${clients.size} total)`);

    // Send initial connection message
    await stream.writeSSE({ data: "connected" });

    // Clean up when client disconnects
    c.req.raw.signal.addEventListener("abort", () => {
      clients.delete(client);
      console.log(
        `[live-reload] Client disconnected (${clients.size} remaining)`,
      );
    });

    // Keep connection alive with periodic pings
    while (true) {
      await stream.sleep(30000); // ping every 30 seconds
      await stream.writeSSE({ data: "ping" });
    }
  });
});
