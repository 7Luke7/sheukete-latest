"use server"

const file_extentions = {
  "application/pdf": "pdf",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "docx",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "text/plain": "txt",
  "application/vnd.ms-powerpoint": "ppt",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": "pptx"
}

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
    return { valid: true, type: "image"};
  }

  if (allowedTypes.documents.includes(type)) {
    if (size > MAX_OTHER_SIZE) return { valid: false, reason: `${name.slice(0, 50)}..., დოკუმენტის ზომა აჭარბებს 10მბ ლიმიტს.` };
    return { valid: true, ext: file_extentions[type], type: "document" };
  }

  if (allowedTypes.presentations.includes(type)) {
    if (size > MAX_OTHER_SIZE) return { valid: false, reason: `${name.slice(0, 50)}..., ფაილის ზომა აჭარბებს 10მბ ლიმიტს.` };
    return { valid: true, ext: file_extentions[type], type: "presentation"};
  }
  if (allowedTypes.videos.includes(type)) {
    if (size > MAX_VIDEO_SIZE) return { valid: false, reason: `${name.slice(0, 50)}..., ფაილის ზომა აჭარბებს 100მბ ლიმიტს.` };
    return { valid: true, type: "video"};
  }

  return { valid: false, reason: `მხარდაუჭერელი ფაილი ${name.slice(0, 50)}..., ფაილის ატვირთვა ვერ მოხერხედება.` };
}