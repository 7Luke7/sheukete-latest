'use server'

import { issue_token } from "./token"

export const fileserver_request = async (method, params, headers = {}) => {
    try {
        const token = await issue_token("file-server")
        headers["x-private-key"] = token
        const response = await fetch(`${process.env.FILESERVER_SERVER_DOMAIN}:${process.env.FILESERVER_SERVER_PORT}/${params}`, {
            method: method,
            ...headers
        })

        if (!response.ok) { 
            const data = await response.json()
            return {status: response.status, ...data}
        }
        
        const data = await response.json()
        return {...data, status: response.status}
    } catch (error) {
        console.log(error)
        return {status: 400, ...error}
    }
}