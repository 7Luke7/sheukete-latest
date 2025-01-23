"use server"
import { getRequestEvent } from "solid-js/web"
import { verify_user } from "../../session_management";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";
import { fileserver_request } from "../../utils/ext_requests/fileserver_request";

export const get_user_service = async (publicId, prof_id) => {
    try {
        const event = getRequestEvent()
        const session = await verify_user(event);

        if (session === 401 || session.profId !== prof_id) {
            throw new Error(401);
        }

        const response = await postgresql_server_request("POST", "xelosani_service", {
            body: JSON.stringify({
                publicId
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.status === 200) {
            const image_response = await fileserver_request("GET", `get_all_service_image_names_and_paths/${session.profId}/${publicId}`)
            if (image_response.status === 200) {
                return {
                    ...response,
                    ...image_response
                }
            }
        } else {
            throw new Error("Fetch request to 'xelosani_service' path failed.")
        }
    } catch (error) {
        console.log(error)
    }
}