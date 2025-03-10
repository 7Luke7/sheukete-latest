import { createEffect, createMemo, createSignal, For} from "solid-js";
import { SingleNotification } from "../../SingleNotification";
import { createAsync } from "@solidjs/router";
import { get_all_unread_special_notifications } from "~/routes/api/notifications/specials";

const UnreadSpecialNotifications = () => {
    const initialNotifications = createAsync(get_all_unread_special_notifications, {
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
          const data = await get_all_unread_special_notifications(
            `&id=${notificationId}&created_at=${notificationCreatedAt}&page=${page()}&total_count=${initialNotifications()?.totalCount}`
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
        if (initialNotifications() && notifications().notifications) {
          return [...initialNotifications().notifications, ...notifications().notifications];
        } else if (initialNotifications()) {
          return initialNotifications().notifications;
        }
        return [];
      })
    
      // Simplified isLast prop
      const isLast = (index, n) => {
        const combined = MemoizedCombinedNotifications();
        return combined.length === index + 1 && n.id;
      };
    
      return (
        <>
          <Suspense fallback={<p>"Loading..."</p>}>
            <h1 class="font-[normal-font] text-xl pl-4">წაუკითხავი | სიახლეები & შეთავაზებები({initialNotifications()?.totalCount})</h1>
            <For each={MemoizedCombinedNotifications()}>
              {(n, i) => {
                return (
                  <SingleNotification
                    isLast={isLast(i(), n)}
                    n={n}
                    i={i}
                    notificationTools={notificationTools}
                    setNotifications={setNotifications}
                    setNotificationTools={setNotificationTools}
                  ></SingleNotification>
                );
              }}
            </For>
          </Suspense>
        </>
      );
};

export default UnreadSpecialNotifications;