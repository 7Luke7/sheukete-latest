import { createSignal, For, Match, createEffect, Switch } from "solid-js";
import threeDotsSVG from "../../svg-images/three-dots.svg";
import { NotificationTools } from "../NotificationTools";
import { A } from "@solidjs/router";
import { MainNotificationTools } from "./MainNotificationTools";

export const Notifications = () => {
    const [notificationTools, setNotificationTools] = createSignal();
    const [active, setActive] = createSignal("all");
    const [notifications, setNotifications] = createSignal()
    const [mainNotificationTools, setMainNotificationTools] = createSignal(false)

    createEffect(
          async () => {
            try {
              const response = await fetch(
                `http://localhost:4321/notifications/get/${active()}`,
                {
                  method: "GET",
                  credentials: "include",
                }
              );
              const data = await response.json();
              if (response.status === 200) {
                setNotifications(data);
              } else if (response.status === 400) {
                setNotifications(data.message);
              }
            } catch (error) {
              console.error(error);
            }
          },
      );
    
    const accept_request = async (id, friend_request_id) => {
        try {
          const response = await fetch(
            `http://localhost:4321/accept/friend`,
            {
              method: "POST",
              body: JSON.stringify({
                friend_request_id: friend_request_id,
                notification_id: id,
              }),
              headers: {
                "Content-Type": "application/json",
              },
              credentials: "include",
            }
          );
    
          if (response.status === 200) {
            // we could make an animation of adding people to friends later
            setNotifications((prev) => {
              return prev.filter((n) => n.id !== id);
            });
          } else {
            throw new Error("დაფიქსირდა შეცდომა მეგობრობის დამატებისას.");
          }
        } catch (error) {
          console.log(error);
        }
      };
    
      const reject_request = async (friend_request_id) => {
        // we could make an animation of rejecting people friend requests later
        try {
          const response = await fetch(`http://localhost:4321/friend/cancel`, {
            method: "POST",
            body: JSON.stringify({
              friend_request_id: friend_request_id,
            }),
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          });
    
          if (response.status === 200) {
            setNotifications((prev) => {
              return {
                count: prev.count - 1,
                notifications: prev.notifications.filter((n) => n.id !== id),
              };
            });
          } else {
            throw new Error("დაფიქსირდა შეცდომა მეგობრობის მოთხოვნის უარყოფისას.");
          }
        } catch (error) {
          console.log(error);
        }
      };

    return <div
    id="notification-menu"
    class="absolute shadow-2xl flex flex-col gap-y-2 rounded-b-3xl px-4 py-3 border-t border-slate-300 right-[1%] z-50 bg-white opacity-100 w-[490px]"
  >
    <div id="notification-menu" class="flex relative items-center justify-between">
      <h2 id="notification-menu" class="font-[bolder-font] text-gray-800">
        შეტყობინებები
      </h2>
      <button
        type="button"
        class="bg-gray-50"
        id="notification-menu"
        onClick={() => {
          setMainNotificationTools(prev => !prev)
        }}
      >
        <img
          class="p-1 shadow-xl rounded-full"
          src={threeDotsSVG}
          width={30}
          id="notification-menu"
          height={30}
          alt=""
        />
      </button>
      <Show when={mainNotificationTools()}>
        <MainNotificationTools setMainNotificationTools={setMainNotificationTools} setNotifications={setNotifications}></MainNotificationTools>
      </Show>
    </div>
    <div id="notification-menu" class="flex items-center gap-x-2">
      <button
        id="notification-menu"
        onClick={() => setActive("all")}
        className={`transition-all duration-300 w-1/2 text-gray-800 text-sm font-[normal-font] py-1 rounded-3xl shadow-md ${
          active() === "all"
            ? "bg-gray-200"
            : "border border-gray-300"
        }`}
      >
        ყველა
      </button>
      <button
        id="notification-menu"
        onClick={() => setActive("unread")}
        className={`transition-all duration-300 w-1/2 text-gray-800 text-sm font-[normal-font] py-1 rounded-3xl shadow-md ${
          active() === "unread"
            ? "bg-gray-200"
            : "border border-gray-300"
        }`}
      >
        წაუკითხავი
      </button>
    </div>
    <div id="notification-menu" class="flex items-center justify-between">
        <p id="notification-menu" class="font-[normal-font] text-base text-gray-800">უახლესი</p>
        <A href="/notifications" id="notification-menu" class="font-[thin-font] font-bold text-xs text-blue-500 underline">ყველას ნახვა</A>
    </div>
    <Switch>
      <Match when={notifications()}>
        <div id="notification-menu" class="flex items-center flex-col gap-y-1">
          <For each={notifications()}>
            {(n, i) => {
              return (
                <div
                  id="notification-menu"
                  class="p-2 font-bold shadow-lg hover:bg-[rgb(243,244,246)] rounded-3xl w-full border-b"
                >
                  <A
                    id="notification-menu"
                    href={`/${n.role}/${n.prof_id}`}
                  >
                    <div
                      id="notification-menu"
                      class="flex relative items-center justify-between px-2 group"
                    >
                      <p
                        id="notification-menu"
                        class="absolute right-0 top-0 font-[thin-font] pr-3 text-gr text-xs"
                      >
                        {n.created_at}
                      </p>
                      <div
                        id="notification-menu"
                        class="flex items-center w-[360px]"
                      >
                        <img
                          src={
                            n.role === "admin"
                              ? "https://img.freepik.com/free-vector/red-product-sale-tag_78370-1271.jpg"
                              : n.image_url
                          }
                          class="w-16 flex-2 object-cover h-16 rounded-full border border-indigo-100"
                          alt="profile"
                          id="notification-menu"
                        />
                        <div
                          id="notification-menu"
                          class="flex flex-col flex-10 px-2 text-xs"
                        >
                          <p
                            id="notification-menu"
                            class="text-sm font-[thin-font]"
                          >
                            {n.firstname} {n.lastname}
                          </p>
                          <p
                            id="notification-menu"
                            class="font-[thin-font] text-gr"
                          >
                            {n.message}
                          </p>
                          <Show when={n.type === "FRIEND_REQUEST"}>
                            <div
                              id="notification-menu"
                              class="flex gap-x-2 mt-2 items-center"
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  accept_request(
                                    n.id,
                                    n.friend_request_id
                                  );
                                }}
                                id="notification-menu"
                                class="font-bold px-2 py-1 rounded bg-gray-200 cursor-default text-gr text-xs font-[thin-font]"
                              >
                                თანხმობა
                              </button>
                              <button
                                id="notification-menu"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  reject_request(n.friend_request_id);
                                }}
                                class="font-bold px-2 py-1 rounded bg-gray-200 cursor-default text-gr text-xs font-[thin-font]"
                              >
                                უარყოფა
                              </button>
                            </div>
                          </Show>
                        </div>
                      </div>
                      <div class="flex items-center gap-x-2">
                        <button
                          type="button"
                          id="notification-menu"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setNotificationTools((prev) =>
                              prev && prev.id === n.id
                                ? null
                                : { type: n.type, id: n.id }
                            );
                          }}
                        >
                          <img
                            class={`${
                              notificationTools()?.id === n.id
                                ? "block"
                                : "hidden group-hover:block"
                            } bg-gray-200 p-1 rounded-full`}
                            src={threeDotsSVG}
                            width={30}
                            id="notification-menu"
                            height={30}
                            alt=""
                          />
                        </button>
                        <Show when={!n.seen}>
                          <div
                            id="notification-menu"
                            class="bg-dark-green-hover pointer-events-none w-3 h-3 text-white text-xs font-[thin-font] rounded-full"
                          ></div>
                        </Show>
                        <Show when={notificationTools()?.id === n.id}>
                          <NotificationTools
                            setNotifications={setNotifications}
                            seen={n.seen}
                            notificationTools={notificationTools}
                            setNotificationTools={setNotificationTools}
                          />
                        </Show>
                      </div>
                    </div>
                  </A>
                </div>
              );
            }}
          </For>
        </div>
      </Match>
      <Match when={!notifications()}>
        <p
          class="font-[thin-font] text-gr font-bold text-xs text-center"
          id="notification-menu"
        >
          შეტყობინებები ცარიელია
        </p>
      </Match>
    </Switch>
  </div>
}