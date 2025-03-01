import { createEffect, createSignal, For, onMount } from "solid-js";
import { SingleNotification } from "../../SingleNotification";
import { getTimeAgo } from "../../utils";

const AllUserNotifications = () => {
  const [notifications, setNotifications] = createSignal([]);
  const [notificationTools, setNotificationTools] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [filterRole, setFilterRole] = createSignal("all");

  let observer;
  let lastNotification = {
    id: null,
    created_at: null,
  };

  const fetchData = async () => {
    if (loading()) return;
    setLoading(true);

    try {
      const response = await fetch(
        `http://localhost:4321/notifications/all/get/users?id=${lastNotification.id}&created_at=${lastNotification.created_at}&role=${filterRole()}`,
        {
          method: "GET",
          credentials: "include",
        }
      );
      const data = await response.json();
      for (let i = 0; i < data.length - 1; i++) {
        data[i].created_at = getTimeAgo(data[i].created_at);
      }
      if (response.status === 200) {
        setNotifications((prev) => prev[0] && filterRole() === prev[0].role ? data : [...prev, ...data]);
      } else if (response.status === 400) {
        console.error(data.message);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  onMount(fetchData);

  createEffect(() => {
    if (!notifications() || notifications().length === 0 && !loading()) return;

    const options = {
      root: document.querySelector("#notificationsArea"),
      rootMargin: "0px",
      threshold: 1.0,
    };

    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          fetchData();
          if (observer) {
            observer.unobserve(entry.target);
          }
        }
      });
    };

    if (observer) {
      observer.disconnect();
    }

    observer = new IntersectionObserver(callback, options);

    const newLastNotification = notifications()[notifications().length - 1];
    if (lastNotification && newLastNotification.id !== lastNotification.id) {
      lastNotification.id = newLastNotification.id;
      lastNotification.created_at = newLastNotification.created_at;
      const target = document.querySelector(
        `#${CSS.escape(lastNotification.id)}`
      );
      if (target) {
        observer.observe(target);
      }
    }
  });

  return (
    <>
      <div class="flex items-center mb-4 justify-between">
        <button
          onClick={() => {
            setFilterRole("all")
            fetchData()
        }}
          class={`px-4 py-2 w-full rounded-lg font-[normal-font] relative ${
            filterRole() === "all" ? "text-green-500" : "text-gray-700"
          }`}
        >
          ყველა
          {filterRole() === "all" && (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-b-lg"></div>
          )}
        </button>
        <button
          onClick={() => {
            setFilterRole("xelosani")
            fetchData()
          }}
          class={`px-4 w-full py-2 relative font-[normal-font] rounded-lg ${
            filterRole() === "xelosani" ? "text-green-500" : "text-gray-700"
          }`}
        >
          ხელოსანი
          {filterRole() === "xelosani" && (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-b-lg"></div>
          )}
        </button>
        <button
          onClick={() => {
            setFilterRole("damkveti")
            fetchData()
        }}
          class={`px-4 w-full py-2 relative rounded-lg font-[normal-font] ${
            filterRole() === "damkveti" ? "text-green-500" : "text-gray-700"
          }`}
        >
          დამკვეთი
          {filterRole() === "damkveti" && (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-500 rounded-b-lg"></div>
          )}
        </button>
      </div>
      <For each={notifications()}>
        {(n, i) => {
          return (
            <SingleNotification
              isLast={
                notifications()[notifications().length - 1] ===
                  notifications()[i()] && n.id
              }
              n={n}
              i={i}
              notificationTools={notificationTools}
              setNotifications={setNotifications}
              setNotificationTools={setNotificationTools}
            ></SingleNotification>
          );
        }}
      </For>
    </>
  );
};

export default AllUserNotifications;
