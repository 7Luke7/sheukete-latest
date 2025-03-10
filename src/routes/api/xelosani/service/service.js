"use server"
import { getRequestEvent } from "solid-js/web"
import { verify_user } from "../../session_management";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";
import { fileserver_request } from "../../utils/ext_requests/fileserver_request";

export const get_user_service = async (publicId, prof_id) => {
    try {
        const {request} = getRequestEvent()
        const session = await verify_user({request});
        const url = new URL(request.url)

        if (session === 401) {
            return {status: 401}
        } else if (session.profId !== prof_id) {
            return {status: 401}
        } else if (!publicId.length) {
            return {status: 200, isEditing: false}
        }

        const sp = new URLSearchParams(publicId)
        const service_public_id = sp.get("id")

        const response = await postgresql_server_request("GET", `xelosani_service/${service_public_id}`)

        if (response.status === 200) {
            const image_response = await fileserver_request("GET", `get_all_service_image_names_and_paths/${session.profId}/${service_public_id}`)
            const {status, ...rest} = image_response
            if (image_response.status === 200) {
                return {
                    ...response,
                    ...rest,
                    profId: session.profId,
                    serviceId: service_public_id,
                    isEditing: true
                }
            } else if (image_response.status === 400) {
                return {
                    ...response,
                    profId: session.profId,
                    isEditing: true,
                    serviceId: service_public_id
                }
            }
        } else {
            throw new Error("Fetch request to 'xelosani_service' path failed.")
        }
    } catch (error) {
        console.log(error)
    }
}