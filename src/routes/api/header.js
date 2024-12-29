"use server"
import { getRequestEvent } from "solid-js/web";
import { verify_user } from "./session_management";

export const header = async () => {  
  try {
    const event = getRequestEvent();
    const session = await verify_user(event);

    if (session === 401) {
      throw new Error(401);
    }

    return {
      profId: session.profId,
      role: session.role,
    };
  } catch (error) {
    if (error.message === "401") {
      return 401;
    }
    console.log("GET USER", error);
  }
}