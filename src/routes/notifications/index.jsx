import { A, createAsync } from "@solidjs/router"
import { get_notifications_home } from "../api/notifications/all"
import { SingleNotification } from "./SingleNotification"
import { createSignal, For } from "solid-js"

const Notifications = () => {
    const notifications = createAsync(get_notifications_home, {deferStream: true})
    const [notificationTools, setNotificationTools] = createSignal(null);

    return <section>
        <div>
            <div class="flex items-center px-2 justify-between">
                <h2 class="font-[normal-font] font-bold">სიახლეები & შეთავაზებები</h2>
                <A href="specials" class="underline text-blue-500 font-[thin-font] font-bold text-xs">ნახე ყველა</A>
            </div>
        </div>
        <div>
            <div class="flex items-center px-2 justify-between">
                <h2 class="font-[normal-font] font-bold">მომხმარებლები</h2>
                <A href="users/all" class="underline text-blue-500 font-[thin-font] font-bold text-xs">ნახე ყველა</A>
            </div>
        <div class="grid grid-cols-2 gap-x-8">
            <For each={notifications() && notifications().user_notifications}>
                {(n) => {
                    return <SingleNotification
                        n={n}
                        isLast={undefined}
                        notificationTools={notificationTools}
                        setNotifications={() => notifications(notifications())}
                        setNotificationTools={setNotificationTools}
                  ></SingleNotification>
                }}
            </For>
        </div>
        </div>
    </section>
}

export default Notifications