"use server";
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../../session_management";
import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request";
import { fileserver_request } from "../../utils/ext_requests/fileserver_request";

export const get_profile_photo = async () => {
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);
    
    if (session === 401) {
      throw new Error(401);
    }

    const request = await fileserver_request("POST", "profile_image_no_id", {
      body: JSON.stringify({
        role: session.role,
        profId: session.profId
      }),
      headers: {
        'Content-Type': "application/json"
      }
    })
    
    return request
  } catch (error) {
    console.log(error)
  }
}

export const navigateToStep = async () => {
  const BASE_URL = "/setup/xelosani/step";
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    const file_response = await fileserver_request("POST", "profile_image_no_id", {
      body: JSON.stringify({
        role: session.role,
        profId: session.profId
      }),
      headers: {
        'Content-Type': "application/json"
      }
    })


    // შეამოწმე თუ რატომ მოდის profId როცა ფოტო არ არსებობს.
    if (!file_response.url) {
      return `${BASE_URL}/photo`;
    }
    const user = await postgresql_server_request("GET", `xelosani/get_step_data/${session.userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    }); 

    if (!user.phone_exists) {
      return `${BASE_URL}/contact`;
    }
    if (!user.email_exists) {
      return `${BASE_URL}/contact`;
    }
    if (!user.location_exists) {
      return `${BASE_URL}/location`;
    }
    if (!user.about_exists) {
      return `${BASE_URL}/about`;
    }
    if (!user.age_exists) {
      return `${BASE_URL}/age`;
    }
    if (!user.gender_exists) {
      return `${BASE_URL}/gender`;
    }
    if (!user.schedule_exists) {
      return `${BASE_URL}/schedule`;
    }
    if (!user.skills_exists) {
      return `${BASE_URL}/skills`;
    }
  } catch (error) {
    console.log(error)
  }
};
