'use server'
import { json, query, redirect } from "@solidjs/router";
import { HandleError } from "./utils/errors/handle_errors";
import { CustomError } from "./utils/errors/custom_errors";
import { postgresql_server_request } from "./utils/ext_requests/posgresql_server_request";
import bcrypt from "bcrypt"
import { randomBytes } from "crypto";
import { create_key, get_key } from "./redis/utils";
import { getRequestEvent } from "solid-js/web";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
const phoneRegex = /^\d{9}$/

export const LoginUser = async (formData) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");

    try {
        if (!phoneEmail.length) {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი სავალდებულოა.")
        }
        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.")
        }

        let body = null
        if (emailRegex.test(phoneEmail)) {
            body = { email: phoneEmail }
        } else if (phoneRegex.test(phoneEmail)) {
            body = { phone: phoneEmail }
        }

        if (!body) {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
        }
        const data = await postgresql_server_request(
            "POST",
            "login",
            {
                body: JSON.stringify(body),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        if (data.status !== 200) {
            throw new CustomError(data.field, data.message)
        }

        const isMatch = bcrypt.compare(password, data.password);
        if (!isMatch) {
            throw new CustomError("password", "პაროლი არასწორია.")
        }

        const session_id = randomBytes(128).toString("hex")
        await create_key(`session:${session_id}`, JSON.stringify({
            role: data.role,
            profId: data.prof_id,
            userId: data.id
        }), { EX: 60 * 60 * 24 })

        return {
            'Set-Cookie': `sessionId=${session_id}; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24}`,
            'Content-Type': 'application/json',
            'Location': `/${data.role}/${data.prof_id}`
        }
    } catch (error) {
        const errors = new HandleError(error).validation_error();
        return {
            errors,
            status: 400
        };
    }
};

export const RegisterUser = async (formData) => {
    const phoneEmail = formData.get("phoneEmail");
    const password = formData.get("password");
    const firstname = formData.get("firstname")
    const lastname = formData.get("lastname")
    const role = formData.get("role")
    const rules = formData.get("rules-confirmation")
    let column

    try {
        if (!firstname.length) {
            throw new CustomError("firstname", "სახელი სავალდებულოა.")
        }
        if (!lastname.length) {
            throw new CustomError("lastname", "გვარი სავალდებულოა.")
        }

        if (emailRegex.test(phoneEmail)) {
            column = "email"
        } else if (phoneRegex.test(phoneEmail)) {
            column = "phone"
        } else {
            throw new CustomError("phoneEmail", "მეილი ან ტელეფონის ნომერი არასწორია.")
        }

        if (password.length < 8) {
            throw new CustomError("password", "პაროლი უნდა შეიცავდეს მინიმუმ 8 სიმბოლოს.")
        }

        if (!rules) {
            throw new CustomError("rules", "გთხოვთ დაეთანხმოთ სერვისის წესებსა და კონფიდენციალურობის პოლიტიკას.")
        }

        const salt = await bcrypt.genSalt(8);
        const hash = await bcrypt.hash(password, salt);
        if (role !== "xelosani" && role !== "damkveti") {
            throw new CustomError("role", "როლი არ არსებობს.")
        }

        const data = await postgresql_server_request(
            "POST",
            `register`,
            {
                body: JSON.stringify({
                    role: role,
                    firstname: firstname.trim(),
                    lastname: lastname.trim(),
                    notification_devices: column,
                    [column]: phoneEmail,
                    password: hash
                }),
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

        if (data.status !== 200) {
            throw new CustomError(data.field, data.message)
        }

        const session_id = randomBytes(128).toString("hex")

        await create_key(`session:${session_id}`, JSON.stringify({
            role: data.role,
            profId: data.prof_id,
            userId: data.id
        }), { EX: 60 * 60 * 24 })

        return {
            'Set-Cookie': `sessionId=${session_id}; Path=/; SameSite=Strict; Max-Age=${60 * 60 * 24}`,
            'Content-Type': 'application/json',
            'Location': `/${data.role}/${data.prof_id}`
        }
    } catch (error) {
        console.log(error)
        const errors = new HandleError(error).validation_error();
        return {
            errors,
            status: 400
        };
    }
}

export const LoginWithFacebook = async (accessToken, userID) => {
    try {
        console.log(accessToken, userID)
    } catch (error) {
        console.log(error)
    }
}

export const check_if_user_is_logged_in = query(async() => {
    try {
        const event = getRequestEvent()
        if (!event?.request?.headers.get("cookie")) return "allow-access"
        const session = event.request.headers.get("cookie").split("sessionId=")[1]
        if (!session) return "allow-access"
        const user = JSON.parse(await get_key(`session:${session}`))

        if (user) return redirect(`/${user.role}/${user.profId}`)
    } catch (error) {
        console.log(error)
    }
}, "logged")

export const redirect_to_login = query(async() => {
    try {
        const event = getRequestEvent()
        const session = event?.request?.headers?.get("cookie")?.split("sessionId=")[1]
        console.log(event?.request?.headers)
        if (!session) return redirect("/login")

        return "allow-access"
    } catch (error) {
        console.log(error)
    }
}, "logged")