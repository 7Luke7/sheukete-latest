"use server"

import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request"

export async function GET({ request }) {
    try {
        const req_url = new URL(request.url);
        const providedParams = Object.fromEntries(req_url.searchParams.entries());      

        const response = await postgresql_server_request("GET", `xelosani/services/get/all?cursor=${providedParams.cursor}&prof_id=${providedParams.prid}`)

        if (response.status === 200) {
            return response.services
        }
    } catch (error) {
        console.log(error)
    }
}