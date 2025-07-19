"use server";
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";
import { json } from "@solidjs/router";
import { fileserver_request } from "../utils/ext_requests/fileserver_request";
import { validateFile } from "./utils";

export const get_messages = async (conversation_id, last = null) => {
  try {
    const event = getRequestEvent();
    const user = await verify_user(event);

    if (user === 401) {
      throw new Error("login first");
    }

    const url = !last ? `messages/${conversation_id}/${user.userId}`
    : `messages/${conversation_id}/${user.userId}?message_id=${last.message_id}&created_at=${last.created_at}`
    const posgresqlserver_response = await postgresql_server_request(
      "GET",
      url,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!last) posgresqlserver_response["my_id"] = user.userId
    if (posgresqlserver_response.status === 200) {
      return posgresqlserver_response;
    }
  } catch (error) {
    console.log(error);
  }
};

export const send_text = async (ms) => {
  try {
    const event = getRequestEvent();
    const user = await verify_user(event);

    if (user === 401) {
      throw new Error("login first");
    }

    const object = {...ms, files: [], sender_role: user.role,
        sender_id: user.userId}
    const response = await postgresql_server_request("POST", "message", {
      body: JSON.stringify(object),
      headers: {
        "Content-Type": "application/json"
      }
    })

    if (response.status !== 200) {
      throw new Error("something went wrong")
    }

    return 200
  } catch (error) {
    console.log(error)
  }
}

export async function POST({request}) {
  try {
    const user = await verify_user({request});
    if (user === 401) {
      return json("Not Authoriezd", {status: 401});
    }
    const FormData = await request.formData()


    const convo_id = FormData.get("convo_id")
    const date = FormData.get("date")
    const receiver_prof_id = FormData.get("receiver_prof_id")
    const file_count = Number(FormData.get("file_count"))
    const content = FormData.get("content")

    const meta = []
    for (let i = 0; i < file_count; i++) {
      const file_meta = JSON.parse(FormData.get(`meta-${i}`))

      const validate = validateFile({ type: file_meta.content_type, size: file_meta.size, name: file_meta.name })
      if (!validate.valid) throw new Error(`file validation failed ${validate.reason}`)
      if (validate.ext) file_meta["ext"] = validate.ext
      meta.push(file_meta)
    }
    
    const response = await postgresql_server_request("POST", "message", {
      body: JSON.stringify({
        meta: meta || null,
        date,
        content: content || null,
        receiver_prof_id,
        convo_id,
        sender_role: user.role,
        sender_id: user.userId
      }),
      headers: {
        "Content-Type": "application/json"
      }
    })

    FormData.delete("convo_id")
    FormData.delete("receiver_prof_id")
    FormData.delete("date")
    FormData.delete("file_count")
    for (let i = 0; i < file_count; i++) {
      FormData.delete(`meta-${i}`)
    }
    if (response.status === 200 && (response.type.includes("file") || response.type.includes("file-text"))) {
      const file_server_response = await fileserver_request("POST", `conversation/file/${convo_id}`, {
        body: FormData
      })

      if (file_server_response.status === 200) {
        return json(response, {status: 200})  
      }
    } 
  } catch (error) {
    console.log(error)
  }
}