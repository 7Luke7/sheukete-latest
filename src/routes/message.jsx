import { A, createAsync, useLocation } from "@solidjs/router"
import { createSignal, For, onMount } from "solid-js"
import { get_user_convos } from "./api/messages/conversations"
import { WSContext } from "~/app"

const Message = (props) => {
    const convos = createAsync(get_user_convos, {
        deferStream: true
    })
    const [input, setInput] = createSignal("")
    const location = useLocation()

    // onMount(() => {
    //     const {ws} = WSContext
    //     ws.send(JSON.stringify({
    //         type: "status",
    //     }))
    // })

    return <div class="flex">
        <section class="border-r sticky min-h-screen overflow-y-auto px-4 w-[500px]">
            <A href="/" class="font-[normal-font] text-dark-green text-xl">
                შეუკეთე
            </A>
            <form>
              <input class="outline-none block mt-4 bg-gray-100 rounded-[16px] w-full px-4 py-2" placeholder="ძებნა..." onInput={(e) => setInput(e.target.value)} type="search" />
            </form>
            <div class="flex gap-y-4 mt-4 flex-col">
            <For each={convos()}>
                {(p, i) => {
                    return <A href={location.pathname.split("/")[2] === p.conversation_id ? "/message" : p.conversation_id} class={`${location.pathname.split("/")[2] === p.conversation_id && "bg-gray-200"} flex px-2 py-2 rounded-lg hover:bg-gray-100 justify-between`}>
                        <div class="flex">
                            <img width={50} height={50} class="w-[50px] h-[50px] rounded-full" src={`http://localhost:5555/static/images/${p.user_role}/profile/small/${p.user_prof_id}.webp`}></img>
                            <div class="flex px-2 flex-col">
                                <h1 class="font-bold text-md font-[thin-font]">{p.firstname + " " + p.lastname}</h1>
                                <Show when={p.last_message}>
                                    <p class="font-bold break-all text-gr text-sm font-[thin-font]">{p.last_message.slice(0, 40)}...</p>
                                </Show>
                            </div>
                        </div>
                        <Show when={p.message_time}>
                            <p class="font-bold text-gr text-sm font-[thin-font]">{p.message_time}</p>
                        </Show>
                    </A>                    
                }}
            </For>
            </div>
        </section>
        <main class="w-full">
            {props.children}
        </main>
    </div>
}

export default Message