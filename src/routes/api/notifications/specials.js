"use server"

import { getRequestEvent } from "solid-js/web";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request"
import { verify_user } from "../session_management";

export const get_all_special_notifications = async (searchParams) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }
        const response = await postgresql_server_request("GET", `notifications/get_specials?userId=${user.userId}${searchParams ?? ""}`)

        if (response.status === 200) {
            return response  
        }
    } catch (error) {
        console.log(error)
    }
}

export const get_all_unread_special_notifications = async (searchParams) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }
        const response = await postgresql_server_request("GET", `notifications/get_unread_specials?userId=${user.userId}${searchParams ?? ""}`)

        if (response.status === 200) {
            return response  
        }
    } catch (error) {
        console.log(error)
    }
}