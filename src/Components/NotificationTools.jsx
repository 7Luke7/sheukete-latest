import checkGray from "../svg-images/check-gray.svg";
import trash from "../svg-images/trash.svg";

export const NotificationTools = (props) => {
    // The notification type will alter the UI of this component 

    const mark_as = async () => {
        try {
            const response = await fetch("http://localhost:4321/xelosani/notification/mark_as", {
                method: "PUT",
                body: JSON.stringify({
                    notification_id: props.notificationTools().id,
                    notification_type: props.notificationTools().type,
                    seen: props.seen
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if (response.status === 200) {
                props.setNotificationTools(null)
                props.setNoifications((prev) => {
                    const notifIndex = prev.findIndex(n => n.id === n.props.notificationTools().id)
                    prev[notifIndex].seen = !prev[notifIndex].seen
                    return prev
                })
            }
        } catch (error) {
            console.log(error)            
        }
    }

    const removeNotification = async () => {
        try {
            const response = await fetch("http://localhost:4321/xelosani/notification/remove", {
                method: "POST",
                body: JSON.stringify({
                    notification_id: props.notificationTools().id,
                    notification_type: props.notificationTools().type,
                }),
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include"
            })

            if (response.status === 200) {
                props.setNotificationTools(null)
                props.setNoifications((prev) => {
                    return prev.filter(n => n.id !== n.props.notificationTools().id)
                })
            }
        } catch (error) {
            console.log(error)            
        }
    }
    return <div class="absolute flex flex-col gap-y-2 mt-2 items-start w-2/3 px-2 py-4 bg-white rounded right-0">
        <div class="absolute -top-2 right-[38px] w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-white"></div>
        <button onClick={mark_as} class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full">
            <div class="w-[24px] h-[24px]">
                <img src={checkGray}></img>
            </div>
            {props.seen ? "წაუკითხავად მონიშვნა" : "წაკითხულად მონიშვნა"}
        </button>
        <button onClick={removeNotification} class="font-[thin-font] flex gap-x-1 text-sm hover:bg-gray-100 text-gray-800 text-left py-1 px-2 rounded w-full">
            <div class="w-[24px] flex items-center justify-center h-[24px]">
                <img src={trash}></img>
            </div>
            შეტყობინების წაშლა
        </button>
    </div>
}