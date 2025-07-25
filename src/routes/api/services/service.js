"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management"
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request"
import { fileserver_request } from "../utils/ext_requests/fileserver_request";

export const get_service = async (pid) => {
    try {

        const event = getRequestEvent();
        const session = await verify_user(event);
        const service = await postgresql_server_request("GET", `xelosani_service/${pid}`, {
            headers: {
                "Content-Type": "application/json"
            }
        }) 

        service["created_at"] = new Date(service["service_created_at"]).toLocaleDateString()

        if (service.status === 200) {
            const files = await fileserver_request("GET", `get_gallery_count/${service.prof_id}/${service.public_id}`)
            return {...session, gallery_count: files.count, ...service, status: session.profId !== service.prof_id ? 401 : 200}
        }
    } catch (error) {
        console.log(error)        
    }
}