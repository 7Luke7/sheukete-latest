// app.config.js
import { defineConfig } from "@solidjs/start/config";
var app_config_default = defineConfig({
  vite({ router }) {
    if (router === "server") {
    } else if (router === "client") {
    } else if (router === "server-function") {
    }
    return { plugins: [] };
  },
  ssr: \u0432\u0444\u0434\u044B\u0443
});
export {
  app_config_default as default
};
