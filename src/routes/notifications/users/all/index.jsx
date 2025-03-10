import { batch, createEffect, createMemo, createSignal, For, on} from "solid-js";
import { SingleNotification } from "../../SingleNotification";
import { get_all_user_notifications } from "~/routes/api/notifications/users";
import { createAsync } from "@solidjs/router";

const AllUserNotifications = () => {
  const initialNotifications = createAsync(get_all_user_notifications, {
    deferStream: true,
  });
  const [notifications, setNotifications] = createSignal({
    hasMore: null,
    notifications: []
  });
  const [notificationTools, setNotificationTools] = createSignal(null);
  const [loading, setLoading] = createSignal(false);
  const [lastNotification, setLastNotification] = createSignal({
    id: null,
    created_at: null,
  });
  const [page, setPage] = createSignal(1)
  const [filterRole, setFilterRole] = createSignal("")

  let observer;

  const fetchData = async () => {
    if (loading()) return;
    setLoading(true);

    let notificationId;
    let notificationCreatedAt;

    if (
      !lastNotification().id &&
      initialNotifications() &&
      initialNotifications().notifications.length > 0
    ) {
      // If it's the initial load and we have initial notifications
      const lastInitialNotification =
        initialNotifications().notifications[initialNotifications().notifications.length - 1];
      notificationId = lastInitialNotification.id;
      notificationCreatedAt = lastInitialNotification.created_at;
    } else {
      // If it's not the initial load, use the last loaded notification
      notificationId = lastNotification().id;
      notificationCreatedAt = lastNotification().created_at;
    }

    try {
      const data = await get_all_user_notifications(
        `&id=${notificationId}&created_at=${notificationCreatedAt}&role=${filterRole()}&page=${page()}&total_count=${initialNotifications()?.totalCount}`
      );

      setNotifications((prev) => {
        return {
          hasMore: data.hasMore,
          notifications: [...prev.notifications, ...data.notifications]
        }
      });

      if (data.notifications.length > 0) {
        const lastFetchedNotification = data.notifications[data.notifications.length - 1];
        setLastNotification(() => ({
          id: lastFetchedNotification.id,
          created_at: lastFetchedNotification.created_at,
        }));
        setPage((prev) => prev + 1)
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  createEffect(() => {
    if (page() === 1 && !initialNotifications()?.hasMore || page() > 1 && !notifications().hasMore) {
      if (observer) {
        observer.disconnect()
      }
      return
    }
    if (observer) {
      observer.disconnect();
    }
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

    observer = new IntersectionObserver(callback, options);
    const { id } =
      initialNotifications() && !lastNotification().id ?
      initialNotifications().notifications[initialNotifications().notifications.length - 1] : lastNotification();

    const target = document.querySelector(`#${CSS.escape(id)}`);
    if (target) {
      observer.observe(target);
    }
  });

  const MemoizedCombinedNotifications = createMemo(() => {
    if (initialNotifications() && notifications().notifications && filterRole() === "") {
      return [...initialNotifications().notifications, ...notifications().notifications];
    } else if (initialNotifications() && filterRole() === "") {
      return initialNotifications().notifications;
    } else if (filterRole !== "") {
      return notifications().notifications;
    }
    return [];
  })

  const isLast = (index, n) => {
    const combined = MemoizedCombinedNotifications();
    return combined.length === index + 1 && n.id;
  };

  createEffect(on(filterRole, async () => {
    setNotifications([])
    if (filterRole() === "") return
    try {
      const data = await get_all_user_notifications(
        `&role=${filterRole()}`
      );

      // if data is empty then role has no notifiactions and we could just message or smth
  
      if (data.notifications.length > 0) {
        const lastFetchedNotification = data.notifications[data.notifications.length - 1];
        batch(() => {
          setNotifications(() => {
            return {
              hasMore: data.hasMore,
              notifications: data.notifications
            }
          });
          setLastNotification(() => ({
            id: lastFetchedNotification.id,
            created_at: lastFetchedNotification.created_at,
          }));
          setPage(1)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }, {defer: true}))

  return (
    <>
      <div class="flex items-center mb-4 justify-between">
      <button
          onClick={() => {
            setFilterRole("")
        }}
          class={`px-4 py-2 w-full rounded-lg font-[normal-font] relative ${
            filterRole() === "" ? "text-green-500" : "text-gray-700"
          }`}
        >
          ყველა
          {filterRole() === "" ? (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
          ) : (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-800"></div>
          )}
        </button>
        <button
          onClick={() => {
            setFilterRole("xelosani")
          }}
          class={`px-4 w-full py-2 relative font-[normal-font] rounded-lg ${
            filterRole() === "xelosani" ? "text-green-500" : "text-gray-700"
          }`}
        >
          ხელოსანი
          {filterRole() === "xelosani" ? (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
          ) : (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-800"></div>
          )}
        </button>
        <button
          onClick={() => {
            setFilterRole("damkveti")
        }}
          class={`px-4 w-full py-2 relative rounded-lg font-[normal-font] ${
            filterRole() === "damkveti" ? "text-green-500" : "text-gray-700"
          }`}
        >
          დამკვეთი
          {filterRole() === "damkveti" ? (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-500"></div>
          ) : (
            <div class="absolute bottom-0 left-0 w-full h-1 bg-green-800"></div>
          )}
        </button>
      </div>
      <For each={MemoizedCombinedNotifications()}>
        {(n, i) => {
          return (
            <SingleNotification
              isLast={isLast(i(), n)}
              n={n}
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
