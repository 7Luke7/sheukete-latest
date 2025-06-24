"use server"
import { json } from "@solidjs/router";
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export async function POST({request}) {
    try {
        const user = await verify_user({request});

        if (user === 401) {
            throw new Error("Authorize first!")
        }
        const body = JSON.parse(await request.text())

        const response = await postgresql_server_request("POST", 'friend/send', {
            body: JSON.stringify({
                ...body,
                user
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        return json(response, {
            status: 200
        })
    } catch (error) {
        console.log(error)
    }
}