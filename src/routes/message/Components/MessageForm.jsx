import attachIcon from "../../../svg-images/paperclip.svg";
import emojiIcon from "../../../svg-images/emoji-smile.svg";
import sendIcon from "../../../svg-images/send-message.svg";
import { createSignal, Show } from "solid-js";
import { EmojiModal } from "./EmojiModal";

const styles = {
    "normal": {
        "text-area-wrapper": "bg-slate-100",
    },
    "modal": {
        "text-area-wrapper": "w-full z-[50] rounded-t-none rounded-lg border-t",
    }
}

export const MessageForm = (props) => {
    const [showEmojiModal, setShowEmojiModal] = createSignal(false)
    let wrapperDiv;
    const { setValue, scenario, value, send_message, previewImage } = props
    return <div
        ref={el => (wrapperDiv = el)}
        class={"relative gap-x-3 w-1/2 my-1 bg-[#f1f2f6] h-[38px] rounded-[24px] flex px-4 py-1 mx-auto items-center " + styles[scenario]["text-area-wrapper"]}
    >
        <Show when={showEmojiModal()}>
            <EmojiModal setValue={setValue} setShowEmojiModal={setShowEmojiModal}></EmojiModal>
        </Show>
        <button onClick={() => setShowEmojiModal(true)}>
            <img width={24} height={24} src={emojiIcon} />
        </button>
        <textarea
            placeholder="მესიჯი"
            style={{ resize: "none" }}
            class={"w-full bg-inherit font-[thin-font] bg-none font-bold text-md outline-none max-h-[120px] text-gray-700 overflow-y-auto " + styles[scenario]["text-area"] || ""}
            value={value()}
            rows={1}
            oninput={(e) => {
                setValue(e.target.value);
                const textarea = e.target;
                textarea.style.height = 'auto';
                textarea.style.height = textarea.scrollHeight + 'px';
                if (textarea.scrollHeight > 28) {
                    wrapperDiv.style.alignItems = "end";
                } else {
                    wrapperDiv.style.alignItems = "center";
                }
            }}
            onKeyPress={(e) => {
                if (e.key === "Enter") {
                    if (e.shiftKey) {
                        return
                    }
                    e.preventDefault()
                    send_message().then(() => e.target.style.height = 'auto').catch((err) => console.log(err))
                }
            }}
        ></textarea>
        <label id="choose-file" class="bg-gray-100 rounded-full p-2 cursor-pointer">
            <input
                type="file"
                id="choose-file"
                name="files[]"
                multiple
                accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.mp4,.webm,.ogg"
                hidden
                onInput={previewImage}
            ></input>
            <img width={24} height={24} src={attachIcon} />
        </label>
        <Show when={value().length || scenario === "modal"}>
            <button onClick={send_message}>
                <img width={24} height={24} src={sendIcon}></img>
            </button>
        </Show>
    </div>
}