"use server"

import { getRequestEvent } from "solid-js/web"
import { verify_user } from "../session_management";
import { postgresql_server_request } from "../utils/ext_requests/posgresql_server_request";

export const get_friends_home = async () => {
    try {
        const event = getRequestEvent()
        const session = await verify_user(event);

        if (session === 401) {
            throw new Error("user is not logged in")
        }

        const response = await postgresql_server_request("POST", "friends/get_friends_home", {
            body: JSON.stringify({
                userId: session.userId,
            }),
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response.status === 200) {
            return response
        }
        return "hello world"
    } catch (error) {
        console.log(error)
    }
}

export const reject_request = async (friend_request_id, role, status = 'pending') => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("POST", `friend/status/${status}`, {
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                friend_request_id: friend_request_id,
                sender_role: role,
            }),
        })

        return response.status;
    } catch (error) {
        console.log(error);
    }
};

export const accept_request = async (id, friend_request_id, role) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }
        const response = await postgresql_server_request("POST", `accept/friend`, {
            body: JSON.stringify({
                friend_request_id: friend_request_id,
                notification_id: id,
                sender_role: role,
                user
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response.status;
    } catch (error) {
        console.log(error);
    }
};

export const get_received_requests = async (path) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("POST", `friends/${path}`, {
            body: JSON.stringify({cursor: undefined, user}),
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response;
    } catch (error) {
        console.log(error);
    }
};

export const get_sent_requests = async (cursor = undefined) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("POST", `friends/get_sent_requests`, {
            body: JSON.stringify({cursor, user}),
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response;
    } catch (error) {
        console.log(error);
    }
};

export const get_all_friends = async (path) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("POST", `friends/${path}`, {
            body: JSON.stringify({cursor: undefined, user}),
            headers: {
                "Content-Type": "application/json",
            },
        })

        return response;
    } catch (error) {
        console.log(error);
    }
};

export const get_mutual_friends = async (target_mf, cursor) => {
    try {
        const event = getRequestEvent()
        const user = await verify_user(event);
        if (user === 401) {
            throw new Error("login first");
        }

        const response = await postgresql_server_request("POST", `friends/get_mutual_friends`, {
            body: JSON.stringify({
                target_user: target_mf,
                cursor: cursor,
                userId: user.userId
            }),
            headers: {
                "Content-Type": 'application/json'
            }
        })

        console.log(response)
        return response;
    } catch (error) {
        console.log(error)
    }
}