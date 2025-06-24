"use server"

import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export const get_notifications_home = async () => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }
        const response = await postgresql_server_request("GET", `notifications/get_unread_users/${user.userId}`, {
             headers: {
                "Content-Type": "application/json",
            }
        })

        if (response.status === 200) {
            return response.notifications  
        }
    } catch (error) {
        console.log(error)
    }
}