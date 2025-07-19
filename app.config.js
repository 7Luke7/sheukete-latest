import { defineConfig } from "@solidjs/start/config";
import solid from "vite-plugin-solid";

export default defineConfig({
  server: {
    prerender: {
      routes: ["/"] 
    },
    experimental: {
      websocket: true
    },
    esbuild: {
        options: {
            target: 'es2022'
        }
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