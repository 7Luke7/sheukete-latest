import { A } from "@solidjs/router"
import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js"
import closeIcon from "../../../../svg-images/svgexport-12.svg";
import { close_current_mutuals } from "./utils";
import { get_mutual_friends } from "~/routes/api/friends/friends";

export const MutualFriends = (props) => {
    const {index, setViewAllUserMutuals, target_mf} = props
    const [mutualFriends, setMutualFriends] = createSignal([])
    const [cursor, setCursor] = createSignal()

    createEffect(async () => {
        try {
            const response = await get_mutual_friends(target_mf, cursor())

            if (response.status === 200) {
                setMutualFriends(prev => [...prev, ...response.mutual_friends])
            } else {
                throw new Error("error while fetching mutual friends")
            }
        } catch (error) {
            console.log(error)
        }
    })

    // the css for top- left- should be calculated based on which path we are on (no big deal) lol
    return <section class={`fixed z-[${index() + 1}] top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-[490px] h-[600px] rounded bg-white border`}>
            <div class="flex justify-between px-6 py-2">
                <h2 class="font-[normal-font] text-center">საერთო მეგობრები</h2>
                <button onClick={() => close_current_mutuals(setViewAllUserMutuals, target_mf.prof_id)}>
                    <img src={closeIcon}></img>
                </button>
            </div>
            <Switch>
                <Match when={mutualFriends().length}>
                  <div class="flex flex-col border-t py-2">
                    <For each={mutualFriends()}>
                        {(mf) => (
                            <div class="flex justify-between items-center px-6 py-2">
                                <div class="flex items-center gap-x-2">
                                    <A href={`/${mf.role}/${mf.prof_id}`}>
                                        <img width={50} height={50} src={`http://localhost:5555/static/images/${mf.role}/profile/small/${mf.prof_id}.webp`}  class="rounded-full w-[50px] h-[50px]"></img>
                                    </A>
                                    <div class="flex flex-col gap-y-1">
                                    <A href={`/${mf.role}/${mf.prof_id}`}>
                                        <p class="font-[normal-font] text-sm">{mf.firstname} {mf.lastname}</p>
                                    </A>
                                    <Show when={Number(mf.mutual_friends?.mutual_friends_count) > 0}>
                                        <div class="flex items-center gap-x-1">
                                            <div class="flex items-center">
                                            {mf.mutual_friends.mutual_friends.map((mmf) => {
                                                return <A href={`/${mmf.role}/${mmf.prof_id}`}>
                                                <img width={18} height={18} src={`http://localhost:5555/static/images/${mmf.role}/profile/small/${mmf.prof_id}.webp`}  class="rounded-full w-[18px] h-[18px]"></img>
                                            </A>
                                            })}
                                            </div>
                                            <button onClick={() => setViewAllUserMutuals(prev => [...prev, {role: mf.role, prof_id: mf.prof_id}])} class="text-xs underline font-[thin-font] text-gr">{mf.mutual_friends.mutual_friends_count} საერთო მეგობარი</button>
                                        </div>
                                        </Show>
                                    </div>
                                </div>
                                <button class="px-2 py-1 bg-gray-200 rounded font-[normal-font]">მიწერა</button>
                            </div>   
                        )}
                    </For>
                  </div>
                </Match>
            </Switch>
    </section>
}