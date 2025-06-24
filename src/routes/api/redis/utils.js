"use server"
import { client } from "~/entry-server"

export const create_key = async (key, payload, expiry) => {
    try {
        await client.set(key, payload, expiry)
    } catch (error) {
        console.log("REDIS-CREATE-KEY-ERROR", error)
    }
}

const update_key = () => {
    
}

export const get_key = async (key) => {
    try {
        return await client.get(key)
    } catch (error) {
        console.log(error)
    }
}

export const delete_key = async (key) => {
    try {  
        await client.del(key)
    } catch (error) {
        console.log(error)
    }
}