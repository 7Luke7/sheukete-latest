"use server"
import { getRequestEvent } from "solid-js/web"
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request"
import { verify_user } from "../session_management"

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
            return {
                convos: posgresqlserver_response.convos,
                profId: user.profId
            }
        } else {
            return 400
        }
    } catch (error) {
        console.log(error)
    }
}

export const create_user_convos = async (prof_id, role) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event)

        if (user === 401) {
            throw new Error("Login first!");
        } else if (!prof_id) {
            throw new Error("პროფილის id სავალდებულოა.")
        } else if (user.profId === prof_id) {
            throw new Error("თქვენს თავთან კონვერსაციის დაწყება არ შეიძლება.");
        }

        const response = await postgresql_server_request("POST",
            `coversation/start`,
            {
                body: JSON.stringify({
                    user_a_id: user.userId,
                    user_a_role: user.role,
                    prof_id,
                    role
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }
        )

        return {
            status: 200,
            redirect_url: response.redirect_url
        }
    } catch (error) {
        console.log(error)
    }
}