"use server"

import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../../session_management";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";
import { HandleError } from "../../utils/errors/handle_errors";
import { CustomError } from "../../utils/errors/custom_errors";

export const modify_about = async (formData) => {
    try {
        const event = getRequestEvent();
        const session = await verify_user(event);
        const about = formData.get("about")

        if (about.length > 600) {
            throw new CustomError("about", "აღწერა აღემატება 600 სიმბოლოს.")
        }
        if (about.length < 75) {
            throw new CustomError("about", "აღწერა უნდა შეიცავდეს მინიმუმ 75 ასოს.")
        }
        if (session === 401) {
            throw new Error(401);
        }

        const data = await postgresql_server_request("PUT", `${session.role}/modify_about`, {
            body: JSON.stringify({
                about,
                userId: session.userId,
            }),
            headers: {  
                "Content-Type": "application/json",
            },
        });

        if (data.status === 400) {
            return {status: 400}
        }

        return {status: 200}
    }catch(error) {
        if (error.message === "401") {
            return 401
        }
        const handled_error = new HandleError(error).validation_error();
        return { ...handled_error[0], status: 400 };
    }
}