import { defineConfig } from "@solidjs/start/config";

export default defineConfig({
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
})