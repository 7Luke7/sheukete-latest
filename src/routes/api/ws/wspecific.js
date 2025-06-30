"use server"

import { getRequestEvent } from "solid-js/web"
import { get_key } from "../redis/utils"
import { json } from "@solidjs/router"

export async function GET({request}) {
  try {
    const event = getRequestEvent({request})
    if (!event?.request?.headers.get("cookie")) return 400
    const session = event.request.headers.get("cookie").split("sessionId=")[1]
    if (!session) return 400

    const user = JSON.parse(await get_key(`session:${session}`))

    return json({
        profId: user.profId ?? null
    })
  } catch (error) {
    console.log(error)
  }
}