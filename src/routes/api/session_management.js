"use server"

import { client } from "~/entry-server"

export const verify_user = async (event) => {
    try {
        if (!event.request.headers.get("cookie")) {
            throw new Error(401)
        }
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        if (!session) {
            throw new Error(401)
        }

        const user = await client.get(`session:${session}`)

        if (!user) {
            throw new Error(401)
        }

        return JSON.parse(user)
    } catch (error) {
        if (error.message === "401") {
            return 401
        }
        console.log("VERIFY_USER ERROR", error)
    }
}
