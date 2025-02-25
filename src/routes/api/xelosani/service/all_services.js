"use server"

import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request"

export async function GET({ request }) {
    console.log("hi")
    try {
        const req_url = new URL(request.url);
        const providedParams = Object.fromEntries(req_url.searchParams.entries());      

        console.log(providedParams)
        const response = await postgresql_server_request("GET", `xelosani/services?cursor=${providedParams.cursor}&prof_id=${providedParams.prid}`, {
            headers: {
              "Content-Type": "application/json",
            },
          })

        console.log(response)
        if (response.status === 200) {
            return response 
        }
    } catch (error) {
        console.log(error)
    }
}