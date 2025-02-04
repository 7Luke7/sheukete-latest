"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";

export const get_location = async () => {
    try {
      const event = getRequestEvent();
      const user = await verify_user(event);
  
      if (user === 401 || user.role === 2) {
        return 401;
      }
      const data = await postgresql_server_request(
        "GET",
        `xelosani/handle_service_location/:serviceId`,
      )
      
      return []
    } catch (error) {
      console.log(error);
    }
  };