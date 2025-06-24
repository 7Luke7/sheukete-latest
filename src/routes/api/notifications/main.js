"use server"

import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export const get_unseen_notifications = async () => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }
        const response = await postgresql_server_request("GET", `notifications/unseen/${user.userId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        return response
    } catch (error) {
        console.log(error)
    }
}

export const get_active_notification = async (active) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }
        const response = await postgresql_server_request("POST", `notifications/get`, {
            body: JSON.stringify({
                notif_type: active,
                user
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        return response
    } catch (error) {
        console.log(error)
    }
}

export const mark_notification_as_read = async (
    notification_id,
    notification_type,
    seen,
    role
) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("PUT", `notification/mark_as_read`, {
            body: JSON.stringify({
                notification_id,
                notification_type,
                seen,
                role
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })

        return response
    } catch (error) {
        console.log(error)
    }
}

export const remove_notification = async (
    notification_id,
    notification_type,
    seen,
    role
) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("POST", `notification/remove`, {
            body: JSON.stringify({
                notification_id,
                notification_type,
                seen,
                role
            }),
            headers: {
                "Content-Type": "application/json"
            },
        })

        return response
    } catch (error) {
        console.log(error)
    }
}

export const mark_all_as_read = async () => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("GET", `notification/mark_all_as_read?userId=${user.userId}`, {
            headers: {
                "Content-Type": "application/json"
            },
        })

        return response
    } catch (error) {
        console.log(error)
    }
}