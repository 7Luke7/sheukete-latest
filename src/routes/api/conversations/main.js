"use server"

export const startConversation = async (prof_id, role) => {
    try {
        if (!prof_id) {
            throw new Error("პროფილის id სავალდებულოა.")
        }
        const response = await fetch("http://localhost:4321/coversation/start", {
            method: "POST",
            credentials: "include",
            body: JSON.stringify({
                prof_id,
                role
            }),
            redirect: "follow",
            headers: {
                "Content-Type": "application/json"
            }
        })

        const data = await response.json()

        if (response.status === 200 ) { 
            window.location.href = data.redirect_url
            return
        }
    } catch (error) {
        console.log(error)
    }
}