import { createEffect, createSignal, For, Match, Show, Switch } from "solid-js";
import closeIcon from "../../svg-images/svgexport-12.svg";
import { A } from "@solidjs/router";
import { reject_request } from "../notifications/utils";
import { MutualFriends } from "../friends/Components/MutualFriends";

export const SentRequests = (props) => {
    const {setShowSentRequests} = props 
    const [sentFriendRequests, setSentFriendRequests] = createSignal([])
    const [cursor, setCursor] = createSignal()
    const [viewAllUserMutuals, setViewAllUserMutuals] = createSignal([])

    createEffect(async () => {
        try {
            const response = await fetch("http://localhost:4321/friends/get_sent_requests", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    cursor: cursor()
                }),
                headers: {
                    "Content-Type": 'application/json'
                }
            })
            const data = await response.json()
    
            if (response.status === 200) {
                console.log(data)
                setSentFriendRequests(prev => [...prev, ...data])
            } else {
                throw new Error("error while fetching mutual friends")
            }
        } catch (error) {
            console.log(error)
        }
    })

  return (
    <section
      class={`fixed z-[10] top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-[490px] h-[600px] rounded bg-white border`}
    >
      <div class="flex justify-between px-6 py-2">
        <h2 class="font-[normal-font] text-center">გაგზავნილი მოთხოვნები</h2>
        <button
          onClick={() => setShowSentRequests(false)}
        >
          <img src={closeIcon}></img>
        </button>
      </div>
      <Switch>
        <Match when={sentFriendRequests().length}>
          <div class="flex flex-col border-t py-2">
            <For each={sentFriendRequests()}>
              {(mf) => (
                <div class="flex justify-between items-center px-6 py-2">
                  <div class="flex items-center gap-x-2">
                    <A href={`/${mf.role}/${mf.prof_id}`}>
                      <img
                        width={50}
                        height={50}
                        src={`http://localhost:5555/static/images/${mf.role}/profile/small/${mf.prof_id}.webp`}
                        class="rounded-full w-[50px] h-[50px]"
                      ></img>
                    </A>
                    <div class="flex flex-col gap-y-1">
                      <A href={`/${mf.role}/${mf.prof_id}`}>
                        <p class="font-[normal-font] text-sm">
                          {mf.firstname} {mf.lastname}
                        </p>
                      </A>
                      <Show
                        when={
                          Number(mf.mutual_friends_count) > 0
                        }
                      >
                        <div class="flex items-center gap-x-1">
                          <div class="flex items-center">
                            {mf.mutual_friends.map((mmf) => {
                              return (
                                <A href={`/${mmf.role}/${mmf.prof_id}`}>
                                  <img
                                    width={18}
                                    height={18}
                                    src={`http://localhost:5555/static/images/${mmf.role}/profile/small/${mmf.prof_id}.webp`}
                                    class="rounded-full w-[18px] h-[18px]"
                                  ></img>
                                </A>
                              );
                            })}
                          </div>
                          <button
                            onClick={() =>
                              setViewAllUserMutuals((prev) => [
                                ...prev,
                                { role: mf.role, prof_id: mf.prof_id },
                              ])
                            }
                            class="text-xs underline font-[thin-font] text-gr"
                          >
                            {mf.mutual_friends_count} საერთო
                            მეგობარი
                          </button>
                        </div>
                      </Show>
                    </div>
                  </div>
                  <button onClick={async (e) => {
                        const response = await reject_request(mf.id, mf.role);
                        if (response === 200){
                            setSentFriendRequests((prev) => {
                                return prev.filter((p) => p.id !== mf.id)
                            });
                        } else {
                            alert("Got an error.")
                        }
                    }} class="px-2 py-1 bg-gray-200 rounded font-[normal-font]">
                    გაუქმება
                  </button>
                </div>
              )}
            </For>
          </div>
          <Show when={viewAllUserMutuals().length}>
        <For each={viewAllUserMutuals()}>
        {(target_mf, i) => {
            return (
            <MutualFriends
                index={i}
                target_mf={target_mf}
                viewAllUserMutuals={viewAllUserMutuals}
                setViewAllUserMutuals={setViewAllUserMutuals}
            ></MutualFriends>
            );
        }}
        </For>
    </Show> 
        </Match>
      </Switch>
    </section>
  );
};
