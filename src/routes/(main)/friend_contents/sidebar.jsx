import { A, createAsync, useNavigate } from "@solidjs/router";
import { createEffect, createSignal, onMount, Show } from "solid-js";
import { MutualFriends } from "../friends/Components/MutualFriends";
import {
  getTimeAgo,
} from "../../notifications/utils";
import back from "../../../svg-images/back.svg";
import searchIcon from "../../../svg-images/svgexport-5.svg";
import clear from "../../../svg-images/svgexport-12.svg";
import { SentRequests } from "./SentRequests";
import threeDotsSVG from "../../../svg-images/three-dots.svg";
import { reject_request, accept_request, get_received_requests, get_all_friends } from "~/routes/api/friends/friends";
import dropdownGreenSVG from "../../../svg-images/svgexport-13.svg"

export default class Sidebar {
  constructor() {
    this.relations = {
      "/friends/requests": {
        title: "მეგობრობის მოთხოვნები",
        request_pathname: "get_friend_requests",

        action_buttons(props) {
          const { setOptimisticFriendRequests, f } = props;
          return (
            <div class="flex gap-x-2">
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  const response = await accept_request(
                    undefined,
                    f.friend_request_id,
                    f.role
                  );
                  if (response.status === 200) {
                    setOptimisticFriendRequests((prev) => {
                      return prev.filter((p) => p.id !== f.id);
                    });
                  } else {
                    alert("got an error!");
                  }
                }}
                class="w-1/2 px-2 py-1 bg-dark-green-hover text-white rounded font-[normal-font]"
              >
                დადასტურება
              </button>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  const response = await reject_request(
                    f.friend_request_id,
                    f.role
                  );
                  if (response === 200) {
                    setOptimisticFriendRequests((prev) => {
                      return prev.filter((p) => p.id !== f.id);
                    });
                  } else {
                    alert("Got an error.");
                  }
                }}
                class="w-1/2 px-2 py-1 bg-gray-500 text-white rounded font-[normal-font]"
              >
                გაუქმება
              </button>
            </div>
          );
        },
        above_content(props) {
          const [showSentRequest, setShowSentRequests] = createSignal(false);
          const { count } = props;

          return (
            <>
              <div class="flex items-center">
                <A href="/friends">
                  <img src={back} class="pr-4"></img>
                </A>
                <div>
                  <A
                    href="/friends"
                    class="font-[thin-font] text-gr font-bold text-xs hover:underline"
                  >
                    მეგობრები
                  </A>
                  <h2 class="font-[bolder-font] text-lg">{this.title}</h2>
                </div>
              </div>
              <p class="font-[thin-font] text-sm text-gr font-bold">
                {count} მეგობრობის მოთხოვნა
              </p>
              <button
                onClick={() => setShowSentRequests(true)}
                class="text-[10px] font-bold mb-2 text-blue-500 font-[thin-font]"
              >
                გაგზავნილი მოთხოვნები
              </button>
              <Show when={showSentRequest()}>
                <SentRequests
                  setShowSentRequests={setShowSentRequests}
                ></SentRequests>
              </Show>
            </>
          );
        },

        main_content() {
          const response = createAsync(() => get_received_requests(this.request_pathname))
          const [viewAllUserMutuals, setViewAllUserMutuals] = createSignal([]);
          const [optimisticFriendRequests, setOptimisticFriendRequests] =
            createSignal([]);
          const [data, setData] = createSignal({
            count: 0,
            users: [],
          });

          createEffect(() => {
            if (!response()) return
            setData((prev) => {
              return {
                count: response().friend_requests_count,
                users: [...prev.users, ...response().users],
              };
            });
          })

          return (
            <>
              {this.above_content({ count: data().count })}
              <Show
                when={data().users.length && Number(data().count)}
              >
                <For each={data().users}>
                  {(f) => {
                    return (
                      <A state={{ fromFriends: true }} href={`/${f.role}/${f.prof_id}`}>
                        <div class="flex border-t py-2 w-full gap-y-2 flex-col">
                          <div class="flex items-start gap-x-2 w-full">
                            <img
                              width={50}
                              height={50}
                              src={`http://localhost:5555/static/${f.role}/profile/small/${f.prof_id}.webp`}
                              class="rounded-full border w-[50px] h-[50px]"
                            ></img>
                            <div class="flex flex-col gap-y-1 w-full">
                              <div class="flex items-center justify-between">
                                <p class="font-[normal-font] text-sm">
                                  {f.firstname} {f.lastname}
                                </p>
                                <p class="text-gr text-xs font-[thin-font] font-bold">
                                  {getTimeAgo(f.created_at)}
                                </p>
                              </div>
                              <Show
                                when={
                                  Number(f.mutual_friends?.mutual_friends_count) >
                                  0
                                }
                              >
                                <div class="flex items-center gap-x-1">
                                  <div class="flex items-center">
                                    {f.mutual_friends.mutual_friends.map(
                                      (mmf) => {
                                        return (
                                          <A state={{ fromFriends: true }} href={`/${mmf.role}/${mmf.prof_id}`}>
                                            <img
                                              width={18}
                                              height={18}
                                              src={`http://localhost:5555/static/${mmf.role}/profile/small/${mmf.prof_id}.webp`}
                                              class="rounded-full w-[18px] h-[18px]"
                                            ></img>
                                          </A>
                                        );
                                      }
                                    )}
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.preventDefault()
                                      e.stopPropagation()
                                      setViewAllUserMutuals((prev) => [
                                        ...prev,
                                        { role: f.role, prof_id: f.prof_id },
                                      ])
                                    }
                                    }
                                    class="text-xs underline font-[thin-font] text-gr"
                                  >
                                    {f.mutual_friends.mutual_friends_count} საერთო
                                    მეგობარი
                                  </button>
                                </div>
                              </Show>
                            </div>
                          </div>
                          {this.action_buttons({
                            setOptimisticFriendRequests,
                            f,
                          })}
                        </div>
                      </A>
                    );
                  }}
                </For>
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
              </Show>
            </>
          );
        },
      },

      "/friends/all": {
        title: "ყველა მეგობარი",
        request_pathname: "get_all_friends",

        search_component(props) {
          const { value, setValue, count } = props;
          return (
            <>
              <form class="border mt-2 font-[thin-font] rounded-[16px] px-3 py-1 border-[#6e6967] flex items-center">
                <button class="w-[25px] h-[20px]" type="submit">
                  <img src={searchIcon}></img>
                </button>
                <input
                  id="search_input"
                  value={value()}
                  onInput={(e) => setValue(e.target.value)}
                  placeholder="მოძებნე"
                  class="px-1 font-[thin-font] text-sm w-full outline-none"
                  type="text"
                ></input>
                {value().length > 0 && (
                  <button
                    type="button"
                    class="pr-2"
                    onClick={() => setValue("")}
                  >
                    <img
                      src={clear}
                      alt="Clear"
                      class="border rounded-[50%] border-[#6e6967]"
                    ></img>
                  </button>
                )}
              </form>
              <p class="font-[thin-font] my-2 text-sm text-gr font-bold">
                {count} მეგობარი
              </p>
            </>
          );
        },

        above_content() {
          return (
            <>
              <div class="flex items-center">
                <A href="/friends">
                  <img src={back} class="pr-4"></img>
                </A>
                <div>
                  <A
                    href="/friends"
                    class="font-[thin-font] text-gr font-bold text-xs hover:underline"
                  >
                    მეგობრები
                  </A>
                  <h2 class="font-[bolder-font] text-lg">{this.title}</h2>
                </div>
              </div>
            </>
          );
        },

        action_buttons() {
          return <button class="hover:bg-gray-300 rounded-full p-1" onClick={(e) => {
            e.preventDefault()
          }} ><img width={18} height={18} src={threeDotsSVG}></img></button>
        },

        main_content() {
          const allFriends = createAsync(async () => {
            const response = await get_all_friends(this.request_pathname)
            if (response.status === 200) {
              return {
                count: response.friend_count,
                users: response.users,
              };
            }
          }, { deferStream: true })
          const [value, setValue] = createSignal("");
          const [viewAllUserMutuals, setViewAllUserMutuals] = createSignal([]);
          const navigate = useNavigate();

          console.log("hello")
          return (
            <>
              {this.above_content()}
              <Show when={allFriends()}>
                {this.search_component({ value, setValue, count: allFriends().count })}
                <For each={allFriends().users}>
                  {(f) => {
                    return (
                      <>
                        <button onClick={() => navigate(`/${f.role}/${f.prof_id}?fromFriends=true`)}>
                          <div class="hover:bg-gray-200 rounded-2xl mt-2 flex px-2 py-2 gap-y-2 items-start gap-x-2 w-full">
                            <img
                              width={50}
                              height={50}
                              src={`http://localhost:5555/static/${f.role}/profile/small/${f.prof_id}.webp`}
                              class="rounded-full border w-[50px] h-[50px]"
                            ></img>
                            <div class="flex items-start justify-between w-full">
                              <div class="flex flex-col gap-y-1">
                                <p class="font-[normal-font] text-sm">
                                  {f.firstname} {f.lastname}
                                </p>
                                <Show
                                  when={
                                    Number(f.mutual_friends_count) >
                                    0
                                  }
                                >
                                  <div class="flex items-center gap-x-1">
                                    <div class="flex items-center">
                                      {f.mutual_friends.map(
                                        (mmf) => {
                                          return (
                                            <button button onClick={() => navigate(`/${f.role}/${f.prof_id}?fromFriends=true`)}>
                                              <img
                                                width={18}
                                                height={18}
                                                src={`http://localhost:5555/static/${mmf.role}/profile/small/${mmf.prof_id}.webp`}
                                                class="rounded-full w-[18px] h-[18px]"
                                              ></img>
                                            </button>
                                          );
                                        }
                                      )}
                                    </div>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault()
                                        e.stopPropagation()
                                        setViewAllUserMutuals((prev) => [
                                          ...prev,
                                          { role: f.role, prof_id: f.prof_id },
                                        ])
                                      }
                                      }
                                      class="text-xs underline font-[thin-font] text-gr"
                                    >
                                      {f.mutual_friends_count} საერთო
                                      მეგობარი
                                    </button>
                                  </div>
                                </Show>
                              </div>
                              <div class="flex flex-col items-end gap-y-2">
                                <p class="text-gr text-xs font-[thin-font] font-bold">
                                  {getTimeAgo(f.created_at)}
                                </p>
                                {this.action_buttons()}
                              </div>
                            </div>
                          </div>
                        </button>
                      </>
                    );
                  }}
                </For>
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
              </Show>
            </>
          );
        },
      },

      "/friends": {
        main_content() {
          return <>
            <h1 class="text-2xl font-semibold text-gray-800 mb-6">
              მეგობრები
            </h1>
            <div class="flex flex-col gap-y-3">
              <A href="/friends" class="bg-white hover:bg-gray-100 rounded-lg shadow">
                <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                  <span class="text-lg font-[normal-font] text-gray-700">
                    მთავარი
                  </span>
                  <button>
                    <img width={26} src={dropdownGreenSVG} alt="More options"></img>
                  </button>
                </div>
              </A>
              <A href="requests" class="bg-white rounded-lg hover:bg-gray-100 shadow">
                <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                  <span class="text-lg font-[normal-font] text-gray-700">
                    მეგობრობის მოთხოვნები
                  </span>
                  <button>
                    <img width={26} src={dropdownGreenSVG} alt="More options"></img>
                  </button>
                </div>
              </A>
              <A href="all" class="bg-white rounded-lg hover:bg-gray-100 shadow">
                <div class="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                  <span class="text-lg font-[normal-font] text-gray-700">
                    ყველა მეგობრები
                  </span>
                  <button>
                    <img width={26} src={dropdownGreenSVG} alt="More options"></img>
                  </button>
                </div>
              </A>
            </div>
          </>
        }
      }
    };
  }

  render(pathname) {
    console.log(pathname)
    return this.relations[pathname].main_content()
  }
}