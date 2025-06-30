export const get_image_based_on_size = (url, size) => {
    const last_index_of_slash = url.lastIndexOf("/")
    const before_last_slash = url.slice(0, last_index_of_slash)
    const after_last_slash = url.slice(last_index_of_slash + 1, url.length)
    
    return `${before_last_slash}/${size}/${after_last_slash}`
}