import { A } from "@solidjs/router"
import checkGray from "../../svg-images/check-gray.svg";
import extLink from "../../svg-images/external_link.svg";
import { batch } from "solid-js";
import { mark_all_as_read } from "~/routes/api/notifications/main";

export const MainNotificationTools = (props) => {
    const mark_all_notifications_as_read = async () => {
        try {
            const response = await mark_all_as_read()

            if (response.status === 200) {
                batch(() => {
                    props.setNotifications((prev) => {
                        return prev.map((p) => {
                            return {...p, seen: true}
                        })
                    })
                })
            }
        } catch (error) {
            console.log(error)
        } finally {
            props.setMainNotificationTools(false)
        }
    }
    return <div id="notification-menu" class="absolute top-full mt-2 -right-2 z-[50] flex flex-col gap-y-2 items-start w-2/3 px-2 py-4 bg-white rounded shadow-xl border border-gray-200">
    <div id="notification-menu" class="absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white"></div>
    <button id="notification-menu" onClick={mark_all_notifications_as_read} class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full">
        <div class="w-[24px] h-[24px]">
            <img id="notification-menu" src={checkGray} alt="" />
        </div>
        მონიშნეთ ყველა წაკითხულად
    </button>
    <A id="notification-menu" href="/settings/notifications" class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full">
        <div id="notification-menu" class="w-[24px] flex items-center justify-center h-[24px]">
            <img id="notification-menu" src={extLink} alt="" />
        </div>
        შეტყობინებების პარამეტრები
    </A>
    <A id="notification-menu" href="/notifications" class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full">
        <div id="notification-menu" class="w-[24px] flex items-center justify-center h-[24px]">
            <img id="notification-menu" src={extLink} alt="" />
        </div>
        გახსენით შეტყობინებები
    </A>
</div>

}