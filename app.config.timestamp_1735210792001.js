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
  ssr: \u10E4\u10D0\u10DA\u10E1\u10D4
});
export {
  app_config_default as default
};
