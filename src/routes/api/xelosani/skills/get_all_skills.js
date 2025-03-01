"use server"

import { postgresql_server_request } from "../../utils/ext_requests/posgresql_server_request"

export const get_all_user_skills = async (prof_id) => {
    try {
        const response = await postgresql_server_request("GET", `get_all_xelosani_skills/${prof_id}`)

        if (response.status === 200) {
            return response.skills
        }
    } catch (error) {
        console.log(error)
    }
}