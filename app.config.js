import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
  server: {
    experimental: {
      websocket: true,
    }
  },
  vite({ router }) {
    if (router === "server") {
     
    } else if (router === "client") {
      // Client-specific settings
    } else if (router === "server-function") {
      // Server function-specific settings
    }
    return { plugins: [] };
  },
  ssr: true
}).addRouter({
  name: "ws",
  type: "http",
  handler: "./src/api/ws.js",
  target: "server",
  base: "/ws",
});