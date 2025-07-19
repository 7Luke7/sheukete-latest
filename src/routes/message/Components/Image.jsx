import { get_image_based_on_size } from "~/Components/utils"
import { getFlexBasisClass } from "./utils"

export const Image = (props) => {
    const {setCarouselImages, add_overlay, message, i, fm} = props
    return <button onClick={() => {
        setCarouselImages(message.file_metadata.filter((file) => {
            return file.content_type === "image"
        }).map((file) => {
            return { ...file, on_display: file.id === fm.id ? true : false }
        }))
        add_overlay("carousel")
    }} type="button" class={`p-[10px] relative ${getFlexBasisClass(message.file_metadata?.length, i())}`}>
        <img
            data-message-image
            height={200}
            loading="lazy"
            class="object-cover rounded-md w-full h-[200px]"
            src={`http://localhost:5555${get_image_based_on_size(fm.url, "medium")}`}
        />
    </button>
}