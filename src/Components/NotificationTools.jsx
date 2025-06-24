import { mark_notification_as_read, remove_notification } from "~/routes/api/notifications/main";
import checkGray from "../svg-images/check-gray.svg";
import trash from "../svg-images/trash.svg";

export const NotificationTools = (props) => {
    const mark_as = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            const response = await mark_notification_as_read(
                props.notificationTools().id,
                props.notificationTools().type,
                props.seen,
                props.role
            )

            if (response.status === 200) {
                props.setNotifications((prev) => {                    
                    return prev.map((n) =>
                        n.id === props.notificationTools().id ? { ...n, seen: !n.seen } : n
                    )
                });          
            }
        } catch (error) {
            console.log(error)            
        } finally {
            props.setNotificationTools(null)
        }
    }

    const removeNotification = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        try {
            const response = await remove_notification(
                props.notificationTools().id,
                props.notificationTools().type,
                props.seen,
                props.role
            )

            if (response.status === 200) {
                props.setNotifications((prev) => {
                    return prev.filter(n => n.id !== props.notificationTools().id)
                })
            }
        } catch (error) {
            console.log(error)            
        } finally {
            props.setNotificationTools(null)
        }
    }

    return <div id="notification-menu" class="absolute top-full right-0 z-[50] flex flex-col gap-y-2 items-start w-2/3 px-2 py-4 bg-white rounded">
    <div id="notification-menu" class="absolute -top-2 right-4 w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white"></div>
  
        <button id="notification-menu" onClick={mark_as} class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full">
            <div class="w-[24px] h-[24px]">
                <img id="notification-menu" alt="" src={checkGray}></img>
            </div>
            {props.seen ? "წაუკითხავად მონიშვნა" : "წაკითხულად მონიშვნა"}
        </button>
        <button id="notification-menu" onClick={removeNotification} class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full">
            <div id="notification-menu" class="w-[24px] flex items-center justify-center h-[24px]">
                <img id="notification-menu" alt="" src={trash}></img>
            </div>
            შეტყობინების წაშლა
        </button>
    </div>
}