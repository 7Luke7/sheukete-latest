import { createEffect, createSignal, For } from "solid-js";
import { SingleNotification } from "./SingleNotification";
import { getTimeAgo } from "./utils";


const Notifications = () => {
    const [notifications, setNotifications] = createSignal([]);
    const [notificationTools, setNotificationTools] = createSignal(null);
    const [loading, setLoading] = createSignal(false);

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
                `http://localhost:4321/notifications/all/get/specials?id=${lastNotification.id}&created_at=${lastNotification.created_at}`,
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
                setNotifications((prev) => [...prev, ...data]);
            } else if (response.status === 400) {
                console.error(data.message);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    createEffect(() => {
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

        if (notifications().length) {
            const newLastNotification = notifications()[notifications().length - 1];
            if (lastNotification && newLastNotification.id !== lastNotification.id) {
                lastNotification.id = newLastNotification.id;
                lastNotification.created_at = newLastNotification.created_at;
                const target = document.querySelector(`#${CSS.escape(lastNotification.id)}`);
                if (target) {
                    observer.observe(target);
                }
            }
        } else {
            fetchData()
        }
    });

    return (
        <div class="flex items-center flex-col w-full gap-y-1">
            <For each={notifications()}>
                {(n, i) => {
                    return (
                        <SingleNotification
                            isLast={notifications().length === i() + 1 && n.id}
                            n={n}
                            i={i}
                            notificationTools={notificationTools}
                            setNotifications={setNotifications}
                            setNotificationTools={setNotificationTools}
                        ></SingleNotification>
                    );
                }}
            </For>
        </div>
    );
};

export default Notifications;