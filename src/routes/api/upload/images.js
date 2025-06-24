"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";
import { fileserver_request } from "../utils/ext_requests/fileserver_request";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export const upload_image = async (formData) => {
    try {
        const event = getRequestEvent()
        const session = await verify_user(event);

        if (!session) {
            throw new Error("Login first!")
        }

        // const response = await fetch(
        //     `http://localhost:5555`,
        //     {
        //       method: "POST",
        //       body: formData,
        //       signal: signal(),
        //       credentials: "include"
        //     }
        //   );

        const response = await fileserver_request("POST", `profile_picture/${session.role}/${session.profId}`, {
            body: formData,
        })

        console.log(response)
        if (response.status === 200) {
            if (response.increase_step_percent) {
                const stepPercent = await postgresql_server_request("GET", `${session.role}/increment_step_percent/${session.profId}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                })

                return {
                    stepPercent,
                    message: response.message,
                    status: 200
                }
            } else {
                return {
                    status: 200,
                    message: response.message
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}