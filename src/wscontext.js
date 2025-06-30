import { createWS, createWSState } from "@solid-primitives/websocket";
import { createContext, createSignal, onCleanup, onMount } from "solid-js";

export const WSContext = createContext()
export const states = ["კავშირდება", "დაკავშირდა", "იხურება", "დაიხურა"];

export const WSProvider = (props) => {
    const [ctx, setCtx] = createSignal(null);
    onMount(() => {
        const ws = createWS("ws://localhost:3000/ws");
        const state = createWSState(ws);
        const wsCtx = { ws, state, status: states[state()] };
        setCtx(wsCtx);

        ws.addEventListener('open', () => {
            ws.send(JSON.stringify({
                type: "INIT",
                cookie: document.cookie ?? null
            }))
        });
    });

    onCleanup(() => {
        ctx()?.ws?.close(1000, "disconnect-all");
    });
    return <WSContext.Provider value={ctx}>
        {props.children}
    </WSContext.Provider>
}