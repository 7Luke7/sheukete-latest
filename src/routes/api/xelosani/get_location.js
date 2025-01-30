"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export const get_location = async () => {
    try {
      const event = getRequestEvent();
      const user = await verify_user(event);
  
      if (user === 401 || user.role === 2) {
        return 401;
      }
      const data = await postgresql_server_request(
        "GET",
        `xelosani/check_location/${user.userId}`,
      )
      
      return data
    } catch (error) {
      console.log(error);
    }
  };