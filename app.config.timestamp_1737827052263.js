// app.config.js
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  server: {
    experimental: {
      websocket: true
    }
  },
  vite({ router }) {
    if (router === "server") {
    } else if (router === "client") {
    } else if (router === "server-function") {
    }
    return { plugins: [] };
  },
  ssr: true
})``;
export {
  app_config_default as default
};
