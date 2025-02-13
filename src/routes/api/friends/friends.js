"use server"

import { getRequestEvent } from "solid-js/web"
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export const get_all_friends = async () => {
    const event = getRequestEvent()
    const session = await verify_user(event);

    console.log(event)

    if (session === 401) {
        throw new Error("user is not logged in")
    }

    const response = await postgresql_server_request("POST", "/all_friends", {
        body: JSON.stringify({
            cursor: "",
            role: session.role
        })
    })

    return "hello world"
}