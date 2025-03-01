"use server"

export const get_all_special_notifications = async () => {
    try {
        return [
            {
                "id": "c4b0ee4b-099f-4b36-825d-b01564d05f32",
                "role": "admin",
                "user_id": "88e322fa-432c-4c73-8631-222f619119b8",
                "friend_request_id": null,
                "type": "offer",
                "message": "ყურადღება 25% ფასდაკლება პრემიუმზე მხოლოდ 3 დღის განმავლობაში",
                "friend_request_status": null,
                "created_at": "10 დღის უკან",
                "seen": true
            },
            {
                "id": "6e38d03a-9dc0-4a7b-ac6b-5e0f3b4a3863",
                "role": "admin",
                "user_id": "88e322fa-432c-4c73-8631-222f619119b8",
                "friend_request_id": null,
                "type": "offer",
                "message": "ყურადღება 25% ფასდაკლება პრემიუმზე მხოლოდ 3 დღის განმავლობაში",
                "friend_request_status": null,
                "created_at": "10 დღის უკან",
                "seen": true
            }
        ]
    } catch (error) {
        console.log(error)
    }
}