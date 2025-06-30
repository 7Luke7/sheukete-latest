import { defineConfig } from "@solidjs/start/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  server: {
    experimental: {
      websocket: true
    }
  },
  plugins: [
    solid({
      ssr: true,
    })
  ],
}).addRouter({
  name: "ws",
  type: "http",
  handler: "./src/server/ws.js",
  target: "server",
  base: "/ws",
});