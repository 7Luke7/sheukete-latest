import { createWS, createWSState } from "@solid-primitives/websocket";
import { MetaProvider } from "@solidjs/meta";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { onMount, Suspense } from "solid-js";

export class WSContext {
  constructor(ws, state) {
    this.ws = ws;
    this.state = state;
    this.Subscriptions = new Set();
  }
  send(message) {
    switch (message.type) {
      case "JSON": {
        this.ws.send(JSON.stringify(message));
      }
      case "blob": {
        this.ws.send(new Blob(message));
      }
    }
  }
  subscribe(type, topic) {
    if (!this.Subscriptions.has(type)) {
      ws.send(
        JSON.stringify({
          type,
          topic,
        })
      );
      this.Subscriptions.add(type);
    }
  }
  unsubscribe(type, topic) {
    if (this.Subscriptions.has(type)) {
      ws.send(
        JSON.stringify({
          type,
          topic,
        })
      );
      this.Subscriptions.delete(type);
    }
  }
}

export const states = ["კავშირდება", "დაკავშირდა", "იხურება", "დაიხურა"];

export default function App() {
  onMount(() => {
    const ws = createWS("ws://localhost:3000/ws");
    const state = createWSState(ws);

    new WSContext(ws, states[state()])
  });
  return (
    <Router
      root={(props) => {
        return (
          <MetaProvider>
            <Suspense>{props.children}</Suspense>
          </MetaProvider>
        );
      }}
    >
      <FileRoutes />
    </Router>
  );
}
