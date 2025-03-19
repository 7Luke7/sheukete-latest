"use server"
import { getRequestEvent } from "solid-js/web"
import { verify_user } from "../session_management"
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request"

export const get_user_convos = async () => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event)

        if (user === 401) {
            throw new Error("login first")
        } 

        const posgresqlserver_response = await postgresql_server_request("GET", `conversations/${user.userId}`, {
            headers: {
                "Content-Type": "application/json"
            }
        }) 

        if (posgresqlserver_response.status === 200) {
            return posgresqlserver_response.convos
        }
    } catch (error) {
        console.log(error)
    }
}