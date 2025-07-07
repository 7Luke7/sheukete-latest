import { A, createAsync } from "@solidjs/router";
import { get_friends_home, accept_request, reject_request } from "../../api/friends/friends";
import { createEffect, createMemo, createSignal, For, Show, useContext } from "solid-js";
import { MutualFriends } from "./Components/MutualFriends";
import { WSContext } from "~/wscontext";
import { Toast } from "~/Components/ToastComponent";

const Friends = () => {
  const friends = createAsync(get_friends_home);
  const [viewAllUserMutuals, setViewAllUserMutuals] = createSignal([])
  const [optimisticFriendRequests, setOptimisticFriendRequests] = createSignal();
  const [toast, setToast] = createSignal()
  const ctx = useContext(WSContext)

  createEffect(() => {
    if (friends()?.status === 200) {
      setOptimisticFriendRequests(friends().friends);
    }
  });

  const render_content = createMemo(() => {
    if (optimisticFriendRequests()) {
      return {
        friend_requests: optimisticFriendRequests(),
        people_you_may_know: null
      }
    } 
  })

  return (
    <section class="flex gap-y-3 flex-col relative">
      <section>
      <div class="flex justify-between items-end">
        <h2 class="font-[normal-font] text-lg">მეგობრობის მოთხოვნები</h2>
        <A href="requests" class="underline text-blue-500 font-[thin-font] font-bold text-xs">ნახე ყველა</A>
      </div>
      <div class="mt-6 flex gap-x-3">
        <For each={render_content() && render_content().friend_requests}>
          {(f) => {
            return <div class="border rounded-b-lg">
              <A href={`/${f.role}/${f.prof_id}`}>
                <img src={`http://localhost:5555/static/${f.role}/profile/medium/${f.prof_id}.webp`} width={340} height={340} class="w-[340px] h-[340px]" alt={`${f.firstname}-ს პროფილის ფოტო`}></img>
              </A>
              <div class="px-2 pb-2">
              <div class="flex flex-col border-b py-2">
                <div class="flex items-center justify-between">
                    <h2 class="font-[normal-font] text-lg">{f.firstname} {f.lastname}</h2>
                  <div class="flex gap-x-2 items-center">
                    <div class="flex items-center">
                    {f.mutual_friends.friends.map((fm) => {
                      return <A href={`/${fm.role}/${fm.prof_id}`}>
                        <img src={`http://localhost:5555/static/${fm.role}/profile/small/${fm.prof_id}.webp`} class="w-[18px] h-[18px] rounded-full"></img>
                      </A> 
                    })}
                    </div>
                    <button onClick={() => {
                      setViewAllUserMutuals(prev => [...prev, {role: f.role, prof_id: f.prof_id}])
                    }} class="font-[thin-font] text-xs font-bold text-gr underline">
                      {f.mutual_friends.mutual_friend_count} საერთო მეგობარი
                    </button>
                  </div>
                </div>
                <h2 class="text-xs font-[thin-font] text-gr font-bold">{f.firstname} {f.lastname} გიგზავნით მეგობრობის მოთხოვნას.</h2>
              </div>
              <div class="flex mt-2 gap-x-2">
                <button onClick={async (e) => {
                  e.preventDefault()
                  const response = await accept_request(
                    f.notification_id,
                    f.friend_request_id,
                    f.role
                  )
                  console.log(response)
                  if (response.status === 200) {
                    setOptimisticFriendRequests((prev) => {
                      return prev.filter((p) => p.id !== f.id)
                    })
                    const ws = ctx()?.ws
                    ws.send(JSON.stringify({
                      type: "unseen-notification",
                      action: "delete",
                      is_echo: true,
                      id: f.notification_id
                    }))
                    setToast({
                      type: true,
                      message: `${f.firstname} დაემატა მეგობრების სიაში.`
                    })
                  }
                }} class="w-1/2 px-2 py-1 bg-dark-green-hover text-white rounded font-[normal-font]">დადასტურება</button>
                <button onClick={async (e) => {
                  e.preventDefault()
                  const response = await reject_request(f.friend_request_id, f.role);
                  if (response === 200){
                    setOptimisticFriendRequests((prev) => {
                      return prev.filter((p) => p.id !== f.id)
                    });
                    const ws = ctx()?.ws
                    ws.send(JSON.stringify({
                      type: "unseen-notification",
                      action: "delete",
                      is_echo: true,
                      id: f.notification_id
                    }))
                    setToast({
                      type: true,
                      message: "მეგობრობის მოთხოვნა უარყოფილია."
                    })
                  } 
                }} class="w-1/2 px-2 py-1 bg-gray-500 text-white rounded font-[normal-font]">უარყოფა</button>
              </div>
              </div>
            </div>
          }}
        </For>  
      </div>
      </section>
      <Show when={viewAllUserMutuals().length}>
        <For each={viewAllUserMutuals()}>
          {(target_mf, i) => {
            return <MutualFriends index={i} target_mf={target_mf} viewAllUserMutuals={viewAllUserMutuals} setViewAllUserMutuals={setViewAllUserMutuals}></MutualFriends>
          }}
        </For>
      </Show>
      <Show when={toast()}>
          <Toast toast={toast} setToast={setToast}></Toast>
      </Show>
    </section>
  );
};

export default Friends;
