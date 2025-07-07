  import { MetaProvider } from "@solidjs/meta";
  import { Router } from "@solidjs/router";
  import { FileRoutes } from "@solidjs/start/router";
  import { Suspense } from "solid-js";
  import { WSProvider } from "./wscontext";

  export default function App() {
    return (
      <Router
        root={(props) => {
          return (
            <WSProvider>
              <MetaProvider>
                <Suspense>{props.children}</Suspense>
              </MetaProvider>
            </WSProvider>
          );
        }}
      >
        <FileRoutes />
      </Router>
    );
  }
