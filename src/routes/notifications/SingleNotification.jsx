import { Show } from "solid-js";
import { NotificationTools } from "~/Components/NotificationTools";
import threeDotsSVG from "../../svg-images/three-dots.svg";
import { accept_request, getTimeAgo, reject_request } from "./utils";

export const SingleNotification = (props) => {
  const { n, i, isLast, notificationTools, setNotificationTools, setNotifications } = props;
  return (
    <div
    id={isLast ? isLast : undefined}
    class="p-4 m-2 font-bold shadow-lg hover:bg-[rgb(243,244,246)] rounded-3xl w-full border-b"
  >
    <div class="flex relative items-center justify-between px-3 group">
      <p class="absolute right-0 top-0 font-[thin-font] pr-4 text-base">
        {isLast ? getTimeAgo(n.created_at) : n.created_at}
      </p>
      <div class="flex items-center">
        <img
          src={
            n.role === "admin"
              ? "https://img.freepik.com/free-vector/red-product-sale-tag_78370-1271.jpg"
              : n.image_url
          }
          class="w-20 h-20 rounded-full border border-indigo-100"
          alt="profile"
        />
        <div class="flex flex-col flex-10 px-3">
          <p class="text-lg font-[thin-font]">
            {n.type === "offer" ? "შეუკეთე" : n.firstname + " " + n.lastname}
          </p>
          <p class="text-base font-[thin-font] text-gr">
            {n.message}
          </p>
          <Show when={n.type === "FRIEND_REQUEST"}>
            <div class="flex gap-x-3 mt-3 items-center">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const response = await accept_request(
                    n.id,
                    n.friend_request_id
                  )
                  if (response === 200) {
                    setNotifications((prev) => {
                      return prev.filter((p) => p.id !== n.id);
                    });
                  } else {
                    alert("got an error!")
                  }
                }}
                class="font-bold px-4 py-2 rounded bg-gray-200 cursor-default text-gr text-base font-[thin-font]" // Increased padding and text size
              >
                თანხმობა
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  const response = await reject_request(n.friend_request_id);
                  if (response === 200){
                    setNotifications((prev) => {
                      return {
                        count: prev.count - 1,
                        notifications: prev.notifications.filter((p) => p.id !== n.id),
                      };
                    });
                  } else {
                    alert("Got an error.")
                  }
                }}
                class="font-bold px-4 py-2 rounded bg-gray-200 cursor-default text-gr text-base font-[thin-font]" // Increased padding and text size
              >
                უარყოფა
              </button>
            </div>
          </Show>
        </div>
      </div>
      <div class="flex items-center gap-x-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setNotificationTools((prev) =>
              prev && prev.id === n.id ? null : { type: n.type, id: n.id }
            );
          }}
        >
          <img
            class={`${
              notificationTools()?.id === n.id
                ? "block"
                : "hidden group-hover:block"
            } bg-gray-200 p-2 rounded-full`}
            src={threeDotsSVG}
            width={35}
            height={35}
            alt=""
          />
        </button>
        <Show when={!n.seen}>
          <div class="bg-dark-green-hover pointer-events-none w-4 h-4 text-white text-xs font-[thin-font] rounded-full"></div>
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
  </div>
  );
};