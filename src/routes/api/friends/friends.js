"use server"

import { getRequestEvent } from "solid-js/web"
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export const get_friends_home = async () => {
    try {
        const event = getRequestEvent()
        const session = await verify_user(event);

        if (session === 401) {
            throw new Error("user is not logged in")
        }

        const response = await postgresql_server_request("POST", "friends/get_friends_home", {
            body: JSON.stringify({
                userId: session.userId,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.status === 200) {
            return response
        }
        return "hello world"
    } catch (error) {
        console.log(error)
    }
}