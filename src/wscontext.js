import { createWS, createWSState } from "@solid-primitives/websocket";
import { createContext, createSignal, onCleanup, onMount } from "solid-js";

export const WSContext = createContext()
export const states = ["კავშირდება", "დაკავშირდა", "იხურება", "დაიხურა"];

export const WSProvider = (props) => {
    const [ctx, setCtx] = createSignal(null);
    onMount(async () => {
        let ws = createWS("ws://localhost:3000/ws");
        const state = createWSState(ws);
        const wsCtx = { ws, state, status: states[state()] };
        setCtx(wsCtx);

        const initialize_user = () => {
            ws.send(JSON.stringify({
                type: "INIT",
                cookie: document.cookie ?? null
            }))
        }

        const message = async (event) => {
            const { channel, type } = JSON.parse(event.data)
            if (channel === "ping") {
                ws.send(JSON.stringify({
                    type: "pong",
                }))
            } else if (channel === "status") {
                switch (type) {
                    case "update_status":
                        ws.send(JSON.stringify({
                            type: "share_status_update",
                        }))
                        break;
                }
            }
        }

        ws.addEventListener('open', initialize_user);
        ws.addEventListener('message', message)

        onCleanup(() => {
            ws.removeEventListener('open', initialize_user);
            ws.removeEventListener('message', message)
        })
    });

    return <WSContext.Provider value={ctx}>
        {props.children}
    </WSContext.Provider>
}