import { A, createAsync } from "@solidjs/router"
import { createEffect, createSignal, For, Match, onCleanup, Switch, useContext } from "solid-js"
import { get_user_convos } from "./api/messages/conversations"
import { WSContext } from "~/wscontext"
import { createStore, produce } from "solid-js/store"
import { get_image_based_on_size } from "~/Components/utils"

const Message = (props) => {
    const convos = createAsync(get_user_convos)
    const [input, setInput] = createSignal("")
    const [convoStore, setConvoStore] = createStore({
        convos: []
    })
    const ctx = useContext(WSContext)
    let ws

    createEffect(() => {
        if (convos() === 400) return;
        if (ctx()) ws = ctx().ws
        setConvoStore("convos", convos()?.convos || [])
        ws.send(JSON.stringify({
            type: "convo",
            action: "join",
            convo: convos()?.convos.map(c => c.conversation_id),
        }))
        const get_message = (event) => {
            const data = JSON.parse(event.data)

            if (data.channel.includes("convo")) {
                const id = data.channel.split(":")[1]
                setConvoStore(
                    produce((state) => {
                        const convo = state.convos.find((c) => id === c.conversation_id)
                        if (convo) {
                            convo["created_at"] = data["created_at"]
                            convo["is_echo"] = data["is_echo"]
                            convo["content"] = data["content"]
                            if (data["type"][0] === "file") {
                                convo["file_metadata"] = data["file_metadata"]
                                delete convo["content"]
                            } else if (data["type"][0] === "text") {
                                convo["content"] = data["content"]
                                delete convo["file_metadata"]
                            }
                            convo["type"] = data["type"]
                        }
                    })
                )
            }
        }
        ws.addEventListener("message", get_message)

        onCleanup(() => {
            ws.removeEventListener("message", get_message)
        })
    })

    return <div class="flex max-h-screen overflow-hidden">
        <section class="border-r sticky top-0 min-h-screen overflow-y-auto px-4 w-[500px]">
            <A href="/" class="font-[normal-font] text-dark-green text-xl">
                შეუკეთე
            </A>
            <form>
                <input class="outline-none block mt-4 bg-gray-100 rounded-[16px] w-full px-4 py-2" placeholder="ძებნა..." onInput={(e) => setInput(e.target.value)} type="search" />
            </form>
            <div class="flex gap-y-4 mt-4 flex-col">
                <Show when={convoStore.convos.length}>
                    <For each={convoStore.convos}>
                        {(p, i) => {
                            return <A href={props.location.pathname.split("/")[2] === p.conversation_id ? "/message" : p.conversation_id} class={`${props.location.pathname.split("/")[2] === p.conversation_id && "bg-gray-200"} flex px-2 py-2 rounded-lg hover:bg-gray-100 justify-between`}>
                                <div class="flex">
                                    <img width={50} height={50} class="w-[50px] h-[50px] rounded-full" src={`http://localhost:5555/static/${p.user_role}/profile/small/${p.user_prof_id}.webp`}></img>
                                    <div class="flex px-2 flex-col">
                                        <h1 class="font-bold text-md font-[thin-font]">{p.firstname + " " + p.lastname}</h1>
                                        <div class="flex gap-x-1 items-center">
                                            <span class="font-bold break-all text-gr text-sm font-[thin-font]">
                                                {p.is_echo && "თქვენ:"}
                                            </span>
                                            <Show when={p.type}>
                                                <Switch>
                                                    <Match when={p.type?.length > 1}>

                                                    </Match>
                                                    <Match when={p.type[0] === "text"}>
                                                        <p class="font-bold break-all text-gr text-sm">
                                                            {p.content.slice(0, 37)}{p.content > 37 && "..."}
                                                        </p>
                                                    </Match>
                                                    <Match when={p.type[0] === "file"}>
                                                        <Show when={p.file_metadata[p.file_metadata.length - 1].content_type === "image"}>
                                                            <div class="relative">
                                                                <img class="pt-1 rounded-md w-[30px] h-[30px]" src={`http://localhost:5555${get_image_based_on_size(p.file_metadata[p.file_metadata.length - 1].url, "medium")}`}></img>
                                                            </div>
                                                        </Show>
                                                    </Match>
                                                </Switch>
                                            </Show>
                                        </div>
                                    </div>
                                </div>
                                <Show when={p.created_at}>
                                    <p class="font-bold text-gr text-sm font-[thin-font]">{new Date(p.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: true
                                    })}</p>
                                </Show>
                            </A>
                        }}
                    </For>
                </Show>
            </div>
        </section>
        <main class="w-full">
            {props.children}
        </main>
    </div>
}

export default Message