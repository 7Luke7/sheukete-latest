import { createSignal, onMount } from "solid-js";
import { Toast } from "~/Components/ToastComponent";

export const EmojiModal = (props) => {
    const [toast, setToast] = createSignal()

    let pickerRef
    const {setValue, setShowEmojiModal} = props
    onMount(() => {
        async function initializeEmojiMart() {
            const script = document.createElement("script");
            script.type = "module";
            script.src = `https://cdn.jsdelivr.net/npm/emoji-mart@${import.meta.env.VITE_EMOJI_MART_VERSION}/dist/browser.min.js`;
            document.head.appendChild(script);
            
            try {
                const response = await fetch('https://cdn.jsdelivr.net/npm/@emoji-mart/data');
                const emojiData = await response.json();

                if (typeof window.EmojiMart === 'undefined') {
                    setToast({
                        type: false,
                        message: "ემოჯი-ს ჩატვირთვა ვერ მოხერხდა ისევ სცადეთ."
                    })
                    return;
                }

                if (pickerRef) {
                    const picker = new window.EmojiMart.Picker({
                        data: emojiData,
                        onEmojiSelect: (emoji) => {
                            setValue(prev => prev + emoji.native)
                        },
                        onClickOutside: () => {
                            setShowEmojiModal(false)
                        },
                        perLine: 8,
                        set: "default",
                        theme: "light",
                        locale: "en",
                        previewPosition: "none"
                    });
                    pickerRef.appendChild(picker);
                } else {
                    console.log("picker not initialized")
                    setToast({
                        type: false,
                        message: "ემოჯი-ს ჩატვირთვა ვერ მოხერხდა ისევ სცადეთ."
                    })
                }

            } catch (error) {
                console.log(error)
                setToast({
                    type: false,
                        message: "ემოჯი-ს ჩატვირთვა ვერ მოხერხდა ისევ სცადეთ."
                    })
            }
        }

        initializeEmojiMart();
    });

    return (
        <>
            <div class="absolute z-[103] top-[-440px]" ref={pickerRef}></div>
            <Show when={toast()}>
                <Toast toast={toast} setToast={setToast}></Toast>
            </Show>
        </>
    );
};