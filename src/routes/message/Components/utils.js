export const validateFile = (file) => {
  const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
  const MAX_OTHER_SIZE = 10 * 1024 * 1024;
  const MAX_VIDEO_SIZE = 100 * 1024 * 1024;

  const allowedTypes = {
    images: ["image/jpeg", "image/png", "image/webp"],
    documents: [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain"
    ],
    presentations: [
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ],
    videos: [
      "video/mp4",
      "video/webm",
      "video/ogg",
    ]
  };

  const { type, size, name } = file;

  if (allowedTypes.images.includes(type)) {
    if (size > MAX_IMAGE_SIZE) return { valid: false, reason: `${name.slice(0, 50)}..., ფოტოზ ზომა აჭარბებს 5მბ ლიმიტს.` };
    return { valid: true, type: "image" };
  }

  if (allowedTypes.documents.includes(type)) {
    if (size > MAX_OTHER_SIZE) return { valid: false, reason: `${name.slice(0, 50)}..., დოკუმენტის ზომა აჭარბებს 10მბ ლიმიტს.` };
    return { valid: true, type: "document" };
  }

  if (allowedTypes.presentations.includes(type)) {
    if (size > MAX_OTHER_SIZE) return { valid: false, reason: `${name.slice(0, 50)}..., ფაილის ზომა აჭარბებს 10მბ ლიმიტს.` };
    return { valid: true, type: "presentation" };
  }
  if (allowedTypes.videos.includes(type)) {
    if (size > MAX_VIDEO_SIZE) return { valid: false, reason: `${name.slice(0, 50)}..., ფაილის ზომა აჭარბებს 100მბ ლიმიტს.` };
    return { valid: true, type: "video" };
  }

  return { valid: false, reason: `მხარდაუჭერელი ფაილი ${name.slice(0, 50)}..., ფაილის ატვირთვა ვერ მოხერხედება.` };
}

export const formatFileSize = (bytes) => {
  if (bytes < 1024) return `${bytes}b`;

  const kb = bytes / 1024;
  if (kb < 1024) {
    const roundedKb = Math.ceil(kb * 100) / 100;
    return `${roundedKb.toFixed(2)}kb`;
  }

  const mb = kb / 1024;
  const roundedMb = Math.ceil(mb * 100) / 100;
  return `${roundedMb.toFixed(2)}mb`;
}

export function getFlexBasisClass(count, index) {
  if (count === 1) return "basis-full";
  if (count === 2) return "basis-1/2";
  if (count === 3) {
    if (index === 0) {
      return "basis-full"
    }
    return "basis-1/2"
  }
  if (count === 4) return "basis-1/2";
  if (count === 5) {
    if (index === 0) {
      return "basis-full"
    }
    return "basis-1/2"
  }
  if (count >= 6) {
    if (index === 0) {
      return "basis-full"
    } else if (index < 3) {
      return "basis-1/2"
    } else {
      return "basis-1/3"
    }
  }
}
export const send_message_to_server = async (formData, response, ws) => {
  try {
    const file_message_response = await fetch("/api/messages/main", {
      method: "POST",
      credentials: "include",
      body: formData
    })

    const data = await file_message_response.json()
    if (file_message_response.status === 200) {
      ws.send(JSON.stringify({
        type: "message",
        message_content_type: data.type,
        file_metadata: data.file_metadata,
        created_at: data.created_at,
        convo_id: response().conversation_id,
        sender_id: response().my_id
      }))
    }
  } catch (error) {
    console.log("sending_files_error: (send_message()): ", error)
  }
}