export const Text = (props) => {
    const {message} =  props
    return <p
        class="text-gray-700 px-2 pb-3 pt-2 break-words font-[thin-font] font-bold text-md mb-2"
        style={{ "overflow-wrap": "break-word" }}
    >
        {message.content}
    </p>
}