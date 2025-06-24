'use server'

import { issue_token } from "./token"

export const postgresql_server_request = async (method, params, headers) => {
    try {
        const token = await issue_token("postgresql-server")
        headers['headers']["x-private-key"] = token
        const response = await fetch(`${process.env.POSTGRES_SERVER_DOMAIN}:${process.env.POSTGRES_SERVER_PORT}/${params}`, {
            method: method, 
            ...headers
        })

        if (!response.ok || response.status !== 200) { 
            const data = await response.json()
            return {status: response.status, ...data}
        }

        const data = await response.json()
        return {...data, status: response.status}
    } catch (error) {
        console.log("POSTGRESQL_ERROR: ", error)
        return {status: 400, ...error}
    }
}